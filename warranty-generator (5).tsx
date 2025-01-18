import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Papa from 'papaparse';

const GAFWarrantyGenerator = () => {
  // State for loaded data
  const [customers, setCustomers] = useState([]);
  const [eagleviewReports, setEagleviewReports] = useState([]);
  const [invoiceMatches, setInvoiceMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for selected data
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load customer data
        const customerData = await window.fs.readFile('customer_and_building_info.csv');
        const customerText = new TextDecoder().decode(customerData);
        const parsedCustomers = Papa.parse(customerText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true
        });
        setCustomers(parsedCustomers.data);

        // Load eagleview reports
        const eagleviewData = await window.fs.readFile('eagleview_reports.csv');
        const eagleviewText = new TextDecoder().decode(eagleviewData);
        const parsedEagleview = Papa.parse(eagleviewText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true
        });
        setEagleviewReports(parsedEagleview.data);

        // Load invoice matches
        const invoiceData = await window.fs.readFile('customers_matched_to_supplier_invoices.csv');
        const invoiceText = new TextDecoder().decode(invoiceData);
        const parsedInvoice = Papa.parse(invoiceText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true
        });
        setInvoiceMatches(parsedInvoice.data);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Generate warranty form data
  const generateWarrantyForm = (customer, report, invoice) => {
    return {
      structureInfo: {
        type: 'Single family', // Default to single family
      },
      buildingAddress: {
        street: customer.Street,
        city: customer.City,
        state: customer.State,
        zip: customer.Zip,
        address: customer.Address
      },
      ownerInfo: {
        firstName: customer['First Name'],
        lastName: customer['Last Name'],
        email: customer.Email,
        phone: customer['Mobile Phone']
      },
      projectDetails: {
        reportId: report.ReportID,
        reportType: report.ReportType,
        structureType: report.StructureType
      }
    };
  };

  // Calculate warranty eligibility based on invoice data
  const calculateWarrantyEligibility = (invoice) => {
    return {
      standard: true, // Default eligibility, would need real logic based on products
      systemPlus: true,
      silverPledge: false,
      goldenPledge: false,
      windProven: false
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">GAF Warranty Generator</h1>

      {/* Customer Selection */}
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">1. Select Customer</h2>
        <select
          className="w-full border rounded p-2"
          onChange={(e) => {
            const customer = customers.find(c => c.Customer === e.target.value);
            setSelectedCustomer(customer);
          }}
        >
          <option value="">Select Customer</option>
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

      {/* Eagleview Report Selection */}
      {selectedCustomer && (
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">2. Select Eagleview Report</h2>
          <select
            className="w-full border rounded p-2"
            onChange={(e) => {
              const report = eagleviewReports.find(r => r.ReportID === parseInt(e.target.value));
              setSelectedReport(report);
            }}
          >
            <option value="">Select Report</option>
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

      {/* Invoice Selection */}
      {selectedCustomer && (
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">3. Select Invoice</h2>
          <select
            className="w-full border rounded p-2"
            onChange={(e) => {
              const invoice = invoiceMatches.find(i => i['Invoice Number'] === parseInt(e.target.value));
              setSelectedInvoice(invoice);
            }}
          >
            <option value="">Select Invoice</option>
            {invoiceMatches
              .filter(invoice => invoice['Customer Name'] === selectedCustomer.Customer)
              .map((invoice) => (
                <option key={invoice['Invoice Number']} value={invoice['Invoice Number']}>
                  Invoice #{invoice['Invoice Number']} - PO: {invoice['PO Number']}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Warranty Eligibility */}
      {selectedInvoice && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">4. Warranty Eligibility</h2>
          
          {Object.entries(calculateWarrantyEligibility(selectedInvoice)).map(([warranty, eligible]) => (
            <Alert key={warranty} variant={eligible ? "default" : "destructive"}>
              {eligible ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{warranty.replace(/([A-Z])/g, ' $1').trim()}</AlertTitle>
              <AlertDescription>
                {eligible ? "Eligible" : "Not eligible"}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Generate Warranty Button */}
      {selectedCustomer && selectedReport && selectedInvoice && (
        <button
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          onClick={() => {
            const warrantyData = generateWarrantyForm(selectedCustomer, selectedReport, selectedInvoice);
            console.log('Generated Warranty Data:', warrantyData);
          }}
        >
          Generate Warranty
        </button>
      )}
    </div>
  );
};

export default GAFWarrantyGenerator;