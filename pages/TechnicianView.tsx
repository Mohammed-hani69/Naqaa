import React, { useRef, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Button, Card, Input, Modal, Badge } from '../components/Shared';
import { MapPin, Calendar, CheckCircle, Camera, PenTool } from 'lucide-react';
import { VisitStatus } from '../types';

const TechnicianView: React.FC = () => {
  const { visits, clients, currentUser, updateVisit } = useStore();
  const [selectedVisit, setSelectedVisit] = useState<any>(null);
  const [reportData, setReportData] = useState({ pestType: '', chemicals: '', notes: '' });

  // Filter visits for this technician
  const myVisits = visits.filter(v => v.technicianId === currentUser.id && v.status !== 'Canceled');
  const today = new Date().toISOString().split('T')[0];
  const pendingVisits = myVisits.filter(v => v.status === VisitStatus.PENDING).sort((a,b) => a.date.localeCompare(b.date));

  const handleStartReport = (visit: any) => {
    setSelectedVisit(visit);
    setReportData({ pestType: '', chemicals: '', notes: '' });
  };

  const submitReport = () => {
    if(selectedVisit) {
      updateVisit(selectedVisit.id, {
        status: VisitStatus.COMPLETED,
        pestType: reportData.pestType,
        chemicalsUsed: reportData.chemicals,
        notes: reportData.notes,
        completedAt: new Date().toISOString()
      });
      setSelectedVisit(null);
    }
  };

  // Simple signature canvas placeholder
  const SignatureArea = () => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center bg-gray-50 text-gray-400">
        <div className="text-center">
            <PenTool className="mx-auto mb-2" />
            <p>Customer signs here</p>
        </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-brand-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold">Hello, {currentUser.name}</h1>
        <p className="opacity-90">You have {pendingVisits.length} pending visits.</p>
      </div>

      <div className="space-y-4">
        <h2 className="font-bold text-gray-800 text-lg">Upcoming Schedule</h2>
        {pendingVisits.length === 0 && <p className="text-gray-500 italic">No pending visits.</p>}
        
        {pendingVisits.map(visit => {
          const client = clients.find(c => c.id === visit.clientId);
          const isToday = visit.date === today;
          
          return (
            <div key={visit.id} className={`bg-white p-4 rounded-lg shadow border-l-4 ${isToday ? 'border-brand-500' : 'border-gray-300'}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{client?.name}</h3>
                  <div className="flex items-center text-gray-500 text-sm gap-1">
                    <MapPin size={14} /> {client?.address}
                  </div>
                </div>
                {isToday && <Badge className="bg-green-100 text-green-800">TODAY</Badge>}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Calendar size={14} /> {visit.date}
                <span className="text-gray-300">|</span>
                <span className="font-mono">{visit.visitNumber}</span>
              </div>

              <Button onClick={() => handleStartReport(visit)} className="w-full">
                <CheckCircle size={16} /> Complete Visit
              </Button>
            </div>
          );
        })}
      </div>

      <Modal isOpen={!!selectedVisit} onClose={() => setSelectedVisit(null)} title="Service Report">
        <div className="space-y-4">
          <Input label="Target Pest" placeholder="e.g. Cockroaches, Ants" value={reportData.pestType} onChange={e => setReportData({...reportData, pestType: e.target.value})} />
          <Input label="Chemicals Used" placeholder="e.g. Advion Gel, Biflex" value={reportData.chemicals} onChange={e => setReportData({...reportData, chemicals: e.target.value})} />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photos</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer">
              <Camera size={24} className="mb-2" />
              <span>Tap to upload photos</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Signature</label>
            <SignatureArea />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
             <textarea className="w-full border rounded-md p-2 h-24" placeholder="Any additional observations..." value={reportData.notes} onChange={e => setReportData({...reportData, notes: e.target.value})}></textarea>
          </div>

          <Button onClick={submitReport} className="w-full">Submit Report</Button>
        </div>
      </Modal>
    </div>
  );
};

export default TechnicianView;