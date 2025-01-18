import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Papa from 'papaparse';
import _ from 'lodash';

const DataDashboard = () => {
  const [data, setData] = useState(null);
  const [productStats, setProductStats] = useState([]);
  const [colorStats, setColorStats] = useState([]);
  const [featureStats, setFeatureStats] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const fileContent = await window.fs.readFile('aggregated_supplier_invoice_data.csv', { encoding: 'utf8' });
      const parsedData = Papa.parse(fileContent, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
      });

      // Clean and transform data
      const cleanedRecords = parsedData.data.map(row => {
        const products = {};
        Object.keys(row).forEach(key => {
          if (key.includes('.type') && row[key]) {
            const baseKey = key.split('.')[2];
            if (!products[baseKey]) {
              products[baseKey] = {
                type: row[key],
                line: row[key.replace('.type', '.line')],
                color: row[key.replace('.type', '.color')],
                features: row[key.replace('.type', '.features')]
              };
            }
          }
        });
        return {
          customer_name: row.customer_name,
          products: _.pickBy(products, value => value.type),
          component_count: row.product_summary?.warranty_eligibility?.component_count,
          layerlock_qualified: row.product_summary?.warranty_eligibility?.layerlock_qualified
        };
      });

      setData(cleanedRecords);

      // Calculate product type distribution
      const productCounts = {};
      cleanedRecords.forEach(record => {
        Object.values(record.products).forEach(product => {
          if (!productCounts[product.type]) {
            productCounts[product.type] = 0;
          }
          productCounts[product.type]++;
        });
      });
      setProductStats(Object.entries(productCounts).map(([name, value]) => ({ name, value })));

      // Calculate color distribution
      const colorCounts = {};
      cleanedRecords.forEach(record => {
        Object.values(record.products).forEach(product => {
          if (product.color) {
            if (!colorCounts[product.color]) {
              colorCounts[product.color] = 0;
            }
            colorCounts[product.color]++;
          }
        });
      });
      setColorStats(Object.entries(colorCounts).map(([name, value]) => ({ name, value })));

      // Calculate feature distribution
      const featureCounts = {};
      cleanedRecords.forEach(record => {
        Object.values(record.products).forEach(product => {
          if (product.features) {
            const features = product.features.replace(/[\[\]']/g, '').split(', ');
            features.forEach(feature => {
              if (!featureCounts[feature]) {
                featureCounts[feature] = 0;
              }
              featureCounts[feature]++;
            });
          }
        });
      });
      setFeatureStats(Object.entries(featureCounts).map(([name, value]) => ({ name, value })));
    };

    loadData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  if (!data) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Supplier Invoice Data Analysis</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Product Types Distribution */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Product Types Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Color Distribution */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Color Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={colorStats}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name}) => name}
                >
                  {colorStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Features Distribution */}
        <div className="bg-white p-4 rounded shadow col-span-2">
          <h3 className="text-lg font-semibold mb-2">Product Features Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="bg-white p-4 rounded shadow col-span-2">
          <h3 className="text-lg font-semibold mb-2">Summary Statistics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="font-medium">Total Orders</p>
              <p className="text-2xl">{data.length}</p>
            </div>
            <div>
              <p className="font-medium">Average Components per Order</p>
              <p className="text-2xl">
                {(data.reduce((acc, curr) => acc + (curr.component_count || 0), 0) / data.length).toFixed(1)}
              </p>
            </div>
            <div>
              <p className="font-medium">LayerLock™ Qualified Orders</p>
              <p className="text-2xl">
                {data.filter(d => d.layerlock_qualified).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataDashboard;