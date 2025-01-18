import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader, FilePlus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const WarrantyGenerator = () => {
  // Product categorization patterns
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

  // Component state
  const [data, setData] = useState({
    customers: [],
    reports: [],
    invoices: []
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load mock data
  useEffect(() => {
    setLoading(true);
    setData({
      customers: [
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
        }
      ],
      reports: [
        {
          ReportID: 1001,
          ReportType: "Standard Measurement",
          StructureType: "Residential",
          Address: "123 Main St, Charleston, WV 25301"
        }
      ],
      invoices: [
        {
          InvoiceNumber: "INV001",
          CustomerName: "CUST001",
          Items: [
            {
              ItemNumber: "02GASTZ3CH",
              Description: "GAF TIMBERLINE HDZ CHARCOAL",
              Quantity: 60,
              Price: 34.66
            },
            {
              ItemNumber: "04GASR2CH",
              Description: "GAF SEAL-A-RIDGE CHARCOAL",
              Quantity: 10,
              Price: 64.00
            },
            {
              ItemNumber: "04GAPST",
              Description: "GAF PRO-START STARTER",
              Quantity: 10,
              Price: 65.00
            },
            {
              ItemNumber: "11GAWW2",
              Description: "GAF WEATHERWATCH LEAK BARRIER",
              Quantity: 2,
              Price: 90.50
            }
          ]
        }
      ]
    });
    setLoading(false);
  }, []);

  // Check warranty eligibility based on products
  const checkWarrantyEligibility = (items) => {
    const categories = {
      layerlockShingles: 0,
      starterStrips: 0,
      ridgeCaps: 0,
      leakBarriers: 0,
      roofDeck: 0,
      ventilation: 0
    };

    items.forEach(item => {
      const code = item.ItemNumber;
      
      if (PRODUCT_PATTERNS.SHINGLES.HDZ.test(code)) categories.layerlockShingles++;
      if (PRODUCT_PATTERNS.STARTER_STRIPS.PRO_START.test(code) || 
          PRODUCT_PATTERNS.STARTER_STRIPS.WEATHER_BLOCKER.test(code)) categories.starterStrips++;
      if (PRODUCT_PATTERNS.RIDGE_CAPS.SEAL_A_RIDGE.test(code) || 
          PRODUCT_PATTERNS.RIDGE_CAPS.TIMBERTEX.test(code)) categories.ridgeCaps++;
      if (PRODUCT_PATTERNS.LEAK_BARRIER.STORM_GUARD.test(code) || 
          PRODUCT_PATTERNS.LEAK_BARRIER.WEATHER_WATCH.test(code)) categories.leakBarriers++;
      if (PRODUCT_PATTERNS.ROOF_DECK.DECK_ARMOR.test(code) || 
          PRODUCT_PATTERNS.ROOF_DECK.FELTBUSTER.test(code) ||
          PRODUCT_PATTERNS.ROOF_DECK.TIGER_PAW.test(code)) categories.roofDeck++;
      if (PRODUCT_PATTERNS.VENTILATION.COBRA.test(code) || 
          PRODUCT_PATTERNS.VENTILATION.MASTER_FLOW.test(code)) categories.ventilation++;
    });

    const accessoryCount = Object.values(categories).filter(count => count > 0).length - 1;
    const hasLayerlock = categories.layerlockShingles > 0;

    return {
      standardEligible: accessoryCount >= 3,
      systemPlusEligible: accessoryCount >= 3,
      silverPledgeEligible: accessoryCount >= 4,
      goldenPledgeEligible: accessoryCount >= 5,
      windProvenEligible: hasLayerlock && accessoryCount >= 4,
      categories,
      accessoryCount
    };
  };

  // Generate warranty report
  const generateReport = async () => {
    try {
      setGenerating(true);

      const customerInvoice = data.invoices.find(inv => 
        inv.CustomerName === selectedCustomer.Customer
      );

      const eligibility = checkWarrantyEligibility(customerInvoice.Items);
      
      const reportData = {
        customer: selectedCustomer,
        report: selectedReport,
        products: customerInvoice.Items,
        warrantyEligibility: eligibility,
        generatedDate: new Date().toISOString(),
        totalCost: customerInvoice.Items.reduce((sum, item) => 
          sum + (item.Quantity * item.Price), 0
        )
      };

      // Download as JSON
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `warranty-${selectedCustomer.Customer}-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (err) {
      setError('Error generating report: ' + err.message);
    } finally {
      setGenerating(false);
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

  const selectedInvoice = selectedCustomer 
    ? data.invoices.find(inv => inv.CustomerName === selectedCustomer.Customer)
    : null;

  const warrantyEligibility = selectedInvoice 
    ? checkWarrantyEligibility(selectedInvoice.Items)
    : null;

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
            const customer = data.customers.find(c => c.Customer === e.target.value);
            setSelectedCustomer(customer);
            setSelectedReport(null);
          }}
          value={selectedCustomer?.Customer || ''}
        >
          <option value="">Select a Customer</option>
          {data.customers.map((customer) => (
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
              const report = data.reports.find(r => r.ReportID === parseInt(e.target.value));
              setSelectedReport(report);
            }}
            value={selectedReport?.ReportID || ''}
          >
            <option value="">Select a Report</option>
            {data.reports
              .filter(report => report.Address === selectedCustomer.Address)
              .map((report) => (
                <option key={report.ReportID} value={report.ReportID}>
                  Report #{report.ReportID} - {report.ReportType}
                </option>
              ))}
          </select>
        </div>
      )}

      {selectedInvoice && (
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">3. Product List</h2>
          <div className="space-y-4">
            {selectedInvoice.Items.map((item, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded">
                <div className="flex justify-between">
                  <span className="font-medium">{item.Description}</span>
                  <span className="text-gray-600">
                    {item.Quantity} x ${item.Price.toFixed(2)}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Item #: {item.ItemNumber}
                </div>
              </div>
            ))}

            <div className="mt-4 pt-4 border-t">
              <h3 className="font-semibold mb-2">Warranty Eligibility:</h3>
              {warrantyEligibility && (
                <div className="space-y-2">
                  <Alert variant={warrantyEligibility.standardEligible ? "default" : "destructive"}>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Standard Limited Warranty</AlertTitle>
                    <AlertDescription>
                      {warrantyEligibility.standardEligible
                        ? "Eligible - Meets minimum requirements"
                        : `Not eligible - Has ${warrantyEligibility.accessoryCount} of 3 required accessories`}
                    </AlertDescription>
                  </Alert>

                  <Alert variant={warrantyEligibility.systemPlusEligible ? "default" : "destructive"}>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>System Plus Limited Warranty</AlertTitle>
                    <AlertDescription>
                      {warrantyEligibility.systemPlusEligible
                        ? "Eligible with GAF Certified™ Contractor"
                        : `Not eligible - Has ${warrantyEligibility.accessoryCount} of 3 required accessories`}
                    </AlertDescription>
                  </Alert>

                  <Alert variant={warrantyEligibility.silverPledgeEligible ? "default" : "destructive"}>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Silver Pledge™ Limited Warranty</AlertTitle>
                    <AlertDescription>
                      {warrantyEligibility.silverPledgeEligible
                        ? "Eligible with Master Elite® Contractor"
                        : `Not eligible - Has ${warrantyEligibility.accessoryCount} of 4 required accessories`}
                    </AlertDescription>
                  </Alert>

                  <Alert variant={warrantyEligibility.goldenPledgeEligible ? "default" : "destructive"}>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Golden Pledge® Limited Warranty</AlertTitle>
                    <AlertDescription>
                      {warrantyEligibility.goldenPledgeEligible
                        ? "Eligible with Master Elite® Contractor"
                        : `Not eligible - Has ${warrantyEligibility.accessoryCount} of 5 required accessories`}
                    </AlertDescription>
                  </Alert>

                  <Alert variant={warrantyEligibility.windProvenEligible ? "default" : "destructive"}>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>WindProven™ Limited Wind Warranty</AlertTitle>
                    <AlertDescription>
                      {warrantyEligibility.windProvenEligible
                        ? "Eligible - Has LayerLock™ shingles and required accessories"
                        : warrantyEligibility.categories.layerlockShingles === 0 
                          ? "Not eligible - Requires LayerLock™ shingles"
                          : `Not eligible - Has ${warrantyEligibility.accessoryCount} of 4 required accessories`}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedCustomer && selectedReport && selectedInvoice && (
        <div className="flex justify-end mt-6">
          <button
            onClick={generateReport}
            disabled={generating}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {generating ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FilePlus className="w-4 h-4 mr-2" />
                Generate Warranty Report
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default WarrantyGenerator;