import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Papa from 'papaparse';

const WarrantyGenerator = () => {
  // Mock data for fallback
  const MOCK_CUSTOMERS = [
    {
      Customer: "CUST001",
      "First Name": "John",
      "Last Name": "Doe",
      Email: "john@example.com",
      "Mobile Phone": "304-555-0123",
      Street: "123 Main St",
      City: "Charleston",
      State: "WV",
      Zip: "25301",
      Address: "123 Main St, Charleston, WV 25301"
    },
    {
      Customer: "CUST002",
      "First Name": "Jane",
      "Last Name": "Smith",
      Email: "jane@example.com",
      "Mobile Phone": "304-555-0124",
      Street: "456 Oak Ave",
      City: "Huntington",
      State: "WV",
      Zip: "25701",
      Address: "456 Oak Ave, Huntington, WV 25701"
    }
  ];

  const MOCK_REPORTS = [
    {
      ReportID: 1001,
      ReportType: "Premium Report",
      StructureType: "Residential",
      Address: "123 Main St, Charleston, WV 25301"
    },
    {
      ReportID: 1002,
      ReportType: "Standard Report",
      StructureType: "Residential",
      Address: "456 Oak Ave, Huntington, WV 25701"
    }
  ];

  // State
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [eagleviewReports, setEagleviewReports] = useState(MOCK_REPORTS);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to load real data
      try {
        const response = await window.fs.readFile('customer_and_building_info.csv');
        const text = new TextDecoder().decode(response);
        const result = Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true
        });
        if (result.data && result.data.length > 0) {
          setCustomers(result.data);
        }
      } catch (err) {
        console.log('Using mock customer data:', err);
        // Keep using mock data
      }

      try {
        const response = await window.fs.readFile('eagleview_reports.csv');
        const text = new TextDecoder().decode(response);
        const result = Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true
        });
        if (result.data && result.data.length > 0) {
          setEagleviewReports(result.data);
        }
      } catch (err) {
        console.log('Using mock report data:', err);
        // Keep using mock data
      }

    } catch (err) {
      setError("Error initializing data. Using sample data for demonstration.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading warranty system...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">GAF Warranty Generator</h1>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">1. Select Customer</h2>
        <select
          className="w-full border rounded p-2"
          onChange={(e) => {
            const customer = customers.find(c => c.Customer === e.target.value);
            setSelectedCustomer(customer);
            setSelectedReport(null);
          }}
          value={selectedCustomer?.Customer || ''}
        >
          <option value="">Select a Customer</option>
          {customers.map((customer) => (
            <option key={customer.Customer} value={customer.Customer}>
              {customer['First Name']} {customer['Last Name']} - {customer.Address}
            </option>
          ))}
        </select>
      </div>

      {selectedCustomer && (
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">2. Customer Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Name:</label>
              <p>{selectedCustomer['First Name']} {selectedCustomer['Last Name']}</p>
            </div>
            <div>
              <label className="font-semibold">Email:</label>
              <p>{selectedCustomer.Email}</p>
            </div>
            <div>
              <label className="font-semibold">Phone:</label>
              <p>{selectedCustomer['Mobile Phone']}</p>
            </div>
            <div>
              <label className="font-semibold">Address:</label>
              <p>{selectedCustomer.Address}</p>
            </div>
          </div>
        </div>
      )}

      {selectedCustomer && (
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">3. Select Report</h2>
          <select
            className="w-full border rounded p-2"
            onChange={(e) => {
              const report = eagleviewReports.find(r => r.ReportID === parseInt(e.target.value));
              setSelectedReport(report);
            }}
            value={selectedReport?.ReportID || ''}
          >
            <option value="">Select a Report</option>
            {eagleviewReports
              .filter(report => report.Address === selectedCustomer.Address)
              .map((report) => (
                <option key={report.ReportID} value={report.ReportID}>
                  Report #{report.ReportID} - {report.ReportType}
                </option>
              ))}
          </select>
        </div>
      )}

      {selectedReport && (
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">4. Report Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Report ID:</label>
              <p>{selectedReport.ReportID}</p>
            </div>
            <div>
              <label className="font-semibold">Report Type:</label>
              <p>{selectedReport.ReportType}</p>
            </div>
            <div>
              <label className="font-semibold">Structure Type:</label>
              <p>{selectedReport.StructureType}</p>
            </div>
            <div>
              <label className="font-semibold">Address:</label>
              <p>{selectedReport.Address}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarrantyGenerator;