import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save, AlertCircle } from 'lucide-react';

const LeadIntakeForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    primaryPhone: '',
    secondaryPhone: '',
    email: '',
    siteAddress: '',
    siteCity: '',
    siteState: 'WV',
    siteZip: '',
    useAltMailing: false,
    mailingAddress: '',
    mailingCity: '',
    mailingState: '',
    mailingZip: '',
    houseHeight: '',
    currentRoofType: '',
    gutterCleaningFrequency: '',
    productAge: '',
    productInterest: [],
    marketingSource: '',
    gpsDirections: '',
    houseDescription: '',
    additionalNotes: '',
  });

  const [lastSaved, setLastSaved] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setIsDirty(true);
  };

  const handleProductInterestChange = (product) => {
    setFormData(prev => ({
      ...prev,
      productInterest: prev.productInterest.includes(product)
        ? prev.productInterest.filter(p => p !== product)
        : [...prev.productInterest, product]
    }));
    setIsDirty(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card className="bg-white">
        <CardHeader className="pb-4 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">New Lead Intake</CardTitle>
            <div className="flex items-center gap-4">
              {isDirty && (
                <span className="text-orange-500 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Unsaved changes
                </span>
              )}
              {lastSaved && (
                <span className="text-gray-500 text-sm">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"
                onClick={() => {
                  setLastSaved(new Date());
                  setIsDirty(false);
                }}
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-x-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Contact Information */}
              <section>
                <h3 className="text-lg font-semibold mb-4 bg-gray-50 p-2">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name*</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name*</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Primary Phone*</label>
                    <input
                      type="tel"
                      name="primaryPhone"
                      value={formData.primaryPhone}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Secondary Phone</label>
                    <input
                      type="tel"
                      name="secondaryPhone"
                      value={formData.secondaryPhone}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
              </section>

              {/* Address Information */}
              <section>
                <h3 className="text-lg font-semibold mb-4 bg-gray-50 p-2">Site Address</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Street Address*</label>
                    <input
                      type="text"
                      name="siteAddress"
                      value={formData.siteAddress}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1">City*</label>
                      <input
                        type="text"
                        name="siteCity"
                        value={formData.siteCity}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">State</label>
                      <input
                        type="text"
                        name="siteState"
                        value={formData.siteState}
                        className="w-full p-2 border rounded-md bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">ZIP*</label>
                      <input
                        type="text"
                        name="siteZip"
                        value={formData.siteZip}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Marketing Source */}
              <section>
                <h3 className="text-lg font-semibold mb-4 bg-gray-50 p-2">Lead Source</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Marketing Source*</label>
                  <select
                    name="marketingSource"
                    value={formData.marketingSource}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select Source</option>
                    <option value="facebook">Facebook</option>
                    <option value="google">Google</option>
                    <option value="referral">Referral</option>
                    <option value="website">Website</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Property Details */}
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
                  <div>
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
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Age (Years)</label>
                    <input
                      type="number"
                      name="productAge"
                      value={formData.productAge}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
              </section>

              {/* Product Interest */}
              <section>
                <h3 className="text-lg font-semibold mb-4 bg-gray-50 p-2">Product Interest</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['Gutters', 'Gutter Guards', 'Shingle Roofing', 'Metal Roofing', 'Soffit', 'Fascia'].map((product) => (
                    <label key={product} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
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

              {/* Notes and Additional Information */}
              <section>
                <h3 className="text-lg font-semibold mb-4 bg-gray-50 p-2">Additional Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">GPS Directions/House Description</label>
                    <textarea
                      name="gpsDirections"
                      value={formData.gpsDirections}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md h-20"
                      placeholder="Enter any special directions or house identifiers..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Additional Notes</label>
                    <textarea
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md h-20"
                      placeholder="Enter any additional notes or important information..."
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex justify-end gap-4 border-t pt-4">
            <button className="px-4 py-2 bg-gray-100 rounded-md">
              Clear Form
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md">
              Submit Lead
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadIntakeForm;
