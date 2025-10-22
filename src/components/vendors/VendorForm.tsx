import { useState } from 'react';
import { ArrowLeft, Save, Plus, Edit, Trash2, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Vendor, VendorCOA, FormMode } from '@/types';
import VendorCOAMappingDialog from './VendorCOAMappingDialog';
import VendorCOAForm from './VendorCOAForm';

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

  const [showCoaDialog, setShowCoaDialog] = useState(false);
  const [coaFormMode, setCoaFormMode] = useState<FormMode>('create');
  const [editingCoa, setEditingCoa] = useState<VendorCOA | null>(null);
  const [selectedCoaForMapping, setSelectedCoaForMapping] = useState<VendorCOA | null>(null);

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
    setCoaFormMode('create');
    setEditingCoa(null);
    setShowCoaDialog(true);
  };

  const handleEditCoa = (coa: VendorCOA, e: React.MouseEvent) => {
    e.stopPropagation();
    setCoaFormMode('edit');
    setEditingCoa(coa);
    setShowCoaDialog(true);
  };

  const handleDeleteCoa = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCoaList(coaList.filter(c => c.id !== id));
  };

  const handleSaveCoa = (coa: VendorCOA) => {
    if (coaFormMode === 'create') {
      const newCoa: VendorCOA = {
        ...coa,
        id: Date.now().toString(),
        vendorId: vendor?.id || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCoaList([...coaList, newCoa]);
    } else {
      setCoaList(coaList.map(c => c.id === coa.id ? { ...coa, updatedAt: new Date().toISOString() } : c));
    }
    setShowCoaDialog(false);
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

      {/* Master COA Vendor Button */}
      {!isReadonly && (
        <div className="flex justify-end">
          <Button 
            type="button" 
            onClick={handleAddCoa}
            variant="outline"
            className="gap-2"
          >
            <FolderOpen className="h-4 w-4" />
            Master COA Vendor
          </Button>
        </div>
      )}

      {/* COA Detail Table */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">COA Vendor Detail</CardTitle>
        </CardHeader>
        <CardContent>
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
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={(e) => handleEditCoa(coa, e)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={(e) => handleDeleteCoa(coa.id, e)}>
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

      {/* COA Form Dialog */}
      <VendorCOAForm
        mode={coaFormMode}
        vendorCOA={editingCoa}
        open={showCoaDialog}
        onClose={() => setShowCoaDialog(false)}
        onSave={handleSaveCoa}
      />

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