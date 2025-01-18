import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronRight } from 'lucide-react';

const ProductMapping = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const colorOptions = {
    STANDARD_COLORS: [
      'PEWTER GRAY', 'CHARCOAL', 'BARKWOOD', 'SLATE', 'HICKORY',
      'WEATHERED WOOD', 'MISSION BROWN', 'FOX HOLLOW GRAY',
      'OYSTER GRAY', 'SHAKEWOOD'
    ],
    HARVEST_BLEND_COLORS: [
      'GOLDEN HARVEST', 'CEDAR FALLS', 'APPALACHIAN SKY',
      'NANTUCKET MORNING'
    ],
    DESIGNER_COLORS: [
      'BLACK OAK', 'STONEWOOD', 'STORM CLOUD GRAY',
      'WEATHERED TIMBER', 'ANTIQUE SLATE', 'ROYAL SLATE',
      'CEDARWOOD ABBEY'
    ],
    LOW_SLOPE_COLORS: [
      'HICKORY', 'SHAKEWOOD', 'WHITE', 'TAN', 'SLATE',
      'WEATHERWOOD', 'BLACK'
    ]
  };

  const productCategories = {
    'LIFETIME_SHINGLES': {
      description: 'Premium architectural shingles with LayerLock technology',
      subcategories: {
        'HDZ_SERIES': {
          patterns: ['TIMB HDZ', 'HDZ'],
          features: ['LayerLock Technology', 'WindProven Eligible'],
          availableColors: 'STANDARD_COLORS'
        },
        'UHDZ_SERIES': {
          patterns: ['UHDZ', 'ULTRA HDZ'],
          features: ['LayerLock Technology', 'WindProven Eligible', 'Premium Protection'],
          availableColors: 'STANDARD_COLORS'
        },
        'HDZ_HIGH_DEFINITION': {
          patterns: ['HB GOLDEN HRVST', 'HB CEDAR FALLS', 'HB APPALACHIAN', 'HB NANTUCKET'],
          features: ['LayerLock Technology', 'High Definition Design'],
          availableColors: 'HARVEST_BLEND_COLORS'
        },
        'AS_SERIES': {
          patterns: ['AS II', 'AS', 'IMPACT RESISTANT'],
          features: ['Impact Resistance', 'SBS Modified'],
          availableColors: 'STANDARD_COLORS'
        },
        'DESIGNER': {
          patterns: ['GRAND SEQUOIA', 'GRAND CANYON', 'CAMELOT', 'WOODLAND', 'SLATELINE'],
          features: ['Premium Design', 'Enhanced Aesthetics'],
          availableColors: 'DESIGNER_COLORS'
        }
      }
    },
    'STARTER_STRIPS': {
      description: 'Starter strip products',
      patterns: [
        'PRO-START', 'STARTER STRIP', 'QUICKSTART', 'WEATHERBLOCKER',
        'STARTERMATCH', 'STARTER 120.33LF', 'STARTER 100LF', 'STARTER 50LF'
      ],
      productCodes: {
        'PRO_START': '04GAPST',
        'WEATHERBLOCKER_50': '04GAWBL50',
        'WEATHERBLOCKER_100': '04GAWBL100'
      }
    },
    'RIDGE_CAPS': {
      description: 'Ridge cap shingles and accessories',
      subcategories: {
        'PREMIUM': {
          patterns: ['TIMBERTEX', 'TIMBERCREST', 'Z RIDGE'],
          features: ['Premium Design', 'Enhanced Protection']
        },
        'STANDARD': {
          patterns: ['S-A-R', 'SEAL-A-RIDGE', 'RIDGLASS'],
          features: ['Standard Protection']
        }
      }
    },
    'VENTILATION': {
      description: 'Comprehensive ventilation solutions',
      subcategories: {
        'COBRA': {
          patterns: [
            'COBRA SNOW COUNTRY', 'COBRA RIDGERUNNER', 'COBRA RIGID VENT',
            'COBRA INTAKEPRO', 'COBRA EXHAUST', 'COBRA HIP'
          ]
        },
        'MASTER_FLOW': {
          patterns: [
            'MASTER FLOW', 'SSB960A', 'ERV5HT', 'PRSOLAR', 'GREEN MACHINE',
            'EZ COOL', 'WI-FI ATTIC VENT'
          ],
          productTypes: {
            'POWER_VENTS': ['ERV5HT', 'EZ COOL', 'WI-FI'],
            'STATIC_VENTS': ['SSB960A', 'IR61'],
            'SOLAR_VENTS': ['PRSOLAR', 'GREEN MACHINE']
          }
        }
      }
    },
    'LEAK_BARRIER': {
      description: 'Waterproofing and leak protection',
      patterns: [
        'WEATHERWATCH', 'STORMGUARD', 'LEAK BARRIER', 'EXTENDED DRY-IN',
        'WEATHERWATCH 36', 'STORMGUARD 2'
      ],
      productCodes: {
        'STORMGUARD_2SQ': '11GASG2',
        'WEATHERWATCH_2SQ': '11GAWW2'
      }
    },
    'ROOF_DECK': {
      description: 'Roof deck protection and underlayment',
      patterns: [
        'FELTBUSTER', 'TIGER PAW', 'DECK-ARMOR', 'SHINGLE-MATE',
        'VERSASHIELD', 'ROOF DECK PROTECTION', 'SYNTHETIC ROOFING FELT'
      ],
      productCodes: {
        'DECK_ARMOR': '05GADA54',
        'TIGER_PAW': '11GATP10',
        'FELTBUSTER': '05GAFBSR10'
      }
    },
    'LOW_SLOPE': {
      description: 'Low slope roofing solutions',
      subcategories: {
        'CAP_SHEETS': {
          patterns: ['LIBERTY SBS SA CAP'],
          availableColors: 'LOW_SLOPE_COLORS'
        },
        'BASE_SHEETS': {
          patterns: ['LIBERTY SBS SA BASE', 'SMOOTH']
        }
      }
    },
    'BUILDING_MATERIALS': {
      description: 'Insulation and building materials',
      subcategories: {
        'INSULATION': {
          patterns: ['ENERGYGUARD', 'ISO']
        },
        'WALL_PANELS': {
          patterns: ['THERMACAL WALL']
        },
        'ROOF_PANELS': {
          patterns: ['THERMACAL VENTILATED', 'THERMACAL 1', 'THERMACAL 2']
        }
      }
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderPatternList = (patterns) => (
    <div className="flex flex-wrap gap-2 mt-1">
      {patterns.map((pattern, idx) => (
        <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
          {pattern}
        </span>
      ))}
    </div>
  );

  const renderFeatureList = (features) => (
    <div className="flex flex-wrap gap-2 mt-1">
      {features.map((feature, idx) => (
        <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
          {feature}
        </span>
      ))}
    </div>
  );

  const renderColorSection = (colorType) => (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-600">Available Colors:</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {colorOptions[colorType]?.map((color, idx) => (
          <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
            {color}
          </span>
        ))}
      </div>
    </div>
  );

  const renderProductCodes = (codes) => (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-600">Product Codes:</p>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {Object.entries(codes).map(([code, value]) => (
          <div key={code} className="text-xs">
            <span className="font-medium">{code}:</span> {value}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSubcategories = (subcategories) => (
    <div className="ml-6 space-y-4 mt-4">
      {Object.entries(subcategories).map(([name, data]) => (
        <div key={name} className="border rounded-lg p-4 bg-white">
          <h4 className="font-semibold text-blue-700">{name.replace(/_/g, ' ')}</h4>
          
          {data.patterns && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 font-medium">Pattern Matching:</p>
              {renderPatternList(data.patterns)}
            </div>
          )}

          {data.features && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 font-medium">Features:</p>
              {renderFeatureList(data.features)}
            </div>
          )}

          {data.availableColors && renderColorSection(data.availableColors)}
          
          {data.productTypes && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 font-medium">Product Types:</p>
              {Object.entries(data.productTypes).map(([type, products]) => (
                <div key={type} className="mt-2">
                  <p className="text-xs font-medium">{type.replace(/_/g, ' ')}:</p>
                  {renderPatternList(products)}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Complete GAF Product Category Mapping</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(productCategories).map(([category, data]) => (
            <div key={category} className="border rounded-lg p-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection(category)}
              >
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">
                    {category.replace(/_/g, ' ')}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{data.description}</p>
                </div>
                {expandedSections[category] ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
              </div>

              {expandedSections[category] && (
                <div className="mt-4">
                  {data.patterns && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-600">Pattern Matching:</p>
                      {renderPatternList(data.patterns)}
                    </div>
                  )}
                  {data.productCodes && renderProductCodes(data.productCodes)}
                  {data.subcategories && renderSubcategories(data.subcategories)}
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