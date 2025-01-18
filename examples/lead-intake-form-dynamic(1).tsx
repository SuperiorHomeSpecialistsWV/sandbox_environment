import React from 'react';

const PRODUCTS = [
  'Gutters',
  'Gutter Guards',
  'Shingle Roofing',
  'Metal Roofing',
  'Soffit',
  'Fascia',
  'Siding'
];

export default function LeadIntakeForm() {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    primaryPhone: '',
    secondaryPhone: '',
    email: '',
    siteAddress: '',
    siteCity: '',
    siteState: 'WV',
    siteZip: '',
    productInterest: [],
    houseHeight: '',
    currentRoofType: '',
    gutterCleaningFrequency: '',
    marketingSource: '',
    gpsDirections: '',
    additionalNotes: '',
    productAges: {
      siding: '',
      gutters: '',
      roof: ''
    }
  });

  const [isDirty, setIsDirty] = React.useState(false);
  const [lastSaved, setLastSaved] = React.useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const isProductSelected = (product) => formData.productInterest.includes(product);

  const handleProductInterestChange = (product) => {
    const updatedInterest = formData.productInterest.includes(product)
      ? formData.productInterest.filter(p => p !== product)
      : [...formData.productInterest, product];
    
    setFormData(prev => ({
      ...prev,
      productInterest: updatedInterest,
      gutterCleaningFrequency: !updatedInterest.includes('Gutter Guards') ? '' : prev.gutterCleaningFrequency
    }));
    setIsDirty(true);
  };

  const handleProductAgeChange = (product, value) => {
    setFormData(prev => ({
      ...prev,
      productAges: { ...prev.productAges, [product]: value }
    }));
    setIsDirty(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="border-b p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">New Lead Intake</h1>
            <div className="flex items-center gap-4">
              {isDirty && <span className="text-orange-500 text-sm">Unsaved changes</span>}
              {lastSaved && (
                <span className="text-gray-500 text-sm">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}
              <button 
                onClick={() => {
                  setLastSaved(new Date());
                  setIsDirty(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-4 bg-gray-50 p-2">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name*</label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name*</label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Primary Phone*</label>
                  <input
                    name="primaryPhone"
                    value={formData.primaryPhone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Secondary Phone</label>
                  <input
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

            <section>
              <h3 className="text-lg font-semibold mb-4 bg-gray-50 p-2">Site Address</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Street Address*</label>
                  <input
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
                      name="siteCity"
                      value={formData.siteCity}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <input
                      value="WV"
                      readOnly
                      className="w-full p-2 border rounded-md bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">ZIP*</label>
                    <input
                      name="siteZip"
                      value={formData.siteZip}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>
            </section>

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

          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-4 bg-gray-50 p-2">Product Interest</h3>
              <div className="grid grid-cols-2 gap-4">
                {PRODUCTS.map((product) => (
                  <label 
                    key={product}
                    className={`flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 
                      ${isProductSelected(product) ? 'bg-blue-50 border-blue-200' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isProductSelected(product)}
                      onChange={() => handleProductInterestChange(product)}
                      className="w-4 h-4"
                    />
                    <span>{product}</span>
                  </label>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4 bg-gray-50 p-2">Property Details</h3>
              <div className="space-y-4">
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

                {isProductSelected('Gutter Guards') && (
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
                )}

                {isProductSelected('Siding') && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Siding Age (Years)</label>
                    <input
                      type="number"
                      value={formData.productAges.siding}
                      onChange={(e) => handleProductAgeChange('siding', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                )}

                {(isProductSelected('Shingle Roofing') || isProductSelected('Metal Roofing')) && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Roof Age (Years)</label>
                    <input
                      type="number"
                      value={formData.productAges.roof}
                      onChange={(e) => handleProductAgeChange('roof', e.target.value)}
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
                      onChange={(e) => handleProductAgeChange('gutters', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4 bg-gray-50 p-2">Additional Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">GPS Directions/House Description</label>
                  <textarea
                    name="gpsDirections"
                    value={formData.gpsDirections}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md h-24"
                    placeholder="Enter any special directions or house identifiers..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Additional Notes</label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md h-24"
                    placeholder="Enter any additional notes or important information..."
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
