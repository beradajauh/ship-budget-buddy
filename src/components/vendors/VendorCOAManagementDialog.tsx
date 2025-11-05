import { useState, useRef } from 'react';
import { Plus, Edit, Trash2, FolderOpen, Upload, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VendorCOA, FormMode, Vendor } from '@/types';
import VendorCOAForm from './VendorCOAForm';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface VendorCOAManagementDialogProps {
  vendor: Vendor;
  open: boolean;
  onClose: () => void;
}

export default function VendorCOAManagementDialog({ vendor, open, onClose }: VendorCOAManagementDialogProps) {
  const initialCOAs: VendorCOA[] = [
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
  ];
  
  const [coaList, setCoaList] = useLocalStorage<VendorCOA[]>(`vendorCOA_${vendor.id}`, initialCOAs);

  const [showCoaForm, setShowCoaForm] = useState(false);
  const [coaFormMode, setCoaFormMode] = useState<FormMode>('create');
  const [editingCoa, setEditingCoa] = useState<VendorCOA | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (confirm('Are you sure you want to delete this COA?')) {
      setCoaList(coaList.filter(c => c.id !== id));
    }
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

  const handleUploadExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        const newCOAs: VendorCOA[] = jsonData.map((row, index) => ({
          id: (Date.now() + index).toString(),
          vendorId: vendor.id,
          vendorCoaCode: row['Vendor COA Code'] || row['vendorCoaCode'] || '',
          vendorCoaName: row['Vendor COA Name'] || row['vendorCoaName'] || '',
          description: row['Description'] || row['description'] || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

        setCoaList([...coaList, ...newCOAs]);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert('Error parsing Excel file. Please check the format.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleDownloadTemplate = () => {
    const template = [
      {
        'Vendor COA Code': 'VEN001',
        'Vendor COA Name': 'Services',
        'Description': 'Service charges'
      },
      {
        'Vendor COA Code': 'VEN002',
        'Vendor COA Name': 'Supplies',
        'Description': 'Material supplies'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendor COA Template');
    XLSX.writeFile(workbook, `Vendor_COA_Template_${vendor.vendorName}.xlsx`);
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
            <div className="flex justify-end gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleUploadExcel}
                accept=".xlsx,.xls"
                className="hidden"
              />
              <Button 
                variant="outline" 
                onClick={handleDownloadTemplate} 
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download Template
              </Button>
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()} 
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Excel
              </Button>
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
