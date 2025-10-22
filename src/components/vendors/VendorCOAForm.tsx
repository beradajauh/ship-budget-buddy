import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { VendorCOA, FormMode } from '@/types';

interface VendorCOAFormProps {
  mode: FormMode;
  vendorCOA: VendorCOA | null;
  open: boolean;
  onClose: () => void;
  onSave: (coa: VendorCOA) => void;
}

export default function VendorCOAForm({ mode, vendorCOA, open, onClose, onSave }: VendorCOAFormProps) {
  const [formData, setFormData] = useState<VendorCOA>(
    vendorCOA || {
      id: '',
      vendorId: '',
      vendorCoaCode: '',
      vendorCoaName: '',
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      id: formData.id || `coa-${Date.now()}`,
    };
    onSave(dataToSave);
  };

  const isViewMode = mode === 'view';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' && 'Add COA Vendor'}
            {mode === 'edit' && 'Edit COA Vendor'}
            {mode === 'view' && 'View COA Vendor'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' && 'Create a new COA vendor entry'}
            {mode === 'edit' && 'Update COA vendor information'}
            {mode === 'view' && 'View COA vendor details'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendorCoaCode">Vendor COA Code *</Label>
              <Input
                id="vendorCoaCode"
                value={formData.vendorCoaCode}
                onChange={(e) => setFormData({ ...formData, vendorCoaCode: e.target.value })}
                disabled={isViewMode}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendorCoaName">Vendor COA Name *</Label>
              <Input
                id="vendorCoaName"
                value={formData.vendorCoaName}
                onChange={(e) => setFormData({ ...formData, vendorCoaName: e.target.value })}
                disabled={isViewMode}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isViewMode}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {isViewMode ? 'Close' : 'Cancel'}
            </Button>
            {!isViewMode && (
              <Button type="submit" className="bg-primary hover:bg-primary-dark">
                {mode === 'create' ? 'Create' : 'Save Changes'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
