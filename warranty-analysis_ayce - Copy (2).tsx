import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Papa from 'papaparse';

const WarrantyAnalysis = () => {
  const [data, setData] = useState({
    componentCounts: [],
    warrantyTypes: [],
    productCombinations: []
  });

  useEffect(() => {
    const analyzeData = async () => {
      const fileContent = await window.fs.readFile('aggregated_supplier_invoice_data.csv', { encoding: 'utf8' });
      const parsedData = Papa.parse(fileContent, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
      });

      const analysis = {
        componentCounts: {},
        warrantyTypes: {
          'System Limited': 0,
          'System Plus': 0,
          'WindProven': 0,
          'Standard': 0
        },
        productCombos: {}
      };

      parsedData.data.forEach(row => {
        // Count components
        const count = row.product_summary?.warranty_eligibility?.component_count || 0;
        analysis.componentCounts[count] = (analysis.componentCounts[count] || 0) + 1;

        // Count warranty types
        if (row.product_summary?.warranty_eligibility?.eligible_warranties) {
          row.product_summary.warranty_eligibility.eligible_warranties.forEach(warranty => {
            analysis.warrantyTypes[warranty]++;
          });
        } else {
          analysis.warrantyTypes['Standard']++;
        }

        // Analyze product combinations
        const products = [];
        if (row.product_summary?.warranty_eligibility?.qualifying_products?.shingles?.length > 0) products.push('Shingles');
        if (row.product_summary?.warranty_eligibility?.qualifying_products?.ridge_cap?.length > 0) products.push('Ridge Cap');
        if (row.product_summary?.warranty_eligibility?.qualifying_products?.starter_strip?.length > 0) products.push('Starter Strip');
        if (row.product_summary?.warranty_eligibility?.qualifying_products?.ventilation?.length > 0) products.push('Ventilation');

        const combo = products.sort().join(', ') || 'No Components';
        analysis.productCombos[combo] = (analysis.productCombos[combo] || 0) + 1;
      });

      // Transform data for charts
      const chartData = {
        componentCounts: Object.entries(analysis.componentCounts).map(([count, value]) => ({
          name: `${count} Components`,
          value
        })),
        warrantyTypes: Object.entries(analysis.warrantyTypes).map(([name, value]) => ({
          name,
          value
        })),
        productCombinations: Object.entries(analysis.productCombos).map(([name, value]) => ({
          name,
          value
        }))
      };

      setData(chartData);
    };

    analyzeData();
  }, []);

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="flex flex-col space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Warranty Coverage Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.warrantyTypes}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {data.warrantyTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Component Combinations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.productCombinations}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {data.productCombinations.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WarrantyAnalysis;