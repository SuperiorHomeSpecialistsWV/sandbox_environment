import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronRight } from 'lucide-react';

const ProductMapping = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const mappings = [
    {
      category: "Shingles",
      description: "Complete shingle product line with all series and variants",
      subCategories: [
        {
          name: "Timberline Series",
          description: "Premium architectural shingles with LayerLock technology",
          products: [
            {
              name: "Timberline HDZ",
              colors: ["Pewter Gray", "Charcoal", "Barkwood", "Slate", "Oyster Gray", 
                      "Hickory", "Shakewood", "Fox Hollow Gray"],
              features: [
                "LayerLock® Technology",
                "StainGuard Plus™ Protection",
                "StrikeZone® Nailing Area",
                "WindProven™ Limited Wind Warranty"
              ],
              specs: {
                "Technology": "LayerLock®",
                "Stain Protection": "StainGuard Plus™",
                "Nail Zone": "StrikeZone®",
                "Wind Warranty": "WindProven™"
              },
              warranty: ["Lifetime Limited Warranty", "WindProven™ Limited Wind Warranty"]
            },
            {
              name: "Timberline HDZ High Definition",
              colors: ["Appalachian Sky", "Golden Harvest", "Nantucket Morning"],
              features: ["LayerLock Technology", "High Definition Design"],
              warranty: ["Lifetime Limited Warranty", "WindProven™ Limited Wind Warranty"]
            },
            {
              name: "Timberline Ultra HDZ",
              colors: ["Dual Charcoal"],
              features: [
                "LayerLock® Technology",
                "StainGuard Plus PRO™ Protection",
                "StrikeZone® Nailing Area",
                "WindProven™ Limited Wind Warranty",
                "Premium Protection"
              ],
              specs: {
                "Technology": "LayerLock®",
                "Stain Protection": "StainGuard Plus PRO™",
                "Nail Zone": "StrikeZone®",
                "Wind Warranty": "WindProven™"
              },
              warranty: ["Premium Lifetime Warranty", "WindProven™ Limited Wind Warranty"]
            }
          ]
        },
        {
          name: "Designer Series",
          description: "Premium designer architectural shingles",
          products: [
            {
              name: "Grand Canyon",
              colors: ["Black Oak", "Mission Brown", "Stonewood", "Storm Cloud Gray"],
              features: ["Premium Design", "Enhanced Aesthetics"],
              warranty: ["Lifetime Limited Warranty", "StainGuard Plus™ Algae Protection"]
            },
            {
              name: "Camelot II",
              colors: ["Weathered Timber", "Antique Slate", "Charcoal", "Barkwood", "Royal Slate"],
              features: ["Premium Design", "Enhanced Aesthetics"],
              warranty: ["Lifetime Limited Warranty", "StainGuard Plus™ Algae Protection"]
            },
            {
              name: "Grand Sequoia",
              colors: ["Charcoal", "Autumn Brown", "Weathered Wood"],
              features: ["Premium Design", "Enhanced Aesthetics"],
              warranty: ["Lifetime Limited Warranty", "StainGuard Plus™ Algae Protection"]
            },
            {
              name: "Woodland",
              colors: ["Castlewood Gray", "Cedarwood Abbey"],
              features: ["Premium Design", "Enhanced Aesthetics"],
              warranty: ["Lifetime Limited Warranty", "StainGuard Plus™ Algae Protection"]
            },
            {
              name: "Slateline",
              colors: ["Royal Slate", "Antique Slate", "Weathered Slate"],
              features: ["Premium Design", "Enhanced Aesthetics"],
              warranty: ["Lifetime Limited Warranty", "StainGuard Plus™ Algae Protection"]
            }
          ]
        },
        {
          name: "SBS Modified Series",
          description: "Impact-resistant architectural shingles",
          products: [
            {
              name: "Timberline AS II",
              colors: ["Charcoal", "Hickory", "Adobe Sunset", "Pewter Gray", 
                      "Barkwood", "Shakewood", "Slate", "Weathered Wood"],
              features: [
                "SBS Modified IR Technology",
                "UL 2218 Class 4 Impact Rating",
                "StainGuard Plus™ Protection"
              ],
              specs: {
                "Technology": "SBS Modified IR",
                "Impact Rating": "Class 4",
                "Stain Protection": "StainGuard Plus™"
              },
              warranty: ["Lifetime Limited Warranty", "UL 2218 Class 4 Impact Resistance"]
            },
            {
              name: "Grand Sequoia AS",
              colors: ["Charcoal", "Dusky Gray", "Weathered Wood"],
              features: ["Impact Resistance", "SBS Modified"],
              warranty: ["Lifetime Limited Warranty", "UL 2218 Class 4 Impact Resistance"]
            }
          ]
        },
        {
          name: "3-Tab Series",
          description: "Traditional three-tab shingles",
          products: [
            {
              name: "3-Tab Shingles",
              colors: ["Autumn Brown", "Charcoal", "Golden Cedar", "Silver Lining", 
                      "Weathered Gray", "White", "Ash Brown", "Nickel Gray", "Slate"],
              warranty: ["10-Year Limited Warranty"]
            }
          ]
        }
      ]
    },
    {
      category: "Roof Accessories",
      description: "Supporting roofing components and materials",
      subCategories: [
        {
          name: "Ridge Cap Shingles",
          products: [
            {
              name: "Premium Ridge Caps",
              variants: ["TimberTex", "TimberCrest", "Z Ridge"],
              features: ["Premium Design", "Enhanced Protection"]
            },
            {
              name: "Standard Ridge Caps",
              variants: ["Seal-A-Ridge", "RidGlass"],
              features: ["Standard Protection"],
              productCodes: {
                "SEAL_A_RIDGE": "04GASR2",
                "RIDGLASS": "04GARG"
              }
            }
          ]
        },
        {
          name: "Starter Strip Shingles",
          products: [
            {
              name: "WeatherBlocker™",
              productCodes: {
                "50_FEET": "04GAWBL50",
                "100_FEET": "04GAWBL100"
              }
            },
            {
              name: "Pro-Start®",
              features: ["WindProven Compatible"],
              productCodes: {"PRO_START": "04GAPST"}
            },
            {
              name: "QuickStart®",
              features: ["Easy Installation"]
            }
          ]
        }
      ]
    },
    {
      category: "Protection & Ventilation",
      description: "Protective underlayments and ventilation solutions",
      subCategories: [
        {
          name: "Roof Deck Protection",
          products: [
            {
              name: "Premium Underlayments",
              variants: ["Deck-Armor™", "Tiger Paw™", "FeltBuster®"],
              productCodes: {
                "DECK_ARMOR": "05GADA54",
                "TIGER_PAW": "11GATP10",
                "FELTBUSTER": "05GAFBSR10"
              }
            }
          ]
        },
        {
          name: "Leak Barriers",
          products: [
            {
              name: "Premium Leak Barriers",
              variants: ["StormGuard®", "WeatherWatch®"],
              productCodes: {
                "STORMGUARD_2SQ": "11GASG2",
                "WEATHERWATCH_2SQ": "11GAWW2"
              }
            }
          ]
        },
        {
          name: "Ventilation",
          products: [
            {
              name: "Cobra® Series",
              variants: [
                "Cobra® Snow Country Advanced",
                "Cobra® RidgeRunner®",
                "Cobra® Rigid Vent 3™",
                "Cobra® IntakePro®"
              ]
            },
            {
              name: "Master Flow® Series",
              variants: {
                "POWER_VENTS": ["ERV5HT", "EZ Cool", "Wi-Fi Attic Vent"],
                "STATIC_VENTS": ["SSB960A", "IR61"],
                "SOLAR_VENTS": ["PRSOLAR", "Green Machine"]
              }
            }
          ]
        }
      ]
    },
    {
      category: "Low Slope Roofing",
      description: "Solutions for low-slope applications",
      subCategories: [
        {
          name: "Liberty™ Self-Adhering System",
          products: [
            {
              name: "Liberty™ Cap Sheets",
              colors: ["Hickory", "Shakewood", "White", "Tan", "Slate", "Weatherwood", "Black"]
            },
            {
              name: "Liberty™ Base Sheets",
              variants: ["Smooth"]
            }
          ]
        }
      ]
    }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderFeatures = (features) => (
    <div className="flex flex-wrap gap-2 mt-2">
      {features.map((feature, idx) => (
        <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
          {feature}
        </span>
      ))}
    </div>
  );

  const renderWarranty = (warranty) => (
    <div className="flex flex-wrap gap-2 mt-2">
      {warranty.map((item, idx) => (
        <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
          {item}
        </span>
      ))}
    </div>
  );

  const renderColors = (colors) => (
    <div className="flex flex-wrap gap-2 mt-2">
      {colors.map((color, idx) => (
        <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
          {color}
        </span>
      ))}
    </div>
  );

  const renderVariants = (variants) => {
    if (Array.isArray(variants)) {
      return (
        <div className="flex flex-wrap gap-2 mt-2">
          {variants.map((variant, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
              {variant}
            </span>
          ))}
        </div>
      );
    } else {
      return Object.entries(variants).map(([type, items]) => (
        <div key={type} className="mt-2">
          <p className="text-xs font-medium text-gray-600">{type.replace(/_/g, ' ')}:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {items.map((item, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                {item}
              </span>
            ))}
          </div>
        </div>
      ));
    }
  };

  const renderProducts = (products) => (
    <div className="space-y-4 mt-4">
      {products.map((product, idx) => (
        <div key={idx} className="border rounded-lg p-4 bg-white">
          <h4 className="font-semibold text-blue-700">{product.name}</h4>
          
          {product.features && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 font-medium">Features:</p>
              {renderFeatures(product.features)}
            </div>
          )}
          
          {product.warranty && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 font-medium">Warranty:</p>
              {renderWarranty(product.warranty)}
            </div>
          )}
          
          {product.colors && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 font-medium">Colors:</p>
              {renderColors(product.colors)}
            </div>
          )}
          
          {product.variants && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 font-medium">Variants:</p>
              {renderVariants(product.variants)}
            </div>
          )}

          {product.productCodes && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 font-medium">Product Codes:</p>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {Object.entries(product.productCodes).map(([code, value]) => (
                  <div key={code} className="text-xs">
                    <span className="font-medium">{code.replace(/_/g, ' ')}:</span> {value}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>GAF Product Line Mapping</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mappings.map((category, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection(category.category)}
              >
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">
                    {category.category}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                </div>
                {expandedSections[category.category] ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
              </div>

              {expandedSections[category.category] && (
                <div className="mt-4 space-y-6">
                  {category.subCategories.map((subCategory, subIdx) => (
                    <div key={subIdx} className="ml-6">
                      <h3 className="font-semibold text-blue-700 mb-2">{subCategory.name}</h3>
                      <p className="text-sm text-gray-600">{subCategory.description}</p>
                      {renderProducts(subCategory.products)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductMapping;