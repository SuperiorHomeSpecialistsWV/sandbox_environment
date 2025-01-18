import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ProductMapping = () => {
  const mappings = [
    {
      category: "Shingles",
      products: [
        {
          supplier: "GAF SG TIMB HDZ CHARCOAL 3/S",
          official: "GAF Timberline High Definition Shingles Charcoal 3 Bundle Per Square",
          price: "$42.68",
          unit: "BD - Bundle"
        },
        {
          supplier: "GAF FELTBUSTER SYN ROOF FELT 10SQ",
          official: "GAF Feltbuster Synthetic Roofing Felt 10 Square",
          price: "$114.00",
          unit: "RL - Roll"
        },
        {
          supplier: "GAF WEATHERWATCH 36\"X66.7' 2SQ/RL",
          official: "GAF Weatherwatch 36\" X 66.7' 2 Square Per Roll",
          price: "$104.50",
          unit: "RL - Roll"
        }
      ]
    },
    {
      category: "Accessories",
      products: [
        {
          supplier: "GAF SSB960A ALUM SLANT BACK BLACK",
          official: "GAF #SSB960A Aluminum Slant Back Black",
          price: "$22.99",
          unit: "EA - Each"
        },
        {
          supplier: "GAF PRO-START STARTER 120.33LF",
          official: "GAF Pro-Start Starter 120.33 Linear Feet Per Bundle",
          price: "$67.60",
          unit: "BD - Bundle"
        }
      ]
    }
  ];

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>GAF Product Mapping</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mappings.map((category, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-600">{category.category}</h3>
              <div className="space-y-4">
                {category.products.map((product, pidx) => (
                  <div key={pidx} className="border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 gap-2">
                      <div className="text-sm">
                        <span className="font-medium">Supplier Description: </span>
                        <span className="text-gray-600">{product.supplier}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Official GAF Product: </span>
                        <span className="text-gray-600">{product.official}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Price: </span>
                        <span className="text-green-600">{product.price}</span>
                        <span className="text-gray-500 ml-2">per {product.unit}</span>
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

export default ProductMapping;