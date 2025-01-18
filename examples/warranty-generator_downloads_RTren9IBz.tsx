import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Papa from 'papaparse';

const WarrantyGenerator = () => {
  // State for data
  const [customers, setCustomers] = useState([]);
  const [eagleviewReports, setEagleviewReports] = useState([]);
  const [invoiceMatches, setInvoiceMatches] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);
  
  // State for selections
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [warrantyEligibility, setWarrantyEligibility] = useState(null);
  
  // State for UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      console.error(`Error loading ${filename}:`, error);
      throw error;
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [customerData, reportData, invoiceMatchData, supplierData] = await Promise.all([
        loadCSV('customer_and_building_info.csv'),
        loadCSV('eagleview_reports.csv'),
        loadCSV('customers_matched_to_supplier_invoices.csv'),
        loadCSV('Supplier_invoice_data.csv')
      ]);

      setCustomers(customerData);
      setEagleviewReports(reportData);
      setInvoiceMatches(invoiceMatchData);
      setInvoiceData(supplierData);
    } catch (err) {
      setError(`Error loading data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkWarrantyEligibility = (invoiceProducts) => {
    const categories = {
      layerlockShingles: 0,
      starterStrips: 0,
      ridgeCaps: 0,
      leakBarriers: 0,
      roofDeck: 0,
      ventilation: 0
    };

    invoiceProducts.forEach(product => {
      const code = product.ItemNumber;
      const desc = product.Description?.toLowerCase() || '';

      if (code?.startsWith('02GASTZ3')) categories.layerlockShingles++;
      if (code?.startsWith('04GAPST') || code?.startsWith('04GAWBL')) categories.starterStrips++;
      if (code?.startsWith('04GASR2') || code?.startsWith('04GATX')) categories.ridgeCaps++;
      if (code?.startsWith('11GASG') || code?.startsWith('11GAWW')) categories.leakBarriers++;
      if (code?.startsWith('05GADA') || code?.startsWith('05GAFB')) categories.roofDeck++;
      if (code?.startsWith('17GA')) categories.ventilation++;
    });

    const accessoryCount = Object.values(categories).filter(count => count > 0).length - 1;
    const hasLayerlock = categories.layerlockShingles > 0;

    return {
      standardEligible: accessoryCount >= 3,
      systemPlusEligible: accessoryCount >= 3,
      silverPledgeEligible: accessoryCount >= 4,
      goldenPledgeEligible: accessoryCount >= 5,
      windProvenEligible: hasLayerlock && accessoryCount >= 4,
      categories
    };
  };

  const handleInvoiceSelect = (invoiceNumber) => {
    const invoice = invoiceMatches.find(i => i['Invoice Number'] === invoiceNumber);
    setSelectedInvoice(invoice);

    if (invoice) {
      const products = invoiceData.filter(item => 
        item.InvoiceNumber === invoiceNumber.toString()
      );
      const eligibility = checkWarrantyEligibility(products);
      setWarrantyEligibility(eligibility);
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
            setSelectedInvoice(null);
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
          <h2 className="text-xl font-semibold mb-4">2. Select Report</h2>
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
          <h2 className="text-xl font-semibold mb-4">3. Select Invoice</h2>
          <select
            className="w-full border rounded p-2"
            onChange={(e) => handleInvoiceSelect(parseInt(e.target.value))}
            value={selectedInvoice?.['Invoice Number'] || ''}
          >
            <option value="">Select an Invoice</option>
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

      {warrantyEligibility && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Warranty Eligibility</h2>
          
          <Alert variant={warrantyEligibility.standardEligible ? "default" : "destructive"}>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Standard Limited Warranty</AlertTitle>
            <AlertDescription>
              {warrantyEligibility.standardEligible ? 
                "Eligible - Minimum requirements met" : 
                "Not eligible - Requires 3 qualifying accessories"}
            </AlertDescription>
          </Alert>

          <Alert variant={warrantyEligibility.systemPlusEligible ? "default" : "destructive"}>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>System Plus Limited Warranty</AlertTitle>
            <AlertDescription>
              {warrantyEligibility.systemPlusEligible ? 
                "Eligible with GAF Certified Contractor" : 
                "Not eligible - Requires 3 qualifying accessories"}
            </AlertDescription>
          </Alert>

          <Alert variant={warrantyEligibility.silverPledgeEligible ? "default" : "destructive"}>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Silver Pledge™ Limited Warranty</AlertTitle>
            <AlertDescription>
              {warrantyEligibility.silverPledgeEligible ? 
                "Eligible with Master Elite Contractor" : 
                "Not eligible - Requires 4 qualifying accessories"}
            </AlertDescription>
          </Alert>

          <Alert variant={warrantyEligibility.goldenPledgeEligible ? "default" : "destructive"}>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Golden Pledge® Limited Warranty</AlertTitle>
            <AlertDescription>
              {warrantyEligibility.goldenPledgeEligible ? 
                "Eligible with Master Elite Contractor" : 
                "Not eligible - Requires 5 qualifying accessories"}
            </AlertDescription>
          </Alert>

          <Alert variant={warrantyEligibility.windProvenEligible ? "default" : "destructive"}>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>WindProven™ Limited Wind Warranty</AlertTitle>
            <AlertDescription>
              {warrantyEligibility.windProvenEligible ? 
                "Eligible - LayerLock shingles and required accessories present" : 
                "Not eligible - Requires LayerLock shingles and 4 qualifying accessories"}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default WarrantyGenerator;