import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, ErrorState } from '@/shared/ui';
import type { TableColumn } from '@/shared/ui/Table';
import { ROUTES } from '@/shared/config/routes';

import { usePropertyList, useCreateProperty, useDeleteProperty } from '../hooks';
import { PropertyFilters } from './PropertyFilters';
import { PropertyStatusBadge } from './PropertyStatusBadge';
import { PropertyModal } from './PropertyModal';
import type { PropertySummary, PropertyFormValues } from '../types';

export function PropertyListFeature() {
  const navigate = useNavigate();
  const { data: properties = [], isLoading, isError, refetch } = usePropertyList();
  const createMutation = useCreateProperty();
  const deleteMutation = useDeleteProperty();

  // UI State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PropertySummary | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const cities = useMemo(() => [...new Set(properties.map(p => p.city))].sort(), [properties]);

  const filtered = useMemo(() => {
    return properties.filter(p => {
      const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || p.status === statusFilter;
      const matchesCity = !cityFilter || p.city === cityFilter;
      return matchesSearch && matchesStatus && matchesCity;
    });
  }, [properties, search, statusFilter, cityFilter]);

  const handleCreate = async (values: PropertyFormValues) => {
    await createMutation.mutateAsync(values);
    setCreateOpen(false);
  };

  const handleEdit = async (values: PropertyFormValues) => {
    // TODO: wire to real PATCH /properties/:id
    console.log('Edit property:', editTarget?.id, values);
    setEditTarget(null);
  };

  const handleDelete = async (row: PropertySummary) => {
    const confirmed = window.confirm(`Delete "${row.name}"? This cannot be undone.`);
    if (!confirmed) return;
    setDeletingId(row.id);
    try {
      await deleteMutation.mutateAsync(row.id);
    } finally {
      setDeletingId(null);
    }
  };

  const columns: TableColumn<PropertySummary>[] = [
    {
      key: 'name',
      header: 'Property',
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">{row.name}</p>
          <p className="text-xs text-slate-500 mt-0.5">{row.address || row.city}</p>
        </div>
      ),
    },
    {
      key: 'city',
      header: 'City',
      cell: (row) => <span className="text-slate-600">{row.city}</span>,
    },
    {
      key: 'totalRooms',
      header: 'Rooms',
      align: 'center',
      cell: (row) => <span className="font-medium text-slate-800">{row.totalRooms}</span>,
    },
    {
      key: 'availableRooms',
      header: 'Available',
      align: 'center',
      cell: (row) => {
        if (row.availableRooms === 0) {
          return (
            <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
              Full
            </span>
          );
        }
        return <span className="font-semibold text-emerald-600">{row.availableRooms}</span>;
      },
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      cell: (row) => <PropertyStatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      className: 'w-28',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            title="View property"
            aria-label="View property"
            onClick={(e) => { e.stopPropagation(); navigate(ROUTES.PROPERTY_DETAIL(row.id)); }}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary-600 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>

          <button
            title="Edit property"
            aria-label="Edit property"
            onClick={(e) => { e.stopPropagation(); setEditTarget(row); }}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            title="Delete property"
            aria-label="Delete property"
            disabled={deletingId === row.id}
            onClick={(e) => { e.stopPropagation(); handleDelete(row); }}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {deletingId === row.id ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState
          title="Failed to load properties"
          description="We couldn't load your property list. Please try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-display font-bold text-slate-900">Properties</h1>
          {!isLoading && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-semibold text-slate-600">
              {filtered.length}
            </span>
          )}
        </div>
        <Button variant="primary" onClick={() => setCreateOpen(true)} className="shadow-sm active:scale-[0.98] transition-transform">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Property
          </div>
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <PropertyFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          cityFilter={cityFilter}
          onCityChange={setCityFilter}
          cities={cities}
        />
      </div>

      {/* Full-page graceful empty state when truly no properties */}
      {!isLoading && properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 rounded-full bg-slate-100 p-5 text-slate-400">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900">No properties yet</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500">Get started by adding your first property to this workspace.</p>
          <Button variant="primary" onClick={() => setCreateOpen(true)} className="mt-6 shadow-sm">
            Add your first property
          </Button>
        </div>
      ) : (
        <Table<PropertySummary>
          columns={columns}
          data={filtered}
          keyExtractor={(row) => row.id}
          isLoading={isLoading}
          emptyMessage="No properties match your filters. Try clearing the search or filters."
          onRowClick={(row) => navigate(ROUTES.PROPERTY_DETAIL(row.id))}
        />
      )}

      {/* Create Modal */}
      <PropertyModal
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        isSubmitting={createMutation.isPending}
        mode="create"
      />

      {/* Edit Modal */}
      <PropertyModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={handleEdit}
        isSubmitting={false}
        mode="edit"
        defaultValues={editTarget ? { name: editTarget.name, address: editTarget.address, city: editTarget.city } : undefined}
      />
    </div>
  );
}
