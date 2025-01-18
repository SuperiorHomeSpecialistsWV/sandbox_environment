import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Papa from 'papaparse';

const WarrantyGenerator = () => {
  // State management
  const [customers, setCustomers] = useState([]);
  const [eagleviewReports, setEagleviewReports] = useState([]);
  const [invoiceMatches, setInvoiceMatches] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [productMap, setProductMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample data for development (while we resolve file access)
  const sampleData = {
    customers: [
      {
        Customer: "CUST001",
        "First Name": "John",
        "Last Name": "Doe",
        Email: "john@example.com",
        "Mobile Phone": "555-0123",
        Street: "123 Main St",
        City: "Anytown",
        State: "WV",
        Zip: 12345,
        Address: "123 Main St, Anytown, WV 12345"
      }
    ],
    eagleview: [
      {
        ReportID: 1001,
        ReportType: "Premium",
        StructureType: "Residential",
        Address: "123 Main St, Anytown, WV 12345"
      }
    ],
    invoices: [
      {
        "Invoice Number": 5001,
        "PO Number": "PO1001",
        "Customer Name": "CUST001",
        Confidence: 100,
        Reason: "Exact Match"
      }
    ]
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadCSV = async (filename) => {
    try {
      const response = await window.fs.readFile(filename);
      const text = new TextDecoder().decode(response);
      return Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
      }).data;
    } catch (error) {
      console.warn(`Warning: Could not load ${filename}, using sample data instead.`);
      return null;
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Attempt to load real data, fall back to sample data if needed
      const customerData = await loadCSV('customer_and_building_info.csv') || sampleData.customers;
      const eagleviewData = await loadCSV('eagleview_reports.csv') || sampleData.eagleview;
      const invoiceData = await loadCSV('customers_matched_to_supplier_invoices.csv') || sampleData.invoices;

      setCustomers(customerData);
      setEagleviewReports(eagleviewData);
      setInvoiceMatches(invoiceData);
      
      setError(null);
    } catch (err) {
      setError(`Error initializing system: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const analyzeWarrantyEligibility = (products) => {
    const accessoryCount = Object.values(products || {}).reduce((count, array) => 
      count + (Array.isArray(array) ? (array.length > 0 ? 1 : 0) : 0), 0);

    const hasLayerLock = (products?.shingles || [])
      .some(s => s.productCode?.includes('02GASTZ3') || s.description?.toLowerCase().includes('hdz'));

    return {
      standardEligible: accessoryCount >= 3,
      systemPlusEligible: accessoryCount >= 3,
      silverPledgeEligible: accessoryCount >= 4,
      goldenPledgeEligible: accessoryCount >= 5,
      windProvenEligible: hasLayerLock && accessoryCount >= 4,
      accessoryCount,
      hasLayerLock
    };
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
      <h1 className="text-2xl font-bold mb-6">GAF Warranty Generator</h1>

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
            setSelectedInvoice(null);
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

      {selectedCustomer && (
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">2. Select Report</h2>
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

      {selectedReport && (
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">3. Select Invoice</h2>
          <select
            className="w-full border rounded p-2"
            onChange={(e) => {
              const invoice = invoiceMatches.find(i => i['Invoice Number'] === parseInt(e.target.value));
              setSelectedInvoice(invoice);
              
              // Sample products for demonstration
              const sampleProducts = {
                shingles: [{ productCode: '02GASTZ3CH', description: 'GAF Timberline HDZ Charcoal' }],
                ridgeCaps: [{ productCode: '04GASR2CH', description: 'GAF Seal-A-Ridge Charcoal' }],
                starterStrips: [{ productCode: '04GAPST', description: 'GAF Pro-Start Starter Strip' }],
                ventilation: [{ productCode: '17GACSCA', description: 'GAF Cobra Snow Country Advanced' }]
              };
              
              setProductMap({ 
                ...sampleProducts, 
                warrantyEligibility: analyzeWarrantyEligibility(sampleProducts) 
              });
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

      {productMap && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Warranty Eligibility</h2>
          
          <Alert variant={productMap.warrantyEligibility.standardEligible ? "default" : "destructive"}>
            {productMap.warrantyEligibility.standardEligible ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>Standard Limited Warranty</AlertTitle>
            <AlertDescription>
              {productMap.warrantyEligibility.standardEligible ? "Eligible" : "Requires 3 qualifying accessories"}
            </AlertDescription>
          </Alert>

          <Alert variant={productMap.warrantyEligibility.systemPlusEligible ? "default" : "destructive"}>
            {productMap.warrantyEligibility.systemPlusEligible ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>System Plus Limited Warranty</AlertTitle>
            <AlertDescription>
              {productMap.warrantyEligibility.systemPlusEligible ? "Eligible with certified contractor" : "Not eligible"}
            </AlertDescription>
          </Alert>

          <Alert variant={productMap.warrantyEligibility.silverPledgeEligible ? "default" : "destructive"}>
            {productMap.warrantyEligibility.silverPledgeEligible ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>Silver Pledge™ Limited Warranty</AlertTitle>
            <AlertDescription>
              {productMap.warrantyEligibility.silverPledgeEligible ? "Eligible with Master Elite contractor" : "Not eligible"}
            </AlertDescription>
          </Alert>

          <Alert variant={productMap.warrantyEligibility.goldenPledgeEligible ? "default" : "destructive"}>
            {productMap.warrantyEligibility.goldenPledgeEligible ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>Golden Pledge® Limited Warranty</AlertTitle>
            <AlertDescription>
              {productMap.warrantyEligibility.goldenPledgeEligible ? "Eligible with Master Elite contractor" : "Not eligible"}
            </AlertDescription>
          </Alert>

          <Alert variant={productMap.warrantyEligibility.windProvenEligible ? "default" : "destructive"}>
            {productMap.warrantyEligibility.windProvenEligible ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>WindProven™ Limited Wind Warranty</AlertTitle>
            <AlertDescription>
              {productMap.warrantyEligibility.windProvenEligible ? "Eligible" : "Requires LayerLock shingles and 4 accessories"}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default WarrantyGenerator;