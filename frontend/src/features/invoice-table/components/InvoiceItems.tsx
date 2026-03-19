import { InvoiceItem } from '@/entities/invoice/types';

interface InvoiceItemsProps {
  items: InvoiceItem[];
}

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

const TYPE_LABELS: Record<string, string> = {
  RENT: 'Core Housing',
  UTILITY: 'Usage-Based',
  FEE: 'Fixed Service',
  OTHER: 'Miscellaneous',
};

export function InvoiceItems({ items }: InvoiceItemsProps) {
  const totalItems = items.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Detailed Money Breakdown</h3>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{items.length} Line Items</span>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm shadow-slate-100/50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Classification</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.map((item) => (
              <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5">
                  <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full border ${
                    item.type === 'RENT' ? 'bg-primary-50 text-primary-700 border-primary-100' :
                    item.type === 'UTILITY' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                    'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {TYPE_LABELS[item.type]}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm font-bold text-slate-800 tracking-tight">{item.description}</p>
                </td>
                <td className="px-6 py-5 text-right">
                  <p className="text-sm font-black text-slate-900 tabular-nums">
                    {vndFormatter.format(item.amount)}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
             <tr className="bg-slate-50 font-black">
                <td colSpan={2} className="px-6 py-4 text-right border-t border-slate-200 text-xs uppercase tracking-widest text-slate-400">Grand Total</td>
                <td className="px-6 py-4 text-right border-t border-slate-200 text-lg text-slate-900 tabular-nums">
                   {vndFormatter.format(totalItems)}
                </td>
             </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
