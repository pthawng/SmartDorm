import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button, Card, Input } from '@/shared/ui';
import { CreateApplicationPayload } from '@/entities/application/types';

const schema = z.object({
  room_id: z.string().min(1, 'Room is required'),
  start_date: z.string().min(1, 'Start date is required'),
  duration_months: z.coerce.number().min(1, 'Duration must be at least 1 month'),
  expected_move_in: z.string().min(1, 'Expected move-in date is required'),
  full_name: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  id_number: z.string().min(9, 'Valid ID/Passport number is required'),
  note: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface ApplicationFormProps {
  roomId: string;
  onSubmit: (data: CreateApplicationPayload) => void;
  isSubmitting: boolean;
}

export function ApplicationForm({ roomId, onSubmit, isSubmitting }: ApplicationFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      room_id: roomId,
      duration_months: 12,
    }
  });

  return (
    <Card className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-2xl shadow-slate-200/50">
      <header className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Lease Application</h2>
        <p className="text-sm text-slate-500 font-medium">Please provide accurate information. Your request will be reviewed by the property manager.</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Period & Duration</label>
              <Input 
                type="date" 
                label="Preferred Start Date" 
                {...register('start_date')} 
                error={errors.start_date?.message}
              />
              <Input 
                type="number" 
                label="Duration (Months)" 
                {...register('duration_months')} 
                error={errors.duration_months?.message}
              />
              <Input 
                type="date" 
                label="Expected Move-in" 
                {...register('expected_move_in')} 
                error={errors.expected_move_in?.message}
              />
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Identity Information</label>
              <Input 
                label="Full Name (on ID)" 
                placeholder="John Doe"
                {...register('full_name')} 
                error={errors.full_name?.message}
              />
              <Input 
                label="Phone Number" 
                placeholder="+84..."
                {...register('phone')} 
                error={errors.phone?.message}
              />
              <Input 
                label="ID / Passport Number" 
                placeholder="012345678"
                {...register('id_number')} 
                error={errors.id_number?.message}
              />
           </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Additional Notes</label>
           <textarea 
             className="w-full min-h-[120px] p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-primary-500 focus:bg-white transition-all outline-none text-sm font-medium text-slate-900 placeholder:text-slate-300"
             placeholder="Optional note to the property manager (e.g., parking requirements, pet info...)"
             {...register('note')}
           />
        </div>

        <div className="pt-6">
          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            fullWidth 
            isLoading={isSubmitting}
            className="h-16 text-base font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-100 active:scale-[0.98]"
          >
            Submit Application for Review
          </Button>
          <p className="mt-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Digital submission does not constitute a legal lease until approved and signed.
          </p>
        </div>
      </form>
    </Card>
  );
}
