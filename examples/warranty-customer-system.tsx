import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, CheckCircle, Clock, AlertCircle, User, Phone, Mail, MapPin } from 'lucide-react';
import Papa from 'papaparse';
import _ from 'lodash';

const WarrantyCustomerSystem = () => {
  const [customers, setCustomers] = useState([]);
  const [warranties, setWarranties] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('customers');
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await window.fs.readFile('cleaned_combined_data.csv', { encoding: 'utf8' });
        const parsed = Papa.parse(response, {
          header: true,
          skipEmptyLines: true
        });
        
        // Process customer data
        const customerData = _.chain(parsed.data)
          .filter(row => row['Customer Name'] || row['Customer'])
          .map(row => ({
            id: row['Invoice Number'],
            name: row['Customer Name'] || row['Customer'],
            email: row['Email'],
            phone: row['Mobile Phone'],
            address: {
              street: row['Street'] || row['SHIPPING_ADDRESS'],
              city: row['City'],
              state: row['State'] || row['State/Province'],
              zip: row['Zip']
            },
            confidence: row['Confidence'],
            reason: row['Reason'],
            warranties: []
          }))
          .uniqBy('id')
          .value();
        
        setCustomers(customerData);
        
        // Process warranty data (similar to before)
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
              requirements: {
                shingles: item.ShingleRequirements,
                accessories: item.AccessoryRequirements,
                contractor: item.ContractorRequirements
              }
            };
          })
          .compact()
          .value();
        
        setWarranties(warrantyData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, []);

  const CustomerSearch = () => (
    <div className="mb-6">
      <div className="flex gap-4">
        <Input 
          placeholder="Search customers by name, email, or address..." 
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

  const CustomerProfile = ({ customer }) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          {customer.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>{customer.email || 'No email provided'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span>{customer.phone || 'No phone provided'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>
                {customer.address.street}<br />
                {customer.address.city}, {customer.address.state} {customer.address.zip}
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Verification Status</h3>
            <Alert>
              <AlertTitle>Confidence Score: {customer.confidence}%</AlertTitle>
              <AlertDescription>{customer.reason}</AlertDescription>
            </Alert>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Active Warranties</h3>
          <div className="space-y-2">
            {customer.warranties.length > 0 ? (
              customer.warranties.map(warranty => (
                <Alert key={warranty.id}>
                  <AlertTitle>{warranty.type}</AlertTitle>
                  <AlertDescription>
                    Registration Date: {warranty.registrationDate}<br />
                    Status: {warranty.status}
                  </AlertDescription>
                </Alert>
              ))
            ) : (
              <Alert>
                <AlertTitle>No Active Warranties</AlertTitle>
                <AlertDescription>
                  Click "Register New Warranty" to add a warranty for this customer.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CustomerList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {customers
        .filter(customer => 
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (customer.address.street && customer.address.street.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .map(customer => (
          <Card 
            key={customer.id} 
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => setSelectedCustomer(customer)}
          >
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{customer.name}</h3>
                  <p className="text-sm text-gray-500">{customer.address.city}, {customer.address.state}</p>
                </div>
                <Badge variant="secondary">
                  {customer.warranties.length} Warranties
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))
      }
    </div>
  );

  const WarrantyRegistration = () => {
    const [selectedWarranty, setSelectedWarranty] = useState(null);
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Register New Warranty</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Select Warranty Type</h3>
              <div className="grid grid-cols-2 gap-2">
                {warranties.map(warranty => (
                  <Button
                    key={warranty.title}
                    variant={selectedWarranty === warranty ? "default" : "outline"}
                    onClick={() => setSelectedWarranty(warranty)}
                    className="justify-start"
                  >
                    <div className="text-left">
                      <div>{warranty.title}</div>
                      <div className="text-xs text-gray-500">
                        {warranty.requiredComponents} components required
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {selectedWarranty && (
              <Alert>
                <AlertTitle>Selected: {selectedWarranty.title}</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-2">
                    <p>{selectedWarranty.coverage}</p>
                    <div className="font-medium">Requirements:</div>
                    <ul className="list-disc pl-4">
                      <li>Shingles: {selectedWarranty.requirements.shingles}</li>
                      <li>Accessories: {selectedWarranty.requirements.accessories}</li>
                      {selectedWarranty.requirements.contractor && (
                        <li>Contractor: {selectedWarranty.requirements.contractor}</li>
                      )}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Button 
              className="w-full" 
              disabled={!selectedWarranty}
            >
              Register Warranty
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Warranty Customer Management System</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerSearch />
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="profile" disabled={!selectedCustomer}>
                Customer Profile
              </TabsTrigger>
              <TabsTrigger value="register" disabled={!selectedCustomer}>
                Register Warranty
              </TabsTrigger>
            </TabsList>

            <TabsContent value="customers">
              <CustomerList />
            </TabsContent>

            <TabsContent value="profile">
              {selectedCustomer && <CustomerProfile customer={selectedCustomer} />}
            </TabsContent>

            <TabsContent value="register">
              {selectedCustomer && <WarrantyRegistration />}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WarrantyCustomerSystem;