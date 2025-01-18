import React, { useState, useEffect } from 'react';
import { AlertCircle, MapPin, Phone, Mail, Home, Info } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const LeadIntakeForm = () => {
  const [formData, setFormData] = useState({
    // Contact Details
    firstName: '',
    lastName: '',
    primaryPhone: '',
    secondaryPhone: '',
    email: '',
    
    // Address Information
    siteAddress: '',
    siteCity: '',
    siteState: 'WV',
    siteZip: '',
    useAltMailing: false,
    mailingAddress: '',
    mailingCity: '',
    mailingState: '',
    mailingZip: '',
    
    // Property Details
    houseHeight: '',
    currentRoofType: '',
    gutterCleaningFrequency: '',
    productAge: '',
    
    // Project Interest
    productInterest: [],
    
    // Source and Notes
    marketingSource: '',
    gpsDirections: '',
    houseDescription: '',
    additionalNotes: '',
  });

  const [activeSection, setActiveSection] = useState('contact');
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Auto-save functionality
  useEffect(() => {
    if (isDirty) {
      const saveTimer = setTimeout(() => {
        handleAutoSave();
      }, 3000);
      return () => clearTimeout(saveTimer);
    }
  }, [formData, isDirty]);

  const handleAutoSave = () => {
    // Simulate save to backend
    console.log('Auto-saving...', formData);
    setLastSaved(new Date());
    setIsDirty(false);
  };

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
    <div className="w-full max-w-3xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">New Lead Intake</CardTitle>
          {lastSaved && (
            <div className="text-sm text-gray-500">
              Last saved: {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {/* Progress Navigation */}
          <div className="flex mb-6 border-b">
            <button
              className={`px-4 py-2 ${activeSection === 'contact' ? 'border-b-2 border-blue-500 text-blue-600' : ''}`}
              onClick={() => setActiveSection('contact')}
            >
              Contact
            </button>
            <button
              className={`px-4 py-2 ${activeSection === 'property' ? 'border-b-2 border-blue-500 text-blue-600' : ''}`}
              onClick={() => setActiveSection('property')}
            >
              Property
            </button>
            <button
              className={`px-4 py-2 ${activeSection === 'project' ? 'border-b-2 border-blue-500 text-blue-600' : ''}`}
              onClick={() => setActiveSection('project')}
            >
              Project
            </button>
            <button
              className={`px-4 py-2 ${activeSection === 'notes' ? 'border-b-2 border-blue-500 text-blue-600' : ''}`}
              onClick={() => setActiveSection('notes')}
            >
              Notes
            </button>
          </div>

          {/* Contact Information Section */}
          {activeSection === 'contact' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Primary Phone</label>
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
                <div className="md:col-span-2">
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

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Site Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Street Address</label>
                    <input
                      type="text"
                      name="siteAddress"
                      value={formData.siteAddress}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input
                      type="text"
                      name="siteCity"
                      value={formData.siteCity}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">State</label>
                      <input
                        type="text"
                        name="siteState"
                        value={formData.siteState}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">ZIP</label>
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
              </div>
            </div>
          )}

          {/* Property Details Section */}
          {activeSection === 'property' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">House Height</label>
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
                  <label className="block text-sm font-medium mb-1">Current Roof Type</label>
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
            </div>
          )}

          {/* Project Interest Section */}
          {activeSection === 'project' && (
            <div className="space-y-4">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Product Interest</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['Gutters', 'Gutter Guards', 'Shingle Roofing', 'Metal Roofing', 'Soffit', 'Fascia'].map((product) => (
                    <label key={product} className="flex items-center space-x-2">
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
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Marketing Source</label>
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
            </div>
          )}

          {/* Notes Section */}
          {activeSection === 'notes' && (
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
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              className="px-4 py-2 bg-gray-100 rounded-md"
              onClick={() => {
                const sections = ['contact', 'property', 'project', 'notes'];
                const currentIndex = sections.indexOf(activeSection);
                if (currentIndex > 0) {
                  setActiveSection(sections[currentIndex - 1]);
                }
              }}
            >
              Previous
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
              onClick={() => {
                const sections = ['contact', 'property', 'project', 'notes'];
                const currentIndex = sections.indexOf(activeSection);
                if (currentIndex < sections.length - 1) {
                  setActiveSection(sections[currentIndex + 1]);
                } else {
                  // Handle form submission
                  console.log('Form submitted:', formData);
                }
              }}
            >
              {activeSection === 'notes' ? 'Submit' : 'Next'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadIntakeForm;
