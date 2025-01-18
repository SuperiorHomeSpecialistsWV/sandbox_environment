import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, Mail, MapPin, FileText, Calendar, Clock, 
  User, CheckCircle, AlertCircle, Home, Map, MessageSquare 
} from 'lucide-react';

const CustomerInterface = () => {
  const [qualificationStatus, setQualificationStatus] = useState('in_progress');
  
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Status Banner */}
      <div className="bg-blue-50 p-4 rounded-lg mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Badge variant={qualificationStatus === 'qualified' ? 'success' : 'secondary'}>
            Lead Status: {qualificationStatus === 'qualified' ? 'Qualified' : 'In Qualification'}
          </Badge>
          <span className="text-sm text-gray-600">Next Action: Schedule Estimate</span>
        </div>
        <div className="flex space-x-2">
          <Badge variant="outline">Source: Facebook</Badge>
          <Badge variant="outline">Interest: Gutter Guards</Badge>
        </div>
      </div>

      {/* Customer Header Card */}
      <Card className="mb-4">
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">John Doe</CardTitle>
              <div className="flex space-x-4 text-gray-600 mt-2">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>(304) 555-0123</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>john.doe@email.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Saint Albans, WV</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Created: Oct 27, 2024</div>
              <div className="text-sm text-gray-500">Last Updated: Oct 27, 2024</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="qualification" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="qualification">Qualification</TabsTrigger>
          <TabsTrigger value="property">Property Details</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="qualification">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Qualification Checklist */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Qualification Checklist</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Contact Information Verified</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Property Ownership Confirmed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      <span>Project Timeline Discussed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      <span>Budget Expectations Set</span>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-lg mt-6">Product Interest</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">Primary: Gutter Guards</div>
                      <Badge>High Priority</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">Secondary: Metal Roofing</div>
                      <Badge variant="secondary">Future Interest</Badge>
                    </div>
                  </div>
                </div>

                {/* Property Quick View */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Property Overview</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">House Height</label>
                      <p className="font-medium">2 Stories</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Current Roof Age</label>
                      <p className="font-medium">15 years</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Gutter Cleaning</label>
                      <p className="font-medium">2x per year</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Current Roof Type</label>
                      <p className="font-medium">Asphalt Shingles</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold text-lg">Location Notes</h3>
                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm">Corner house with red shutters. GPS may show incorrect location - use mailbox number for accurate location.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end space-x-4">
                <button className="px-4 py-2 bg-gray-100 rounded-md">Request More Info</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md">Mark as Qualified</button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Communication History</h3>
                <div className="space-y-4">
                  {/* Communication Timeline */}
                  <div className="border-l-2 border-gray-200 pl-4 space-y-6">
                    <div className="relative">
                      <div className="absolute -left-6 mt-1 w-4 h-4 bg-blue-500 rounded-full"></div>
                      <div className="mb-1 text-sm text-gray-600">Today, 10:30 AM</div>
                      <div className="font-medium">Initial Phone Contact</div>
                      <p className="text-sm text-gray-600">Discussed gutter guard options and current issues</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-6 mt-1 w-4 h-4 bg-gray-300 rounded-full"></div>
                      <div className="mb-1 text-sm text-gray-600">Today, 9:00 AM</div>
                      <div className="font-medium">Web Form Submission</div>
                      <p className="text-sm text-gray-600">Customer submitted interest through website</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerInterface;
