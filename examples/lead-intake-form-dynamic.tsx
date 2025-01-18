import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Save, AlertCircle } from 'lucide-react';

const LeadIntakeForm = () => {
  const [formData, setFormData] = useState({
    // ... other fields remain the same ...
    productInterest: [],
    gutterCleaningFrequency: '',
    productAges: {
      siding: '',
      gutters: '',
      roof: '',
    }
  });

  const PRODUCTS = [
    'Gutters',
    'Gutter Guards',
    'Shingle Roofing',
    'Metal Roofing',
    'Soffit',
    'Fascia',
    'Siding'
  ];

  // Helper function to check if a specific product is selected
  const isProductSelected = (product) => {
    return formData.productInterest.includes(product);
  };

  // Handle product interest changes
  const handleProductInterestChange = (product) => {
    const updatedInterest = formData.productInterest.includes(product)
      ? formData.productInterest.filter(p => p !== product)
      : [...formData.productInterest, product];
    
    setFormData(prev => ({
      ...prev,
      productInterest: updatedInterest,
      // Reset related fields if product is deselected
      gutterCleaningFrequency: !updatedInterest.includes('Gutter Guards') ? '' : prev.gutterCleaningFrequency,
      productAges: {
        ...prev.productAges,
        siding: !updatedInterest.includes('Siding') ? '' : prev.productAges.siding,
        roof: !updatedInterest.includes('Shingle Roofing') && !updatedInterest.includes('Metal Roofing') 
          ? '' : prev.productAges.roof,
        gutters: !updatedInterest.includes('Gutters') ? '' : prev.productAges.gutters
      }
    }));
  };

  // Modified product age section based on interests
  const renderProductAgeFields = () => {
    return (
      <div className="space-y-4">
        {(isProductSelected('Shingle Roofing') || isProductSelected('Metal Roofing')) && (
          <div>
            <label className="block text-sm font-medium mb-1">Current Roof Age (Years)</label>
            <input
              type="number"
              value={formData.productAges.roof}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                productAges: { ...prev.productAges, roof: e.target.value }
              }))}
              className="w-full p-2 border rounded-md"
            />
          </div>
        )}
        
        {isProductSelected('Siding') && (
          <div>
            <label className="block text-sm font-medium mb-1">Current Siding Age (Years)</label>
            <input
              type="number"
              value={formData.productAges.siding}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                productAges: { ...prev.productAges, siding: e.target.value }
              }))}
              className="w-full p-2 border rounded-md"
            />
          </div>
        )}
        
        {isProductSelected('Gutters') && (
          <div>
            <label className="block text-sm font-medium mb-1">Current Gutters Age (Years)</label>
            <input
              type="number"
              value={formData.productAges.gutters}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                productAges: { ...prev.productAges, gutters: e.target.value }
              }))}
              className="w-full p-2 border rounded-md"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card className="bg-white">
        {/* ... Header section remains the same ... */}
        
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-x-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* ... Contact Information section remains the same ... */}
              {/* ... Address Information section remains the same ... */}
              {/* ... Marketing Source section remains the same ... */}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Product Interest - Now with Siding */}
              <section>
                <h3 className="text-lg font-semibold mb-4 bg-gray-50 p-2">Product Interest</h3>
                <div className="grid grid-cols-2 gap-4">
                  {PRODUCTS.map((product) => (
                    <label 
                      key={product} 
                      className={`flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 
                        ${formData.productInterest.includes(product) ? 'bg-blue-50 border-blue-200' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.productInterest.includes(product)}
                        onChange={() => handleProductInterestChange(product)}
                        className="w-4 h-4"
                      />
                      <span>{product}</span>
                    </label>
                  ))}
                </div>
              </section>

              {/* Dynamic Property Details */}
              <section>
                <h3 className="text-lg font-semibold mb-4 bg-gray-50 p-2">Property Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">House Height*</label>
                    <select
                      name="houseHeight"
                      value={formData.houseHeight}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select Height</option>
                      <option value="1">1 Story</option>
                      <option value="2">2 Stories</option>
                      <option value="3">3 Stories</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Roof Type*</label>
                    <select
                      name="currentRoofType"
                      value={formData.currentRoofType}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select Type</option>
                      <option value="asphalt">Asphalt Shingles</option>
                      <option value="metal">Metal</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Gutter Cleaning Frequency - Only shown if Gutter Guards is selected */}
                {isProductSelected('Gutter Guards') && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Gutter Cleaning Frequency</label>
                    <select
                      name="gutterCleaningFrequency"
                      value={formData.gutterCleaningFrequency}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select Frequency</option>
                      <option value="1">Once per year</option>
                      <option value="2">Twice per year</option>
                      <option value="3">Three times or more</option>
                      <option value="0">Never</option>
                    </select>
                  </div>
                )}

                {/* Dynamic Product Age Fields */}
                <div className="mt-4">
                  {renderProductAgeFields()}
                </div>
              </section>

              {/* ... Notes and Additional Information section remains the same ... */}
            </div>
          </div>

          {/* ... Form Actions remain the same ... */}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadIntakeForm;
