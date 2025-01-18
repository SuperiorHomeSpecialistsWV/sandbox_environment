import React, { useState } from 'react';
import { Bell, Settings, LogOut, Phone, Mail, Calendar, Users, Zap, BarChart2, Menu, Search, MessageSquare } from 'lucide-react';

const Dashboard = () => {
  const [status, setStatus] = useState('Available');
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#102F62] text-white">
        <div className="p-4">
          <img 
            src="/api/placeholder/180/60" 
            alt="Superior Home Specialists"
            className="mb-8"
          />
          <nav className="space-y-2">
            <SidebarLink icon={<Menu />} text="Dashboard" active />
            <SidebarLink icon={<Phone />} text="Communications" />
            <SidebarLink icon={<Calendar />} text="Appointments" />
            <SidebarLink icon={<Users />} text="Customers" />
            <SidebarLink icon={<AutomationIcon />} text="Automations" />
            <SidebarLink icon={<BarChart2 />} text="Analytics" />
            <SidebarLink icon={<Settings />} text="Settings" />
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#3A77B4]"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <StatusDropdown status={status} setStatus={setStatus} />
              <Bell className="text-gray-600 cursor-pointer" />
              <Settings className="text-gray-600 cursor-pointer" />
              <LogOut className="text-gray-600 cursor-pointer" />
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Urgent Communication Queue */}
            <DashboardCard title="Urgent Communications">
              <UrgentQueue />
            </DashboardCard>

            {/* Task Center */}
            <DashboardCard title="Tasks">
              <TaskList />
            </DashboardCard>

            {/* Upcoming Appointments */}
            <DashboardCard title="Today's Appointments">
              <AppointmentList />
            </DashboardCard>
          </div>

          {/* Communication Center */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard title="Recent Communications">
              <CommunicationLog />
            </DashboardCard>
            
            <DashboardCard title="Quick Actions">
              <QuickActions />
            </DashboardCard>
          </div>
        </main>
      </div>
    </div>
  );
};

// Subcomponents
const SidebarLink = ({ icon, text, active }) => (
  <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer ${active ? 'bg-[#3A77B4]' : 'hover:bg-[#3A77B4]/50'}`}>
    {icon}
    <span>{text}</span>
  </div>
);

const StatusDropdown = ({ status, setStatus }) => (
  <select 
    value={status}
    onChange={(e) => setStatus(e.target.value)}
    className="border rounded-lg px-3 py-1 text-sm"
  >
    <option>Available</option>
    <option>In a Call</option>
    <option>Away</option>
  </select>
);

const DashboardCard = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="p-4">
      {children}
    </div>
  </div>
);

const UrgentQueue = () => (
  <div className="space-y-3">
    {[
      { type: 'Call', customer: 'John Smith', time: '10 mins ago', urgent: true },
      { type: 'Message', customer: 'Sarah Johnson', time: '25 mins ago', urgent: true },
    ].map((item, i) => (
      <div key={i} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
        <div className="flex items-center space-x-3">
          {item.type === 'Call' ? <Phone size={16} /> : <MessageSquare size={16} />}
          <span className="font-medium">{item.customer}</span>
        </div>
        <span className="text-sm text-gray-500">{item.time}</span>
      </div>
    ))}
  </div>
);

const TaskList = () => (
  <div className="space-y-3">
    {[
      { task: 'Follow up with Mike about estimate', due: 'Today 3PM' },
      { task: 'Send invoice to Barbara', due: 'Today 4PM' },
    ].map((item, i) => (
      <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
        <span>{item.task}</span>
        <span className="text-sm text-gray-500">{item.due}</span>
      </div>
    ))}
  </div>
);

const AppointmentList = () => (
  <div className="space-y-3">
    {[
      { time: '9:00 AM', customer: 'David Wilson', service: 'Home Inspection' },
      { time: '2:30 PM', customer: 'Emma Thompson', service: 'Estimate' },
    ].map((item, i) => (
      <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
        <div>
          <div className="font-medium">{item.customer}</div>
          <div className="text-sm text-gray-500">{item.service}</div>
        </div>
        <span className="text-sm font-medium">{item.time}</span>
      </div>
    ))}
  </div>
);

const CommunicationLog = () => (
  <div className="space-y-3">
    {[
      { type: 'Phone', customer: 'Alice Brown', time: '1 hour ago', status: 'Completed' },
      { type: 'Email', customer: 'Robert Davis', time: '2 hours ago', status: 'Pending Reply' },
    ].map((item, i) => (
      <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          {item.type === 'Phone' ? <Phone size={16} /> : <Mail size={16} />}
          <div>
            <div className="font-medium">{item.customer}</div>
            <div className="text-sm text-gray-500">{item.type}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm">{item.time}</div>
          <div className="text-sm text-gray-500">{item.status}</div>
        </div>
      </div>
    ))}
  </div>
);

const QuickActions = () => (
  <div className="grid grid-cols-2 gap-4">
    {[
      { icon: <Phone size={20} />, text: 'New Call' },
      { icon: <Mail size={20} />, text: 'Send Email' },
      { icon: <MessageSquare size={20} />, text: 'SMS Template' },
      { icon: <Calendar size={20} />, text: 'Schedule' },
    ].map((action, i) => (
      <button
        key={i}
        className="flex items-center justify-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
      >
        {action.icon}
        <span>{action.text}</span>
      </button>
    ))}
  </div>
);

export default Dashboard;
