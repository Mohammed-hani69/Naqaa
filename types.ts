export enum Role {
  ADMIN = 'ADMIN',
  OFFICE = 'OFFICE',
  TECHNICIAN = 'TECHNICIAN'
}

export enum ContractType {
  ANNUAL = 'Annual',
  SEMI_ANNUAL = 'Semi-Annual',
  ONE_TIME = 'One-Time'
}

export enum VisitFrequency {
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  QUARTERLY = 'Quarterly',
  ONE_OFF = 'One-Off'
}

export enum VisitStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  CANCELED = 'Canceled',
  MISSED = 'Missed'
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  emirate: string;
  address: string;
  unitNumber?: string;
  propertyType: 'Residential' | 'Commercial' | 'Industrial';
  createdAt: string;
}

export interface Contract {
  id: string;
  contractNumber: string;
  clientId: string;
  type: ContractType;
  startDate: string;
  endDate: string;
  visitsIncluded: number;
  frequency: VisitFrequency;
  price: number;
  isPaid: boolean;
  status: 'Active' | 'Expired' | 'Terminated';
  pdfUrl?: string; // Placeholder for file
}

export interface Technician {
  id: string;
  name: string;
  role: string;
  email: string;
  color: string; // For calendar visualization
}

export interface Visit {
  id: string;
  visitNumber: string;
  contractId: string;
  clientId: string;
  technicianId: string | null;
  date: string; // ISO Date string
  status: VisitStatus;
  
  // Technician Report Fields
  pestType?: string;
  chemicalsUsed?: string;
  notes?: string;
  photos?: string[]; // Array of base64 strings or URLs
  customerSignature?: string; // Base64 signature
  completedAt?: string;
}

export interface AppState {
  clients: Client[];
  contracts: Contract[];
  visits: Visit[];
  technicians: Technician[];
  currentUser: {
    id: string;
    name: string;
    role: Role;
  };
}