import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import _ from 'lodash';

const WarrantySystem = () => {
  const [warranties, setWarranties] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedWarranty, setSelectedWarranty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [claimStatus, setClaimStatus] = useState('initial');
  const [eligibilityResults, setEligibilityResults] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
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
              qualifyingShingles: item.QualifyingShingles,
              accessories: item.EligibleAccessories,
              requirements: {
                shingles: item.ShingleRequirements,
                accessories: item.AccessoryRequirements,
                contractor: item.ContractorRequirements
              }
            };
          })
          .compact()
          .value();
        
        // Process product data
        const productData = _.chain(parsed.data)
          .map(item => ({
            name: item.ProductName,
            category: item.Category,
            subcategory: item['Subcategory/Product'],
            description: item.Description,
            eligibleWarranties: item.WarrantyType?.replace(/[\[\]"]/g, '').split(',')
          }))
          .uniqBy('name')
          .compact()
          .value();
        
        setWarranties(warrantyData);
        setProducts(productData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, []);

  const SearchPanel = () => (
    <div className="mb-6">
      <div className="flex gap-4">
        <Input 
          placeholder="Search warranties, products, or requirements..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );

  const EligibilityChecker = () => {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [contractorType, setContractorType] = useState('');

    const checkEligibility = () => {
      const results = warranties.map(warranty => {
        const meetsProductRequirements = selectedProducts.length >= warranty.requiredComponents;
        const meetsContractorRequirements = !warranty.requirements.contractor || 
          warranty.requirements.contractor.includes(contractorType);

        return {
          warranty: warranty.title,
          eligible: meetsProductRequirements && meetsContractorRequirements,
          requirements: {
            products: meetsProductRequirements,
            contractor: meetsContractorRequirements
          }
        };
      });

      setEligibilityResults(results);
    };

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Warranty Eligibility Checker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Select Installed Products</h3>
              <div className="flex flex-wrap gap-2">
                {products.slice(0, 5).map(product => (
                  <Button
                    key={product.name}
                    variant={selectedProducts.includes(product.name) ? "default" : "outline"}
                    onClick={() => setSelectedProducts(prev => 
                      prev.includes(product.name) 
                        ? prev.filter(p => p !== product.name)
                        : [...prev, product.name]
                    )}
                  >
                    {product.name}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Contractor Type</h3>
              <div className="flex gap-2">
                {["Any", "GAF Certified", "GAF Master Elite"].map(type => (
                  <Button
                    key={type}
                    variant={contractorType === type ? "default" : "outline"}
                    onClick={() => setContractorType(type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            <Button onClick={checkEligibility} className="w-full">
              Check Eligibility
            </Button>

            {eligibilityResults && (
              <div className="mt-4 space-y-2">
                {eligibilityResults.map(result => (
                  <Alert key={result.warranty} variant={result.eligible ? "default" : "destructive"}>
                    <AlertTitle className="flex items-center gap-2">
                      {result.eligible ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                      {result.warranty}
                    </AlertTitle>
                    <AlertDescription>
                      {result.eligible 
                        ? "Eligible for this warranty program"
                        : "Missing required components or contractor certification"}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const ClaimProcessor = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Warranty Claim Processing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Badge variant={claimStatus === 'initial' ? 'default' : 'secondary'}>
              <Clock className="w-4 h-4 mr-2" />
              Initial Review
            </Badge>
            <Badge variant={claimStatus === 'documentation' ? 'default' : 'secondary'}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Documentation
            </Badge>
            <Badge variant={claimStatus === 'processing' ? 'default' : 'secondary'}>
              <Clock className="w-4 h-4 mr-2" />
              Processing
            </Badge>
            <Badge variant={claimStatus === 'complete' ? 'default' : 'secondary'}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => setClaimStatus('documentation')}
              variant="outline"
            >
              Upload Documents
            </Button>
            <Button 
              onClick={() => setClaimStatus('processing')}
              variant="outline"
            >
              Submit Claim
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>GAF Warranty Management System</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchPanel />
          
          <Tabs defaultValue="eligibility" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="eligibility">Check Eligibility</TabsTrigger>
              <TabsTrigger value="process">Process Claim</TabsTrigger>
              <TabsTrigger value="warranties">View Warranties</TabsTrigger>
            </TabsList>

            <TabsContent value="eligibility">
              <EligibilityChecker />
            </TabsContent>

            <TabsContent value="process">
              <ClaimProcessor />
            </TabsContent>

            <TabsContent value="warranties">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {warranties.map(warranty => (
                  <Card key={warranty.title} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {warranty.title}
                        <Badge variant="secondary">
                          {warranty.requiredComponents} Components
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{warranty.coverage}</p>
                      <Alert>
                        <AlertTitle>Requirements</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc pl-4">
                            <li>Shingles: {warranty.requirements.shingles}</li>
                            <li>Accessories: {warranty.requirements.accessories}</li>
                            {warranty.requirements.contractor && (
                              <li>Contractor: {warranty.requirements.contractor}</li>
                            )}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WarrantySystem;