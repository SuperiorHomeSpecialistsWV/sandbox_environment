import React, { useState } from 'react';
import { Phone, Mail, MessageSquare, Calendar, Clock, AlertCircle, CheckCircle, 
         MessageCircle, ChevronDown, ChevronRight, Copy, Edit, Trash2, Save } from 'lucide-react';

const CommunicationsPanel = () => {
  const [activeTab, setActiveTab] = useState('calls');
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Integration Header */}
      <header className="bg-white border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Communications Center</h1>
          <div className="flex items-center space-x-3">
            <StatusIndicator status="connected" text="Dialpad" />
            <StatusIndicator status="connected" text="Chiirp SMS" />
            <StatusIndicator status="connected" text="Dynamics 365" />
          </div>
        </div>
        
        {/* Integration Tabs */}
        <div className="flex space-x-1">
          <TabButton active={activeTab === 'calls'} onClick={() => setActiveTab('calls')}>
            <Phone size={18} />
            <span>Calls</span>
          </TabButton>
          <TabButton active={activeTab === 'messages'} onClick={() => setActiveTab('messages')}>
            <MessageSquare size={18} />
            <span>Messages</span>
          </TabButton>
          <TabButton active={activeTab === 'templates'} onClick={() => setActiveTab('templates')}>
            <Copy size={18} />
            <span>Templates</span>
          </TabButton>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Communications List */}
        <div className="w-80 border-r bg-white overflow-y-auto">
          {activeTab === 'calls' && <DialpadIntegration />}
          {activeTab === 'messages' && <ChiirpIntegration />}
          {activeTab === 'templates' && <TemplatesList onSelect={setSelectedTemplate} />}
        </div>

        {/* Right Panel - Details/Editor */}
        <div className="flex-1 bg-white overflow-y-auto p-4">
          {selectedTemplate ? (
            <TemplateEditor template={selectedTemplate} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a template to edit or create a new one
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatusIndicator = ({ status, text }) => (
  <div className="flex items-center space-x-2">
    <div className={`w-2 h-2 rounded-full ${
      status === 'connected' ? 'bg-green-500' : 'bg-red-500'
    }`} />
    <span className="text-sm">{text}</span>
  </div>
);

const TabButton = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
      active 
        ? 'bg-[#102F62] text-white' 
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    {children}
  </button>
);

const DialpadIntegration = () => (
  <div className="p-4 space-y-4">
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-semibold">Recent Calls</h2>
      <button className="text-[#3A77B4] text-sm">View All</button>
    </div>
    
    {[
      {
        name: 'John Smith',
        time: '10 mins ago',
        type: 'Inbound',
        status: 'Missed',
        followup: true
      },
      {
        name: 'Sarah Wilson',
        time: '1 hour ago',
        type: 'Outbound',
        status: 'Completed',
        duration: '5:23'
      }
    ].map((call, index) => (
      <div key={index} className="border rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-medium">{call.name}</div>
          <span className="text-sm text-gray-500">{call.time}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Phone size={14} />
          <span>{call.type}</span>
          <span className={`px-2 py-0.5 rounded ${
            call.status === 'Missed' 
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}>
            {call.status}
          </span>
        </div>
        {call.followup && (
          <div className="flex items-center space-x-2 text-sm text-amber-600">
            <AlertCircle size={14} />
            <span>Follow-up required</span>
          </div>
        )}
      </div>
    ))}
  </div>
);

const ChiirpIntegration = () => (
  <div className="p-4 space-y-4">
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-semibold">SMS Messages</h2>
      <button className="text-[#3A77B4] text-sm">New Message</button>
    </div>
    
    {[
      {
        name: 'Emma Thompson',
        time: '5 mins ago',
        message: 'Appointment confirmation sent',
        automated: true
      },
      {
        name: 'Mike Johnson',
        time: '30 mins ago',
        message: 'Quote request received',
        unread: true
      }
    ].map((message, index) => (
      <div key={index} className="border rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-medium">{message.name}</div>
          <span className="text-sm text-gray-500">{message.time}</span>
        </div>
        <p className="text-sm text-gray-600">{message.message}</p>
        {message.automated && (
          <div className="flex items-center space-x-2 text-sm text-blue-600">
            <MessageCircle size={14} />
            <span>Automated Response</span>
          </div>
        )}
      </div>
    ))}
  </div>
);

const TemplatesList = ({ onSelect }) => {
  const templates = {
    'Appointment Confirmations': [
      { id: 1, name: 'Initial Consultation', type: 'SMS' },
      { id: 2, name: 'Follow-up Reminder', type: 'Email' }
    ],
    'Service Updates': [
      { id: 3, name: 'Project Start', type: 'SMS' },
      { id: 4, name: 'Completion Notice', type: 'Email' }
    ],
    'Customer Support': [
      { id: 5, name: 'Quote Request', type: 'Email' },
      { id: 6, name: 'Feedback Request', type: 'SMS' }
    ]
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Message Templates</h2>
        <button className="text-[#3A77B4] text-sm hover:underline">
          + New Template
        </button>
      </div>

      {Object.entries(templates).map(([category, items]) => (
        <div key={category} className="mb-4">
          <div className="font-medium mb-2">{category}</div>
          <div className="space-y-2">
            {items.map(template => (
              <div
                key={template.id}
                onClick={() => onSelect(template)}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  {template.type === 'SMS' ? (
                    <MessageSquare size={16} />
                  ) : (
                    <Mail size={16} />
                  )}
                  <span>{template.name}</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const TemplateEditor = ({ template }) => {
  const [name, setName] = useState(template.name);
  const [content, setContent] = useState(getTemplateContent(template.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Edit Template</h2>
        <div className="space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Trash2 size={20} className="text-gray-500" />
          </button>
          <button className="px-4 py-2 bg-[#102F62] text-white rounded-lg flex items-center space-x-2">
            <Save size={20} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Template Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A77B4]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A77B4]"
          />
        </div>

        <div>
          <h3 className="font-medium mb-2">Available Variables</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              '{customer_name}',
              '{appointment_date}',
              '{service_type}',
              '{technician_name}',
              '{quote_amount}',
              '{company_phone}'
            ].map((variable) => (
              <div
                key={variable}
                className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
              >
                <code className="text-sm">{variable}</code>
                <button className="ml-auto hover:text-[#3A77B4]">
                  <Copy size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to simulate getting template content
const getTemplateContent = (id) => {
  const templates = {
    1: "Hi {customer_name}, this is a reminder of your consultation scheduled for {appointment_date}. Please reply YES to confirm or call us at {company_phone} to reschedule.",
    2: "Dear {customer_name},\n\nThank you for choosing Superior Home Specialists. Your appointment is scheduled for {appointment_date}.\n\nBest regards,\nSuperior Home Team",
    3: "Hi {customer_name}, your project with {technician_name} will begin on {appointment_date}. We'll arrive between [time window].",
    4: "Project complete! Thank you for choosing Superior Home Specialists. We'd love to hear your feedback!",
    5: "Thank you for requesting a quote. Our team will review your requirements and get back to you within 24 hours.",
    6: "How was your experience with Superior Home Specialists? We value your feedback!"
  };
  return templates[id] || '';
};

export default CommunicationsPanel;