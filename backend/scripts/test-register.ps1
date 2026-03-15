param(
    [string]$BaseUrl = "http://localhost:8080",
    [string]$FullName = "Lê Phước Thắng",
    [string]$Phone = "0912345678",
    [string]$Password = "Thang@12345"
)

$ErrorActionPreference = "Stop"

function Invoke-JsonRequest {
    param(
        [string]$Method,
        [string]$Url,
        [hashtable]$Payload
    )

    $jsonBody = $Payload | ConvertTo-Json -Depth 5

    try {
        $response = Invoke-WebRequest `
            -Method $Method `
            -Uri $Url `
            -ContentType "application/json" `
            -Body $jsonBody

        $body = $null
        if ($response.Content) {
            $body = $response.Content | ConvertFrom-Json
        }

        return @{
            StatusCode = [int]$response.StatusCode
            Body = $body
            RawBody = $response.Content
        }
    }
    catch {
        $statusCode = 0
        $rawBody = $null
        $body = $null

        if ($_.Exception.Response) {
            $statusCode = [int]$_.Exception.Response.StatusCode

            $stream = $_.Exception.Response.GetResponseStream()
            if ($stream) {
                $reader = New-Object System.IO.StreamReader($stream)
                $rawBody = $reader.ReadToEnd()
                $reader.Close()
            }

            if ($rawBody) {
                try {
                    $body = $rawBody | ConvertFrom-Json
                }
                catch {
                    $body = $null
                }
            }
        }

        return @{
            StatusCode = $statusCode
            Body = $body
            RawBody = $rawBody
        }
    }
}

function Assert-StatusCode {
    param(
        [string]$Label,
        [int]$Expected,
        [int]$Actual
    )

    if ($Expected -ne $Actual) {
        throw "$Label failed. Expected HTTP $Expected but got $Actual."
    }
}

$registerUrl = "$BaseUrl/api/v1/auth/register"
$email = "le-phuoc-thang+$([DateTimeOffset]::UtcNow.ToUnixTimeSeconds())@example.com"

Write-Host ""
Write-Host "Register API test"
Write-Host "Base URL : $BaseUrl"
Write-Host "Endpoint : $registerUrl"
Write-Host "Email    : $email"

$successPayload = @{
    email = $email
    password = $Password
    full_name = $FullName
    phone = $Phone
}

Write-Host ""
Write-Host "[1/3] Testing successful registration..."
$successResult = Invoke-JsonRequest -Method "POST" -Url $registerUrl -Payload $successPayload
Assert-StatusCode -Label "Successful registration" -Expected 201 -Actual $successResult.StatusCode

Write-Host "HTTP $($successResult.StatusCode)"
if ($successResult.Body) {
    $successResult.Body | ConvertTo-Json -Depth 10
}

Write-Host ""
Write-Host "[2/3] Testing duplicate email..."
$duplicateResult = Invoke-JsonRequest -Method "POST" -Url $registerUrl -Payload $successPayload
Assert-StatusCode -Label "Duplicate registration" -Expected 409 -Actual $duplicateResult.StatusCode

Write-Host "HTTP $($duplicateResult.StatusCode)"
if ($duplicateResult.Body) {
    $duplicateResult.Body | ConvertTo-Json -Depth 10
}

Write-Host ""
Write-Host "[3/3] Testing validation error..."
$invalidPayload = @{
    email = "invalid-email"
    password = "123"
    full_name = $FullName
}

$validationResult = Invoke-JsonRequest -Method "POST" -Url $registerUrl -Payload $invalidPayload
Assert-StatusCode -Label "Validation error" -Expected 500 -Actual $validationResult.StatusCode

Write-Host "HTTP $($validationResult.StatusCode)"
if ($validationResult.Body) {
    $validationResult.Body | ConvertTo-Json -Depth 10
}

Write-Host ""
Write-Host "All register flow checks passed."
