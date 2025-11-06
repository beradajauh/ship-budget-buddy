import { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { CompanyCOA, COAMapping } from '@/types';

interface COAMappingDialogProps {
  companyCoa: CompanyCOA;
  companyId: string;
  onClose: () => void;
  readonly?: boolean;
}

export default function COAMappingDialog({ companyCoa, companyId, onClose, readonly = false }: COAMappingDialogProps) {
  // Mock data
  const mockVendors = [
    { id: '1', vendorName: 'PT Marina Services' },
    { id: '2', vendorName: 'PT Ocean Supply' },
  ];

  const mockVendorCOAs = {
    '1': [
      { id: 'v1', vendorCoaCode: 'VEN001', vendorCoaName: 'Services', vendorId: '1', description: 'Service charges', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'v2', vendorCoaCode: 'VEN002', vendorCoaName: 'Supplies', vendorId: '1', description: 'Material supplies', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ],
    '2': [
      { id: 'v3', vendorCoaCode: 'VEN003', vendorCoaName: 'Materials', vendorId: '2', description: 'Raw materials', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ],
  };

  const [mappings, setMappings] = useState<COAMapping[]>([
    {
      id: '1',
      companyCoaId: companyCoa.id,
      vendorCoaId: 'v1',
      companyId: companyId,
      vendorId: '1',
      vendorCoaCode: 'VEN001',
      vendorCoaName: 'Services',
      companyCoaCode: companyCoa.coaCode,
      companyCoaName: companyCoa.coaName,
      relationshipType: 'Equivalent',
      vendorCOA: mockVendorCOAs['1'][0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingMapping, setEditingMapping] = useState<COAMapping | null>(null);
  const [formData, setFormData] = useState({
    vendorId: '',
    vendorCoaId: '',
    relationshipType: 'Equivalent' as 'Equivalent' | 'Custom Mapping',
  });

  const filteredVendorCOAs = formData.vendorId ? mockVendorCOAs[formData.vendorId as keyof typeof mockVendorCOAs] || [] : [];

  const handleAddMapping = () => {
    setEditingMapping(null);
    setFormData({ vendorId: '', vendorCoaId: '', relationshipType: 'Equivalent' });
    setShowForm(true);
  };

  const handleEditMapping = (mapping: COAMapping) => {
    setEditingMapping(mapping);
    setFormData({
      vendorId: mapping.vendorId,
      vendorCoaId: mapping.vendorCoaId,
      relationshipType: mapping.relationshipType,
    });
    setShowForm(true);
  };

  const handleDeleteMapping = (id: string) => {
    setMappings(mappings.filter(m => m.id !== id));
  };

  const handleSaveMapping = () => {
    const selectedVendorCOA = filteredVendorCOAs.find(v => v.id === formData.vendorCoaId);
    if (editingMapping) {
      setMappings(mappings.map(m => 
        m.id === editingMapping.id 
          ? { 
              ...m, 
              vendorId: formData.vendorId, 
              vendorCoaId: formData.vendorCoaId,
              vendorCoaCode: selectedVendorCOA?.vendorCoaCode || '',
              vendorCoaName: selectedVendorCOA?.vendorCoaName || '',
              relationshipType: formData.relationshipType,
              vendorCOA: selectedVendorCOA,
            } 
          : m
      ));
    } else {
      const newMapping: COAMapping = {
        id: Date.now().toString(),
        companyCoaId: companyCoa.id,
        vendorCoaId: formData.vendorCoaId,
        companyId: companyId,
        vendorId: formData.vendorId,
        vendorCoaCode: selectedVendorCOA?.vendorCoaCode || '',
        vendorCoaName: selectedVendorCOA?.vendorCoaName || '',
        companyCoaCode: companyCoa.coaCode,
        companyCoaName: companyCoa.coaName,
        relationshipType: formData.relationshipType,
        vendorCOA: selectedVendorCOA,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setMappings([...mappings, newMapping]);
    }
    setShowForm(false);
  };

  const getVendorName = (vendorId: string) => {
    return mockVendors.find(v => v.id === vendorId)?.vendorName || '';
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-foreground">Linked COA Vendor</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Company COA: <span className="font-medium">{companyCoa.coaCode} - {companyCoa.coaName}</span>
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {!readonly && (
            <Button onClick={handleAddMapping} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Mapping
            </Button>
          )}

          {showForm && (
            <Card className="border-accent">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Vendor Name *</Label>
                      <Select value={formData.vendorId} onValueChange={(value) => setFormData({...formData, vendorId: value, vendorCoaId: ''})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vendor" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockVendors.map(vendor => (
                            <SelectItem key={vendor.id} value={vendor.id}>
                              {vendor.vendorName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Vendor COA Code *</Label>
                      <Select 
                        value={formData.vendorCoaId} 
                        onValueChange={(value) => setFormData({...formData, vendorCoaId: value})}
                        disabled={!formData.vendorId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select vendor COA" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredVendorCOAs.map(coa => (
                            <SelectItem key={coa.id} value={coa.id}>
                              {coa.vendorCoaCode} - {coa.vendorCoaName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Relationship Type *</Label>
                    <Select value={formData.relationshipType} onValueChange={(value: 'Equivalent' | 'Custom Mapping') => setFormData({...formData, relationshipType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Equivalent">Equivalent</SelectItem>
                        <SelectItem value="Custom Mapping">Custom Mapping</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowForm(false)} size="sm">
                      Cancel
                    </Button>
                    <Button onClick={handleSaveMapping} size="sm" disabled={!formData.vendorId || !formData.vendorCoaId}>
                      {editingMapping ? 'Update Mapping' : 'Add Mapping'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Vendor COA Code</TableHead>
                <TableHead>Vendor COA Name</TableHead>
                <TableHead>Relationship Type</TableHead>
                {!readonly && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {mappings.map((mapping) => (
                <TableRow key={mapping.id}>
                  <TableCell>{getVendorName(mapping.vendorId)}</TableCell>
                  <TableCell className="font-medium">{mapping.vendorCOA?.vendorCoaCode}</TableCell>
                  <TableCell>{mapping.vendorCOA?.vendorCoaName}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      mapping.relationshipType === 'Equivalent' 
                        ? 'bg-success/20 text-success-foreground' 
                        : 'bg-accent/20 text-accent-foreground'
                    }`}>
                      {mapping.relationshipType}
                    </span>
                  </TableCell>
                  {!readonly && (
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditMapping(mapping)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteMapping(mapping.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {mappings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={readonly ? 4 : 5} className="text-center text-muted-foreground">
                    No vendor mappings found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}