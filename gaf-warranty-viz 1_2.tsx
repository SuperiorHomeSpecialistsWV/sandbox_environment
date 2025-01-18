import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const GAFWarrantyVisualizer = () => {
  const [selectedWarranty, setSelectedWarranty] = useState('windproven');
  
  const warranties = {
    windproven: {
      name: "WindProven™ Limited Wind Warranty",
      requirements: [
        "LayerLock® Technology Shingles",
        "4 Qualifying Accessories",
        "No contractor certification required",
        "No maximum wind speed limitation"
      ],
      components: {
        shingles: [
          "Timberline HDZ®",
          "Timberline® UHDZ™",
          "Timberline® AS II",
          "Timberline® CS",
          "Timberline HDZ® RS",
          "Timberline HDZ® RS+"
        ],
        accessories: [
          {
            category: "Starter Strip Shingles",
            options: ["WeatherBlocker™", "Pro-Start®", "QuickStart®"]
          },
          {
            category: "Roof Deck Protection",
            options: ["Deck-Armor™", "Tiger Paw™", "FeltBuster®", "VersaShield®", "Shingle-Mate™"]
          },
          {
            category: "Ridge Cap Shingles",
            options: ["TimberTex®", "TimberCrest®", "Ridglass®", "Seal-A-Ridge®", "Z®Ridge"]
          },
          {
            category: "Choose ONE: Leak Barrier OR Attic Ventilation",
            options: [
              "StormGuard®",
              "WeatherWatch®",
              "Extended Dry-in Membrane",
              "Any Cobra® product",
              "Any Master Flow® product"
            ]
          }
        ]
      }
    },
    systemplus: {
      name: "System Plus Limited Warranty",
      requirements: [
        "Any GAF Lifetime Shingle",
        "3 Qualifying Accessories",
        "GAF Certified™ or Master Elite® Contractor required"
      ]
    },
    golden: {
      name: "Golden Pledge® Limited Warranty",
      requirements: [
        "Any GAF Lifetime Shingle",
        "5 Qualifying Accessories (one from each category)",
        "GAF Master Elite® Contractor required",
        "Installation inspection required"
      ]
    }
  };

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader className="border-b">
        <CardTitle className="flex justify-between items-center">
          <span>GAF Roofing System Warranty Requirements</span>
          <div className="flex gap-2">
            {Object.keys(warranties).map(key => (
              <button
                key={key}
                onClick={() => setSelectedWarranty(key)}
                className={`px-4 py-2 rounded ${
                  selectedWarranty === key 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {warranties[key].name.split(' ')[0]}
              </button>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Warranty Details */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-xl font-bold text-blue-800 mb-4">
              {warranties[selectedWarranty].name}
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              {warranties[selectedWarranty].requirements.map((req, idx) => (
                <li key={idx} className="text-blue-700">{req}</li>
              ))}
            </ul>
          </div>

          {/* Components Section */}
          {warranties[selectedWarranty].components && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Shingles */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 text-blue-700">
                  Qualifying LayerLock® Shingles
                </h3>
                <ul className="space-y-2">
                  {warranties[selectedWarranty].components.shingles.map((shingle, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      {shingle}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Accessories */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 text-blue-700">
                  Required Accessories
                </h3>
                <div className="space-y-4">
                  {warranties[selectedWarranty].components.accessories.map((acc, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded">
                      <div className="font-medium mb-2">{acc.category}</div>
                      <ul className="space-y-1 text-sm">
                        {acc.options.map((opt, optIdx) => (
                          <li key={optIdx} className="text-gray-600">{opt}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Warranty Notes */}
          <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded">
            <p className="font-medium mb-2">Important Notes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>All products must be GAF manufactured</li>
              <li>Must be installed according to GAF specifications</li>
              <li>Registration required for enhanced warranties</li>
              <li>Inspection may be required for certain warranty levels</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GAFWarrantyVisualizer;