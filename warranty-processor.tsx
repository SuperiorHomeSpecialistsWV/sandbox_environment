import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import Papa from 'papaparse';
import _ from 'lodash';

const WarrantyProcessor = () => {
  const [warranties, setWarranties] = useState([]);
  const [selectedWarranty, setSelectedWarranty] = useState(null);
  
  useEffect(() => {
    const loadWarrantyData = async () => {
      try {
        const response = await window.fs.readFile('cleaned_combined_data.csv', { encoding: 'utf8' });
        const parsed = Papa.parse(response, {
          header: true,
          skipEmptyLines: true
        });
        
        // Process warranty data
        const warrantyData = _.chain(parsed.data)
          .groupBy('Title')
          .map((items, title) => {
            if (!title || title === 'null') return null;
            
            const item = items[0];
            return {
              title,
              type: item.WarrantyType?.replace(/[\[\]"]/g, ''),
              coverage: item.WarrantyCoverage,
              terms: item.WarrantyTerms,
              requiredComponents: item.RequiredComponentCount,
              installer: item.RequiredInstaller?.replace(/[\[\]"]/g, ''),
              qualifyingShingles: item.Qualifying_Shingles,
              accessories: item.Eligible_Accessories,
              requirements: {
                shingles: item.Shingle_Requirements,
                accessories: item.Accessory_Requirements,
                contractor: item.Contractor_Requirements
              }
            };
          })
          .compact()
          .value();
          
        setWarranties(warrantyData);
      } catch (error) {
        console.error('Error loading warranty data:', error);
      }
    };
    
    loadWarrantyData();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>GAF Warranty Processing System</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertTitle>Welcome to the Warranty Processing System</AlertTitle>
            <AlertDescription>
              Select a warranty type below to view detailed requirements and coverage information.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="standard" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              {warranties.map(warranty => (
                <TabsTrigger 
                  key={warranty.title}
                  value={warranty.title}
                  onClick={() => setSelectedWarranty(warranty)}
                >
                  {warranty.title?.replace('GAF ', '')}
                </TabsTrigger>
              ))}
            </TabsList>

            {warranties.map(warranty => (
              <TabsContent key={warranty.title} value={warranty.title}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {warranty.title}
                      <Badge variant="secondary">
                        {warranty.requiredComponents} Components Required
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Coverage</h3>
                        <p className="text-sm text-gray-600 mb-4">{warranty.coverage}</p>
                        
                        <h3 className="text-lg font-semibold mb-2">Installation Requirements</h3>
                        <p className="text-sm text-gray-600 mb-4">{warranty.installer}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Required Components</h3>
                        <div className="space-y-2">
                          <Alert>
                            <AlertTitle>Shingles</AlertTitle>
                            <AlertDescription>{warranty.requirements?.shingles}</AlertDescription>
                          </Alert>
                          
                          <Alert>
                            <AlertTitle>Accessories</AlertTitle>
                            <AlertDescription>{warranty.requirements?.accessories}</AlertDescription>
                          </Alert>
                          
                          {warranty.requirements?.contractor && (
                            <Alert>
                              <AlertTitle>Contractor</AlertTitle>
                              <AlertDescription>{warranty.requirements.contractor}</AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Warranty Terms</h3>
                      <p className="text-sm text-gray-600">{warranty.terms}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WarrantyProcessor;