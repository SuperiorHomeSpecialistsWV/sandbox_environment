import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, FilePlus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Papa from 'papaparse';

// Product categorization patterns based on GAF documentation
const PRODUCT_PATTERNS = {
  SHINGLES: {
    HDZ: /02GASTZ3/i,      // Timberline HDZ
    UHDZ: /03GATUHZ/i,     // Timberline UHDZ
    AS: /02GATAS/i         // Timberline AS II
  },
  RIDGE_CAPS: {
    SEAL_A_RIDGE: /04GASR2/i,
    TIMBERTEX: /04GATX/i,
    RIDGLASS: /04GARG/i
  },
  STARTER_STRIPS: {
    PRO_START: /04GAPST/i,
    WEATHER_BLOCKER: /04GAWBL/i
  },
  VENTILATION: {
    COBRA: /17GAC/i,
    MASTER_FLOW: /17GA(SSB|PV|IR)/i
  },
  LEAK_BARRIER: {
    STORM_GUARD: /11GASG/i,
    WEATHER_WATCH: /11GAWW/i
  },
  ROOF_DECK: {
    DECK_ARMOR: /05GADA/i,
    FELTBUSTER: /05GAFB/i,
    TIGER_PAW: /11GATP/i
  }
};

const WarrantyGenerator = () => {
  const [data, setData] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productSummary, setProductSummary] = useState(null);

  const loadCSV = async (filename) => {
    try {
      const response = await window.fs.readFile(filename);
      const text = new TextDecoder().decode(response);
      
      return new Promise((resolve, reject) => {
        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length > 0) {
              reject(new Error(`Error parsing ${filename}: ${results.errors[0].message}`));
            } else {
              resolve(results.data);
            }
          },
          error: (error) => {
            reject(new Error(`Error parsing ${filename}: ${error}`));
          }
        });
      });
    } catch (error) {
      throw new Error(`Error reading ${filename}: ${error.message}`);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [customers, invoices] = await Promise.all([
          loadCSV('customer_and_building_info.csv'),
          loadCSV('customers_matched_to_supplier_invoices.csv')
        ]);

        if (!customers?.length) throw new Error('No customer data found');
        if (!invoices?.length) throw new Error('No invoice data found');

        setData({
          customers,
          invoices
        });

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  const handleCustomerSelect = (customerId) => {
    const customer = data?.customers.find(c => c.Customer === customerId);
    setSelectedCustomer(customer);
    setSelectedInvoices([]);
    setProductSummary(null);
  };

  const handleInvoiceSelect = (invoiceNumber) => {
    const invoice = data?.invoices.find(inv => inv['Invoice Number'] === parseInt(invoiceNumber));
    
    setSelectedInvoices(prev => {
      const exists = prev.some(inv => inv['Invoice Number'] === invoice['Invoice Number']);
      if (exists) {
        return prev.filter(inv => inv['Invoice Number'] !== invoice['Invoice Number']);
      } else {
        return [...prev, invoice];
      }
    });
  };

  const categorizeProducts = (invoices) => {
    const products = {
      shingles: [],
      ridgeCaps: [],
      starterStrips: [],
      ventilation: [],
      leakBarrier: [],
      roofDeck: [],
      other: []
    };

    invoices.forEach(invoice => {
      // Process products from invoice
      // Note: This is a placeholder - we'll need to implement actual product processing
      // once we have access to the product details from the invoices
    });

    return products;
  };

  const analyzeWarrantyEligibility = (products) => {
    const accessoryCount = [
      products.ridgeCaps.length > 0,
      products.starterStrips.length > 0,
      products.ventilation.length > 0,
      products.leakBarrier.length > 0,
      products.roofDeck.length > 0
    ].filter(Boolean).length;

    const hasLayerLock = products.shingles.some(s => 
      PRODUCT_PATTERNS.SHINGLES.HDZ.test(s.code) || 
      PRODUCT_PATTERNS.SHINGLES.UHDZ.test(s.code)
    );

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
        <div className="animate-spin h-8 w-8 text-gray-500">
          <div className="h-full w-full rounded-full border-4 border-t-blue-500 border-b-blue-500 border-r-transparent border-l-transparent"></div>
        </div>
        <span className="ml-2">Loading data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Data</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const matchedInvoices = selectedCustomer ? 
    data.invoices.filter(invoice => invoice['Customer Name'] === selectedCustomer.Customer) : [];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">GAF Warranty Generator</h1>

      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">1. Select Customer</h2>
        <select
          className="w-full border rounded p-2"
          onChange={(e) => handleCustomerSelect(e.target.value)}
          value={selectedCustomer?.Customer || ''}
        >
          <option value="">Select a Customer</option>
          {data?.customers.map((customer) => (
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
              <label className="font-medium">Name:</label>
              <p>{selectedCustomer['First Name']} {selectedCustomer['Last Name']}</p>
            </div>
            <div>
              <label className="font-medium">Email:</label>
              <p>{selectedCustomer.Email}</p>
            </div>
            <div>
              <label className="font-medium">Phone:</label>
              <p>{selectedCustomer['Mobile Phone']}</p>
            </div>
            <div>
              <label className="font-medium">Address:</label>
              <p>{selectedCustomer.Address}</p>
            </div>
          </div>
        </div>
      )}

      {selectedCustomer && matchedInvoices.length > 0 && (
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">3. Select Invoices</h2>
          <div className="space-y-2">
            {matchedInvoices.map((invoice) => (
              <div key={invoice['Invoice Number']} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`invoice-${invoice['Invoice Number']}`}
                  checked={selectedInvoices.some(inv => inv['Invoice Number'] === invoice['Invoice Number'])}
                  onChange={() => handleInvoiceSelect(invoice['Invoice Number'])}
                  className="w-4 h-4"
                />
                <label htmlFor={`invoice-${invoice['Invoice Number']}`} className="flex-1">
                  Invoice #{invoice['Invoice Number']} - PO: {invoice['PO Number']}
                  {invoice['Confidence'] && ` (Match Confidence: ${invoice['Confidence']}%)`}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedInvoices.length > 0 && (
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">4. Selected Invoices</h2>
          <div className="space-y-4">
            {selectedInvoices.map((invoice) => (
              <div key={invoice['Invoice Number']} className="border-b pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium">Invoice Number:</label>
                    <p>#{invoice['Invoice Number']}</p>
                  </div>
                  <div>
                    <label className="font-medium">PO Number:</label>
                    <p>{invoice['PO Number']}</p>
                  </div>
                  {invoice['Confidence'] && (
                    <div>
                      <label className="font-medium">Match Confidence:</label>
                      <p>{invoice['Confidence']}%</p>
                    </div>
                  )}
                  {invoice['Reason'] && (
                    <div>
                      <label className="font-medium">Match Reason:</label>
                      <p>{invoice['Reason']}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WarrantyGenerator;