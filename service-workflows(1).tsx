import React, { useState } from 'react';
import { Clock, Wrench, Home, Thermometer, Shield, Droplet, Wind, 
         CheckCircle, AlertTriangle, Calendar, MessageSquare, 
         FileText, Camera, Star, DollarSign, Zap } from 'lucide-react';

const ServiceWorkflows = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Service Categories Sidebar */}
      <div className="w-72 bg-white border-r overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">Service Categories</h2>
          {serviceCategories.map((category) => (
            <ServiceCategoryButton
              key={category.id}
              category={category}
              selected={selectedService?.id === category.id}
              onClick={() => setSelectedService(category)}
            />
          ))}
        </div>
      </div>

      {/* Workflow Templates */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">
              {selectedService ? `${selectedService.name} Workflows` : 'Select a Service'}
            </h1>
            <button className="px-4 py-2 bg-[#102F62] text-white rounded-lg flex items-center space-x-2">
              <Zap size={20} />
              <span>Create Custom Workflow</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          {selectedService && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {getWorkflowTemplates(selectedService.id).map((template) => (
                <WorkflowTemplateCard
                  key={template.id}
                  template={template}
                  onSelect={() => setSelectedTemplate(template)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Workflow Detail Sidebar */}
      {selectedTemplate && (
        <div className="w-96 bg-white border-l overflow-y-auto">
          <WorkflowDetail
            template={selectedTemplate}
            onClose={() => setSelectedTemplate(null)}
          />
        </div>
      )}
    </div>
  );
};

const ServiceCategoryButton = ({ category, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${
      selected ? 'bg-[#102F62] text-white' : 'hover:bg-gray-100'
    }`}
  >
    <div className={`p-2 rounded-lg ${selected ? 'bg-white/20' : 'bg-gray-100'}`}>
      {category.icon}
    </div>
    <span>{category.name}</span>
  </button>
);

const WorkflowTemplateCard = ({ template, onSelect }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${template.iconBg}`}>
          {template.icon}
        </div>
        <div>
          <h3 className="font-semibold">{template.name}</h3>
          <p className="text-sm text-gray-500">{template.description}</p>
        </div>
      </div>
    </div>

    <div className="space-y-3 mb-4">
      {template.keyFeatures.map((feature, index) => (
        <div key={index} className="flex items-center space-x-2 text-sm">
          <CheckCircle size={16} className="text-green-500" />
          <span>{feature}</span>
        </div>
      ))}
    </div>

    <button
      onClick={onSelect}
      className="w-full px-4 py-2 bg-gray-50 text-[#102F62] border border-[#102F62] rounded-lg hover:bg-gray-100"
    >
      View Workflow
    </button>
  </div>
);

const WorkflowDetail = ({ template, onClose }) => (
  <div className="p-4">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-bold">{template.name}</h2>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        ×
      </button>
    </div>

    <div className="space-y-6">
      {/* Timeline */}
      <div className="space-y-4">
        <h3 className="font-semibold">Workflow Steps</h3>
        <div className="space-y-4">
          {template.workflow.map((step, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${step.iconBg}`}>
                {step.icon}
              </div>
              <div>
                <div className="font-medium">{step.title}</div>
                <div className="text-sm text-gray-500">{step.description}</div>
                {step.trigger && (
                  <div className="mt-1 text-sm text-blue-600">
                    Trigger: {step.trigger}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Points */}
      <div>
        <h3 className="font-semibold mb-3">Integration Points</h3>
        <div className="grid grid-cols-2 gap-3">
          {template.integrations.map((integration, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium">{integration.name}</div>
              <div className="text-sm text-gray-500">{integration.purpose}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Automation Rules */}
      <div>
        <h3 className="font-semibold mb-3">Automation Rules</h3>
        <div className="space-y-2">
          {template.automationRules.map((rule, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle size={16} className="text-amber-500" />
                <span className="text-sm font-medium">{rule.condition}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">{rule.action}</div>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full px-4 py-2 bg-[#102F62] text-white rounded-lg">
        Implement Workflow
      </button>
    </div>
  </div>
);

// Service Categories Data
const serviceCategories = [
  {
    id: 'inspection',
    name: 'Home Inspection',
    icon: <Home size={20} />
  },
  {
    id: 'hvac',
    name: 'HVAC Service',
    icon: <Thermometer size={20} />
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    icon: <Droplet size={20} />
  },
  {
    id: 'electrical',
    name: 'Electrical',
    icon: <Zap size={20} />
  },
  {
    id: 'maintenance',
    name: 'General Maintenance',
    icon: <Wrench size={20} />
  },
  {
    id: 'security',
    name: 'Security Systems',
    icon: <Shield size={20} />
  }
];

// Function to get workflow templates based on service
const getWorkflowTemplates = (serviceId) => {
  const templates = {
    inspection: [
      {
        id: 'inspection-standard',
        name: 'Standard Home Inspection',
        description: 'Complete workflow for standard home inspections',
        icon: <Home size={20} />,
        iconBg: 'bg-blue-100 text-blue-600',
        keyFeatures: [
          'Automated scheduling and confirmation',
          'Pre-inspection checklist',
          'Digital report generation',
          'Follow-up communication'
        ],
        workflow: [
          {
            title: 'Initial Booking',
            description: 'Schedule inspection and send confirmation',
            icon: <Calendar size={16} />,
            iconBg: 'bg-blue-100 text-blue-600',
            trigger: 'Customer books through website or phone'
          },
          {
            title: 'Pre-Inspection Communication',
            description: 'Send preparation checklist and reminders',
            icon: <MessageSquare size={16} />,
            iconBg: 'bg-green-100 text-green-600',
            trigger: '48 hours before inspection'
          },
          {
            title: 'Inspection Execution',
            description: 'Complete digital inspection form and photos',
            icon: <Camera size={16} />,
            iconBg: 'bg-purple-100 text-purple-600',
            trigger: 'Day of inspection'
          },
          {
            title: 'Report Generation',
            description: 'Generate and send detailed inspection report',
            icon: <FileText size={16} />,
            iconBg: 'bg-amber-100 text-amber-600',
            trigger: 'Within 24 hours of completion'
          }
        ],
        integrations: [
          {
            name: 'Dynamics 365',
            purpose: 'Customer record management'
          },
          {
            name: 'Chiirp',
            purpose: 'Automated SMS notifications'
          }
        ],
        automationRules: [
          {
            condition: 'If critical issues found',
            action: 'Immediate notification to customer and follow-up call scheduled'
          },
          {
            condition: 'If inspection duration > 3 hours',
            action: 'Automatic notification to next appointment'
          }
        ]
      },
      {
        id: 'inspection-emergency',
        name: 'Emergency Inspection',
        description: 'Expedited workflow for urgent inspection needs',
        icon: <AlertTriangle size={20} />,
        iconBg: 'bg-red-100 text-red-600',
        keyFeatures: [
          'Priority scheduling',
          'Rapid response protocol',
          'Same-day reporting',
          'Emergency contact notifications'
        ],
        workflow: [
          // Similar structure to standard inspection
        ],
        integrations: [],
        automationRules: []
      }
    ],
    hvac: [
      {
        id: 'hvac-maintenance',
        name: 'HVAC Maintenance',
        description: 'Regular HVAC maintenance workflow',
        icon: <Tool size={20} />,
        iconBg: 'bg-green-100 text-green-600',
        keyFeatures: [
          'Seasonal maintenance scheduling',
          'Parts inventory check',
          'Performance testing protocol',
          'Maintenance report generation'
        ],
        workflow: [],
        integrations: [],
        automationRules: []
      },
      // Add more HVAC templates
    ]
    // Add more service categories
  };

  return templates[serviceId] || [];
};

export default ServiceWorkflows;