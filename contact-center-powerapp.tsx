import React, { useState } from 'react';
import { 
  Bell, 
  Phone, 
  Users, 
  Calendar, 
  MessageSquare, 
  FileText, 
  BarChart,
  Settings,
  Search,
  User,
  Clock,
  AlertCircle
} from 'lucide-react';

const ContactCenterPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for demonstration
  const queueMetrics = {
    callsWaiting: 12,
    avgWaitTime: '2:30',
    serviceLevel: '92%',
    availableAgents: 15,
    abandonedCalls: 3
  };

  const recentCalls = [
    { id: 1, customer: "John Smith", time: "10:30 AM", status: "Completed", duration: "5:23" },
    { id: 2, customer: "Sarah Jones", time: "10:45 AM", status: "Active", duration: "2:15" },
    { id: 3, customer: "Mike Wilson", time: "11:00 AM", status: "Queued", duration: "-" }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar Navigation */}
      <div className="w-16 bg-slate-800 flex flex-col items-center py-4">
        <div className="space-y-6">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`p-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-500 text-white' : 'text-gray-400'}`}>
            <BarChart size={24} />
          </button>
          <button 
            onClick={() => setActiveTab('calls')}
            className={`p-2 rounded-lg ${activeTab === 'calls' ? 'bg-blue-500 text-white' : 'text-gray-400'}`}>
            <Phone size={24} />
          </button>
          <button 
            onClick={() => setActiveTab('team')}
            className={`p-2 rounded-lg ${activeTab === 'team' ? 'bg-blue-500 text-white' : 'text-gray-400'}`}>
            <Users size={24} />
          </button>
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`p-2 rounded-lg ${activeTab === 'schedule' ? 'bg-blue-500 text-white' : 'text-gray-400'}`}>
            <Calendar size={24} />
          </button>
          <button 
            onClick={() => setActiveTab('knowledge')}
            className={`p-2 rounded-lg ${activeTab === 'knowledge' ? 'bg-blue-500 text-white' : 'text-gray-400'}`}>
            <FileText size={24} />
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`p-2 rounded-lg ${activeTab === 'messages' ? 'bg-blue-500 text-white' : 'text-gray-400'}`}>
            <MessageSquare size={24} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">Contact Center Portal</h1>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Bell size={20} className="text-gray-600" />
              <User size={20} className="text-gray-600" />
              <Settings size={20} className="text-gray-600" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 h-full overflow-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Metrics Grid */}
              <div className="grid grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-500">Calls Waiting</h3>
                    <Phone size={20} className="text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold mt-2">{queueMetrics.callsWaiting}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-500">Avg Wait Time</h3>
                    <Clock size={20} className="text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold mt-2">{queueMetrics.avgWaitTime}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-500">Service Level</h3>
                    <BarChart size={20} className="text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold mt-2">{queueMetrics.serviceLevel}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-500">Available Agents</h3>
                    <Users size={20} className="text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold mt-2">{queueMetrics.availableAgents}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <h3 className="text-gray-500">Abandoned Calls</h3>
                    <AlertCircle size={20} className="text-red-500" />
                  </div>
                  <p className="text-2xl font-bold mt-2">{queueMetrics.abandonedCalls}</p>
                </div>
              </div>

              {/* Recent Calls Table */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Recent Calls</h2>
                </div>
                <div className="p-4">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-500">
                        <th className="pb-4">Customer</th>
                        <th className="pb-4">Time</th>
                        <th className="pb-4">Status</th>
                        <th className="pb-4">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentCalls.map(call => (
                        <tr key={call.id} className="border-t">
                          <td className="py-3">{call.customer}</td>
                          <td className="py-3">{call.time}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-sm ${
                              call.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              call.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {call.status}
                            </span>
                          </td>
                          <td className="py-3">{call.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ContactCenterPortal;
