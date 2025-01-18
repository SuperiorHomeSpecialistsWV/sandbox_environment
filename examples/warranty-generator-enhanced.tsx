import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Papa from 'papaparse';

const WarrantyGenerator = () => {
  // Product category definitions
  const PRODUCT_CATEGORIES = {
    SHINGLES: {
      LAYERLOCK: [
        'Timberline HDZ', 'Timberline UHDZ', 'Timberline AS II',
        'Timberline CS', 'Timberline HDZ RS', 'Timberline HDZ RS+'
      ]
    },
    STARTER_STRIPS: ['WeatherBlocker', 'Pro-Start', 'QuickStart', 'StarterMatch'],
    RIDGE_CAPS: ['TimberTex', 'TimberCrest', 'Ridglass', 'Seal-A-Ridge', 'Z Ridge'],
    LEAK_BARRIER: ['StormGuard', 'WeatherWatch', 'Extended Dry-in Membrane'],
    ROOF_DECK: ['Deck-Armor', 'Tiger Paw', 'FeltBuster', 'VersaShield', 'Shingle-Mate']
  };

  // Product code patterns
  const PRODUCT_PATTERNS = {
    SHINGLES: {
      HDZ: /02GASTZ3/i,
      UHDZ: /03GATUHZ/i
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

  useEffect(() => {
    loadData();
  }, []);

  const loadCSV = async (filename) => {
    try {
      const response = await window.fs.readFile(filename);
      const text = new TextDecoder().decode(response);
      const result = Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
      });
      return result.data;
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      throw error;
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const customerData = await loadCSV('customer_and_building_info.csv');
      const eagleviewData = await loadCSV('eagleview_reports.csv');
      const invoiceData = await loadCSV('customers_matched_to_supplier_invoices.csv');

      setCustomers(customerData);
      setEagleviewReports(eagleviewData);
      setInvoiceMatches(invoiceData);
    } catch (err) {
      setError(`Error loading data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const categorizeProduct = (productCode, description) => {
    for (const [category, patterns] of Object.entries(PRODUCT_PATTERNS)) {
      for (const [subType, pattern] of Object.entries(patterns)) {
        if (pattern.test(productCode)) {
          return { category, subType, warrantyEligible: true };
        }
      }
    }

    if (description) {
      const desc = description.toLowerCase();
      if (desc.includes('hdz') || desc.includes('timberline')) {
        return {
          category: 'SHINGLES',
          subType: desc.includes('hdz') ? 'HDZ' : 'STANDARD',
          warrantyEligible: true
        };
      }
    }
    return null;
  };

  const processInvoice = (invoiceItems) => {
    const categorizedProducts = {
      shingles: [],
      ridgeCaps: [],
      starterStrips: [],
      ventilation: [],
      leakBarrier: [],
      roofDeck: [],
      other: []
    };

    for (const item of invoiceItems) {
      const category = categorizeProduct(item.productCode, item.description);
      if (!category) {
        categorizedProducts.other.push(item);
        continue;
      }

      switch (category.category) {
        case 'SHINGLES':
          categorizedProducts.shingles.push({...item, subType: category.subType});
          break;
        case 'RIDGE_CAPS':
          categorizedProducts.ridgeCaps.push({...item, subType: category.subType});
          break;
        case 'STARTER_STRIPS':
          categorizedProducts.starterStrips.push({...item, subType: category.subType});
          break;
        case 'VENTILATION':
          categorizedProducts.ventilation.push({...item, subType: category.subType});
          break;
        case 'LEAK_BARRIER':
          categorizedProducts.leakBarrier.push({...item, subType: category.subType});
          break;
        case 'ROOF_DECK':
          categorizedProducts.roofDeck.push({...item, subType: category.subType});
          break;
        default:
          categorizedProducts.other.push(item);
      }
    }

    return {
      ...categorizedProducts,
      warrantyEligibility: analyzeWarrantyEligibility(categorizedProducts)
    };
  };

  const analyzeWarrantyEligibility = (products) => {
    const accessoryCount = [
      products.ridgeCaps.length > 0,
      products.starterStrips.length > 0,
      products.ventilation.length > 0,
      products.leakBarrier.length > 0,
      products.roofDeck.length > 0
    ].filter(Boolean).length;

    const hasLayerLock = products.shingles.some(s => s.subType === 'HDZ');

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
              
              // Process sample products
              const sampleProducts = [
                { productCode: '02GASTZ3CH', description: 'GAF Timberline HDZ Charcoal' },
                { productCode: '04GASR2CH', description: 'GAF Seal-A-Ridge Charcoal' },
                { productCode: '04GAPST', description: 'GAF Pro-Start Starter Strip' },
                { productCode: '17GACSCA', description: 'GAF Cobra Snow Country Advanced' }
              ];
              
              const mappedProducts = processInvoice(sampleProducts);
              setProductMap(mappedProducts);
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