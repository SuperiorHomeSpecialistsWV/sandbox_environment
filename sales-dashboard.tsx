import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

const SalesDashboard = () => {
  // Sample data - would be connected to Dynamics 365 in production
  const salesData = [
    { month: 'Jan', team1: 4000, team2: 3000, team3: 3500 },
    { month: 'Feb', team1: 3500, team2: 4000, team3: 3800 },
    { month: 'Mar', team1: 5000, team2: 3500, team3: 4200 },
    { month: 'Apr', team1: 4500, team2: 4500, team3: 4000 },
    { month: 'May', team1: 6000, team2: 5000, team3: 5500 }
  ];

  const pipelineData = [
    { name: 'New Leads', value: 15 },
    { name: 'Qualified', value: 10 },
    { name: 'Proposal', value: 8 },
    { name: 'Negotiation', value: 5 },
    { name: 'Closed', value: 3 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const [selectedSalesPerson, setSelectedSalesPerson] = useState('all');

  return (
    <div className="p-4 space-y-4">
      {/* Header Section */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sales Team Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <select 
              className="p-2 border rounded"
              value={selectedSalesPerson}
              onChange={(e) => setSelectedSalesPerson(e.target.value)}
            >
              <option value="all">All Sales Team</option>
              <option value="team1">Team Member 1</option>
              <option value="team2">Team Member 2</option>
              <option value="team3">Team Member 3</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600">Total Pipeline Value</div>
            <div className="text-2xl font-bold">$245,000</div>
            <div className="text-green-500 text-sm">↑ 12% vs last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600">Deals Closed This Month</div>
            <div className="text-2xl font-bold">8</div>
            <div className="text-blue-500 text-sm">↔ Same as last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-gray-600">Average Deal Size</div>
            <div className="text-2xl font-bold">$28,500</div>
            <div className="text-green-500 text-sm">↑ 5% vs last month</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sales Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="team1" stroke="#8884d8" name="Team Member 1" />
                  <Line type="monotone" dataKey="team2" stroke="#82ca9d" name="Team Member 2" />
                  <Line type="monotone" dataKey="team3" stroke="#ffc658" name="Team Member 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sales Pipeline Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Stages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pipelineData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <div>New lead created - ABC Company</div>
              <div className="text-sm text-gray-500">Today, 10:30 AM</div>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <div>Quote sent to XYZ Corp</div>
              <div className="text-sm text-gray-500">Today, 9:15 AM</div>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <div>Deal closed - Smith Project</div>
              <div className="text-sm text-gray-500">Yesterday, 4:45 PM</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesDashboard;
