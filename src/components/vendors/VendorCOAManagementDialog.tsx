import { useState } from 'react';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VendorCOA, FormMode, Vendor } from '@/types';
import VendorCOAForm from './VendorCOAForm';

interface VendorCOAManagementDialogProps {
  vendor: Vendor;
  open: boolean;
  onClose: () => void;
}

export default function VendorCOAManagementDialog({ vendor, open, onClose }: VendorCOAManagementDialogProps) {
  // Mock COA data
  const [coaList, setCoaList] = useState<VendorCOA[]>([
    { 
      id: '1', 
      vendorId: vendor.id, 
      vendorCoaCode: 'VEN001', 
      vendorCoaName: 'Services', 
      description: 'Service charges', 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    },
    { 
      id: '2', 
      vendorId: vendor.id, 
      vendorCoaCode: 'VEN002', 
      vendorCoaName: 'Supplies', 
      description: 'Material supplies', 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    },
  ]);

  const [showCoaForm, setShowCoaForm] = useState(false);
  const [coaFormMode, setCoaFormMode] = useState<FormMode>('create');
  const [editingCoa, setEditingCoa] = useState<VendorCOA | null>(null);

  const handleAddCoa = () => {
    setCoaFormMode('create');
    setEditingCoa(null);
    setShowCoaForm(true);
  };

  const handleEditCoa = (coa: VendorCOA) => {
    setCoaFormMode('edit');
    setEditingCoa(coa);
    setShowCoaForm(true);
  };

  const handleDeleteCoa = (id: string) => {
    setCoaList(coaList.filter(c => c.id !== id));
  };

  const handleSaveCoa = (coa: VendorCOA) => {
    if (coaFormMode === 'create') {
      const newCoa: VendorCOA = {
        ...coa,
        id: Date.now().toString(),
        vendorId: vendor.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCoaList([...coaList, newCoa]);
    } else {
      setCoaList(coaList.map(c => c.id === coa.id ? { ...coa, updatedAt: new Date().toISOString() } : c));
    }
    setShowCoaForm(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Master COA Vendor - {vendor.vendorName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={handleAddCoa} className="gap-2">
                <Plus className="h-4 w-4" />
                Add COA
              </Button>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor COA Code</TableHead>
                    <TableHead>Vendor COA Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coaList.map((coa) => (
                    <TableRow key={coa.id}>
                      <TableCell className="font-medium">{coa.vendorCoaCode}</TableCell>
                      <TableCell>{coa.vendorCoaName}</TableCell>
                      <TableCell>{coa.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditCoa(coa)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteCoa(coa.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {coaList.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No COA records found. Click "Add COA" to create one.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* COA Form Dialog */}
      <VendorCOAForm
        mode={coaFormMode}
        vendorCOA={editingCoa}
        open={showCoaForm}
        onClose={() => setShowCoaForm(false)}
        onSave={handleSaveCoa}
      />
    </>
  );
}
