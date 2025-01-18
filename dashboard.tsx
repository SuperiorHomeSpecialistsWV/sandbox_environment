import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Wrench, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const InstallationDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Sample data - would be connected to Housecall Pro
  const installations = [
    { 
      id: 1, 
      customer: "123 Main St",
      time: "8:00 AM",
      status: "In Progress",
      type: "Full Install",
      team: "Team A"
    },
    { 
      id: 2, 
      customer: "456 Oak Ave",
      time: "10:30 AM",
      status: "Scheduled",
      type: "Service",
      team: "Team B"
    },
    { 
      id: 3, 
      customer: "789 Pine Rd",
      time: "2:00 PM",
      status: "Material Needed",
      type: "Full Install",
      team: "Team A"
    }
  ];

  return (
    <div className="grid grid-cols-12 gap-4 p-4">
      {/* Main Content Area - 9 columns */}
      <div className="col-span-9 space-y-4">
        {/* Top Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-600">Today's Jobs</div>
                  <div className="text-2xl font-bold">5</div>
                  <div className="text-blue-500 text-sm">3 Completed</div>
                </div>
                <Wrench className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-600">Quality Score</div>
                  <div className="text-2xl font-bold">98%</div>
                  <div className="text-green-500 text-sm">Above Target</div>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-600">Material Issues</div>
                  <div className="text-2xl font-bold">1</div>
                  <div className="text-red-500 text-sm">Needs Order</div>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-600">Avg Install Time</div>
                  <div className="text-2xl font-bold">4.2h</div>
                  <div className="text-orange-500 text-sm">On Target</div>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Installation Schedule</CardTitle>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="p-2 border rounded"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {installations.map(job => (
                <div 
                  key={job.id} 
                  className={`p-4 rounded-lg border ${
                    job.status === 'In Progress' ? 'bg-blue-50 border-blue-200' :
                    job.status === 'Material Needed' ? 'bg-red-50 border-red-200' :
                    'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{job.customer}</div>
                      <div className="text-sm text-gray-600">{job.type}</div>
                      <div className="text-sm text-gray-500">Team: {job.team}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{job.time}</div>
                      <div className="text-sm text-gray-600">{job.status}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pre-Installation Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Pre-Installation Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center p-2 bg-green-50 rounded">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Material Inventory Check</span>
                </div>
                <div className="flex items-center p-2 bg-green-50 rounded">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Tool Inspection</span>
                </div>
                <div className="flex items-center p-2 bg-yellow-50 rounded">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                  <span>Safety Equipment Review</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center p-2 bg-green-50 rounded">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Vehicle Check</span>
                </div>
                <div className="flex items-center p-2 bg-green-50 rounded">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Route Planning</span>
                </div>
                <div className="flex items-center p-2 bg-red-50 rounded">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                  <span>Customer Confirmation</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar - 3 columns */}
      <div className="col-span-3 space-y-4">
        {/* Team Status */}
        <Card>
          <CardHeader>
            <CardTitle>Team Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded border border-green-200">
                <div className="font-medium">Team A</div>
                <div className="text-sm text-green-600">On Site - 123 Main St</div>
              </div>
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <div className="font-medium">Team B</div>
                <div className="text-sm text-blue-600">En Route - 456 Oak Ave</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Materials Alert */}
        <Card>
          <CardHeader>
            <CardTitle>Material Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded border border-red-200">
                <div className="font-medium text-red-700">Low Stock Alert</div>
                <div className="text-sm text-red-600">Component #A123</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full p-2 bg-blue-600 text-white rounded">Update Job Status</button>
              <button className="w-full p-2 bg-green-600 text-white rounded">Complete Checklist</button>
              <button className="w-full p-2 bg-red-600 text-white rounded">Report Issue</button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstallationDashboard;