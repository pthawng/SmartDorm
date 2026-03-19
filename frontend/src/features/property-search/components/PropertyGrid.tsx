interface PropertyGridProps {
  children: React.ReactNode;
}

/**
 * Responsive grid for property listings.
 */
export function PropertyGrid({ children }: PropertyGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {children}
    </div>
  );
}
