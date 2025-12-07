import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Role } from './types';
import Dashboard from './pages/Dashboard';
import CalendarView from './pages/Calendar';
import ClientsPage from './pages/Clients';
import TechnicianView from './pages/TechnicianView';
import { 
  LayoutDashboard, Users, Calendar as CalendarIcon, FileText, 
  Menu, Bell, LogOut, ClipboardList, ShieldCheck
} from 'lucide-react';
import { cn } from './utils';

// --- Sidebar Component ---
const Sidebar: React.FC<{ activeTab: string; onTabChange: (tab: string) => void; isOpen: boolean }> = ({ activeTab, onTabChange, isOpen }) => {
  const { currentUser, switchRole } = useStore();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [Role.ADMIN, Role.OFFICE] },
    { id: 'calendar', label: 'Schedule', icon: CalendarIcon, roles: [Role.ADMIN, Role.OFFICE] },
    { id: 'clients', label: 'Clients', icon: Users, roles: [Role.ADMIN, Role.OFFICE] },
    { id: 'contracts', label: 'Contracts', icon: FileText, roles: [Role.ADMIN, Role.OFFICE] },
    { id: 'tech-portal', label: 'My Visits', icon: ClipboardList, roles: [Role.TECHNICIAN] },
  ];

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
      !isOpen && "-translate-x-full"
    )}>
      <div className="flex items-center gap-3 p-6 border-b border-slate-800">
        <div className="p-2 bg-brand-500 rounded-lg">
           <ShieldCheck size={24} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">PestControl<span className="text-brand-400">Pro</span></span>
      </div>
      
      <nav className="p-4 space-y-1">
        {menuItems.filter(item => item.roles.includes(currentUser.role)).map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm font-medium",
              activeTab === item.id ? "bg-brand-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
        <div className="mb-4 px-4">
           <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Simulate Role</p>
           <select 
             className="w-full bg-slate-800 border-none text-xs rounded text-slate-300 p-2"
             value={currentUser.role}
             onChange={(e) => switchRole(e.target.value as Role)}
           >
             <option value={Role.ADMIN}>Admin</option>
             <option value={Role.TECHNICIAN}>Technician</option>
           </select>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white cursor-pointer">
          <LogOut size={18} />
          <span className="text-sm">Sign Out</span>
        </div>
      </div>
    </div>
  );
};

// --- Topbar Component ---
const Topbar: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const { currentUser } = useStore();
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8">
      <button onClick={onMenuClick} className="lg:hidden p-2 text-gray-600">
        <Menu size={24} />
      </button>
      <div className="flex-1 lg:flex-none"></div> 
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-500 hover:text-gray-700">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
            <p className="text-xs text-gray-500 capitalize">{currentUser.role.toLowerCase()}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold">
            {currentUser.name[0]}
          </div>
        </div>
      </div>
    </header>
  );
};

// --- Contracts Placeholder (Since logic is similar to Clients) ---
const ContractsView = () => {
  const { contracts, clients } = useStore();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
        <button className="bg-brand-600 text-white px-4 py-2 rounded-md">+ New Contract</button>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Number</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visits</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contracts.map(c => (
              <tr key={c.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.contractNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{clients.find(cl => cl.id === c.clientId)?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.visitsIncluded}</td>
                <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 text-xs rounded-full font-semibold ${c.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser } = useStore();

  // Redirect technician immediately to portal if they are on dashboard
  React.useEffect(() => {
    if (currentUser.role === Role.TECHNICIAN && activeTab === 'dashboard') {
      setActiveTab('tech-portal');
    } else if (currentUser.role !== Role.TECHNICIAN && activeTab === 'tech-portal') {
      setActiveTab('dashboard');
    }
  }, [currentUser.role]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'calendar': return <CalendarView />;
      case 'clients': return <ClientsPage />;
      case 'contracts': return <ContractsView />;
      case 'tech-portal': return <TechnicianView />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={(t) => {setActiveTab(t); setSidebarOpen(false)}} isOpen={sidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <StoreProvider>
    <AppContent />
  </StoreProvider>
);

export default App;