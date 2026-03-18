import { Button } from '@/shared/ui';

interface SubmitButtonProps {
  isSubmitting: boolean;
  isValid: boolean;
  onCancel: () => void;
}

export function SubmitButton({ isSubmitting, isValid, onCancel }: SubmitButtonProps) {
  return (
    <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        variant="primary" 
        disabled={isSubmitting || !isValid}
        className="w-32"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin text-white/70" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Saving...
          </span>
        ) : (
          'Save Changes'
        )}
      </Button>
    </div>
  );
}
