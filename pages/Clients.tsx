import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Card, Button, Input, Select, Modal, Badge } from '../components/Shared';
import { Plus, Search, MapPin, Phone, Mail } from 'lucide-react';
import { Client } from '../types';

const ClientsPage: React.FC = () => {
  const { clients, addClient, contracts } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Client Form State
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '', phone: '', email: '', emirate: 'Dubai', address: '', propertyType: 'Residential'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone) {
      addClient(formData as Omit<Client, 'id' | 'createdAt'>);
      setIsModalOpen(false);
      setFormData({ name: '', phone: '', email: '', emirate: 'Dubai', address: '', propertyType: 'Residential' });
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Search clients..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsModalOpen(true)}><Plus size={18} /> Add Client</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map(client => {
          const clientContracts = contracts.filter(c => c.clientId === client.id);
          const activeContract = clientContracts.find(c => c.status === 'Active');

          return (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{client.name}</h3>
                  <Badge color={activeContract ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>
                    {activeContract ? 'Active Contract' : 'No Active Contract'}
                  </Badge>
                </div>
                <div className="bg-gray-100 p-2 rounded-full text-gray-600 font-bold text-xs">
                  {client.propertyType[0]}
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2"><Phone size={14} /> {client.phone}</div>
                <div className="flex items-center gap-2"><Mail size={14} /> {client.email}</div>
                <div className="flex items-center gap-2"><MapPin size={14} /> {client.address}, {client.emirate}</div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                <span>ID: {client.id}</span>
                <span className="text-brand-600 font-medium cursor-pointer hover:underline">View History &rarr;</span>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Client">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Client Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
            <Input label="Email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Emirate" value={formData.emirate} onChange={e => setFormData({...formData, emirate: e.target.value})}>
              <option>Dubai</option><option>Abu Dhabi</option><option>Sharjah</option><option>Ajman</option>
            </Select>
            <Select label="Type" value={formData.propertyType} onChange={e => setFormData({...formData, propertyType: e.target.value as any})}>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
            </Select>
          </div>
          <Input label="Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
          <div className="flex justify-end pt-4">
            <Button type="submit">Create Client</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ClientsPage;