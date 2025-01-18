import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Papa from 'papaparse';

// Product categorization patterns for GAF products
const PRODUCT_PATTERNS = {
  SHINGLES: {
    HDZ: /02GASTZ3/i,
    UHDZ: /03GATUHZ/i,
    AS: /02GATAS/i
  },
  RIDGE_CAPS: {
    SEAL_A_RIDGE: /04GASR2/i,
    TIMBERTEX: /04GATX/i
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

const WarrantyCalculator = () => {
  const [data, setData] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warrantyResults, setWarrantyResults] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load all data sources
        const [customerData, invoiceData, supplierData] = await Promise.all([
          window.fs.readFile('customer_and_building_info.csv', { encoding: 'utf8' }),
          window.fs.readFile('customers_matched_to_supplier_invoices.csv', { encoding: 'utf8' }),
          window.fs.readFile('Supplier_invoice_data.csv', { encoding: 'utf8' })
        ]);

        // Parse all CSV data
        const customers = Papa.parse(customerData, {
          header: true,
          skipEmptyLines: true
        }).data;

        const customerInvoices = Papa.parse(invoiceData, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true
        }).data;

        const supplierInvoices = Papa.parse(supplierData, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true
        }).data;

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

        // Match customer invoices with supplier data
        const processedInvoices = customerInvoices.map(invoice => ({
          ...invoice,
          supplierData: supplierInvoiceItems[invoice['Invoice Number']] || null
        }));

        setData({ 
          customers,
          invoices: processedInvoices
        });
        
        setError(null);
      } catch (err) {
        setError('Error loading data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const analyzeWarrantyEligibility = (products) => {
    // Count qualifying product categories
    const categories = {
      hasShingles: products.some(p => 
        Object.values(PRODUCT_PATTERNS.SHINGLES).some(pattern => 
          pattern.test(p.itemNumber))),
      hasRidgeCaps: products.some(p => 
        Object.values(PRODUCT_PATTERNS.RIDGE_CAPS).some(pattern => 
          pattern.test(p.itemNumber))),
      hasStarterStrips: products.some(p => 
        Object.values(PRODUCT_PATTERNS.STARTER_STRIPS).some(pattern => 
          pattern.test(p.itemNumber))),
      hasVentilation: products.some(p => 
        Object.values(PRODUCT_PATTERNS.VENTILATION).some(pattern => 
          pattern.test(p.itemNumber))),
      hasLeakBarrier: products.some(p => 
        Object.values(PRODUCT_PATTERNS.LEAK_BARRIER).some(pattern => 
          pattern.test(p.itemNumber))),
      hasRoofDeck: products.some(p => 
        Object.values(PRODUCT_PATTERNS.ROOF_DECK).some(pattern => 
          pattern.test(p.itemNumber)))
    };

    const qualifyingCount = Object.values(categories).filter(Boolean).length;
    const hasLayerLock = products.some(p => 
      PRODUCT_PATTERNS.SHINGLES.HDZ.test(p.itemNumber) ||
      PRODUCT_PATTERNS.SHINGLES.UHDZ.test(p.itemNumber)
    );

    return {
      standardEligible: qualifyingCount >= 3,
      systemPlusEligible: qualifyingCount >= 3,
      silverPledgeEligible: qualifyingCount >= 4,
      goldenPledgeEligible: qualifyingCount >= 5,
      windProvenEligible: hasLayerLock && qualifyingCount >= 4,
      categories,
      qualifyingCount
    };
  };

  const handleAnalyze = () => {
    if (!selectedInvoices.length) return;

    const allProducts = selectedInvoices.flatMap(invoice => 
      invoice.products || []
    );

    const results = analyzeWarrantyEligibility(allProducts);
    setWarrantyResults(results);
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
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">GAF Warranty Calculator</h2>

      {/* Customer Selection */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Select Customer</h3>
        <select 
          className="w-full p-2 border rounded"
          value={selectedCustomer?.id || ''}
          onChange={(e) => {
            const customer = data?.customers.find(c => c.id === e.target.value);
            setSelectedCustomer(customer);
            setSelectedInvoices([]);
            setWarrantyResults(null);
          }}
        >
          <option value="">Select a customer...</option>
          {data?.customers.map(customer => (
            <option key={customer.Customer} value={customer.Customer}>
              {customer['First Name']} {customer['Last Name']} - {customer.Address}
            </option>
          ))}
        </select>
      </div>

      {/* Invoice Selection */}
      {selectedCustomer && (
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Select Invoices</h3>
          <div className="space-y-2">
            {data?.invoices
              .filter(inv => inv['Customer Name'] === selectedCustomer.Customer)
              .map(invoice => (
                <label 
                  key={invoice.id}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedInvoices.includes(invoice)}
                    onChange={() => {
                      setSelectedInvoices(prev => {
                        const exists = prev.includes(invoice);
                        return exists 
                          ? prev.filter(i => i !== invoice)
                          : [...prev, invoice];
                      });
                      setWarrantyResults(null);
                    }}
                    className="w-4 h-4"
                  />
                  <span>Invoice #{invoice.number}</span>
                </label>
              ))}
          </div>
          
          {selectedInvoices.length > 0 && (
            <button
              onClick={handleAnalyze}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Analyze Warranty Eligibility
            </button>
          )}
        </div>
      )}

      {/* Results Display */}
      {warrantyResults && (
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Warranty Eligibility</h3>
          
          <div className="space-y-4">
            <Alert variant={warrantyResults.standardEligible ? "default" : "destructive"}>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Standard Limited Warranty</AlertTitle>
              <AlertDescription>
                {warrantyResults.standardEligible 
                  ? "Eligible - Meets minimum requirements"
                  : `Not eligible - Has ${warrantyResults.qualifyingCount} of 3 required categories`}
              </AlertDescription>
            </Alert>

            <Alert variant={warrantyResults.systemPlusEligible ? "default" : "destructive"}>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>System Plus Limited Warranty</AlertTitle>
              <AlertDescription>
                {warrantyResults.systemPlusEligible
                  ? "Eligible with GAF Certified™ Contractor"
                  : `Not eligible - Has ${warrantyResults.qualifyingCount} of 3 required categories`}
              </AlertDescription>
            </Alert>

            <Alert variant={warrantyResults.silverPledgeEligible ? "default" : "destructive"}>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Silver Pledge™ Limited Warranty</AlertTitle>
              <AlertDescription>
                {warrantyResults.silverPledgeEligible
                  ? "Eligible with Master Elite® Contractor"
                  : `Not eligible - Has ${warrantyResults.qualifyingCount} of 4 required categories`}
              </AlertDescription>
            </Alert>

            <Alert variant={warrantyResults.goldenPledgeEligible ? "default" : "destructive"}>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Golden Pledge® Limited Warranty</AlertTitle>
              <AlertDescription>
                {warrantyResults.goldenPledgeEligible
                  ? "Eligible with Master Elite® Contractor"
                  : `Not eligible - Has ${warrantyResults.qualifyingCount} of 5 required categories`}
              </AlertDescription>
            </Alert>

            <Alert variant={warrantyResults.windProvenEligible ? "default" : "destructive"}>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>WindProven™ Limited Wind Warranty</AlertTitle>
              <AlertDescription>
                {warrantyResults.windProvenEligible
                  ? "Eligible - Has LayerLock™ shingles and required accessories"
                  : !warrantyResults.categories.hasShingles
                    ? "Not eligible - Requires LayerLock™ shingles"
                    : `Not eligible - Has ${warrantyResults.qualifyingCount} of 4 required categories`}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarrantyCalculator;