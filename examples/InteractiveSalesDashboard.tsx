import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Users, TrendingUp, Calendar } from 'lucide-react';

const InteractiveSalesDashboard = () => {
  // Demo states for interactivity
  const [timeframe, setTimeframe] = useState('month');
  const [teamMember, setTeamMember] = useState('all');
  const [demoMode, setDemoMode] = useState(true);

  // Demo data
  const salesData = [
    { month: 'Jan', value: 65000 },
    { month: 'Feb', value: 75000 },
    { month: 'Mar', value: 85000 },
    { month: 'Apr', value: 95000 },
    { month: 'May', value: 105000 }
  ];

  const pipelineData = [
    { name: 'Leads', value: 30 },
    { name: 'Opportunities', value: 20 },
    { name: 'Proposals', value: 15 },
    { name: 'Closed Won', value: 10 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header with Controls */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Sales Dashboard</h1>
          <p className="text-gray-500">Interactive Demo Mode</p>
        </div>
        <div className="flex gap-4">
          <select 
            className="p-2 border rounded"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="month">Monthly View</option>
            <option value="quarter">Quarterly View</option>
            <option value="year">Yearly View</option>
          </select>
          <select
            className="p-2 border rounded"
            value={teamMember}
            onChange={(e) => setTeamMember(e.target.value)}
          >
            <option value="all">All Team Members</option>
            <option value="john">John Smith</option>
            <option value="sarah">Sarah Johnson</option>
            <option value="mike">Mike Wilson</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold">$425,000</p>
                <p className="text-green-500 text-sm">↑ 12% vs last month</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">New Leads</p>
                <p className="text-2xl font-bold">64</p>
                <p className="text-green-500 text-sm">↑ 8% vs last month</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Conversion Rate</p>
                <p className="text-2xl font-bold">24%</p>
                <p className="text-red-500 text-sm">↓ 2% vs last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Meetings Scheduled</p>
                <p className="text-2xl font-bold">28</p>
                <p className="text-green-500 text-sm">↑ 4 vs last month</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Pipeline Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pipelineData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
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

      {/* Demo Controls */}
      {demoMode && (
        <Card className="bg-white border-blue-200 border-2">
          <CardHeader>
            <CardTitle className="text-blue-600">Demo Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <button 
                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {/* Add demo data update logic */}}
              >
                Generate New Data
              </button>
              <button 
                className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => {/* Add scenario switch logic */}}
              >
                Switch Scenario
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InteractiveSalesDashboard;
