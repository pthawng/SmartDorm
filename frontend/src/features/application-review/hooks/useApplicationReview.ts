import { useState, useMemo } from 'react';
import type { LeaseApplication, ApplicationStatus, ApplicationFilterStatus } from '../types';

const MOCK_APPLICATIONS: LeaseApplication[] = [
  {
    id: 'app-9821',
    status: 'PENDING',
    applied_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    room_id: 'room-101',
    room_number: '101',
    property_name: 'SmartDorm Central',
    applicant: {
      id: 'usr-tenant-1',
      full_name: 'Sarah Chen',
      email: 'sarah.chen@university.edu',
      phone: '+84 901 234 567',
      occupation: 'Graduate Student (CS)',
      id_number: 'ID-8821992',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      verification_status: 'VERIFIED'
    },
    terms: {
      monthly_rent: 4500000,
      deposit_amount: 9000000,
      start_date: '2026-04-01T00:00:00Z',
      duration_months: 12
    },
    message: "Hi! I'm moving to the city for my master's degree. I'm very quiet and reliable."
  },
  {
    id: 'app-7712',
    status: 'APPROVED',
    applied_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    room_id: 'room-202',
    room_number: '202',
    property_name: 'SmartDorm Central',
    applicant: {
      id: 'usr-tenant-2',
      full_name: 'Marcus Thorne',
      email: 'm.thorne@design.com',
      phone: '+84 912 888 777',
      occupation: 'Junior Designer',
      id_number: 'ID-5512001',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      verification_status: 'VERIFIED'
    },
    terms: {
      monthly_rent: 5200000,
      deposit_amount: 10400000,
      start_date: '2026-03-25T00:00:00Z',
      duration_months: 6
    }
  },
  {
    id: 'app-3310',
    status: 'REVISION_REQUESTED',
    applied_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    room_id: 'room-303',
    room_number: '303',
    property_name: 'SmartDorm Skyline',
    applicant: {
      id: 'usr-tenant-3',
      full_name: 'Elena Gilbert',
      email: 'e.gilbert@town.org',
      phone: '+84 933 111 222',
      occupation: 'Journalism Intern',
      id_number: 'ID-1234567',
      verification_status: 'PENDING'
    },
    terms: {
      monthly_rent: 4800000,
      deposit_amount: 9600000,
      start_date: '2026-04-15T00:00:00Z',
      duration_months: 12
    },
    message: "Requested room 303 because of the view."
  }
];

export function useApplicationReview() {
  const [applications, setApplications] = useState<LeaseApplication[]>(MOCK_APPLICATIONS);
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_APPLICATIONS[0].id);
  const [statusFilter, setStatusFilter] = useState<ApplicationFilterStatus>('ALL');
  const [isLoading, setIsLoading] = useState(false);

  const selectedApplication = useMemo(() => 
    applications.find(app => app.id === selectedId) || null
  , [applications, selectedId]);

  const filteredApplications = useMemo(() => 
    applications.filter(app => statusFilter === 'ALL' || app.status === statusFilter)
  , [applications, statusFilter]);

  const handleAction = async (id: string, newStatus: ApplicationStatus) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
    setIsLoading(false);
  };

  return {
    applications: filteredApplications,
    selectedApplication,
    selectedId,
    setSelectedId,
    statusFilter,
    setStatusFilter,
    isLoading,
    handleAction
  };
}
