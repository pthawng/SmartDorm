import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, ErrorState } from '@/shared/ui';
import type { TableColumn } from '@/shared/ui/Table';
import { ROUTES } from '@/shared/config/routes';
import { ContractStatus } from '@/entities/contract';

import { useContractList } from '../hooks/useContractList';
import { ContractFilters } from './ContractFilters';
import { ContractStatusBadge } from './ContractStatusBadge';
import type { ContractSummary, ContractFilterStatus } from '../types';

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function ContractListFeature() {
  const navigate = useNavigate();
  const { data: contracts = [], isLoading, isError, refetch } = useContractList();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContractFilterStatus>('ALL');

  const filteredContracts = useMemo(() => {
    return contracts
      .filter((contract) => {
        const matchesSearch =
          contract.renter_name.toLowerCase().includes(search.toLowerCase()) ||
          contract.id.toLowerCase().includes(search.toLowerCase()) ||
          contract.room_number.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || contract.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
  }, [contracts, search, statusFilter]);

  // Group by status
  const groupedContracts = useMemo(() => {
    const groups: Record<ContractStatus, ContractSummary[]> = {
      [ContractStatus.ACTIVE]: [],
      [ContractStatus.DRAFT]: [],
      [ContractStatus.EXPIRED]: [],
      [ContractStatus.TERMINATED]: []
    };
    
    filteredContracts.forEach(c => {
      groups[c.status].push(c);
    });
    
    return groups;
  }, [filteredContracts]);

  const columns: TableColumn<ContractSummary>[] = [
    {
      key: 'id',
      header: 'ID',
      className: 'w-20',
      cell: (row) => (
        <span className="font-mono text-[10px] uppercase text-slate-400 font-medium">
          #{row.id.split('-').pop()}
        </span>
      ),
    },
    {
      key: 'renter_name',
      header: 'Tenant & Room',
      cell: (row) => (
        <div className="flex flex-col py-1">
          <span className="font-bold text-slate-900 leading-tight">{row.renter_name}</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded uppercase tracking-wider">
              Room {row.room_number}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'start_date',
      header: 'Lease Period',
      cell: (row) => (
        <div className="flex flex-col text-sm text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="font-medium">{dateFormatter.format(new Date(row.start_date))}</span>
            <span className="text-slate-300">→</span>
            <span className="font-medium text-slate-500">{dateFormatter.format(new Date(row.end_date))}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 font-medium uppercase tracking-tight">Standard 1-year lease</p>
        </div>
      ),
    },
    {
      key: 'monthly_rent',
      header: 'Monthly Rent',
      align: 'right',
      cell: (row) => (
        <span className="font-bold text-emerald-700 tabular-nums text-base">
          {vndFormatter.format(row.monthly_rent)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      className: 'w-32',
      cell: (row) => <ContractStatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      className: 'w-20',
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Navigate to contract detail:', row.id);
          }}
          className="hover:bg-slate-50 border-slate-200"
        >
          View
        </Button>
      ),
    },
  ];

  const getRowClassName = (row: ContractSummary): string | undefined => {
    if (row.status === ContractStatus.ACTIVE) {
      return 'bg-emerald-50/40 hover:bg-emerald-50/60 border-l-4 border-l-emerald-500 rounded-none';
    }
    if (row.status === ContractStatus.EXPIRED) {
      return 'opacity-70 grayscale-[0.3] hover:opacity-100 transition-opacity';
    }
    return undefined;
  };

  if (isError) {
    return (
      <div className="py-24">
        <ErrorState
          title="Failed to load contracts"
          description="We encountered an issue while fetching the contract list. Please try again or contact support."
          onRetry={refetch}
        />
      </div>
    );
  }

  const renderSection = (title: string, data: ContractSummary[], color: string) => {
    if (data.length === 0) return null;
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-3 px-1">
          <div className={`h-4 w-1 rounded-full ${color}`} />
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">{title}</h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-400">
            {data.length}
          </span>
        </div>
        <Table<ContractSummary>
          columns={columns}
          data={data}
          keyExtractor={(row) => row.id}
          isLoading={isLoading}
          onRowClick={(row) => console.log('Row clicked:', row.id)}
          rowClassName={getRowClassName}
        />
      </section>
    );
  };

  if (!isLoading && contracts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="mb-8 rounded-full bg-slate-50 p-8 text-slate-300 ring-8 ring-slate-50/50">
          <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-3xl font-display font-bold text-slate-900">No contracts yet</h2>
        <p className="mt-4 max-w-sm text-lg text-slate-500 leading-relaxed">
          It looks like you haven't created any rental agreements in this workspace.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate(ROUTES.DASHBOARD.CONTRACT_APPLY)}
          className="mt-10 px-8 py-6 h-auto text-base shadow-xl active:scale-[0.97]"
        >
          Create Your First Contract
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between px-1">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-slate-900">Contract Management</h1>
          <p className="text-slate-500 mt-1 text-base">Overview of all rental agreements across your properties.</p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate(ROUTES.DASHBOARD.CONTRACT_APPLY)}
          className="shadow-md h-12 px-6 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-2.5">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-bold">New Contract</span>
          </div>
        </Button>
      </header>

      {/* Summary Chips */}
      {!isLoading && contracts.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 px-1">
          <div className="flex flex-col gap-1 items-center justify-center rounded-2xl border border-slate-100 bg-white p-4 shadow-sm min-w-[120px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active</span>
            <span className="text-2xl font-bold text-emerald-600">{contracts.filter(c => c.status === ContractStatus.ACTIVE).length}</span>
          </div>
          <div className="flex flex-col gap-1 items-center justify-center rounded-2xl border border-slate-100 bg-white p-4 shadow-sm min-w-[120px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Drafts</span>
            <span className="text-2xl font-bold text-sky-600">{contracts.filter(c => c.status === ContractStatus.DRAFT).length}</span>
          </div>
          <div className="flex flex-col gap-1 items-center justify-center rounded-2xl border border-slate-100 bg-white p-4 shadow-sm min-w-[120px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expired</span>
            <span className="text-2xl font-bold text-slate-600">{contracts.filter(c => c.status === ContractStatus.EXPIRED).length}</span>
          </div>
        </div>
      )}

      {/* Control Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end px-1">
        <div className="flex-1">
          <ContractFilters
            search={search}
            onSearchChange={setSearch}
            status={statusFilter}
            onStatusChange={setStatusFilter}
          />
        </div>
        {(search || statusFilter !== 'ALL') && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setSearch(''); setStatusFilter('ALL'); }}
            className="h-10 text-slate-400 hover:text-slate-600 border-slate-200"
          >
            Clear Filters
          </Button>
        )}
      </div>

      <div className="space-y-12 pb-20">
        {isLoading ? (
          <Table<ContractSummary>
            columns={columns}
            data={[]}
            keyExtractor={(row) => row.id}
            isLoading={true}
          />
        ) : (
          <>
            {statusFilter === 'ALL' ? (
              <>
                {renderSection('Active Agreements', groupedContracts[ContractStatus.ACTIVE], 'bg-emerald-500')}
                {renderSection('Drafts & Pending', groupedContracts[ContractStatus.DRAFT], 'bg-sky-500')}
                {renderSection('Expired & Archived', groupedContracts[ContractStatus.EXPIRED], 'bg-slate-400')}
                {renderSection('Terminated', groupedContracts[ContractStatus.TERMINATED], 'bg-rose-500')}
              </>
            ) : (
              <Table<ContractSummary>
                columns={columns}
                data={filteredContracts}
                keyExtractor={(row) => row.id}
                onRowClick={(row) => console.log('Row clicked:', row.id)}
                rowClassName={getRowClassName}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
