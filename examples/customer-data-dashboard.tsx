import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomerDataDashboard = () => {
  const [data, setData] = useState(null);
  const [flattenedData, setFlattenedData] = useState([]);
  const [summaryStats, setSummaryStats] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const fileContent = await window.fs.readFile('consolidated_customer_data (1).json', { encoding: 'utf8' });
        const cleanContent = fileContent.replace(/: NaN/g, ': null');
        const jsonData = JSON.parse(cleanContent);
        setData(jsonData);

        // Create flattened data
        const flattened = jsonData.flatMap(customer => 
          customer.Invoices.flatMap(invoice => 
            (invoice.Products || []).map(product => ({
              customer_name: customer.CustomerInfo.customer_name,
              shipping_address: customer.CustomerInfo.shipping_address,
              invoice_number: invoice.invoice_number,
              po_number: invoice.po_number,
              subtotal: parseFloat(invoice.subtotal),
              product_type: product.Product_Type,
              color: product.color || "Not Specified",
              features: product.features ? JSON.parse(product.features.replace(/'/g, '"')) : [],
              line: product.line || "Not Specified",
              type: product.type
            }))
          )
        );
        setFlattenedData(flattened);

        // Calculate summary statistics
        const stats = {
          totalCustomers: new Set(flattened.map(d => d.customer_name)).size,
          totalTransactions: new Set(flattened.map(d => d.invoice_number)).size,
          productCategories: new Set(flattened.map(d => d.type)).size,
          totalProducts: flattened.length
        };

        // Calculate product type distribution
        const productTypeCounts = {};
        flattened.forEach(item => {
          productTypeCounts[item.type] = (productTypeCounts[item.type] || 0) + 1;
        });
        
        const productTypeData = Object.entries(productTypeCounts).map(([name, value]) => ({
          name,
          value
        }));

        setSummaryStats({
          ...stats,
          productTypeData
        });

      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  if (!summaryStats) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Data Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold">{summaryStats.totalCustomers}</div>
              <div className="text-sm text-gray-600">Total Customers</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold">{summaryStats.totalTransactions}</div>
              <div className="text-sm text-gray-600">Total Transactions</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold">{summaryStats.productCategories}</div>
              <div className="text-sm text-gray-600">Product Categories</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold">{summaryStats.totalProducts}</div>
              <div className="text-sm text-gray-600">Total Product Records</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Type Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summaryStats.productTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">The data has been flattened from its nested structure into a simpler format with the following fields:</p>
            <ul className="list-disc pl-6 text-sm">
              <li>Customer Name</li>
              <li>Shipping Address</li>
              <li>Invoice Number</li>
              <li>PO Number</li>
              <li>Subtotal</li>
              <li>Product Type</li>
              <li>Color</li>
              <li>Features</li>
              <li>Product Line</li>
              <li>Product Category</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDataDashboard;