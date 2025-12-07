import React from 'react';
import { useStore } from '../context/StoreContext';
import { Card } from '../components/Shared';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, FileText, Calendar, AlertTriangle } from 'lucide-react';
import { VisitStatus } from '../types';

const Dashboard: React.FC = () => {
  const { clients, contracts, visits } = useStore();

  const activeContracts = contracts.filter(c => c.status === 'Active').length;
  const today = new Date().toISOString().split('T')[0];
  const todaysVisits = visits.filter(v => v.date === today);
  const missedVisits = visits.filter(v => v.status === VisitStatus.MISSED || (new Date(v.date) < new Date(today) && v.status === VisitStatus.PENDING)).length;

  const stats = [
    { label: 'Total Clients', value: clients.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Contracts', value: activeContracts, icon: FileText, color: 'text-green-600', bg: 'bg-green-50' },
    { label: "Today's Visits", value: todaysVisits.length, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Missed/Delayed', value: missedVisits, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  // Chart Data Preparation
  const statusData = [
    { name: 'Completed', value: visits.filter(v => v.status === VisitStatus.COMPLETED).length },
    { name: 'Pending', value: visits.filter(v => v.status === VisitStatus.PENDING).length },
    { name: 'Missed', value: missedVisits },
  ];
  const COLORS = ['#22c55e', '#eab308', '#ef4444'];

  const visitsByMonth = [
    { name: 'Jan', visits: 12 }, { name: 'Feb', visits: 19 }, { name: 'Mar', visits: 15 },
    { name: 'Apr', visits: 22 }, { name: 'May', visits: 30 }, { name: 'Jun', visits: 25 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="flex items-center p-6">
            <div className={`p-4 rounded-full ${stat.bg} mr-4`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Visits Overview (Last 6 Months)" className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={visitsByMonth}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="visits" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Visit Status Distribution" className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {statusData.map((entry, index) => (
              <div key={index} className="flex items-center text-sm">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                {entry.name}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Contracts Expiring Soon">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contracts.slice(0, 3).map((contract) => (
                <tr key={contract.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contract.contractNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{clients.find(c => c.id === contract.clientId)?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contract.endDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {contract.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;