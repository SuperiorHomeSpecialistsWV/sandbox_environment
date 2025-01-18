import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const GAFWarrantyGenerator = () => {
  const [selectedProducts, setSelectedProducts] = useState({
    shingles: '',
    starterStrips: [],
    ridgeCaps: [],
    leakBarriers: [],
    roofDeck: [],
    ventilation: []
  });

  const [contractorType, setContractorType] = useState('none');

  // Warranty requirement configurations
  const warrantyRequirements = {
    standard: { accessories: 3, contractor: 'none' },
    systemPlus: { accessories: 3, contractor: 'certified' },
    silverPledge: { accessories: 4, contractor: 'masterElite' },
    goldenPledge: { accessories: 5, contractor: 'masterElite' },
    windProven: { accessories: 4, contractor: 'none', requiresLayerLock: true }
  };

  // Check if product is LayerLock technology
  const isLayerLockProduct = (shingle) => {
    const layerLockProducts = ['Timberline HDZ', 'Timberline UHDZ', 'Timberline AS II'];
    return layerLockProducts.includes(shingle);
  };

  // Calculate eligible warranties based on selections
  const calculateEligibleWarranties = () => {
    const totalAccessories = [
      ...selectedProducts.starterStrips,
      ...selectedProducts.ridgeCaps,
      ...selectedProducts.leakBarriers,
      ...selectedProducts.roofDeck,
      ...selectedProducts.ventilation
    ].length;

    const hasLayerLock = isLayerLockProduct(selectedProducts.shingles);

    return {
      standard: totalAccessories >= 3,
      systemPlus: totalAccessories >= 3 && 
        ['certified', 'masterElite'].includes(contractorType),
      silverPledge: totalAccessories >= 4 && contractorType === 'masterElite',
      goldenPledge: totalAccessories >= 5 && contractorType === 'masterElite',
      windProven: totalAccessories >= 4 && hasLayerLock
    };
  };

  const eligibleWarranties = calculateEligibleWarranties();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">GAF Warranty Generator</h1>
      
      {/* Product Selection Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">1. Select Products</h2>
        
        {/* Shingles Selection */}
        <div className="border rounded-lg p-4">
          <label className="block mb-2">Shingle Type</label>
          <select 
            className="w-full border rounded p-2"
            value={selectedProducts.shingles}
            onChange={(e) => setSelectedProducts({
              ...selectedProducts,
              shingles: e.target.value
            })}
          >
            <option value="">Select Shingle</option>
            <option value="Timberline HDZ">Timberline HDZ</option>
            <option value="Timberline UHDZ">Timberline UHDZ</option>
            <option value="Timberline AS II">Timberline AS II</option>
            <option value="Grand Canyon">Grand Canyon</option>
            <option value="Camelot II">Camelot II</option>
          </select>
        </div>

        {/* Contractor Selection */}
        <div className="border rounded-lg p-4">
          <label className="block mb-2">Contractor Type</label>
          <select
            className="w-full border rounded p-2"
            value={contractorType}
            onChange={(e) => setContractorType(e.target.value)}
          >
            <option value="none">Standard Contractor</option>
            <option value="certified">GAF Certified</option>
            <option value="masterElite">Master Elite</option>
          </select>
        </div>
      </div>

      {/* Warranty Eligibility Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">2. Warranty Eligibility</h2>
        
        {/* Standard Warranty */}
        <Alert variant={eligibleWarranties.standard ? "default" : "destructive"}>
          {eligibleWarranties.standard ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>Standard Limited Warranty</AlertTitle>
          <AlertDescription>
            Requires 3 qualifying accessories. No contractor certification needed.
          </AlertDescription>
        </Alert>

        {/* System Plus */}
        <Alert variant={eligibleWarranties.systemPlus ? "default" : "destructive"}>
          {eligibleWarranties.systemPlus ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>System Plus Limited Warranty</AlertTitle>
          <AlertDescription>
            Requires 3 qualifying accessories and GAF Certified or Master Elite contractor.
          </AlertDescription>
        </Alert>

        {/* Silver Pledge */}
        <Alert variant={eligibleWarranties.silverPledge ? "default" : "destructive"}>
          {eligibleWarranties.silverPledge ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>Silver Pledge™ Limited Warranty</AlertTitle>
          <AlertDescription>
            Requires 4 qualifying accessories and Master Elite contractor.
          </AlertDescription>
        </Alert>

        {/* Golden Pledge */}
        <Alert variant={eligibleWarranties.goldenPledge ? "default" : "destructive"}>
          {eligibleWarranties.goldenPledge ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>Golden Pledge® Limited Warranty</AlertTitle>
          <AlertDescription>
            Requires 5 qualifying accessories and Master Elite contractor.
          </AlertDescription>
        </Alert>

        {/* WindProven */}
        <Alert variant={eligibleWarranties.windProven ? "default" : "destructive"}>
          {eligibleWarranties.windProven ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>WindProven™ Limited Wind Warranty</AlertTitle>
          <AlertDescription>
            Requires LayerLock Technology shingles and 4 specific accessories.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default GAFWarrantyGenerator;