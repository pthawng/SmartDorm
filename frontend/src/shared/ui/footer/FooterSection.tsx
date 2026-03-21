import { Link } from 'react-router-dom';

interface FooterLink {
  label: string;
  path: string;
}

interface FooterSectionProps {
  title: string;
  links: FooterLink[];
}

/**
 * Modular link column for the global footer.
 */
export function FooterSection({ title, links }: FooterSectionProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-900 group-hover:text-primary-600 transition-colors">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link 
              to={link.path} 
              className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors leading-none"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
