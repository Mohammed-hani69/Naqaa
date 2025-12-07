import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  AppState, Client, Contract, Visit, Technician, Role, 
  ContractType, VisitFrequency, VisitStatus 
} from '../types';
import { generateId } from '../utils';

// --- MOCK DATA ---
const MOCK_TECHNICIANS: Technician[] = [
  { id: 't1', name: 'Ahmed Hassan', role: 'Senior Tech', email: 'ahmed@pcp.com', color: '#3b82f6' },
  { id: 't2', name: 'John Doe', role: 'Junior Tech', email: 'john@pcp.com', color: '#f59e0b' },
  { id: 't3', name: 'Sarah Smith', role: 'Specialist', email: 'sarah@pcp.com', color: '#8b5cf6' },
];

const MOCK_CLIENTS: Client[] = [
  { 
    id: 'c1', name: 'Grand Hyatt Hotel', phone: '+971 50 123 4567', email: 'ops@grandhyatt.ae', 
    emirate: 'Dubai', address: 'Sheikh Zayed Rd', propertyType: 'Commercial', createdAt: '2023-01-10'
  },
  { 
    id: 'c2', name: 'Villa 45 Compound', phone: '+971 55 987 6543', email: 'manager@villas.ae', 
    emirate: 'Abu Dhabi', address: 'Saadiyat Island', propertyType: 'Residential', createdAt: '2023-03-15'
  }
];

const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'cnt1', contractNumber: 'CTR-2023-001', clientId: 'c1', type: ContractType.ANNUAL,
    startDate: '2023-01-01', endDate: '2023-12-31', visitsIncluded: 12, frequency: VisitFrequency.MONTHLY,
    price: 15000, isPaid: true, status: 'Active'
  },
  {
    id: 'cnt2', contractNumber: 'CTR-2023-055', clientId: 'c2', type: ContractType.SEMI_ANNUAL,
    startDate: '2023-06-01', endDate: '2023-12-01', visitsIncluded: 6, frequency: VisitFrequency.MONTHLY,
    price: 5000, isPaid: false, status: 'Active'
  }
];

const MOCK_VISITS: Visit[] = [
  { 
    id: 'v1', visitNumber: 'VST-1001', contractId: 'cnt1', clientId: 'c1', technicianId: 't1', 
    date: new Date().toISOString().split('T')[0], status: VisitStatus.PENDING 
  },
  { 
    id: 'v2', visitNumber: 'VST-1002', contractId: 'cnt2', clientId: 'c2', technicianId: 't2', 
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], status: VisitStatus.COMPLETED,
    pestType: 'Cockroaches', chemicalsUsed: 'Advion Gel', completedAt: new Date().toISOString()
  }
];

interface StoreContextType extends AppState {
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  deleteClient: (id: string) => void;
  addContract: (contract: Omit<Contract, 'id' | 'contractNumber' | 'status'>) => void;
  addVisit: (visit: Omit<Visit, 'id' | 'visitNumber' | 'status'>) => void;
  updateVisit: (id: string, updates: Partial<Visit>) => void;
  switchRole: (role: Role) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
  const [visits, setVisits] = useState<Visit[]>(MOCK_VISITS);
  const [technicians] = useState<Technician[]>(MOCK_TECHNICIANS);
  const [userRole, setUserRole] = useState<Role>(Role.ADMIN);

  const currentUser = {
    id: 'u1',
    name: userRole === Role.TECHNICIAN ? 'Ahmed Hassan' : 'Admin User',
    role: userRole
  };

  const addClient = (data: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    setClients([...clients, newClient]);
  };

  const deleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
    // Also cleanup contracts and visits in a real app
  };

  const addContract = (data: Omit<Contract, 'id' | 'contractNumber' | 'status'>) => {
    const newContract: Contract = {
      ...data,
      id: generateId(),
      contractNumber: `CTR-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      status: 'Active'
    };
    setContracts([...contracts, newContract]);

    // Auto-generate visits based on frequency
    // Simple mock implementation for demo
    const newVisits: Visit[] = [];
    let currentDate = new Date(newContract.startDate);
    const endDate = new Date(newContract.endDate);
    
    // Safety break to prevent infinite loops in demo
    let count = 0;
    while (currentDate <= endDate && count < newContract.visitsIncluded) {
      newVisits.push({
        id: generateId(),
        visitNumber: `VST-${Math.floor(Math.random() * 10000)}`,
        contractId: newContract.id,
        clientId: newContract.clientId,
        technicianId: null, // Unassigned initially
        date: currentDate.toISOString().split('T')[0],
        status: VisitStatus.PENDING
      });

      // Increment date
      if (newContract.frequency === VisitFrequency.WEEKLY) {
        currentDate.setDate(currentDate.getDate() + 7);
      } else if (newContract.frequency === VisitFrequency.MONTHLY) {
        currentDate.setMonth(currentDate.getMonth() + 1);
      } else {
        // One-time or other, just break for now
        break; 
      }
      count++;
    }
    setVisits([...visits, ...newVisits]);
  };

  const addVisit = (data: Omit<Visit, 'id' | 'visitNumber' | 'status'>) => {
    const newVisit: Visit = {
      ...data,
      id: generateId(),
      visitNumber: `VST-${Math.floor(Math.random() * 10000)}`,
      status: VisitStatus.PENDING
    };
    setVisits([...visits, newVisit]);
  };

  const updateVisit = (id: string, updates: Partial<Visit>) => {
    setVisits(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const switchRole = (role: Role) => setUserRole(role);

  return (
    <StoreContext.Provider value={{
      clients, contracts, visits, technicians, currentUser,
      addClient, deleteClient, addContract, addVisit, updateVisit, switchRole
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};