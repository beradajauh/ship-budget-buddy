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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [editingMapping, setEditingMapping] = useState<COAMapping | null>(null);

  const isReadonly = mode === 'view';
  const title = mode === 'create' ? 'Add New Company' : mode === 'edit' ? 'Edit Company' : 'Company Details';

  // Load all company COAs from localStorage
  const [companyCOAs] = useLocalStorage<CompanyCOA[]>(`companyCOA_${company?.id || 'temp'}`, []);

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

    const vendor = vendors.find(v => v.id === selectedVendor);
    if (!vendor) return;

    // Load vendor COAs from localStorage
    const vendorCOAsKey = `vendorCOA_${selectedVendor}`;
    const vendorCOAsJson = localStorage.getItem(vendorCOAsKey);
    const vendorCOAs: VendorCOA[] = vendorCOAsJson ? JSON.parse(vendorCOAsJson) : [];

    // Create mappings for all vendor COAs
    const newMappings: COAMapping[] = vendorCOAs.map(vendorCoa => ({
      id: Date.now().toString() + Math.random(),
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

    setMappings([...mappings, ...newMappings]);
    setSelectedVendor('');
  };

  const handleUpdateMapping = (mappingId: string, field: string, value: string) => {
    setMappings(mappings.map(m => {
      if (m.id === mappingId) {
        const updated = { ...m, [field]: value };
        
        // If company COA is selected, auto-fill code and name
        if (field === 'companyCoaId') {
          const companyCoa = companyCOAs.find(c => c.id === value);
          if (companyCoa) {
            updated.companyCoaCode = companyCoa.coaCode;
            updated.companyCoaName = companyCoa.coaName;
          }
        }
        
        return updated;
      }
      return m;
    }));
  };

  const handleDeleteMapping = (mappingId: string) => {
    if (confirm('Are you sure you want to delete this mapping?')) {
      setMappings(mappings.filter(m => m.id !== mappingId));
    }
  };

  const filteredMappings = mappings.filter(m => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      m.vendorCoaCode.toLowerCase().includes(search) ||
      m.vendorCoaName.toLowerCase().includes(search) ||
      m.companyCoaCode.toLowerCase().includes(search) ||
      m.companyCoaName.toLowerCase().includes(search)
    );
  });

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

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search mappings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Mappings Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor Name</TableHead>
                    <TableHead>Vendor COA Code</TableHead>
                    <TableHead>Vendor COA Name</TableHead>
                    <TableHead>Company COA</TableHead>
                    <TableHead>Relationship Type</TableHead>
                    <TableHead>Notes</TableHead>
                    {!isReadonly && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMappings.map((mapping) => (
                    <TableRow 
                      key={mapping.id}
                      className={mapping.companyCoaId ? 'bg-green-50 dark:bg-green-950/20' : ''}
                    >
                      <TableCell className="font-medium">
                        {getVendorName(mapping.vendorId)}
                      </TableCell>
                      <TableCell>{mapping.vendorCoaCode}</TableCell>
                      <TableCell>{mapping.vendorCoaName}</TableCell>
                      <TableCell>
                        {isReadonly ? (
                          <div>
                            <div className="font-medium">{mapping.companyCoaCode || '-'}</div>
                            <div className="text-sm text-muted-foreground">{mapping.companyCoaName || '-'}</div>
                          </div>
                        ) : (
                          <Select
                            value={mapping.companyCoaId}
                            onValueChange={(value) => handleUpdateMapping(mapping.id, 'companyCoaId', value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select COA..." />
                            </SelectTrigger>
                            <SelectContent>
                              {companyCOAs.map(coa => (
                                <SelectItem key={coa.id} value={coa.id}>
                                  {coa.coaCode} - {coa.coaName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell>
                        {isReadonly ? (
                          <Badge variant={mapping.relationshipType === 'Equivalent' ? 'default' : 'secondary'}>
                            {mapping.relationshipType}
                          </Badge>
                        ) : (
                          <Select
                            value={mapping.relationshipType}
                            onValueChange={(value) => handleUpdateMapping(mapping.id, 'relationshipType', value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Equivalent">Equivalent</SelectItem>
                              <SelectItem value="Custom Mapping">Custom Mapping</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell>
                        {isReadonly ? (
                          <span className="text-sm">{mapping.notes || '-'}</span>
                        ) : (
                          <Input
                            value={mapping.notes || ''}
                            onChange={(e) => handleUpdateMapping(mapping.id, 'notes', e.target.value)}
                            placeholder="Add notes..."
                          />
                        )}
                      </TableCell>
                      {!isReadonly && (
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMapping(mapping.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                  {filteredMappings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={isReadonly ? 6 : 7} className="text-center text-muted-foreground py-8">
                        No COA mappings found. {!isReadonly && 'Add a vendor to start mapping.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Summary */}
            <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
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
    </div>
  );
}
