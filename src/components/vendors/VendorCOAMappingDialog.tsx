import { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { VendorCOA, COAMapping } from '@/types';

interface VendorCOAMappingDialogProps {
  vendorCoa: VendorCOA;
  vendorId: string;
  onClose: () => void;
  readonly?: boolean;
}

export default function VendorCOAMappingDialog({ vendorCoa, vendorId, onClose, readonly = false }: VendorCOAMappingDialogProps) {
  // Mock data
  const mockCompanies = [
    { id: '1', companyName: 'PT Pelayaran Nusantara' },
    { id: '2', companyName: 'PT Maritime Indonesia' },
  ];

  const mockCompanyCOAs = {
    '1': [
      { id: 'c1', coaCode: 'COA001', coaName: 'Operating Expenses', companyId: '1', description: 'Day to day operational costs', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'c2', coaCode: 'COA002', coaName: 'Maintenance & Repairs', companyId: '1', description: 'Vessel maintenance costs', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ],
    '2': [
      { id: 'c3', coaCode: 'COA003', coaName: 'Operational Costs', companyId: '2', description: 'General operational expenses', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ],
  };

  const [mappings, setMappings] = useState<COAMapping[]>([
    {
      id: '1',
      companyCoaId: 'c1',
      vendorCoaId: vendorCoa.id,
      companyId: '1',
      vendorId: vendorId,
      relationshipType: 'Mapping',
      companyCOA: mockCompanyCOAs['1'][0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingMapping, setEditingMapping] = useState<COAMapping | null>(null);
  const [formData, setFormData] = useState({
    companyId: '',
    companyCoaId: '',
    relationshipType: 'Equivalent' as 'Equivalent' | 'Mapping',
  });

  const filteredCompanyCOAs = formData.companyId ? mockCompanyCOAs[formData.companyId as keyof typeof mockCompanyCOAs] || [] : [];

  const handleAddMapping = () => {
    setEditingMapping(null);
    setFormData({ companyId: '', companyCoaId: '', relationshipType: 'Equivalent' });
    setShowForm(true);
  };

  const handleEditMapping = (mapping: COAMapping) => {
    setEditingMapping(mapping);
    setFormData({
      companyId: mapping.companyId,
      companyCoaId: mapping.companyCoaId,
      relationshipType: mapping.relationshipType,
    });
    setShowForm(true);
  };

  const handleDeleteMapping = (id: string) => {
    setMappings(mappings.filter(m => m.id !== id));
  };

  const handleSaveMapping = () => {
    if (editingMapping) {
      setMappings(mappings.map(m => 
        m.id === editingMapping.id 
          ? { 
              ...m, 
              companyId: formData.companyId, 
              companyCoaId: formData.companyCoaId, 
              relationshipType: formData.relationshipType,
              companyCOA: filteredCompanyCOAs.find(c => c.id === formData.companyCoaId),
            } 
          : m
      ));
    } else {
      const newMapping: COAMapping = {
        id: Date.now().toString(),
        companyCoaId: formData.companyCoaId,
        vendorCoaId: vendorCoa.id,
        companyId: formData.companyId,
        vendorId: vendorId,
        relationshipType: formData.relationshipType,
        companyCOA: filteredCompanyCOAs.find(c => c.id === formData.companyCoaId),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setMappings([...mappings, newMapping]);
    }
    setShowForm(false);
  };

  const getCompanyName = (companyId: string) => {
    return mockCompanies.find(c => c.id === companyId)?.companyName || '';
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-foreground">Linked Company COA</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Vendor COA: <span className="font-medium">{vendorCoa.vendorCoaCode} - {vendorCoa.vendorCoaName}</span>
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
                      <Label>Company Name *</Label>
                      <Select value={formData.companyId} onValueChange={(value) => setFormData({...formData, companyId: value, companyCoaId: ''})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockCompanies.map(company => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.companyName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Company COA Code *</Label>
                      <Select 
                        value={formData.companyCoaId} 
                        onValueChange={(value) => setFormData({...formData, companyCoaId: value})}
                        disabled={!formData.companyId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select company COA" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredCompanyCOAs.map(coa => (
                            <SelectItem key={coa.id} value={coa.id}>
                              {coa.coaCode} - {coa.coaName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Relationship Type *</Label>
                    <Select value={formData.relationshipType} onValueChange={(value: 'Equivalent' | 'Mapping') => setFormData({...formData, relationshipType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Equivalent">Equivalent</SelectItem>
                        <SelectItem value="Mapping">Mapping</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowForm(false)} size="sm">
                      Cancel
                    </Button>
                    <Button onClick={handleSaveMapping} size="sm" disabled={!formData.companyId || !formData.companyCoaId}>
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
                <TableHead>Company Name</TableHead>
                <TableHead>Company COA Code</TableHead>
                <TableHead>Company COA Name</TableHead>
                <TableHead>Relationship Type</TableHead>
                {!readonly && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {mappings.map((mapping) => (
                <TableRow key={mapping.id}>
                  <TableCell>{getCompanyName(mapping.companyId)}</TableCell>
                  <TableCell className="font-medium">{mapping.companyCOA?.coaCode}</TableCell>
                  <TableCell>{mapping.companyCOA?.coaName}</TableCell>
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
                    No company mappings found
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