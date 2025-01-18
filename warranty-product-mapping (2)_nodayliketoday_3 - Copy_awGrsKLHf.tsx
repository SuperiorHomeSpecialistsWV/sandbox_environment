import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const WarrantyProductMapping = () => {
  const warrantyProducts = [
    {
      category: "Qualifying Lifetime† Shingles",
      role: "Base Layer (Required)",
      products: [
        {
          name: "Timberline® Collection",
          variants: [
            {
              supplier: "GAF TIMB ULTRA HDZ SG DUAL SLATE 3S",
              official: "Timberline® UHDZ™",
              features: ["LayerLock Technology", "WindProven™ Eligible"],
              special: "Premium Line"
            },
            {
              supplier: "GAF SG TIMB HDZ CHARCOAL 3/S",
              official: "Timberline HDZ®",
              features: ["LayerLock Technology", "WindProven™ Eligible"]
            },
            {
              supplier: "GAF TIMB HDZ RS",
              official: "Timberline HDZ® RS",
              features: ["LayerLock Technology", "Regional Special"]
            }
          ]
        },
        {
          name: "Designer Lifetime Collection",
          variants: [
            {
              supplier: "GAF GRAND CANYON",
              official: "Grand Canyon®",
              features: ["Premium Design", "Enhanced Warranty Eligible"]
            },
            {
              supplier: "GAF CAMELOT II",
              official: "Camelot® II",
              features: ["Premium Design", "Enhanced Warranty Eligible"]
            },
            {
              supplier: "GAF WOODLAND",
              official: "Woodland®",
              features: ["Premium Design", "Enhanced Warranty Eligible"]
            }
          ]
        }
      ]
    },
    {
      category: "Leak Barriers",
      role: "Component 1",
      products: [
        {
          name: "Primary Barriers",
          variants: [
            {
              supplier: "GAF STORMGUARD ROLL",
              official: "StormGuard®",
              features: ["Film-Surfaced", "Premium Protection"]
            },
            {
              supplier: "GAF WEATHERWATCH ROLL",
              official: "WeatherWatch®",
              features: ["Mineral-Surfaced", "Standard Protection"]
            }
          ]
        }
      ]
    },
    {
      category: "Roof Deck Protection",
      role: "Component 2",
      products: [
        {
          name: "Synthetic Underlayments",
          variants: [
            {
              supplier: "GAF DECK ARMOR ROLL",
              official: "Deck-Armor™",
              features: ["Premium", "Breathable"]
            },
            {
              supplier: "GAF TIGER PAW ROLL",
              official: "Tiger Paw™",
              features: ["High Performance", "Non-Breathable"]
            },
            {
              supplier: "GAF FELTBUSTER SYN ROOF FELT 10SQ",
              official: "FeltBuster®",
              features: ["Value Option", "Synthetic"]
            }
          ]
        }
      ]
    },
    {
      category: "Starter Strip Shingles",
      role: "Component 3",
      products: [
        {
          name: "Premium Starters",
          variants: [
            {
              supplier: "GAF WEATHERBLOCKER STARTER",
              official: "WeatherBlocker™",
              features: ["Premium Protection", "Enhanced Installation"]
            },
            {
              supplier: "GAF PRO-START STARTER 120.33LF",
              official: "Pro-Start®",
              features: ["Standard Protection", "Professional Grade"]
            }
          ]
        }
      ]
    },
    {
      category: "Attic Ventilation",
      role: "Component 5 (Alternative)",
      products: [
        {
          name: "Cobra® Ventilation",
          variants: [
            {
              supplier: "GAF COBRA SNOW COUNTRY ADV",
              official: "Cobra® SnowCountry® Advanced",
              features: ["Premium Snow Protection", "Enhanced Airflow"]
            },
            {
              supplier: "GAF COBRA RIDGE RUNNER",
              official: "Cobra® RidgeRunner®",
              features: ["All Climate", "Standard Airflow"]
            }
          ]
        },
        {
          name: "Master Flow® Products",
          variants: [
            {
              supplier: "GAF MASTER FLOW GREEN MACHINE SOLAR",
              official: "Master Flow® GreenMachine™ Series",
              features: ["Solar Powered", "Energy Efficient", "Smart Controls"]
            }
          ]
        }
      ]
    },
    {
      category: "Ridge Cap Shingles",
      role: "Component 6",
      products: [
        {
          name: "Premium Ridge Caps",
          variants: [
            {
              supplier: "GAF SG TIMBERTEX",
              official: "TimberTex®",
              features: ["Premium Design", "Enhanced Protection"]
            },
            {
              supplier: "GAF SEAL A RIDGE",
              official: "Seal-A-Ridge®",
              features: ["Standard Protection", "Color Match"]
            }
          ]
        }
      ]
    }
  ];

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>GAF Warranty-Eligible Product Mapping</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {warrantyProducts.map((category, idx) => (
            <div key={idx} className="border rounded-lg p-6">
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-blue-700">{category.category}</h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {category.role}
                    </span>
                  </div>
                </div>

                {category.products.map((productLine, pIdx) => (
                  <div key={pIdx} className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">{productLine.name}</h3>
                    <div className="grid gap-4">
                      {productLine.variants.map((variant, vIdx) => (
                        <div key={vIdx} className="border rounded bg-gray-50 p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <div className="text-sm">
                                <span className="font-medium">Supplier Code: </span>
                                <span className="text-gray-600">{variant.supplier}</span>
                              </div>
                              {variant.special && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                                  {variant.special}
                                </span>
                              )}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Official Product: </span>
                              <span className="text-gray-600">{variant.official}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {variant.features.map((feature, fIdx) => (
                                <span key={fIdx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
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

                {category.category === "Qualifying Lifetime† Shingles" && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      †Lifetime refers to the length of warranty coverage provided and means as long as the original individual owner(s) owns the property where the qualifying GAF products are installed.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WarrantyProductMapping;