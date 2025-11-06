import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CompanyCOA, COAMapping, VendorCOA } from '@/types';

interface CompanyVendorMappingDialogProps {
  vendorId: string;
  vendorName: string;
  companyId: string;
  companyCOAs: CompanyCOA[];
  mappings: COAMapping[];
  onSave: (updatedMappings: COAMapping[]) => void;
  onClose: () => void;
}

export default function CompanyVendorMappingDialog({ 
  vendorId, 
  vendorName, 
  companyId,
  companyCOAs,
  mappings,
  onSave, 
  onClose 
}: CompanyVendorMappingDialogProps) {
  const [localMappings, setLocalMappings] = useState<COAMapping[]>([]);

  useEffect(() => {
    // Load vendor COAs from localStorage
    const vendorCOAsKey = `vendorCOA_${vendorId}`;
    const vendorCOAsJson = localStorage.getItem(vendorCOAsKey);
    const vendorCOAs: VendorCOA[] = vendorCOAsJson ? JSON.parse(vendorCOAsJson) : [];

    // Filter existing mappings for this vendor
    const existingMappings = mappings.filter(m => m.vendorId === vendorId);
    
    // Create mappings for all vendor COAs
    const allMappings: COAMapping[] = vendorCOAs.map(vendorCoa => {
      const existing = existingMappings.find(m => m.vendorCoaId === vendorCoa.id);
      if (existing) {
        return existing;
      }
      // Create new mapping
      return {
        id: `mapping-${Date.now()}-${Math.random()}`,
        companyCoaId: '',
        vendorCoaId: vendorCoa.id,
        companyId: companyId,
        vendorId: vendorId,
        vendorCoaCode: vendorCoa.vendorCoaCode,
        vendorCoaName: vendorCoa.vendorCoaName,
        companyCoaCode: '',
        companyCoaName: '',
        relationshipType: 'Equivalent',
        notes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    setLocalMappings(allMappings);
  }, [vendorId, mappings, companyId]);

  const handleUpdateMapping = (mappingId: string, field: string, value: string) => {
    setLocalMappings(localMappings.map(m => {
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

  const handleSave = () => {
    onSave(localMappings);
    onClose();
  };

  const totalMapped = localMappings.filter(m => m.companyCoaId !== '').length;
  const totalUnmapped = localMappings.length - totalMapped;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-foreground">COA Mapping - {vendorName}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Map vendor COAs to company COAs
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary */}
          <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Total COAs</p>
              <p className="text-2xl font-bold">{localMappings.length}</p>
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

          {/* Mappings Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor COA Code</TableHead>
                  <TableHead>Vendor COA Name</TableHead>
                  <TableHead>Company COA</TableHead>
                  <TableHead>Relationship Type</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localMappings.map((mapping) => (
                  <TableRow 
                    key={mapping.id}
                    className={mapping.companyCoaId ? 'bg-green-50 dark:bg-green-950/20' : ''}
                  >
                    <TableCell className="font-medium">{mapping.vendorCoaCode}</TableCell>
                    <TableCell>{mapping.vendorCoaName}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      <Input
                        value={mapping.notes || ''}
                        onChange={(e) => handleUpdateMapping(mapping.id, 'notes', e.target.value)}
                        placeholder="Add notes..."
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {localMappings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No COAs found for this vendor
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Mappings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
