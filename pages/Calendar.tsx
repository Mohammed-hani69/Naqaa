import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Card, Modal, Button, Select } from '../components/Shared';
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import { formatCurrency, cn, getStatusColor } from '../utils';

const CalendarView: React.FC = () => {
  const { visits, clients, technicians, updateVisit } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedVisit, setSelectedVisit] = useState<any>(null); // For modal

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getVisitsForDay = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    return visits.filter(v => v.date === dateStr);
  };

  const handleVisitClick = (visit: any) => {
    setSelectedVisit(visit);
  };

  const assignTechnician = (techId: string) => {
    if (selectedVisit) {
      updateVisit(selectedVisit.id, { technicianId: techId });
      setSelectedVisit(null);
    }
  };

  const rescheduleVisit = (newDate: string) => {
    if(selectedVisit) {
        updateVisit(selectedVisit.id, { date: newDate });
        setSelectedVisit(null);
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrevMonth}><ChevronLeft size={16} /> Prev</Button>
          <Button variant="outline" onClick={() => setCurrentDate(new Date())}>Today</Button>
          <Button variant="outline" onClick={handleNextMonth}>Next <ChevronRight size={16} /></Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow ring-1 ring-gray-200 flex-grow flex flex-col">
        <div className="grid grid-cols-7 gap-px border-b border-gray-200 bg-gray-50 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
          <div className="py-2">Sun</div>
          <div className="py-2">Mon</div>
          <div className="py-2">Tue</div>
          <div className="py-2">Wed</div>
          <div className="py-2">Thu</div>
          <div className="py-2">Fri</div>
          <div className="py-2">Sat</div>
        </div>
        <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
          <div className="w-full grid grid-cols-7 grid-rows-5 gap-px">
            {blanks.map(blank => <div key={`blank-${blank}`} className="bg-gray-50 min-h-[100px]" />)}
            {days.map(day => {
              const dayVisits = getVisitsForDay(day);
              return (
                <div key={day} className="relative bg-white p-2 min-h-[120px] hover:bg-gray-50 transition-colors">
                  <time dateTime={`2023-${day}`} className={cn("flex h-6 w-6 items-center justify-center rounded-full font-semibold", 
                    day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() ? "bg-brand-600 text-white" : "text-gray-900"
                  )}>
                    {day}
                  </time>
                  <div className="mt-2 space-y-1 overflow-y-auto max-h-[80px]">
                    {dayVisits.map(visit => {
                      const client = clients.find(c => c.id === visit.clientId);
                      const tech = technicians.find(t => t.id === visit.technicianId);
                      return (
                        <button
                          key={visit.id}
                          onClick={() => handleVisitClick(visit)}
                          className={cn("w-full text-left px-2 py-1 rounded text-xs truncate border-l-2", 
                             visit.status === 'Completed' ? "bg-green-50 border-green-500 text-green-700" :
                             tech ? `bg-blue-50 border-[${tech.color}] text-blue-700` : "bg-yellow-50 border-yellow-500 text-yellow-700"
                          )}
                          style={tech ? { borderLeftColor: tech.color } : {}}
                        >
                          {client?.name || 'Unknown'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Visit Detail / Reschedule / Assign Modal */}
      <Modal isOpen={!!selectedVisit} onClose={() => setSelectedVisit(null)} title="Manage Visit">
        {selectedVisit && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Client</label>
              <div className="font-medium text-lg">{clients.find(c => c.id === selectedVisit.clientId)?.name}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Date</label>
              <input type="date" className="block w-full border rounded p-2 mt-1" defaultValue={selectedVisit.date} onChange={(e) => rescheduleVisit(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-gray-500">Assigned Technician</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {technicians.map(tech => (
                   <button
                   key={tech.id}
                   onClick={() => assignTechnician(tech.id)}
                   className={cn("p-2 border rounded text-left flex items-center gap-2 text-sm", 
                     selectedVisit.technicianId === tech.id ? "border-brand-500 bg-brand-50" : "hover:bg-gray-50"
                   )}
                 >
                   <div className="w-3 h-3 rounded-full" style={{backgroundColor: tech.color}}></div>
                   {tech.name}
                 </button>
                ))}
              </div>
            </div>
            <div className="pt-4 flex justify-end gap-2">
                <Button variant="danger" onClick={() => { /* Cancel Logic */ setSelectedVisit(null) }}>Cancel Visit</Button>
                <Button onClick={() => setSelectedVisit(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CalendarView;