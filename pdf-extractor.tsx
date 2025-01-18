import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Download } from 'lucide-react';

const PDFExtractor = () => {
  const [extractedData, setExtractedData] = useState([]);

  // Function to parse and extract data from the PDFs
  const extractPDFData = async () => {
    // Create an array to store all measurements
    let measurements = [];

    try {
      // Read and process each PDF document
      const docs = document.querySelectorAll('antml\\:document');
      
      docs.forEach(doc => {
        const pages = doc.querySelectorAll('antml\\:document_content');
        let measurement = {
          reportType: '',
          address: '',
          reportNumber: '',
          date: '',
          measurements: {}
        };

        pages.forEach(page => {
          const content = page.textContent;

          // Extract basic information
          if (!measurement.address && content.includes('Indian Lake Drive')) {
            measurement.address = '1111 Indian Lake Drive, Elkview, WV 25071';
          }
          if (!measurement.date && content.includes('August')) {
            const dateMatch = content.match(/August \d+, 2024/);
            if (dateMatch) measurement.date = dateMatch[0];
          }
          if (!measurement.reportNumber && content.includes('Report:')) {
            const reportMatch = content.match(/Report:\s*(\d+)/);
            if (reportMatch) measurement.reportNumber = reportMatch[1];
          }

          // Determine report type and extract specific measurements
          if (content.includes('GutterReport')) {
            measurement.reportType = 'Gutter Report';
            const eaveLengthMatch = content.match(/Total Eave Length:\s*(\d+)\s*ft/);
            const downspoutsMatch = content.match(/Est\. Number of\s*Downspouts:\s*(\d+)/);
            
            if (eaveLengthMatch) measurement.measurements.totalEaveLength = eaveLengthMatch[1] + ' ft';
            if (downspoutsMatch) measurement.measurements.estimatedDownspouts = downspoutsMatch[1];
          } 
          else if (content.includes('Extended Coverage 2D')) {
            measurement.reportType = 'Extended Coverage 2D';
            
            // Extract roof measurements
            const matches = {
              totalArea: content.match(/Total Area\s*=\s*([\d,]+)\s*sq ft/),
              ridges: content.match(/Total Ridges\s*=\s*(\d+)\s*ft/),
              valleys: content.match(/Total Valleys\s*=\s*(\d+)\s*ft/),
              rakes: content.match(/Total Rakes\s*=\s*(\d+)\s*ft/),
              eaves: content.match(/Total Eaves\s*=\s*(\d+)\s*ft/),
              predominantPitch: content.match(/Predominant Pitch\s*=\s*(\d+\/\d+)/)
            };

            Object.entries(matches).forEach(([key, match]) => {
              if (match) {
                measurement.measurements[key] = match[1];
              }
            });
          }
        });

        if (Object.keys(measurement.measurements).length > 0) {
          measurements.push(measurement);
        }
      });

      setExtractedData(measurements);
    } catch (error) {
      console.error('Error extracting data:', error);
    }
  };

  // Function to download data as CSV
  const downloadCSV = () => {
    if (extractedData.length === 0) return;

    // Create CSV headers
    const headers = ['Report Type', 'Address', 'Report Number', 'Date'];
    const measurementHeaders = new Set();
    extractedData.forEach(data => {
      Object.keys(data.measurements).forEach(key => measurementHeaders.add(key));
    });

    const allHeaders = [...headers, ...Array.from(measurementHeaders)];
    
    // Create CSV rows
    const csvRows = [allHeaders.join(',')];
    
    extractedData.forEach(data => {
      const row = [
        data.reportType,
        data.address,
        data.reportNumber,
        data.date,
        ...Array.from(measurementHeaders).map(header => 
          data.measurements[header] || ''
        )
      ];
      csvRows.push(row.join(','));
    });

    // Create and download CSV file
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'measurements.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">PDF Data Extractor</h2>
            <p className="text-gray-500">Extract measurements from PDF reports</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={extractPDFData}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Extract Data
            </button>
            <button 
              onClick={downloadCSV}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
              disabled={extractedData.length === 0}
            >
              <Download size={16} />
              Download CSV
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {extractedData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-2 text-left">Report Type</th>
                  <th className="border border-gray-200 p-2 text-left">Address</th>
                  <th className="border border-gray-200 p-2 text-left">Report Number</th>
                  <th className="border border-gray-200 p-2 text-left">Date</th>
                  <th className="border border-gray-200 p-2 text-left">Measurements</th>
                </tr>
              </thead>
              <tbody>
                {extractedData.map((data, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-200 p-2">{data.reportType}</td>
                    <td className="border border-gray-200 p-2">{data.address}</td>
                    <td className="border border-gray-200 p-2">{data.reportNumber}</td>
                    <td className="border border-gray-200 p-2">{data.date}</td>
                    <td className="border border-gray-200 p-2">
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(data.measurements, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Click "Extract Data" to begin processing the PDF reports
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PDFExtractor;