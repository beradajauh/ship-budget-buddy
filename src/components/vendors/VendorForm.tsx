import { useState } from 'react';
import { ArrowLeft, Save, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Vendor, VendorCOA, FormMode } from '@/types';
import VendorCOAMappingDialog from './VendorCOAMappingDialog';

interface VendorFormProps {
  mode: FormMode;
  vendor?: Vendor | null;
  onSave: (vendor: Partial<Vendor>) => void;
  onClose: () => void;
}

export default function VendorForm({ mode, vendor, onSave, onClose }: VendorFormProps) {
  const [formData, setFormData] = useState({
    vendorCode: vendor?.vendorCode || '',
    vendorName: vendor?.vendorName || '',
    address: vendor?.address || '',
    phone: vendor?.phone || '',
    email: vendor?.email || '',
    taxId: vendor?.taxId || '',
    status: vendor?.status || 'Active',
  });

  // Mock COA data
  const [coaList, setCoaList] = useState<VendorCOA[]>([
    { id: '1', vendorId: vendor?.id || '', vendorCoaCode: 'VEN001', vendorCoaName: 'Services', description: 'Service charges', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', vendorId: vendor?.id || '', vendorCoaCode: 'VEN002', vendorCoaName: 'Supplies', description: 'Material supplies', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ]);

  const [showCoaForm, setShowCoaForm] = useState(false);
  const [editingCoa, setEditingCoa] = useState<VendorCOA | null>(null);
  const [selectedCoaForMapping, setSelectedCoaForMapping] = useState<VendorCOA | null>(null);
  const [coaFormData, setCoaFormData] = useState({ vendorCoaCode: '', vendorCoaName: '', description: '' });

  const isReadonly = mode === 'view';
  const title = mode === 'create' ? 'Add New Vendor' : mode === 'edit' ? 'Edit Vendor' : 'Vendor Details';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode !== 'view') {
      onSave(formData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddCoa = () => {
    setEditingCoa(null);
    setCoaFormData({ vendorCoaCode: '', vendorCoaName: '', description: '' });
    setShowCoaForm(true);
  };

  const handleEditCoa = (coa: VendorCOA) => {
    setEditingCoa(coa);
    setCoaFormData({ vendorCoaCode: coa.vendorCoaCode, vendorCoaName: coa.vendorCoaName, description: coa.description });
    setShowCoaForm(true);
  };

  const handleDeleteCoa = (id: string) => {
    setCoaList(coaList.filter(c => c.id !== id));
  };

  const handleSaveCoa = () => {
    if (editingCoa) {
      setCoaList(coaList.map(c => c.id === editingCoa.id ? { ...c, ...coaFormData } : c));
    } else {
      const newCoa: VendorCOA = {
        id: Date.now().toString(),
        vendorId: vendor?.id || '',
        ...coaFormData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCoaList([...coaList, newCoa]);
    }
    setShowCoaForm(false);
    setCoaFormData({ vendorCoaCode: '', vendorCoaName: '', description: '' });
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
            {mode === 'create' ? 'Add a new vendor to manage your vessels' : 
             mode === 'edit' ? 'Update vendor information' : 
             'View vendor details'}
          </p>
        </div>
      </div>

      {/* Header Form */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Vendor Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="vendorCode">Vendor Code *</Label>
                <Input
                  id="vendorCode"
                  value={formData.vendorCode}
                  onChange={(e) => handleChange('vendorCode', e.target.value)}
                  placeholder="e.g., VD001"
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
              <Label htmlFor="vendorName">Vendor Name *</Label>
              <Input
                id="vendorName"
                value={formData.vendorName}
                onChange={(e) => handleChange('vendorName', e.target.value)}
                placeholder="e.g., PT Marina Services"
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
                placeholder="Vendor address"
                rows={3}
                readOnly={isReadonly}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  placeholder="contact@vendor.com"
                  readOnly={isReadonly}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId">NPWP</Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => handleChange('taxId', e.target.value)}
                  placeholder="Tax identification number"
                  readOnly={isReadonly}
                />
              </div>
            </div>

            {!isReadonly && (
              <div className="flex justify-end space-x-3 pt-6">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {mode === 'create' ? 'Create Vendor' : 'Update Vendor'}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* COA Detail Table */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">COA Vendor</CardTitle>
          {!isReadonly && (
            <Button onClick={handleAddCoa} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add COA
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {showCoaForm && (
            <Card className="mb-4 border-accent">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Vendor COA Code *</Label>
                      <Input
                        value={coaFormData.vendorCoaCode}
                        onChange={(e) => setCoaFormData({...coaFormData, vendorCoaCode: e.target.value})}
                        placeholder="e.g., VEN001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Vendor COA Name *</Label>
                      <Input
                        value={coaFormData.vendorCoaName}
                        onChange={(e) => setCoaFormData({...coaFormData, vendorCoaName: e.target.value})}
                        placeholder="e.g., Services"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={coaFormData.description}
                      onChange={(e) => setCoaFormData({...coaFormData, description: e.target.value})}
                      placeholder="Description"
                      rows={2}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowCoaForm(false)} size="sm">
                      Cancel
                    </Button>
                    <Button onClick={handleSaveCoa} size="sm">
                      Save COA
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor COA Code</TableHead>
                <TableHead>Vendor COA Name</TableHead>
                <TableHead>Description</TableHead>
                {!isReadonly && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {coaList.map((coa) => (
                <TableRow 
                  key={coa.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedCoaForMapping(coa)}
                >
                  <TableCell className="font-medium">{coa.vendorCoaCode}</TableCell>
                  <TableCell>{coa.vendorCoaName}</TableCell>
                  <TableCell>{coa.description}</TableCell>
                  {!isReadonly && (
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" onClick={() => handleEditCoa(coa)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCoa(coa.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {coaList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isReadonly ? 3 : 4} className="text-center text-muted-foreground">
                    No COA records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* COA Mapping Dialog */}
      {selectedCoaForMapping && (
        <VendorCOAMappingDialog
          vendorCoa={selectedCoaForMapping}
          vendorId={vendor?.id || ''}
          onClose={() => setSelectedCoaForMapping(null)}
          readonly={isReadonly}
        />
      )}
    </div>
  );
}