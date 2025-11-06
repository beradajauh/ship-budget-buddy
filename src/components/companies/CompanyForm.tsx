import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

import { Company, CompanyCOA, COAMapping, FormMode, Vendor, VendorCOA } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import CompanyVendorMappingDialog from './CompanyVendorMappingDialog';

interface CompanyFormProps {
  mode: FormMode;
  company?: Company | null;
  onSave: (company: Partial<Company>, mappings: COAMapping[]) => void;
  onClose: () => void;
}

export default function CompanyForm({ mode, company, onSave, onClose }: CompanyFormProps) {
  const [formData, setFormData] = useState({
    companyCode: company?.companyCode || '',
    companyName: company?.companyName || '',
    address: company?.address || '',
    phone: company?.phone || '',
    email: company?.email || '',
    status: company?.status || 'Active',
  });

  const [vendors] = useLocalStorage<Vendor[]>('vendors', []);
  const [mappings, setMappings] = useLocalStorage<COAMapping[]>(`companyMappings_${company?.id || 'new'}`, []);
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [mappingDialogVendor, setMappingDialogVendor] = useState<{ id: string; name: string } | null>(null);

  const isReadonly = mode === 'view';
  const title = mode === 'create' ? 'Add New Company' : mode === 'edit' ? 'Edit Company' : 'Company Details';

  // Load all company COAs from localStorage
  const companyCOAsKey = company?.id ? `companyCOA_${company.id}` : 'companyCOA_temp';
  const storedCompanyCOAs = localStorage.getItem(companyCOAsKey);
  const [companyCOAs] = useState<CompanyCOA[]>(() => {
    if (storedCompanyCOAs) {
      return JSON.parse(storedCompanyCOAs);
    }
    // Default sample COAs if none exist
    return [
      {
        id: `ccoa-temp-1`,
        companyId: company?.id || 'temp',
        coaCode: 'C-5100',
        coaName: 'Operating Expenses - Fuel',
        description: 'Biaya operasional bahan bakar',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `ccoa-temp-2`,
        companyId: company?.id || 'temp',
        coaCode: 'C-5200',
        coaName: 'Operating Expenses - Maintenance',
        description: 'Biaya operasional perawatan',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `ccoa-temp-3`,
        companyId: company?.id || 'temp',
        coaCode: 'C-5300',
        coaName: 'Operating Expenses - Crew',
        description: 'Biaya operasional kru',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode !== 'view') {
      onSave(formData, mappings);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddVendor = () => {
    if (!selectedVendor) return;

    // Check if vendor already added
    const vendorAlreadyAdded = mappings.some(m => m.vendorId === selectedVendor);
    if (vendorAlreadyAdded) {
      alert('Vendor ini sudah ditambahkan!');
      return;
    }

    const vendor = vendors.find(v => v.id === selectedVendor);
    if (!vendor) return;

    console.log('=== DEBUG ADD VENDOR ===');
    console.log('Selected Vendor ID:', selectedVendor);
    console.log('Vendor Name:', vendor.vendorName);
    
    // Debug: Check all localStorage keys
    console.log('All localStorage keys:', Object.keys(localStorage));
    console.log('Keys containing "vendorCOA":', Object.keys(localStorage).filter(k => k.includes('vendorCOA')));
    
    // Load vendor COAs from localStorage
    const vendorCOAsKey = `vendorCOA_${selectedVendor}`;
    console.log('Looking for key:', vendorCOAsKey);
    
    const vendorCOAsJson = localStorage.getItem(vendorCOAsKey);
    console.log('Raw JSON from localStorage:', vendorCOAsJson);
    
    const vendorCOAs: VendorCOA[] = vendorCOAsJson ? JSON.parse(vendorCOAsJson) : [];
    console.log('Parsed vendor COAs:', vendorCOAs);
    console.log('Number of COAs found:', vendorCOAs.length);

    if (vendorCOAs.length === 0) {
      const shouldNavigate = confirm(
        `Vendor "${vendor.vendorName}" belum memiliki Master COA.\n\n` +
        `Klik OK untuk kembali ke daftar Vendor dan tambahkan Master COA dengan klik icon Folder pada vendor "${vendor.vendorName}".`
      );
      
      if (shouldNavigate) {
        onClose();
      }
      return;
    }

    // Create placeholder mappings for this vendor
    const timestamp = Date.now();
    const newMappings: COAMapping[] = vendorCOAs.map((vendorCoa, index) => ({
      id: `mapping-${timestamp}-${index}`,
      companyCoaId: '',
      vendorCoaId: vendorCoa.id,
      companyId: company?.id || '',
      vendorId: selectedVendor,
      vendorCoaCode: vendorCoa.vendorCoaCode,
      vendorCoaName: vendorCoa.vendorCoaName,
      companyCoaCode: '',
      companyCoaName: '',
      relationshipType: 'Equivalent',
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    console.log('Created mappings:', newMappings);
    setMappings([...mappings, ...newMappings]);
    setSelectedVendor('');
  };

  const handleOpenMappingDialog = (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (vendor) {
      setMappingDialogVendor({ id: vendorId, name: vendor.vendorName });
    }
  };

  const handleSaveMappings = (updatedMappings: COAMapping[]) => {
    // Remove old mappings for this vendor
    const otherMappings = mappings.filter(m => m.vendorId !== mappingDialogVendor?.id);
    // Add updated mappings
    setMappings([...otherMappings, ...updatedMappings]);
  };

  const handleDeleteVendor = (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (confirm(`Hapus vendor "${vendor?.vendorName}" dan semua mapping COA-nya?`)) {
      setMappings(mappings.filter(m => m.vendorId !== vendorId));
    }
  };

  // Get unique vendors from mappings
  const linkedVendors = Array.from(new Set(mappings.map(m => m.vendorId)))
    .map(vendorId => vendors.find(v => v.id === vendorId))
    .filter(v => v !== undefined) as Vendor[];

  const totalMapped = mappings.filter(m => m.companyCoaId !== '').length;
  const totalUnmapped = mappings.length - totalMapped;

  const getVendorName = (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor?.vendorName || 'Unknown Vendor';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onClose} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="text-muted-foreground">
            {mode === 'create' ? 'Create a new company record' : 
             mode === 'edit' ? 'Update company information' : 
             'View company details'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Section: Company Info */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Company Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyCode">Company Code *</Label>
                  <Input
                    id="companyCode"
                    value={formData.companyCode}
                    onChange={(e) => handleChange('companyCode', e.target.value)}
                    placeholder="e.g., PT001"
                    required
                    readOnly={isReadonly}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleChange('status', value)}
                    disabled={isReadonly}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  placeholder="e.g., PT Pelayaran Nusantara"
                  required
                  readOnly={isReadonly}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Company address"
                  rows={3}
                  readOnly={isReadonly}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+62 xxx xxx xxx"
                    readOnly={isReadonly}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="contact@company.com"
                    readOnly={isReadonly}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detail Section: COA Mapping */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Linked Vendor and COA Mapping</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Vendor Section */}
            {!isReadonly && (
              <div className="flex gap-3">
                <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select vendor to add..." />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.filter(v => v.status === 'Active').map(vendor => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.vendorName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={handleAddVendor} disabled={!selectedVendor}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vendor
                </Button>
              </div>
            )}

            {/* Linked Vendors Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {linkedVendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">
                        {vendor.vendorName}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenMappingDialog(vendor.id)}
                          >
                            COA
                          </Button>
                          {!isReadonly && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteVendor(vendor.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {linkedVendors.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                        No linked vendors. {!isReadonly && 'Add a vendor to start mapping.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Summary */}
            <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Total Vendors</p>
                <p className="text-2xl font-bold">{linkedVendors.length}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Total Mappings</p>
                <p className="text-2xl font-bold">{mappings.length}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Mapped</p>
                <p className="text-2xl font-bold text-green-600">{totalMapped}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Unmapped</p>
                <p className="text-2xl font-bold text-orange-600">{totalUnmapped}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        {!isReadonly && (
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {mode === 'create' ? 'Create Company' : 'Update Company'}
            </Button>
          </div>
        )}
      </form>

      {/* COA Mapping Dialog */}
      {mappingDialogVendor && (
        <CompanyVendorMappingDialog
          vendorId={mappingDialogVendor.id}
          vendorName={mappingDialogVendor.name}
          companyId={company?.id || ''}
          companyCOAs={companyCOAs}
          mappings={mappings}
          onSave={handleSaveMappings}
          onClose={() => setMappingDialogVendor(null)}
        />
      )}
    </div>
  );
}
