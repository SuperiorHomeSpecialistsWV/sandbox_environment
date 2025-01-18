import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader, FilePlus, FileWarning } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const WarrantyForm = ({ customer, report, products, warrantyEligibility }) => {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const getStructureType = () => {
    if (!report) return 'single-family';
    const type = report.StructureType?.toLowerCase() || '';
    if (type.includes('commercial')) return 'commercial';
    if (type.includes('multi')) return 'multi-family';
    if (type.includes('condo')) return 'condo/hoa';
    return 'single-family';
  };

  const formatDate = (date) => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const generateFormData = () => {
    return {
      structure_type: getStructureType(),
      building_address: {
        buildingName: customer?.['Building Name'] || '',
        streetAddress: customer?.Street || '',
        city: customer?.City || '',
        state: customer?.State || 'WV',
        zipCode: customer?.Zip || '',
        buildingDetails: report?.StructureType || ''
      },
      owner_info: {
        contactPerson: {
          firstName: customer?.['First Name'] || '',
          lastName: customer?.['Last Name'] || '',
          phoneNumber: customer?.['Mobile Phone'] || '',
          email: customer?.Email || ''
        }
      },
      project_details: {
        dateOfInstallation: formatDate(new Date()),
        steepSlopeSq: report?.['Total Squares'] || '0',
        totalCost: products?.reduce((sum, item) => 
          sum + (item.Quantity * item.Price), 0) || 0
      },
      product_info: {
        shingles: products?.filter(p => p.ItemNumber.startsWith('02GASTZ3')) || [],
        accessories: {
          leakBarrier: products?.filter(p => p.ItemNumber.startsWith('11GA')) || [],
          starterStrips: products?.filter(p => p.ItemNumber.startsWith('04GA')) || [],
          ridgeCaps: products?.filter(p => 
            p.ItemNumber.startsWith('04GASR2') || 
            p.ItemNumber.startsWith('04GATX')
          ) || [],
          ventilation: products?.filter(p => p.ItemNumber.startsWith('17GA')) || []
        }
      },
      warranty_type: warrantyEligibility?.goldenPledgeEligible ? 'golden-pledge' :
                    warrantyEligibility?.silverPledgeEligible ? 'silver-pledge' :
                    warrantyEligibility?.systemPlusEligible ? 'system-plus' :
                    'standard'
    };
  };

  const generateReport = async () => {
    try {
      setGenerating(true);
      setError(null);

      const formData = generateFormData();
      const blob = new Blob([JSON.stringify(formData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `warranty-${customer?.Customer}-${formatDate(new Date())}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (err) {
      setError('Error generating warranty report: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  if (!customer || !products || !warrantyEligibility) {
    return (
      <Alert variant="warning">
        <FileWarning className="h-4 w-4" />
        <AlertTitle>Cannot Generate Report</AlertTitle>
        <AlertDescription>
          Please select a customer and ensure product information is available.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Warranty Report Generator</h2>
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
              Generate Report
            </>
          )}
        </button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="font-semibold">Report Preview</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Structure Type:</label>
            <p>{getStructureType()}</p>
          </div>
          
          <div>
            <label className="font-medium">Installation Date:</label>
            <p>{formatDate(new Date())}</p>
          </div>
          
          <div>
            <label className="font-medium">Eligible Warranty:</label>
            <p className="capitalize">
              {warrantyEligibility?.goldenPledgeEligible ? 'Golden Pledge®' :
               warrantyEligibility?.silverPledgeEligible ? 'Silver Pledge™' :
               warrantyEligibility?.systemPlusEligible ? 'System Plus' :
               'Standard Limited'} Warranty
            </p>
          </div>
          
          <div>
            <label className="font-medium">Total Products:</label>
            <p>{products?.length || 0} items</p>
          </div>
        </div>

        <div className="mt-4">
          <label className="font-medium">Products Overview:</label>
          <div className="mt-2 grid grid-cols-1 gap-2">
            {products?.map((product, index) => (
              <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                {product.Description} (x{product.Quantity})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const WarrantyGenerator = () => {
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

  const MOCK_DATA = {
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
        Street: "123 Main St",
        City: "Charleston",
        "State/Province": "WV",
        Zip: 25301,
        Address: "123 Main St, Charleston, WV 25301"
      }
    ],
    supplierInvoices: [
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
  };

  // State
  const [data, setData] = useState(MOCK_DATA);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const newErrors = [];

      try {
        setErrors([{
          title: "Using Demo Data",
          description: "Using sample data for demonstration. Live data connection not available."
        }]);
        setData(MOCK_DATA);
      } catch (error) {
        newErrors.push({
          title: "Data Loading Error",
          description: error.message
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
      
      {errors.map((error, index) => (
        <Alert 
          key={index}
          variant={error.title === "Using Demo Data" ? "warning" : "destructive"}
          className={error.title === "Using Demo Data" ? "bg-amber-50" : ""}
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{error.title}</AlertTitle>
          <AlertDescription>{error.description}</AlertDescription>
        </Alert>
      ))}

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
          <h2 className="text-xl font-semibold mb-4">2