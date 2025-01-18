import React, { useState } from 'react';
import { AlertCircle, Download, FilePlus, FileWarning, Loader } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const WarrantyFormGenerator = ({ 
  customer, 
  report, 
  products, 
  warrantyEligibility 
}) => {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  // Map structure type to form options
  const getStructureType = () => {
    if (!report) return 'single-family';
    const type = report.StructureType?.toLowerCase() || '';
    if (type.includes('commercial')) return 'commercial';
    if (type.includes('multi')) return 'multi-family';
    if (type.includes('condo')) return 'condo/hoa';
    return 'single-family';
  };

  // Format date for warranty form
  const formatDate = (date) => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Generate warranty form data
  const generateFormData = () => {
    return {
      // Structure Info
      structure_type: getStructureType(),
      
      // Building Address
      building_address: {
        buildingName: customer?.['Building Name'] || '',
        streetAddress: customer?.Street || '',
        city: customer?.City || '',
        state: customer?.State || 'WV',
        zipCode: customer?.Zip || '',
        buildingDetails: report?.StructureType || ''
      },
      
      // Owner Info
      owner_info: {
        contactPerson: {
          firstName: customer?.['First Name'] || '',
          lastName: customer?.['Last Name'] || '',
          phoneNumber: customer?.['Mobile Phone'] || '',
          email: customer?.Email || ''
        }
      },
      
      // Project Details
      project_details: {
        dateOfInstallation: formatDate(new Date()),
        steepSlopeSq: report?.['Total Squares'] || '0',
        totalCost: products?.reduce((sum, item) => 
          sum + (item.Quantity * item.Price), 0) || 0
      },
      
      // Product Info
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
      
      // Warranty Type
      warranty_type: warrantyEligibility?.goldenPledgeEligible ? 'golden-pledge' :
                    warrantyEligibility?.silverPledgeEligible ? 'silver-pledge' :
                    warrantyEligibility?.systemPlusEligible ? 'system-plus' :
                    'standard'
    };
  };

  // Generate and download report
  const generateReport = async () => {
    try {
      setGenerating(true);
      setError(null);

      const formData = generateFormData();
      
      // For now, just download as JSON
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

export default WarrantyFormGenerator;