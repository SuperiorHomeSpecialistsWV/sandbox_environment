import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const CompleteProductMapping = () => {
  const mappings = [
    {
      category: "Timberline® Shingles",
      description: "Premium architectural shingles with LayerLock technology",
      subCategories: [
        {
          name: "Timberline HDZ®",
          description: "America's #1-selling shingle with LayerLock technology",
          products: [
            {
              supplier: "GAF SG TIMB HDZ WEATHERED WOOD 3/S",
              official: "GAF Timberline HDZ Weathered Wood",
              price: "$42.68",
              unit: "BD - Bundle",
              features: ["LayerLock Technology", "StainGuard Plus", "WindProven Limited Warranty"]
            }
          ]
        }
      ]
    },
    {
      category: "Designer Lifetime Shingles",
      description: "Premium designer shingles with unique architectural styles",
      subCategories: [
        {
          name: "Grand Canyon®",
          description: "Ultra-premium wood-shake look",
          products: [
            {
              supplier: "GAF GRAND CANYON STORM CLOUD GRAY",
              official: "GAF Grand Canyon Storm Cloud Gray",
              price: "Premium",
              unit: "BD - Bundle",
              features: ["StainGuard Plus Protection", "Ultra-Premium Design", "Lifetime Limited Warranty"]
            }
          ]
        },
        {
          name: "Camelot® II",
          description: "Luxury slate appearance",
          products: [
            {
              supplier: "GAF CAMELOT II ANTIQUE SLATE",
              official: "GAF Camelot II Antique Slate",
              price: "Premium",
              unit: "BD - Bundle",
              features: ["StainGuard Plus Protection", "Artisan-Crafted Shapes", "Lifetime Limited Warranty"]
            }
          ]
        }
      ]
    },
    {
      category: "Specialty Roofing Systems",
      description: "Specialized roofing solutions for specific applications",
      subCategories: [
        {
          name: "LIBERTY™ Self-Adhering System",
          description: "Low-slope roofing solution",
          products: [
            {
              supplier: "GAF LIBERTY SBS SA CAP SHEET SHAKEW",
              official: "GAF Liberty SBS Self-Adhering Cap Sheet Shakewood",
              price: "$133.99",
              unit: "RL - Roll",
              features: ["Self-Adhering", "Low-Slope Application", "No Torch Required"]
            }
          ]
        },
        {
          name: "ThermaCal® Panels",
          description: "Roof insulation panels",
          products: [
            {
              supplier: "THERMACAL NAIL BASE ROOF INSULATION",
              official: "GAF ThermaCal® Nail Base Roof Insulation",
              price: "Special Order",
              unit: "SH - Sheet",
              features: ["Ventilated Design", "Energy Efficient", "Moisture Control"]
            }
          ]
        }
      ]
    },
    {
      category: "Building Envelope Solutions",
      description: "Complete building protection systems",
      subCategories: [
        {
          name: "WeatherSide™ Siding",
          description: "Fiber-cement siding replacement solution",
          products: [
            {
              supplier: "WEATHERSIDE PURITY FIBER CEMENT",
              official: "GAF WeatherSide™ Purity™ Fiber-Cement Siding",
              price: "Special Order",
              unit: "PC - Piece",
              features: ["Asbestos-Free", "Fiber-Cement Construction", "Multiple Profiles"]
            }
          ]
        },
        {
          name: "Master Flow® Ventilation",
          description: "Advanced attic ventilation solutions",
          products: [
            {
              supplier: "GAF MASTER FLOW GREEN MACHINE SOLAR VENT",
              official: "GAF Master Flow® Green Machine Solar-Powered Roof Vent",
              price: "$387.99",
              unit: "EA - Each",
              features: ["Solar Powered", "High Efficiency", "Smart Controls"]
            }
          ]
        }
      ]
    }
  ];

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Complete GAF Product Line Mapping (Including Special Order Items)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {mappings.map((category, idx) => (
            <div key={idx} className="border rounded-lg p-6">
              <div className="space-y-4">
                {/* Category Header */}
                <div className="border-b pb-4">
                  <h2 className="text-xl font-bold text-blue-700">{category.category}</h2>
                  <p className="text-gray-600 mt-1">{category.description}</p>
                </div>

                {/* Subcategories */}
                <div className="grid gap-6">
                  {category.subCategories.map((subCat, subIdx) => (
                    <div key={subIdx} className="border rounded p-4 bg-gray-50">
                      <h3 className="text-lg font-semibold text-blue-600 mb-2">{subCat.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{subCat.description}</p>

                      {/* Products */}
                      <div className="space-y-3">
                        {subCat.products.map((product, pIdx) => (
                          <div key={pIdx} className="border rounded bg-white p-4">
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
                              <div className="flex flex-wrap gap-2 mt-2">
                                {product.features.map((feature, fIdx) => (
                                  <span key={fIdx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                    {feature}
                                  </span>
                                ))}
                              </div>
                              {product.price === "Special Order" && (
                                <div className="mt-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Special Order Item
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompleteProductMapping;