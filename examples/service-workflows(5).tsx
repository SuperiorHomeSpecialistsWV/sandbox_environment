import React, { useState } from 'react';
import { Home, Wrench, AlertTriangle, Calendar, MessageSquare, 
         FileText, Camera, Star, DollarSign, Zap, CircleDollarSign,
         Cloud, Umbrella, CheckCircle, Shield, Bell } from 'lucide-react';

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

// Updated Service Categories Data
const serviceCategories = [
  {
    id: 'roofing',
    name: 'Roofing',
    icon: <Home size={20} />
  },
  {
    id: 'gutters',
    name: 'Gutters & Guards',
    icon: <Cloud size={20} />
  },
  {
    id: 'siding',
    name: 'Siding',
    icon: <Wrench size={20} />
  },
  {
    id: 'soffit',
    name: 'Soffit & Fascia',
    icon: <Umbrella size={20} />
  },
  {
    id: 'estimates',
    name: 'Estimates',
    icon: <CircleDollarSign size={20} />
  }
];

// Function to get workflow templates based on service
const getWorkflowTemplates = (serviceId) => {
  const templates = {
    roofing: [
      {
        id: 'roofing-new',
        name: 'New Roof Installation',
        description: 'Complete workflow for GAF shingle installation',
        icon: <Home size={20} />,
        iconBg: 'bg-blue-100 text-blue-600',
        keyFeatures: [
          'GAF material ordering',
          'Installation scheduling',
          'Weather monitoring',
          'Warranty documentation'
        ],
        workflow: [
          {
            title: 'Initial Consultation',
            description: 'On-site measurement and GAF shingle selection',
            icon: <Calendar size={16} />,
            iconBg: 'bg-blue-100 text-blue-600',
            trigger: 'Customer inquiry'
          },
          {
            title: 'Material Planning',
            description: 'Order GAF materials and schedule delivery',
            icon: <CircleDollarSign size={16} />,
            iconBg: 'bg-green-100 text-green-600',
            trigger: 'After deposit received'
          },
          {
            title: 'Installation',
            description: 'Complete roof installation with photo documentation',
            icon: <Camera size={16} />,
            iconBg: 'bg-purple-100 text-purple-600',
            trigger: 'Materials delivered and weather permitting'
          },
          {
            title: 'Warranty Registration',
            description: 'Register GAF warranty and send documentation',
            icon: <FileText size={16} />,
            iconBg: 'bg-amber-100 text-amber-600',
            trigger: 'Installation completion'
          }
        ],
        integrations: [
          {
            name: 'Dynamics 365',
            purpose: 'Project and warranty tracking'
          },
          {
            name: 'Chiirp',
            purpose: 'Customer updates and scheduling'
          }
        ],
        automationRules: [
          {
            condition: 'If weather forecast shows >30% rain chance',
            action: 'Automatic rescheduling notification'
          },
          {
            condition: 'Upon GAF warranty registration',
            action: 'Send digital copy to customer and store in CRM'
          }
        ]
      }
    ],
    gutters: [
      {
        id: 'gutter-install',
        name: 'Gutter Installation',
        description: 'New gutter and LeafSlugger guard installation',
        icon: <Cloud size={20} />,
        iconBg: 'bg-blue-100 text-blue-600',
        keyFeatures: [
          'Custom gutter measurement',
          'LeafSlugger guard fitting',
          'Drainage optimization',
          'Installation verification'
        ],
        workflow: [
          {
            title: 'Site Assessment',
            description: 'Measure and plan gutter installation',
            icon: <Wrench size={16} />,
            iconBg: 'bg-blue-100 text-blue-600',
            trigger: 'Initial consultation scheduled'
          },
          {
            title: 'Material Preparation',
            description: 'Order custom gutters and LeafSlugger guards',
            icon: <CircleDollarSign size={16} />,
            iconBg: 'bg-green-100 text-green-600',
            trigger: 'Assessment approval'
          }
        ],
        integrations: [
          {
            name: 'Dynamics 365',
            purpose: 'Project tracking and warranty management'
          }
        ],
        automationRules: [
          {
            condition: 'After LeafSlugger installation',
            action: 'Schedule first cleaning reminder for 12 months'
          }
        ]
      }
    ],
    siding: [
      {
        id: 'siding-installation',
        name: 'Siding Installation',
        description: 'Complete siding installation workflow',
        icon: <Wrench size={20} />,
        iconBg: 'bg-green-100 text-green-600',
        keyFeatures: [
          'Material estimation',
          'Color and style selection',
          'Installation scheduling',
          'Quality inspection'
        ],
        workflow: [
          {
            title: 'Initial Assessment',
            description: 'Measure exterior and assess current siding condition',
            icon: <Camera size={16} />,
            iconBg: 'bg-blue-100 text-blue-600',
            trigger: 'Customer consultation scheduled'
          },
          {
            title: 'Design Consultation',
            description: 'Help customer select siding style and color',
            icon: <FileText size={16} />,
            iconBg: 'bg-purple-100 text-purple-600',
            trigger: 'After initial assessment'
          },
          {
            title: 'Pre-Installation Prep',
            description: 'Schedule installation and order materials',
            icon: <Calendar size={16} />,
            iconBg: 'bg-amber-100 text-amber-600',
            trigger: 'Design approval and deposit received'
          },
          {
            title: 'Installation Process',
            description: 'Remove old siding and install new',
            icon: <Wrench size={16} />,
            iconBg: 'bg-green-100 text-green-600',
            trigger: 'Materials delivered'
          }
        ],
        integrations: [
          {
            name: 'Dynamics 365',
            purpose: 'Project tracking and documentation'
          },
          {
            name: 'Chiirp',
            purpose: 'Installation updates and scheduling'
          }
        ],
        automationRules: [
          {
            condition: 'If weather forecast unfavorable',
            action: 'Automatic rescheduling notification'
          },
          {
            condition: 'Upon completion',
            action: 'Trigger warranty registration and feedback request'
          }
        ]
      }
    ],
    soffit: [
      {
        id: 'soffit-fascia',
        name: 'Soffit & Fascia Installation',
        description: 'Soffit and fascia replacement process',
        icon: <Umbrella size={20} />,
        iconBg: 'bg-purple-100 text-purple-600',
        keyFeatures: [
          'Ventilation assessment',
          'Material coordination',
          'Installation process',
          'Quality verification'
        ],
        workflow: [
          {
            title: 'Inspection',
            description: 'Assess current condition and ventilation needs',
            icon: <Camera size={16} />,
            iconBg: 'bg-blue-100 text-blue-600',
            trigger: 'Initial consultation'
          },
          {
            title: 'Material Selection',
            description: 'Choose materials and colors to match existing',
            icon: <FileText size={16} />,
            iconBg: 'bg-green-100 text-green-600',
            trigger: 'After inspection approval'
          },
          {
            title: 'Installation',
            description: 'Remove old materials and install new',
            icon: <Wrench size={16} />,
            iconBg: 'bg-amber-100 text-amber-600',
            trigger: 'Materials ready'
          }
        ],
        integrations: [
          {
            name: 'Dynamics 365',
            purpose: 'Project and warranty tracking'
          }
        ],
        automationRules: [
          {
            condition: 'When coordinating with other services',
            action: 'Sync scheduling with related projects'
          }
        ]
      }
    ],
    estimates: [
      {
        id: 'estimate-process',
        name: 'Estimate Generation',
        description: 'Structured estimation workflow',
        icon: <CircleDollarSign size={20} />,
        iconBg: 'bg-blue-100 text-blue-600',
        keyFeatures: [
          'On-site measurement',
          'Material calculation',
          'Price estimation',
          'Proposal generation'
        ],
        workflow: [
          {
            title: 'Schedule Visit',
            description: 'Book on-site estimation appointment',
            icon: <Calendar size={16} />,
            iconBg: 'bg-blue-100 text-blue-600',
            trigger: 'Customer inquiry received'
          },
          {
            title: 'Site Evaluation',
            description: 'Measure and assess project requirements',
            icon: <Camera size={16} />,
            iconBg: 'bg-green-100 text-green-600',
            trigger: 'Scheduled appointment'
          },
          {
            title: 'Estimate Creation',
            description: 'Calculate materials and labor costs',
            icon: <CircleDollarSign size={16} />,
            iconBg: 'bg-purple-100 text-purple-600',
            trigger: 'Site evaluation completed'
          },
          {
            title: 'Proposal Delivery',
            description: 'Generate and send detailed proposal',
            icon: <FileText size={16} />,
            iconBg: 'bg-amber-100 text-amber-600',
            trigger: 'Estimate approved internally'
          }
        ],
        integrations: [
          {
            name: 'Dynamics 365',
            purpose: 'Customer and estimate tracking'
          },
          {
            name: 'Chiirp',
            purpose: 'Appointment scheduling and follow-ups'
          }
        ],
        automationRules: [
          {
            condition: 'If no response after 3 days',
            action: 'Automatic follow-up sequence'
          },
          {
            condition: 'If estimate accepted',
            action: 'Generate contract and schedule next steps'
          }
        ]
      },
      {
        id: 'warranty-tracking',
        name: 'Warranty Management',
        description: 'Warranty registration and tracking',
        icon: <Shield size={20} />,
        iconBg: 'bg-green-100 text-green-600',
        keyFeatures: [
          'Warranty registration',
          'Document management',
          'Maintenance scheduling',
          'Claim processing'
        ],
        workflow: [
          {
            title: 'Registration',
            description: 'Register product warranties',
            icon: <FileText size={16} />,
            iconBg: 'bg-blue-100 text-blue-600',
            trigger: 'Project completion'
          },
          {
            title: 'Documentation',
            description: 'Store and organize warranty documents',
            icon: <FileText size={16} />,
            iconBg: 'bg-green-100 text-green-600',
            trigger: 'Warranty registration complete'
          },
          {
            title: 'Maintenance Reminders',
            description: 'Schedule and track maintenance requirements',
            icon: <Bell size={16} />,
            iconBg: 'bg-purple-100 text-purple-600',
            trigger: 'Based on warranty terms'
          },
          {
            title: 'Claim Processing',
            description: 'Handle warranty claims if needed',
            icon: <AlertTriangle size={16} />,
            iconBg: 'bg-amber-100 text-amber-600',
            trigger: 'Customer reports issue'
          }
        ],
        integrations: [
          {
            name: 'Dynamics 365',
            purpose: 'Warranty and maintenance tracking'
          },
          {
            name: 'Chiirp',
            purpose: 'Maintenance reminders'
          }
        ],
        automationRules: [
          {
            condition: 'Approaching maintenance due date',
            action: 'Send reminder to customer'
          },
          {
            condition: 'Warranty expiration approaching',
            action: 'Notify customer and offer inspection'
          }
        ]
      }
    ]
  };

  return templates[serviceId] || [];
};

export default ServiceWorkflows;