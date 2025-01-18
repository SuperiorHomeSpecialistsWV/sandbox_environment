import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronRight } from 'lucide-react';

const ShingleMapping = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const shingleCategories = {
    'timberline_series': {
      description: 'Premium architectural shingles with LayerLock technology',
      subcategories: {
        'hdz': {
          colors: [
            'Pewter Gray', 'Charcoal', 'Barkwood', 'Slate', 'Oyster Gray', 
            'Hickory', 'Shakewood', 'Fox Hollow Gray'
          ],
          warranty: [
            'Lifetime Limited Warranty',
            'WindProven™ Limited Wind Warranty'
          ]
        },
        'hdz_high_definition': {
          colors: [
            'Appalachian Sky', 'Golden Harvest', 'Nantucket Morning'
          ],
          warranty: [
            'Lifetime Limited Warranty',
            'WindProven™ Limited Wind Warranty'
          ]
        },
        'ultra_hdz': {
          colors: ['Dual Charcoal'],
          warranty: [
            'Premium Lifetime Warranty',
            'WindProven™ Limited Wind Warranty'
          ]
        }
      }
    },
    'designer_series': {
      description: 'Premium designer architectural shingles',
      subcategories: {
        'grand_canyon': {
          colors: [
            'Black Oak', 'Mission Brown', 'Stonewood', 'Storm Cloud Gray'
          ],
          warranty: [
            'Lifetime Limited Warranty',
            'StainGuard Plus™ Algae Protection'
          ]
        },
        'camelot_ii': {
          colors: [
            'Weathered Timber', 'Antique Slate', 'Charcoal', 
            'Barkwood', 'Royal Slate'
          ],
          warranty: [
            'Lifetime Limited Warranty',
            'StainGuard Plus™ Algae Protection'
          ]
        },
        'grand_sequoia': {
          colors: [
            'Charcoal', 'Autumn Brown', 'Weathered Wood'
          ],
          warranty: [
            'Lifetime Limited Warranty',
            'StainGuard Plus™ Algae Protection'
          ]
        },
        'woodland': {
          colors: [
            'Castlewood Gray', 'Cedarwood Abbey'
          ],
          warranty: [
            'Lifetime Limited Warranty',
            'StainGuard Plus™ Algae Protection'
          ]
        },
        'slateline': {
          colors: [
            'Royal Slate', 'Antique Slate', 'Weathered Slate'
          ],
          warranty: [
            'Lifetime Limited Warranty',
            'StainGuard Plus™ Algae Protection'
          ]
        }
      }
    },
    'sbs_modified_series': {
      description: 'Impact-resistant architectural shingles',
      subcategories: {
        'timberline_as_ii': {
          colors: [
            'Charcoal', 'Hickory', 'Adobe Sunset', 'Pewter Gray',
            'Barkwood', 'Shakewood', 'Slate', 'Weathered Wood'
          ],
          warranty: [
            'Lifetime Limited Warranty',
            'UL 2218 Class 4 Impact Resistance'
          ]
        },
        'grand_sequoia_as': {
          colors: [
            'Charcoal', 'Dusky Gray', 'Weathered Wood'
          ],
          warranty: [
            'Lifetime Limited Warranty',
            'UL 2218 Class 4 Impact Resistance'
          ]
        }
      }
    },
    '3_tab': {
      description: 'Traditional three-tab shingles',
      colors: [
        'Autumn Brown', 'Charcoal', 'Golden Cedar', 'Silver Lining',
        'Weathered Gray', 'White', 'Ash Brown', 'Nickel Gray', 'Slate'
      ],
      warranty: ['10-Year Limited Warranty']
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderWarrantyList = (warranty) => (
    <div className="flex flex-wrap gap-2 mt-1">
      {warranty.map((item, idx) => (
        <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
          {item}
        </span>
      ))}
    </div>
  );

  const renderColorList = (colors) => (
    <div className="flex flex-wrap gap-2 mt-1">
      {colors.map((color, idx) => (
        <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
          {color}
        </span>
      ))}
    </div>
  );

  const renderSubcategories = (subcategories) => (
    <div className="ml-6 space-y-4 mt-4">
      {Object.entries(subcategories).map(([name, data]) => (
        <div key={name} className="border rounded-lg p-4 bg-white">
          <h4 className="font-semibold text-blue-700">
            {name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </h4>
          
          <div className="mt-2">
            <p className="text-sm text-gray-600 font-medium">Colors:</p>
            {renderColorList(data.colors)}
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600 font-medium">Warranty:</p>
            {renderWarrantyList(data.warranty)}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>GAF Shingle Product Line Mapping</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(shingleCategories).map(([category, data]) => (
            <div key={category} className="border rounded-lg p-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection(category)}
              >
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">
                    {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
                  {data.subcategories ? (
                    renderSubcategories(data.subcategories)
                  ) : (
                    <>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 font-medium">Colors:</p>
                        {renderColorList(data.colors)}
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 font-medium">Warranty:</p>
                        {renderWarrantyList(data.warranty)}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShingleMapping;