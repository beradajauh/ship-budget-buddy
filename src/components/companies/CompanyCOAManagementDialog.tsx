import { useState } from 'react';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompanyCOA } from '@/types';
import CompanyCOAForm from './CompanyCOAForm';
import COAMappingDialog from './COAMappingDialog';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface CompanyCOAManagementDialogProps {
  companyId: string;
  companyName: string;
  open: boolean;
  onClose: () => void;
}

export default function CompanyCOAManagementDialog({
  companyId,
  companyName,
  open,
  onClose,
}: CompanyCOAManagementDialogProps) {
  const initialCOAs: CompanyCOA[] = [
    {
      id: '1',
      companyId,
      coaCode: 'COA001',
      coaName: 'Operating Expenses',
      description: 'Day to day operational costs',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      companyId,
      coaCode: 'COA002',
      coaName: 'Maintenance & Repairs',
      description: 'Vessel maintenance costs',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  
  const [coaList, setCoaList] = useLocalStorage<CompanyCOA[]>(`companyCOA_${companyId}`, initialCOAs);

  const [showCoaForm, setShowCoaForm] = useState(false);
  const [editingCoa, setEditingCoa] = useState<CompanyCOA | null>(null);
  const [coaFormMode, setCoaFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedCoaForMapping, setSelectedCoaForMapping] = useState<CompanyCOA | null>(null);

  const handleAddCoa = () => {
    setCoaFormMode('create');
    setEditingCoa(null);
    setShowCoaForm(true);
  };

  const handleEditCoa = (coa: CompanyCOA) => {
    setCoaFormMode('edit');
    setEditingCoa(coa);
    setShowCoaForm(true);
  };

  const handleViewCoa = (coa: CompanyCOA) => {
    setCoaFormMode('view');
    setEditingCoa(coa);
    setShowCoaForm(true);
  };

  const handleDeleteCoa = (id: string) => {
    if (confirm('Are you sure you want to delete this COA?')) {
      setCoaList(coaList.filter((c) => c.id !== id));
    }
  };

  const handleSaveCoa = (coa: CompanyCOA) => {
    if (coaFormMode === 'edit') {
      setCoaList(coaList.map((c) => (c.id === coa.id ? { ...coa, updatedAt: new Date().toISOString() } : c)));
    } else {
      const newCoa: CompanyCOA = {
        ...coa,
        id: Date.now().toString(),
        companyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCoaList([...coaList, newCoa]);
    }
    setShowCoaForm(false);
  };

  const handleRowClick = (coa: CompanyCOA) => {
    setSelectedCoaForMapping(coa);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Master COA Company
            </DialogTitle>
            <DialogDescription>
              Manage Chart of Accounts for {companyName}
            </DialogDescription>
          </DialogHeader>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-base font-medium">COA List</CardTitle>
              <Button onClick={handleAddCoa} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add COA
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>COA Code</TableHead>
                      <TableHead>COA Name</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coaList.map((coa) => (
                      <TableRow 
                        key={coa.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(coa)}
                      >
                        <TableCell className="font-medium">{coa.coaCode}</TableCell>
                        <TableCell>{coa.coaName}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {coa.description}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCoa(coa)}
                            >
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
                        <TableCell
                          colSpan={4}
                          className="text-center text-muted-foreground py-8"
                        >
                          No COA records found. Click "Add COA" to create one.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* COA Form Dialog */}
      {showCoaForm && (
        <CompanyCOAForm
          mode={coaFormMode}
          companyCOA={editingCoa}
          open={showCoaForm}
          onClose={() => setShowCoaForm(false)}
          onSave={handleSaveCoa}
        />
      )}

      {/* COA Mapping Dialog */}
      {selectedCoaForMapping && (
        <COAMappingDialog
          companyCoa={selectedCoaForMapping}
          companyId={companyId}
          onClose={() => setSelectedCoaForMapping(null)}
        />
      )}
    </>
  );
}
