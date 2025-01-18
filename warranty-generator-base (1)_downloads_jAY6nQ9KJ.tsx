import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const WarrantyGenerator = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Mock data matching CSV structure
  const MOCK_CUSTOMERS = [
    {
      Customer: "CUST001",
      "First Name": "John",
      "Last Name": "Doe",
      Email: "john.doe@example.com",
      "Mobile Phone": "304-555-0123",
      "Unnamed: 5": null,
      Street: "123 Main Street",
      City: "Charleston",
      State: "WV",
      Zip: 25301,
      Address: "123 Main Street, Charleston, WV 25301"
    },
    {
      Customer: "CUST002",
      "First Name": "Jane",
      "Last Name": "Smith",
      Email: "jane.smith@example.com",
      "Mobile Phone": "304-555-0124",
      "Unnamed: 5": null,
      Street: "456 Oak Avenue",
      City: "Huntington",
      State: "WV",
      Zip: 25701,
      Address: "456 Oak Avenue, Huntington, WV 25701"
    }
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock data
      setCustomers(MOCK_CUSTOMERS);
      setError(null);
    } catch (err) {
      setError(`Error loading customer data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSelect = (customerId) => {
    const customer = customers.find(c => c.Customer === customerId);
    setSelectedCustomer(customer);
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">GAF Warranty Generator</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* Customer Selection */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">1. Select Customer</h2>
          <select
            className="w-full border rounded p-2"
            value={selectedCustomer?.Customer || ''}
            onChange={(e) => handleCustomerSelect(e.target.value)}
          >
            <option value="">Select a Customer</option>
            {customers.map((customer) => (
              <option key={customer.Customer} value={customer.Customer}>
                {customer['First Name']} {customer['Last Name']} - {customer.Address}
              </option>
            ))}
          </select>
        </div>

        {/* Customer Details */}
        {selectedCustomer && (
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
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
      </div>
    </div>
  );
};

export default WarrantyGenerator;