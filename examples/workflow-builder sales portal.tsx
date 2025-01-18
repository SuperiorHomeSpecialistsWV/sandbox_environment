import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Settings,
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
  Mail,
  Phone,
  MessageSquare,
  FileText,
  AlertCircle,
  Users,
  DollarSign,
  Check,
  X,
  ArrowRight,
  Trash2,
  Save,
  Play
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Workflow Templates
const workflowTemplates = [
  {
    id: 'lead-nurture',
    name: 'Lead Nurturing',
    description: 'Automated lead follow-up sequence',
    triggers: ['New Lead Created'],
    actions: [
      { type: 'email', delay: '0h', template: 'welcome_email' },
      { type: 'wait', delay: '2d' },
      { type: 'email', delay: '0h', template: 'follow_up_1' },
      { type: 'task', delay: '1d', template: 'sales_call' },
      { type: 'condition', check: 'response', yes: 'schedule_meeting', no: 'send_reminder' }
    ]
  },
  {
    id: 'quote-follow',
    name: 'Quote Follow-up',
    description: 'Quote follow-up and reminder sequence',
    triggers: ['Quote Sent'],
    actions: [
      { type: 'wait', delay: '2d' },
      { type: 'email', delay: '0h', template: 'quote_follow_up' },
      { type: 'task', delay: '1d', template: 'follow_up_call' }
    ]
  },
  {
    id: 'contract-approval',
    name: 'Contract Approval',
    description: 'Contract review and approval process',
    triggers: ['Contract Created'],
    actions: [
      { type: 'notification', delay: '0h', template: 'review_request' },
      { type: 'task', delay: '0h', template: 'legal_review' },
      { type: 'condition', check: 'approved', yes: 'send_for_signature', no: 'revision_needed' }
    ]
  }
];

// Calendar View Component
const CalendarView = ({ tasks, date, onDateChange }) => {
  const [view, setView] = useState('month');
  const [filteredTasks, setFilteredTasks] = useState(tasks);

  const renderCalendarGrid = () => {
    // Calendar grid implementation
    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Calendar days */}
        {Array.from({ length: 35 }).map((_, index) => (
          <div key={index} className="p-2 border min-h-32 relative">
            <span className="text-sm text-gray-500">{index + 1}</span>
            {/* Task indicators */}
            <div className="space-y-1 mt-1">
              {filteredTasks
                .filter(task => task.date === `2024-11-${index + 1}`)
                .map(task => (
                  <div
                    key={task.id}
                    className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate"
                  >
                    {task.title}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <button
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={() => onDateChange('prev')}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold">November 2024</h2>
            <button
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={() => onDateChange('next')}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className={`px-3 py-1 rounded ${
                view === 'month' ? 'bg-blue-100 text-blue-800' : 'text-gray-600'
              }`}
              onClick={() => setView('month')}
            >
              Month
            </button>
            <button
              className={`px-3 py-1 rounded ${
                view === 'week' ? 'bg-blue-100 text-blue-800' : 'text-gray-600'
              }`}
              onClick={() => setView('week')}
            >
              Week
            </button>
            <button
              className={`px-3 py-1 rounded ${
                view === 'day' ? 'bg-blue-100 text-blue-800' : 'text-gray-600'
              }`}
              onClick={() => setView('day')}
            >
              Day
            </button>
          </div>
        </div>
        {renderCalendarGrid()}
      </div>
    </div>
  );
};

// Workflow Builder Component
const WorkflowBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [workflowSteps, setWorkflowSteps] = useState([]);
  const [showTemplates, setShowTemplates] = useState(true);

  const actionTypes = {
    email: {
      icon: <Mail className="h-4 w-4" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    task: {
      icon: <CheckIcon className="h-4 w-4" />,
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    wait: {
      icon: <Clock className="h-4 w-4" />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100'
    },
    condition: {
      icon: <AlertCircle className="h-4 w-4" />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100'
    }
  };

  const addStep = (type) => {
    setWorkflowSteps([...workflowSteps, { type, id: Date.now() }]);
  };

  const renderWorkflowStep = (step, index) => {
    const actionType = actionTypes[step.type];
    
    return (
      <div key={step.id} className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${actionType.bgColor}`}>
          {actionType.icon}
        </div>
        <div className="flex-1">
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder={`Configure ${step.type} action...`}
          />
        </div>
        <button
          className="p-2 hover:bg-gray-100 rounded-full"
          onClick={() => removeStep(index)}
        >
          <Trash2 className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Template Selection */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Workflow Templates</CardTitle>
            <CardDescription>Start with a pre-built template or create custom</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workflowTemplates.map(template => (
                <div
                  key={template.id}
                  className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedTemplate?.id === template.id ? 'border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <h3 className="font-medium text-[#102F62]">{template.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {template.triggers[0]}
                    </span>
                    <span className="text-xs text-gray-500">
                      {template.actions.length} steps
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Builder */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Workflow Builder</CardTitle>
                <CardDescription>
                  {selectedTemplate
                    ? `Customizing: ${selectedTemplate.name}`
                    : 'Create a custom workflow'}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  <Save className="h-4 w-4" />
                </button>
                <button className="px-4 py-2 bg-[#3A77B4] text-white rounded-lg hover:bg-[#102F62]">
                  <Play className="h-4 w-4" />
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Trigger Configuration */}
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Trigger</h3>
                <select className="w-full p-2 border rounded">
                  <option>Select a trigger...</option>
                  <option>New Lead Created</option>
                  <option>Quote Sent</option>
                  <option>Contract Created</option>
                  <option>Custom Trigger</option>
                </select>
              </div>

              {/* Workflow Steps */}
              <div className="space-y-4">
                {workflowSteps.map((step, index) => renderWorkflowStep(step, index))}
              </div>

              {/* Add Step */}
              <div className="flex space-x-2">
                <button
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                  onClick={() => addStep('email')}
                >
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </button>
                <button
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                  onClick={() => addStep('task')}
                >
                  <Check className="h-4 w-4" />
                  <span>Task</span>
                </button>
                <button
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                  onClick={() => addStep('wait')}
                >
                  <Clock className="h-4 w-4" />
                  <span>Wait</span>
                </button>
                <button
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                  onClick={() => addStep('condition')}
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>Condition</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Main Component combining all features
const EnhancedTaskWorkflow = () => {
  const [activeView, setActiveView] = useState('calendar');
  
  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeView === 'calendar'
              ? 'bg-[#102F62] text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setActiveView('calendar')}
        >
          Calendar
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeView === 'workflow'
              ? 'bg-[#102F62] text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setActiveView('workflow')}
        >
          Workflow Builder
        </button>
      </div>

      {/* Main Content */}
      {activeView === 'calendar' ? (
        <CalendarView tasks={[]} date={new Date()} onDateChange={() => {}} />
      ) : (
        <WorkflowBuilder />
      )}
    </div>
  );
};

export default EnhancedTaskWorkflow;