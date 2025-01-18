import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const GafProductLines = () => {
  const productLines = [
    {
      category: "Liberty SBS (Self-Adhered Modified Bitumen)",
      description: "Premium self-adhering roofing system for low-slope applications",
      products: [
        {
          name: "GAF LIBERTY SBS SA CAP SHEET SHAKEW",
          type: "Cap Sheet",
          features: ["Self-Adhering", "Shakewood Color", "Premium Finish"]
        },
        {
          name: "GAF LIBERTY SBS SA BASE SHEET SMTH",
          type: "Base Sheet",
          features: ["Self-Adhering", "Smooth Surface", "Foundation Layer"]
        }
      ]
    },
    {
      category: "Weather Protection",
      description: "Underlayment and weather barrier products",
      products: [
        {
          name: "GAF WEATHERWATCH 36\"X66.7' 2SQ/RL",
          type: "Ice & Water Shield",
          features: ["2 Square Coverage", "Self-Adhesive", "Waterproof Membrane"]
        }
      ]
    },
    {
      category: "Ventilation Solutions",
      description: "Advanced roof ventilation products",
      products: [
        {
          name: "GAF 12\" COBRA SNOW COUNTRY 4' ADV",
          type: "Ridge Vent",
          features: ["Snow Guard Design", "4 Foot Sections", "Weather Protection"]
        }
      ]
    },
    {
      category: "Starter Strip Shingles",
      description: "Pre-cut starter strips for roof edges",
      products: [
        {
          name: "GAF SG S-A-R WILLIMSBURG SLATE 25LF",
          type: "Seal-A-Ridge",
          features: ["25 Linear Feet", "Williamsburg Slate Color", "Pre-cut Design"]
        },
        {
          name: "GAF SG S-A-R WEATHEREDWOOD 25LF",
          type: "Seal-A-Ridge",
          features: ["25 Linear Feet", "Weathered Wood Color", "Pre-cut Design"]
        },
        {
          name: "GAF SG S-A-R SHAKEWOOD 25LF",
          type: "Seal-A-Ridge",
          features: ["25 Linear Feet", "Shakewood Color", "Pre-cut Design"]
        }
      ]
    },
    {
      category: "Roof Deck Protection",
      description: "Synthetic underlayment for enhanced protection",
      products: [
        {
          name: "GAF FELTBUSTER SYN ROOF FELT 10SQ",
          type: "Synthetic Underlayment",
          features: ["10 Square Coverage", "Synthetic Material", "Enhanced Durability"]
        }
      ]
    },
    {
      category: "Accessories",
      description: "Complementary roofing components",
      products: [
        {
          name: "GAF SSB960A ALUM SLANT BACK BROWN",
          type: "Ventilation",
          features: ["Aluminum Construction", "Brown Finish", "Slant Back Design"]
        },
        {
          name: "GAF SSB960A ALUM SLANT BACK BLACK",
          type: "Ventilation",
          features: ["Aluminum Construction", "Black Finish", "Slant Back Design"]
        }
      ]
    }
  ];

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>GAF Product Lines Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {productLines.map((line, idx) => (
            <div key={idx} className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="text-lg font-semibold text-blue-600">{line.category}</h3>
                <p className="text-sm text-gray-600">{line.description}</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {line.products.map((product, pidx) => (
                  <div key={pidx} className="border rounded-lg p-4 bg-gray-50">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">{product.name}</div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Type: </span>
                        {product.type}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.features.map((feature, fidx) => (
                          <span 
                            key={fidx}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GafProductLines;