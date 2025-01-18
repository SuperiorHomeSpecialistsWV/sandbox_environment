import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import Papa from 'papaparse';
import { ProductMatcher } from '../lib/product-matcher';
import { determineWarrantyEligibility } from '../lib/warranty-rules';
import type { Customer, CustomerInvoice, WarrantyEligibility, SupplierInvoiceItem } from '../types';
import { getStandardProductName, getCleanProductName } from '../lib/product-utils';

const productMatcher = new ProductMatcher();

const WarrantyCalculator: React.FC = () => {
  const [data, setData] = useState<{ customers: Customer[]; invoices: CustomerInvoice[] } | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<CustomerInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warrantyResults, setWarrantyResults] = useState<WarrantyEligibility | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load all data sources
        const [customerData, invoiceData, supplierData] = await Promise.all([
          fetch('/data/customer_and_building_info.csv').then(res => res.text()),
          fetch('/data/customers_matched_to_supplier_invoices.csv').then(res => res.text()),
          fetch('/data/supplier_invoice_data.csv').then(res => res.text())
        ]);

        // Parse all CSV data
        const customers = Papa.parse(customerData, {
          header: true,
          skipEmptyLines: true
        }).data as Customer[];

        const customerInvoices = Papa.parse(invoiceData, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true
        }).data as CustomerInvoice[];

        const supplierInvoices = Papa.parse(supplierData, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true
        }).data;

        // Process and organize the supplier invoice data
        const supplierInvoiceItems = supplierInvoices.reduce((acc: { [key: string]: any }, row: any) => {
          if (!row.INVOICE_NUMBER) return acc;

          if (!acc[row.INVOICE_NUMBER]) {
            acc[row.INVOICE_NUMBER] = {
              invoiceNumber: row.INVOICE_NUMBER,
              shippingAddress: row.SHIPPING_ADDRESS || '',
              poNumber: row.PO_NUMBER || '',
              totalDue: parseFloat(row.TOTAL_DUE || '0'),
              items: []
            };
          }

          if (row.ITEM_NUMBER_COL) {
            acc[row.INVOICE_NUMBER].items.push({
              itemNumber: String(row.ITEM_NUMBER_COL || '').trim(),
              description: String(row.DESC_COL || '').trim(),
              quantity: parseInt(row.QTY_SHIP_COL || '0', 10),
              unitPrice: parseFloat(row.NET_UNIT_PRICE_COL || '0'),
              amount: parseFloat(row.NET_AMOUNT_COL || '0')
            });
          }

          return acc;
        }, {});

        // Match customer invoices with supplier data
        const processedInvoices = customerInvoices.map(invoice => ({
          ...invoice,
          supplierData: supplierInvoiceItems[invoice['Invoice Number']] || null
        }));

        setData({
          customers,
          invoices: processedInvoices
        });

        setError(null);
      } catch (err) {
        setError('Error loading data: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAnalyze = () => {
    if (!selectedInvoices.length) return;

    // Get all products from selected invoices
    const allProducts = selectedInvoices.flatMap(invoice =>
      invoice.supplierData?.items || []
    );

    // Process products and get category analysis
    const {
      validProducts,
      categories,
      shingleInfo,
      qualifyingCount
    } = productMatcher.processProducts(allProducts);

    if (!shingleInfo) {
      console.error('No valid shingle information found');
      return;
    }

    // Determine warranty eligibility
    const eligibility = determineWarrantyEligibility(
      categories,
      qualifyingCount,
      {
        series: shingleInfo.series || '',
        product: shingleInfo.product || '',
        features: shingleInfo.features || {}
      }
    );

    // Update state with results
    setWarrantyResults({
      ...eligibility,
      categories,
      qualifyingCount,
      shingleInfo,
      processedProducts: validProducts,
      accessoryProducts: {
        starterStrip: validProducts.find(p => p.matchedProduct?.category === 'STARTER_STRIPS')?.matchedProduct?.product,
        ventilation: validProducts.find(p => p.matchedProduct?.category === 'VENTILATION')?.matchedProduct?.product,
        leakBarrier: validProducts.find(p => p.matchedProduct?.category === 'LEAK_BARRIER')?.matchedProduct?.product,
        roofDeck: validProducts.find(p => p.matchedProduct?.category === 'ROOF_DECK')?.matchedProduct?.product,
        ridgeCap: validProducts.find(p => p.matchedProduct?.category === 'RIDGE_CAPS')?.matchedProduct?.product
      }
    } as WarrantyEligibility);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">GAF Warranty Calculator</h2>

      {/* Customer Selection */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Select Customer</h3>
        <select
          className="w-full p-2 border rounded"
          value={selectedCustomer?.Customer || ''}
          onChange={(e) => {
            const customer = data?.customers.find(c => c.Customer === e.target.value);
            setSelectedCustomer(customer || null);
            setSelectedInvoices([]);
            setWarrantyResults(null);
          }}
        >
          <option value="">Select a customer...</option>
          {data?.customers
            .filter((customer, index, self) =>
              index === self.findIndex(c => c.Customer === customer.Customer)
            )
            .map(customer => (
              <option key={customer.Customer} value={customer.Customer}>
                {customer['First Name']} {customer['Last Name']} - {customer.Address}
              </option>
          ))}
        </select>
      </div>

      {/* Invoice Selection */}
      {selectedCustomer && (
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Select Invoices</h3>
          <div className="space-y-2">
            {data?.invoices
              .filter(inv => inv['Customer Name'] === selectedCustomer.Customer)
              .map(invoice => (
                <label
                  key={invoice['Invoice Number']}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedInvoices.includes(invoice)}
                    onChange={() => {
                      setSelectedInvoices(prev => {
                        const exists = prev.includes(invoice);
                        return exists
                          ? prev.filter(i => i !== invoice)
                          : [...prev, invoice];
                      });
                      setWarrantyResults(null);
                    }}
                    className="w-4 h-4"
                  />
                  <span>Invoice #{invoice['Invoice Number']}</span>
                </label>
              ))}
          </div>

          {selectedInvoices.length > 0 && (
            <>
              {/* Invoice Line Items Display */}
              <div className="mt-6">
                <h4 className="text-md font-semibold mb-2">Invoice Line Items</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Number</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedInvoices.map(invoice => (
                        <React.Fragment key={invoice['Invoice Number']}>
                          {/* Invoice Header Row */}
                          <tr className="bg-gray-50">
                            <td colSpan={6} className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                              Invoice #{invoice['Invoice Number']} - {invoice.supplierData?.poNumber || 'N/A'}
                              {invoice['Invoice Number'].toString().includes('RETURN') && <span className="ml-2 text-red-600">(Return)</span>}
                            </td>
                          </tr>
                          {/* Invoice Items */}
                          {(invoice.supplierData?.items || []).map((item, index) => (
                            <tr key={`${invoice['Invoice Number']}-${index}`} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.itemNumber}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.description}</td>
                              <td className={`px-6 py-4 whitespace-nowrap text-sm ${item.amount < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                {item.amount < 0 ? `-${Math.abs(item.quantity)}` : item.quantity}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.unitPrice.toFixed(2)}</td>
                              <td className={`px-6 py-4 whitespace-nowrap text-sm ${item.amount < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                ${item.amount.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                          {/* Invoice Subtotal Row */}
                          <tr className="bg-gray-100">
                            <td colSpan={5} className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                              Subtotal for Invoice #{invoice['Invoice Number']}:
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              ${(invoice.supplierData?.items || []).reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Analyze Warranty Eligibility
              </button>
            </>
          )}
        </div>
      )}

      {/* Results Display */}
      {warrantyResults && (
        <div className="space-y-6">
          {/* Product Categories Analysis */}
          <h3 className="text-xl font-semibold">Product Categories Analysis</h3>
          {Object.entries(warrantyResults.categories).map(([category, present]) => {
            if (!present) return null;

            const categoryName = category.replace(/^has/, '').replace(/([A-Z])/g, ' $1').trim();
            const items = warrantyResults.processedProducts.filter(p =>
              p.matchedProduct?.category === categoryName.replace(/\s+/g, '_').toUpperCase()
            );

            return (
              <div key={category} className="border rounded-lg p-4 bg-green-50">
                <h4 className="font-medium mb-2">{categoryName}</h4>
                <table className="min-w-full">
                  <thead className="bg-white">
                    <tr>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase p-2">Invoice #</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase p-2">Item #</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase p-2">Description</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase p-2">Qty</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase p-2">Unit Price</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase p-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => {
                      const invoice = selectedInvoices.find(inv =>
                        inv.supplierData?.items?.some(i =>
                          i.itemNumber === item.itemNumber &&
                          i.description === item.description
                        )
                      );
                      return (
                        <tr key={idx} className="hover:bg-white">
                          <td className="text-sm text-gray-500 p-2">{invoice?.['Invoice Number'] || ''}</td>
                          <td className="text-sm text-gray-500 p-2">{item.itemNumber}</td>
                          <td className="text-sm text-gray-500 p-2">{item.description}</td>
                          <td className={`text-sm p-2 ${item.amount < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                            {item.amount < 0 ? `-${Math.abs(item.quantity)}` : item.quantity}
                          </td>
                          <td className="text-sm text-gray-500 p-2">${item.unitPrice.toFixed(2)}</td>
                          <td className={`text-sm p-2 ${item.amount < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                            ${item.amount.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="border-t">
                      <td colSpan={5} className="text-right font-medium p-2">Subtotal:</td>
                      <td className="font-medium p-2">${items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}

          {/* Eligibility Summary */}
          <div className="border rounded-lg p-4 bg-blue-50">
            <h4 className="font-medium mb-4">Eligibility Summary</h4>

            {/* Shingle Information */}
            <div className="mb-4">
              <h5 className="font-medium text-gray-800 mb-2">Shingle Information</h5>
              <div className="space-y-1">
                <div>
                  <span className="text-sm font-medium text-gray-600">Shingle Series:</span>
                  <span className="ml-2">{warrantyResults.shingleInfo?.series || 'Not Found'}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Product:</span>
                  <span className="ml-2">{warrantyResults.shingleInfo?.product || 'Not Found'}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Color:</span>
                  <span className="ml-2">{warrantyResults.shingleInfo?.color || 'Not Found'}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Features:</span>
                  <span className="ml-2">
                    {warrantyResults.shingleInfo?.features ? (
                      Object.entries(warrantyResults.shingleInfo.features)
                        .filter(([_, value]) => value)
                        .map(([key]) => key)
                        .join(', ') || 'None'
                    ) : 'Not Found'}
                  </span>
                </div>
              </div>
            </div>

            {/* GAF Accessories */}
            <div className="mb-4">
              <h5 className="font-medium text-gray-800 mb-2">GAF Accessories</h5>
              <div className="space-y-1">
                {warrantyResults.accessoryProducts.starterStrip && (
                  <div className="flex justify-between">
                    <span className="text-sm">Starter Strip Shingles</span>
                    <span className="text-sm">{warrantyResults.accessoryProducts.starterStrip}</span>
                  </div>
                )}

                {warrantyResults.accessoryProducts.ventilation && (
                  <div className="flex justify-between">
                    <span className="text-sm">Cobra® Ventilation</span>
                    <span className="text-sm">{warrantyResults.accessoryProducts.ventilation}</span>
                  </div>
                )}

                {warrantyResults.accessoryProducts.leakBarrier && (
                  <div className="flex justify-between">
                    <span className="text-sm">Leak Barrier</span>
                    <span className="text-sm">{warrantyResults.accessoryProducts.leakBarrier}</span>
                  </div>
                )}

                {warrantyResults.accessoryProducts.roofDeck && (
                  <div className="flex justify-between">
                    <span className="text-sm">Roof Deck Protection</span>
                    <span className="text-sm">{warrantyResults.accessoryProducts.roofDeck}</span>
                  </div>
                )}

                {warrantyResults.accessoryProducts.ridgeCap && (
                  <div className="flex justify-between">
                    <span className="text-sm">Ridge Cap Shingles</span>
                    <span className="text-sm">{warrantyResults.accessoryProducts.ridgeCap}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Component Count */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Component Count:</span>
                <span className="font-medium">{warrantyResults.qualifyingCount} of 5</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Standard Limited
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  System Plus Limited (GAF Certified™)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarrantyCalculator;
