SmartDorm - Business Logic Specification
1. Tổng quan hệ thống (System Overview)
SmartDorm là nền tảng tích hợp hai mục tiêu:

- Community Platform: Mạng xã hội giúp kết nối người thuê và chủ trọ.
- Rental Management System (RMS): Hệ thống SaaS quản lý vận hành, tài chính và giao tiếp cho khu trọ.

2. Phân hệ người dùng & Phân quyền (User Roles & RBAC)
- Guest/Community User: Xem tin, tìm kiếm, đăng bài thảo luận.

- Tenant (Người thuê): Quản lý hóa đơn, báo cáo sự cố, xem hợp đồng, chat.

- Landlord (Chủ trọ): Quản lý tòa nhà, phòng, người thuê, tài chính, phê duyệt yêu cầu.

- System Admin: Quản trị toàn bộ nền tảng, kiểm duyệt nội dung, quản lý người dùng.

3. Đặc tả chi tiết các phân hệ (Detailed Modules)
3.1. Community Platform (MXH & Tìm kiếm)
Tìm kiếm thông minh: Lọc theo tọa độ (GIS), khoảng giá, diện tích và tiện ích (Wifi, máy lạnh, tự do...).

Hệ thống bài đăng: Hỗ trợ bài đăng tìm phòng và bài đăng cho thuê. Tích hợp tương tác (Like, Comment).

Trust System: Review và Rating phải dựa trên lịch sử thuê phòng thực tế (Verified Review) để tránh spam.

3.2. Rental Management (Cốt lõi vận hành)
Cấu trúc dữ liệu: Property (Khu trọ) > Room (Phòng) > Slot (Giường/Chỗ ở).

Trạng thái phòng: * Available: Sẵn sàng cho thuê.

Occupied: Đã có người ở.

Maintenance: Đang sửa chữa (không thể tạo hợp đồng).

Hợp đồng (Contract): * Phải có ngày bắt đầu, ngày kết thúc và số tiền cọc.

Trạng thái: Draft, Active, Expired, Terminated.

3.3. Financial & Billing (Hệ thống tài chính)
Utility Tracking: Ghi nhận chỉ số điện/nước hàng tháng. Công thức: (Số mới - Số cũ) * Đơn giá.

Billing Logic: Hóa đơn được tạo tự động vào ngày cấu hình (ví dụ: ngày 1 hàng tháng).

Total = Rent + Electricity + Water + Services - Discounts.

Thanh toán: Hỗ trợ QR Code thanh toán và đối soát tự động qua Webhook.

3.4. Communication & Realtime
Chat: Hỗ trợ chat 1-1 giữa Landlord - Tenant và chat nhóm theo khu trọ.

Notifications: * Realtime: Qua WebSocket (Hóa đơn mới, tin nhắn mới).

System: Qua Email/Push (Hợp đồng sắp hết hạn, thông báo cúp điện).

4. Các ràng buộc nghiệp vụ (Critical Business Rules)
Tính nhất quán tài chính: Tất cả các giao dịch tiền tệ phải sử dụng kiểu dữ liệu int64 (VNĐ) để tránh sai số. Sử dụng Database Transaction cho mọi thao tác cập nhật số dư hoặc tạo hóa đơn.

Ràng buộc hợp đồng: Một Slot chỉ có thể thuộc về duy nhất một Active Contract.

Bảo mật dữ liệu: Landlord tuyệt đối không thể truy cập dữ liệu (phòng, hóa đơn, người thuê) của Landlord khác (Data Isolation).

Xử lý sự cố: Tenant gửi yêu cầu sửa chữa -> Landlord nhận thông báo -> Landlord cập nhật trạng thái In Progress -> Resolved -> Tenant xác nhận.

5. Định nghĩa Hoàn thành (Definition of Done - DoD)
Mọi API phải có validation dữ liệu (Class-validator/Struct validation).

Mọi logic tính toán tài chính phải có Unit Test bao phủ 100%.

Mọi truy vấn danh sách (Search, Browse) phải có Pagination (phân trang).

Log lại mọi hành động thay đổi dữ liệu quan trọng (Audit Log).