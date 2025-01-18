import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Papa from 'papaparse';

const PRODUCT_PATTERNS = {
  SHINGLES: {
    HDZ: /02GASTZ3/i,
    UHDZ: /03GATUHZ/i,
    AS: /02GATAS/i
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

        const [customers, customerInvoices, supplierInvoices] = await Promise.all([
          loadCSV('customer_and_building_info.csv'),
          loadCSV('customers_matched_to_supplier_invoices.csv'),
          loadCSV('Supplier_invoice_data.csv')
        ]);

        if (!customers?.length) throw new Error('No customer data found');
        if (!customerInvoices?.length) throw new Error('No customer invoice data found');
        if (!supplierInvoices?.length) throw new Error('No supplier invoice data found');

        // Process and organize the supplier invoice data
        const supplierInvoiceItems = supplierInvoices.reduce((acc, row) => {
          if (!row.INVOICE_NUMBER) return acc;
          
          if (!acc[row.INVOICE_NUMBER]) {
            acc[row.INVOICE_NUMBER] = {
              invoiceNumber: row.INVOICE_NUMBER,
              shippingAddress: row.SHIPPING_ADDRESS || '',
              poNumber: row.PO_NUMBER || '',
              totalDue: parseFloat(row.TOTAL_DUE || '0'),
              items: []
            };
          }
          
          if (row.ITEM_NUMBER_COL) {
            acc[row.INVOICE_NUMBER].items.push({
              itemNumber: String(row.ITEM_NUMBER_COL || '').trim(),
              description: String(row.DESC_COL || '').trim(),
              quantity: parseInt(row.QTY_SHIP_COL || '0', 10),
              unitPrice: parseFloat(row.NET_UNIT_PRICE_COL || '0'),
              amount: parseFloat(row.NET_AMOUNT_COL || '0')
            });
          }
          
          return acc;
        }, {});

        const processedInvoices = customerInvoices.map(invoice => {
          const supplierData = supplierInvoiceItems[invoice['Invoice Number'].toString()];
          return {
            ...invoice,
            supplierData: supplierData || null
          };
        });

        setData({
          customers,
          invoices: processedInvoices
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
      }
      return [...prev, invoice];
    });
  };

  const analyzeProducts = () => {
    const products = {
      shingles: [],
      ridgeCaps: [],
      starterStrips: [],
      ventilation: [],
      leakBarrier: [],
      roofDeck: [],
      other: []
    };

    selectedInvoices.forEach(invoice => {
      if (!invoice.supplierData?.items) return;

      invoice.supplierData.items.forEach(item => {
        const itemCode = item.itemNumber;
        let categorized = false;

        // Categorize products based on patterns
        if (Object.values(PRODUCT_PATTERNS.SHINGLES).some(pattern => pattern.test(itemCode))) {
          products.shingles.push(item);
          categorized = true;
        }
        if (Object.values(PRODUCT_PATTERNS.RIDGE_CAPS).some(pattern => pattern.test(itemCode))) {
          products.ridgeCaps.push(item);
          categorized = true;
        }
        if (Object.values(PRODUCT_PATTERNS.STARTER_STRIPS).some(pattern => pattern.test(itemCode))) {
          products.starterStrips.push(item);
          categorized = true;
        }
        if (Object.values(PRODUCT_PATTERNS.VENTILATION).some(pattern => pattern.test(itemCode))) {
          products.ventilation.push(item);
          categorized = true;
        }
        if (Object.values(PRODUCT_PATTERNS.LEAK_BARRIER).some(pattern => pattern.test(itemCode))) {
          products.leakBarrier.push(item);
          categorized = true;
        }
        if (Object.values(PRODUCT_PATTERNS.ROOF_DECK).some(pattern => pattern.test(itemCode))) {
          products.roofDeck.push(item);
          categorized = true;
        }
        if (!categorized) {
          products.other.push(item);
        }
      });
    });

    const qualifyingCategories = [
      products.shingles.length > 0,
      products.ridgeCaps.length > 0,
      products.starterStrips.length > 0,
      products.ventilation.length > 0,
      products.leakBarrier.length > 0,
      products.roofDeck.length > 0
    ].filter(Boolean).length;

    const hasLayerLock = products.shingles.some(s => 
      PRODUCT_PATTERNS.SHINGLES.HDZ.test(s.itemNumber) || 
      PRODUCT_PATTERNS.SHINGLES.UHDZ.test(s.itemNumber)
    );

    setProductSummary({
      ...products,
      qualifyingCategories,
      eligibility: {
        standardEligible: qualifyingCategories >= 3,
        systemPlusEligible: qualifyingCategories >= 3,
        silverPledgeEligible: qualifyingCategories >= 4,
        goldenPledgeEligible: qualifyingCategories >= 5,
        windProvenEligible: hasLayerLock && qualifyingCategories >= 4
      }
    });
  }, [selectedInvoices]);

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
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => analyzeProducts()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Analyze Products for Warranty
            </button>
          </div>
        </div>
      )}

      {productSummary && (
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Warranty Eligibility</h2>
          <div className="space-y-4">
            <div className="p-3 rounded bg-gray-50">
              <p className="font-medium">Qualifying Categories Found: {productSummary.qualifyingCategories}</p>
              <p className="text-sm text-gray-600">Requires 3-5 categories depending on warranty level</p>
            </div>

            <div className="p-3 rounded border border-blue-200 bg-blue-50">
              <p className="font-medium">Available Warranties:</p>
              <ul className="mt-2 space-y-1">
                {productSummary.eligibility.standardEligible && (
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Standard Limited Warranty</span>
                  </li>
                )}
                {productSummary.eligibility.systemPlusEligible && (
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span