import React, { useState } from 'react';
import { Phone, Mail, MessageSquare, Calendar, Clock, Star, ChevronRight, Bell, Users, Settings, Search, Filter, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

const CommunicationCenter = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedChannel, setSelectedChannel] = useState(null);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Navigation */}
      <nav className="w-64 bg-[#102F62] text-white p-6">
        <div className="mb-8">
          <img src="/api/placeholder/160/48" alt="Superior Home" className="mb-6" />
          <div className="flex items-center space-x-3 bg-[#3A77B4] rounded-lg p-3">
            <div className="w-10 h-10 rounded-full bg-white/20" />
            <div>
              <div className="font-medium">Nikki</div>
              <div className="text-sm opacity-75">Available</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <NavItem icon={<MessageSquare size={20} />} text="Communications" active />
          <NavItem icon={<Calendar size={20} />} text="Appointments" />
          <NavItem icon={<Users size={20} />} text="Customers" />
          <NavItem icon={<Bell size={20} />} text="Notifications" />
          <NavItem icon={<Settings size={20} />} text="Settings" />
        </div>
      </nav>

      {/* Communication Center */}
      <div className="flex-1 flex">
        {/* Messages List */}
        <div className="w-96 border-r bg-white">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-4 mb-4">
              <h1 className="text-xl font-bold">Communications</h1>
              <button className="ml-auto p-2 hover:bg-gray-100 rounded-lg">
                <Filter size={20} />
              </button>
            </div>
            <div className="flex space-x-2">
              <ChannelTab active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
                All
              </ChannelTab>
              <ChannelTab active={activeTab === 'unread'} onClick={() => setActiveTab('unread')}>
                Unread
              </ChannelTab>
              <ChannelTab active={activeTab === 'flagged'} onClick={() => setActiveTab('flagged')}>
                Flagged
              </ChannelTab>
            </div>
          </div>

          <div className="overflow-auto">
            {communications.map((comm) => (
              <CommunicationItem
                key={comm.id}
                data={comm}
                selected={selectedChannel?.id === comm.id}
                onClick={() => setSelectedChannel(comm)}
              />
            ))}
          </div>
        </div>

        {/* Conversation View */}
        {selectedChannel ? (
          <div className="flex-1 flex flex-col bg-white">
            <ConversationHeader channel={selectedChannel} />
            <ConversationBody channel={selectedChannel} />
            <ConversationInput />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">Select a Conversation</h2>
              <p className="text-gray-500">Choose from your active conversations to get started</p>
            </div>
          </div>
        )}

        {/* Customer Info Sidebar */}
        {selectedChannel && (
          <div className="w-80 border-l bg-white p-4">
            <CustomerInfo customer={selectedChannel.customer} />
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <QuickAction icon={<Calendar size={16} />} text="Schedule" />
                <QuickAction icon={<Star size={16} />} text="Priority" />
                <QuickAction icon={<MessageSquare size={16} />} text="Template" />
                <QuickAction icon={<Clock size={16} />} text="Reminder" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Subcomponents
const NavItem = ({ icon, text, active }) => (
  <div className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${
    active ? 'bg-[#3A77B4]' : 'hover:bg-[#3A77B4]/50'
  }`}>
    {icon}
    <span>{text}</span>
  </div>
);

const ChannelTab = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium ${
      active ? 'bg-[#102F62] text-white' : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    {children}
  </button>
);

const CommunicationItem = ({ data, selected, onClick }) => (
  <div
    onClick={onClick}
    className={`p-4 border-b cursor-pointer ${
      selected ? 'bg-blue-50' : 'hover:bg-gray-50'
    }`}
  >
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div>
          <div className="font-medium">{data.customer.name}</div>
          <div className="text-sm text-gray-500">{data.channel}</div>
        </div>
      </div>
      <div className="text-sm text-gray-500">{data.time}</div>
    </div>
    <p className="text-sm text-gray-600 line-clamp-2">{data.preview}</p>
  </div>
);

const ConversationHeader = ({ channel }) => (
  <div className="p-4 border-b flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-full bg-gray-200" />
      <div>
        <div className="font-medium">{channel.customer.name}</div>
        <div className="text-sm text-gray-500">{channel.customer.email}</div>
      </div>
    </div>
    <div className="flex space-x-2">
      <button className="p-2 hover:bg-gray-100 rounded-lg">
        <Phone size={20} />
      </button>
      <button className="p-2 hover:bg-gray-100 rounded-lg">
        <Mail size={20} />
      </button>
    </div>
  </div>
);

const ConversationBody = ({ channel }) => (
  <div className="flex-1 overflow-auto p-4 space-y-4">
    {channel.messages.map((message, i) => (
      <div
        key={i}
        className={`flex ${message.sent ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-md p-3 rounded-lg ${
            message.sent
              ? 'bg-[#102F62] text-white'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {message.content}
        </div>
      </div>
    ))}
  </div>
);

const ConversationInput = () => (
  <div className="p-4 border-t">
    <div className="flex items-center space-x-2">
      <input
        type="text"
        placeholder="Type your message..."
        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A77B4]"
      />
      <button className="p-2 bg-[#102F62] text-white rounded-lg">
        <ArrowRight size={20} />
      </button>
    </div>
  </div>
);

const CustomerInfo = ({ customer }) => (
  <div>
    <h3 className="font-semibold mb-4">Customer Information</h3>
    <div className="space-y-3">
      <InfoField label="Phone" value={customer.phone} />
      <InfoField label="Email" value={customer.email} />
      <InfoField label="Address" value={customer.address} />
      <InfoField label="Last Interaction" value={customer.lastInteraction} />
    </div>
  </div>
);

const InfoField = ({ label, value }) => (
  <div>
    <div className="text-sm text-gray-500">{label}</div>
    <div className="font-medium">{value}</div>
  </div>
);

const QuickAction = ({ icon, text }) => (
  <button className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50">
    {icon}
    <span className="text-sm">{text}</span>
  </button>
);

// Sample data
const communications = [
  {
    id: 1,
    customer: {
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "(304) 555-0123",
      address: "123 Main St, St. Albans, WV",
      lastInteraction: "Today at 2:30 PM"
    },
    channel: "Phone",
    time: "2:30 PM",
    preview: "Regarding the upcoming home inspection...",
    messages: [
      { content: "Hi, I'd like to schedule a home inspection", sent: false },
      { content: "Of course! I can help you with that. What's your availability next week?", sent: true }
    ]
  },
  // Add more sample communications as needed
];

export default CommunicationCenter;
