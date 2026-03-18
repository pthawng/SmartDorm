import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, ErrorState } from '@/shared/ui';
import type { TableColumn } from '@/shared/ui/Table';
import { ROUTES } from '@/shared/config/routes';

import { useRoomList, useCreateRoom, useDeleteRoom, useUpdateRoomStatus } from '../hooks';
import { RoomFilters } from './RoomFilters';
import { RoomStatusBadge } from './RoomStatusBadge';
import { RoomModal } from './RoomModal';
import type { RoomSummary, RoomFormValues, RoomStatus } from '../types';

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const STATUSES: { value: RoomStatus; label: string }[] = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'OCCUPIED', label: 'Occupied' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
];

export function RoomManagementFeature() {
  const navigate = useNavigate();
  const { data: rooms = [], isLoading, isError, refetch } = useRoomList();
  const createMutation = useCreateRoom();
  const deleteMutation = useDeleteRoom();
  const statusMutation = useUpdateRoomStatus();

  // UI state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<RoomSummary | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Derived unique properties for filter dropdown
  const propertyOptions = useMemo(() => {
    const map = new Map<string, string>();
    rooms.forEach(r => map.set(r.propertyId, r.propertyName));
    return [...map.entries()].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
  }, [rooms]);

  // Client-side filtering
  const filtered = useMemo(() => {
    return rooms.filter(r => {
      const matchSearch = !search || r.roomNumber.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || r.status === statusFilter;
      const matchProperty = !propertyFilter || r.propertyId === propertyFilter;
      return matchSearch && matchStatus && matchProperty;
    });
  }, [rooms, search, statusFilter, propertyFilter]);

  const handleCreate = async (values: RoomFormValues) => {
    await createMutation.mutateAsync(values);
    setCreateOpen(false);
  };

  const handleEdit = async (values: RoomFormValues) => {
    console.log('Edit room:', editTarget?.id, values);
    setEditTarget(null);
  };

  const handleDelete = async (row: RoomSummary) => {
    if (!window.confirm(`Delete room "${row.roomNumber}" in ${row.propertyName}? This cannot be undone.`)) return;
    setDeletingId(row.id);
    try {
      await deleteMutation.mutateAsync(row.id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusToggle = (roomId: string, newStatus: RoomStatus) => {
    statusMutation.mutate({ id: roomId, status: newStatus });
  };

  const columns: TableColumn<RoomSummary>[] = [
    {
      key: 'roomNumber',
      header: 'Room',
      cell: (row) => (
        <div className="flex items-center gap-3">
          {/* Colored left-edge indicator */}
          <span className={`hidden sm:block h-8 w-1 rounded-full flex-shrink-0 ${
            row.status === 'AVAILABLE' ? 'bg-emerald-400' :
            row.status === 'OCCUPIED' ? 'bg-red-400' : 'bg-amber-400'
          }`} />
          <span className="font-bold text-slate-900 text-base tracking-tight">{row.roomNumber}</span>
        </div>
      ),
    },
    {
      key: 'propertyName',
      header: 'Property',
      cell: (row) => (
        <div>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(ROUTES.PROPERTY_DETAIL(row.propertyId)); }}
            className="text-sm text-primary-600 hover:text-primary-800 hover:underline transition-colors font-medium"
          >
            {row.propertyName}
          </button>
          <p className="text-[11px] text-slate-400 mt-0.5">Floor {row.floor}</p>
        </div>
      ),
    },
    {
      key: 'area',
      header: 'Area',
      align: 'center',
      cell: (row) => (
        <span className="text-slate-600 tabular-nums">{row.area} m²</span>
      ),
    },
    {
      key: 'monthlyPrice',
      header: 'Price / Month',
      align: 'right',
      cell: (row) => (
        <span className="font-bold text-emerald-700 tabular-nums text-[15px]">
          {vndFormatter.format(row.monthlyPrice)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      className: 'w-44',
      cell: (row) => (
        <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
          <RoomStatusBadge status={row.status} />
          {/* Quick Status Toggle */}
          <div className="relative group">
            <button
              title="Change status"
              className="rounded-md p-1 text-slate-300 hover:bg-slate-100 hover:text-slate-500 transition-colors"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {/* Dropdown */}
            <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-150 absolute right-0 top-full mt-1 z-20 w-36 rounded-lg border border-slate-200 bg-white shadow-lg py-1">
              {STATUSES.filter(s => s.value !== row.status).map(s => (
                <button
                  key={s.value}
                  onClick={() => handleStatusToggle(row.id, s.value)}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <span className={`h-2 w-2 rounded-full ${
                    s.value === 'AVAILABLE' ? 'bg-emerald-500' :
                    s.value === 'OCCUPIED' ? 'bg-red-500' : 'bg-amber-500'
                  }`} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      className: 'w-28',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            title="View room"
            onClick={(e) => { e.stopPropagation(); navigate(ROUTES.ROOM_DETAIL(row.id)); }}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary-600 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            title="Edit room"
            onClick={(e) => { e.stopPropagation(); setEditTarget(row); }}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            title="Delete room"
            disabled={deletingId === row.id}
            onClick={(e) => { e.stopPropagation(); handleDelete(row); }}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
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

  // Row-level styling: highlight available rooms
  const getRowClassName = (row: RoomSummary): string | undefined => {
    if (row.status === 'AVAILABLE') return 'bg-emerald-50/40 hover:bg-emerald-50/70';
    if (row.status === 'MAINTENANCE') return 'bg-amber-50/30 hover:bg-amber-50/50';
    return undefined;
  };

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState title="Failed to load rooms" description="We couldn't load your room list. Please try again." onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-display font-bold text-slate-900">Rooms</h1>
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
            Add Room
          </div>
        </Button>
      </div>

      {/* Quick Status Summary */}
      {!isLoading && rooms.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            {rooms.filter(r => r.status === 'AVAILABLE').length} Available
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700">
            <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
            {rooms.filter(r => r.status === 'OCCUPIED').length} Occupied
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
            {rooms.filter(r => r.status === 'MAINTENANCE').length} Maintenance
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <RoomFilters
              search={search}
              onSearchChange={setSearch}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              propertyFilter={propertyFilter}
              onPropertyChange={setPropertyFilter}
              properties={propertyOptions}
            />
          </div>
          {(search || statusFilter || propertyFilter) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setSearch(''); setStatusFilter(''); setPropertyFilter(''); }}
              className="whitespace-nowrap text-slate-500"
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {!isLoading && rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 rounded-full bg-slate-100 p-5 text-slate-400">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900">No rooms yet</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500">Add rooms to your properties to start managing them.</p>
          <Button variant="primary" onClick={() => setCreateOpen(true)} className="mt-6 shadow-sm">
            Add your first room
          </Button>
        </div>
      ) : (
        <Table<RoomSummary>
          columns={columns}
          data={filtered}
          keyExtractor={(row) => row.id}
          isLoading={isLoading}
          emptyMessage="No rooms match your filters. Try adjusting the search or property filter."
          onRowClick={(row) => navigate(ROUTES.ROOM_DETAIL(row.id))}
          rowClassName={getRowClassName}
        />
      )}

      {/* Create Modal */}
      <RoomModal
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        isSubmitting={createMutation.isPending}
        mode="create"
      />

      {/* Edit Modal */}
      <RoomModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={handleEdit}
        isSubmitting={false}
        mode="edit"
        defaultValues={editTarget ? {
          roomNumber: editTarget.roomNumber,
          propertyId: editTarget.propertyId,
          floor: editTarget.floor,
          area: editTarget.area,
          monthlyPrice: editTarget.monthlyPrice,
        } : undefined}
      />
    </div>
  );
}
