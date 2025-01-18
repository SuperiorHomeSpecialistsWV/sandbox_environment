import React, { useState } from 'react';
import { Phone, Mail, MessageSquare, Calendar, Clock, AlertCircle, CheckCircle, 
         MessageCircle, ChevronDown, ChevronRight, Copy, Edit, Trash2, Save,
         FileText, Users, Bell, Settings, Zap, Filter, Play, Pause } from 'lucide-react';

const AdvancedIntegrations = () => {
  const [activeTab, setActiveTab] = useState('dynamics');
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Navigation */}
      <div className="w-64 bg-[#102F62] text-white p-4">
        <h2 className="text-xl font-bold mb-6">Integrations</h2>
        <nav className="space-y-2">
          <NavItem
            icon={<FileText size={20} />}
            text="Dynamics 365"
            active={activeTab === 'dynamics'}
            onClick={() => setActiveTab('dynamics')}
          />
          <NavItem
            icon={<Zap size={20} />}
            text="Automations"
            active={activeTab === 'automations'}
            onClick={() => setActiveTab('automations')}
          />
          <NavItem
            icon={<MessageSquare size={20} />}
            text="Templates"
            active={activeTab === 'templates'}
            onClick={() => setActiveTab('templates')}
          />
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'dynamics' && <Dynamics365Integration />}
        {activeTab === 'automations' && <AutomationWorkflows />}
        {activeTab === 'templates' && <ExpandedTemplates />}
      </div>
    </div>
  );
};

// Dynamics 365 Integration Component
const Dynamics365Integration = () => {
  const [activeView, setActiveView] = useState('customers');

  return (
    <div className="h-full flex flex-col">
      <header className="bg-white border-b p-4">
        <h1 className="text-xl font-bold mb-4">Dynamics 365 Integration</h1>
        <div className="flex space-x-2">
          <TabButton 
            active={activeView === 'customers'} 
            onClick={() => setActiveView('customers')}
          >
            <Users size={18} />
            <span>Customers</span>
          </TabButton>
          <TabButton 
            active={activeView === 'opportunities'} 
            onClick={() => setActiveView('opportunities')}
          >
            <FileText size={18} />
            <span>Opportunities</span>
          </TabButton>
          <TabButton 
            active={activeView === 'services'} 
            onClick={() => setActiveView('services')}
          >
            <Settings size={18} />
            <span>Services</span>
          </TabButton>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DynamicsMetricsCard
            title="Customer Insights"
            metrics={[
              { label: 'Active Customers', value: '1,234' },
              { label: 'New This Month', value: '45' },
              { label: 'Pending Quotes', value: '23' },
              { label: 'Service Due', value: '15' }
            ]}
          />
          <DynamicsMetricsCard
            title="Service Performance"
            metrics={[
              { label: 'Open Projects', value: '28' },
              { label: 'Completed MTD', value: '67' },
              { label: 'Satisfaction Rate', value: '4.8/5' },
              { label: 'Response Time', value: '2.3h' }
            ]}
          />
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-4">Recent Activities</h3>
          <div className="bg-white rounded-lg shadow">
            <DynamicsActivityList />
          </div>
        </div>
      </div>
    </div>
  );
};

// Automation Workflows Component
const AutomationWorkflows = () => {
  const [workflows, setWorkflows] = useState(automationWorkflows);

  return (
    <div className="h-full flex flex-col">
      <header className="bg-white border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Automation Workflows</h1>
          <button className="px-4 py-2 bg-[#102F62] text-white rounded-lg">
            Create Workflow
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {workflows.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Expanded Templates Component
const ExpandedTemplates = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="h-full flex flex-col">
      <header className="bg-white border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Message Templates</h1>
          <button className="px-4 py-2 bg-[#102F62] text-white rounded-lg">
            New Template
          </button>
        </div>
        <div className="flex space-x-2 overflow-x-auto">
          {templateCategories.map((category) => (
            <CategoryPill
              key={category.id}
              category={category}
              selected={selectedCategory === category.id}
              onClick={() => setSelectedCategory(category.id)}
            />
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {getTemplatesByCategory(selectedCategory).map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Shared Components
const NavItem = ({ icon, text, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      active ? 'bg-[#3A77B4]' : 'hover:bg-[#3A77B4]/50'
    }`}
  >
    {icon}
    <span>{text}</span>
  </button>
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

const DynamicsMetricsCard = ({ title, metrics }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h3 className="font-semibold mb-4">{title}</h3>
    <div className="grid grid-cols-2 gap-4">
      {metrics.map((metric, index) => (
        <div key={index}>
          <div className="text-sm text-gray-500">{metric.label}</div>
          <div className="text-xl font-semibold">{metric.value}</div>
        </div>
      ))}
    </div>
  </div>
);

const DynamicsActivityList = () => (
  <div className="divide-y">
    {recentActivities.map((activity, index) => (
      <div key={index} className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${activity.iconBg}`}>
            {activity.icon}
          </div>
          <div>
            <div className="font-medium">{activity.title}</div>
            <div className="text-sm text-gray-500">{activity.description}</div>
          </div>
        </div>
        <div className="text-sm text-gray-500">{activity.time}</div>
      </div>
    ))}
  </div>
);

const WorkflowCard = ({ workflow }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${workflow.active ? 'bg-green-100' : 'bg-gray-100'}`}>
          {workflow.active ? <Play size={20} className="text-green-600" /> : <Pause size={20} className="text-gray-600" />}
        </div>
        <div>
          <h3 className="font-semibold">{workflow.name}</h3>
          <div className="text-sm text-gray-500">{workflow.description}</div>
        </div>
      </div>
      <button className="p-2 hover:bg-gray-100 rounded-lg">
        <Edit size={20} className="text-gray-500" />
      </button>
    </div>
    <div className="space-y-2">
      {workflow.steps.map((step, index) => (
        <div key={index} className="flex items-center space-x-2 text-sm">
          <ChevronRight size={16} className="text-gray-400" />
          <span>{step}</span>
        </div>
      ))}
    </div>
  </div>
);

const CategoryPill = ({ category, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
      selected
        ? 'bg-[#102F62] text-white'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {category.name}
  </button>
);

const TemplateCard = ({ template }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-2">
        {template.type === 'sms' ? (
          <MessageSquare size={16} className="text-blue-500" />
        ) : (
          <Mail size={16} className="text-green-500" />
        )}
        <span className="font-medium">{template.name}</span>
      </div>
      <div className="flex space-x-2">
        <button className="p-1 hover:bg-gray-100 rounded">
          <Copy size={16} className="text-gray-500" />
        </button>
        <button className="p-1 hover:bg-gray-100 rounded">
          <Edit size={16} className="text-gray-500" />
        </button>
      </div>
    </div>
    <p className="text-sm text-gray-600 line-clamp-3">{template.preview}</p>
    <div className="mt-3 flex items-center justify-between text-sm">
      <span className="text-gray-500">Last updated: {template.lastUpdated}</span>
      <span className={`px-2 py-1 rounded-full ${
        template.category === 'appointment' ? 'bg-blue-100 text-blue-700' :
        template.category === 'service' ? 'bg-green-100 text-green-700' :
        'bg-purple-100 text-purple-700'
      }`}>
        {template.category}
      </span>
    </div>
  </div>
);

// Sample Data
const recentActivities = [
  {
    icon: <Users size={20} className="text-blue-500" />,
    iconBg: 'bg-blue-100',
    title: 'New Customer Added',
    description: 'John Smith - Residential Service',
    time: '5 mins ago'
  },
  {
    icon: <FileText size={20} className="text-green-500" />,
    iconBg: 'bg-green-100',
    title: 'Quote Generated',
    description: 'Home Inspection Service - $299',
    time: '1 hour ago'
  }
];

const automationWorkflows = [
  {
    id: 1,
    name: 'Appointment Reminder',
    description: 'Automated 24h reminder sequence',
    active: true,
    category: 'Appointments',
    steps: [
      'Send SMS reminder 24h before',
      'Check confirmation status',
      'Follow-up call if unconfirmed',
      'Update Dynamics 365 status'
    ]
  },
  {
    id: 2,
    name: 'Service Follow-up',
    description: 'Post-service feedback collection',
    active: true,
    category: 'Customer Service',
    steps: [
      'Send feedback request email',
      'SMS reminder after 48h',
      'Update customer record',
      'Alert for negative feedback'
    ]
  },
  {
    id: 3,
    name: 'Quote Follow-up',
    description: 'Automated quote follow-up sequence',
    active: true,
    category: 'Sales',
    steps: [
      'Send quote via email',
      'SMS notification of quote sent',
      'Follow-up call after 2 days if no response',
      'Update opportunity in Dynamics'
    ]
  },
  {
    id: 4,
    name: 'Maintenance Reminder',
    description: 'Seasonal service reminder workflow',
    active: true,
    category: 'Maintenance',
    steps: [
      'Check service history in Dynamics',
      'Send seasonal reminder email',
      'Schedule follow-up call if interested',
      'Create service opportunity'
    ]
  },
  {
    id: 5,
    name: 'Emergency Response',
    description: 'Urgent service request handling',
    active: true,
    category: 'Emergency',
    steps: [
      'Priority message to on-call team',
      'Immediate customer callback',
      'Dispatch confirmation SMS',
      'Update emergency ticket status'
    ]
  },
  {
    id: 6,
    name: 'Review Request',
    description: 'Automated review collection',
    active: true,
    category: 'Marketing',
    steps: [
      'Send review request 2 days post-service',
      'Check for submission',
      'Thank you message for reviews',
      'Flag negative reviews for follow-up'
    ]
  },
  {
    id: 7,
    name: 'Contract Renewal',
    description: 'Service contract renewal workflow',
    active: true,
    category: 'Sales',
    steps: [
      'Check contract expiration date',
      'Send renewal notification email',
      'SMS reminder if no response',
      'Schedule renewal call if needed'
    ]
  },
  {
    id: 8,
    name: 'Customer Onboarding',
    description: 'New customer welcome sequence',
    active: true,
    category: 'Customer Service',
    steps: [
      'Send welcome email with portal access',
      'Schedule welcome call',
      'Verify contact preferences',
      'Add to newsletter list'
    ]
  },
  {
    id: 9,
    name: 'Service Completion',
    description: 'Post-service completion workflow',
    active: true,
    category: 'Operations',
    steps: [
      'Send completion notification',
      'Request before/after photos',
      'Schedule quality check if needed',
      'Update service history'
    ]
  },
  {
    id: 10,
    name: 'Payment Follow-up',
    description: 'Outstanding payment collection',
    active: true,
    category: 'Finance',
    steps: [
      'Send payment reminder email',
      'SMS notification after 3 days',
      'Schedule collection call if needed',
      'Update payment status in Dynamics'
    ]
  }
];

const templateCategories = [
  { id: 'all', name: 'All Templates' },
  { id: 'appointment', name: 'Appointments' },
  { id: 'service', name: 'Service Updates' },
  { id: 'quote', name: 'Quotes & Estimates' },
  { id: 'feedback', name: 'Customer Feedback' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'seasonal', name: 'Seasonal Offers' },
  { id: 'maintenance', name: 'Maintenance Reminders' }
];

const getTemplatesByCategory = (categoryId) => {
  // Sample templates - in a real app, this would filter based on category
  return [
    {
      id: 1,
      name: 'Initial Consultation',
      type: 'sms',
      category: 'appointment',
      preview: 'Hi {customer_name}, your consultation is scheduled for {date} at {time}...',
      lastUpdated: '2d ago'
    },
    {
      id: 2,
      name: 'Service Completion',
      type: 'email',
      category: 'service',
      preview: 'Dear {customer_name}, thank you for choosing Superior Home Specialists...',
      lastUpdated: '1w ago'
    }
  ];
};

export default AdvancedIntegrations;