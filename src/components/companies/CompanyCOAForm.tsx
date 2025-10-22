import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CompanyCOA, FormMode } from '@/types';

interface CompanyCOAFormProps {
  mode: FormMode;
  companyCOA: CompanyCOA | null;
  open: boolean;
  onClose: () => void;
  onSave: (coa: CompanyCOA) => void;
}

export default function CompanyCOAForm({ mode, companyCOA, open, onClose, onSave }: CompanyCOAFormProps) {
  const [formData, setFormData] = useState<CompanyCOA>(
    companyCOA || {
      id: '',
      companyId: '',
      coaCode: '',
      coaName: '',
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
      updatedAt: new Date().toISOString(),
    };
    onSave(dataToSave);
  };

  const isViewMode = mode === 'view';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' && 'Add Company COA'}
            {mode === 'edit' && 'Edit Company COA'}
            {mode === 'view' && 'View Company COA'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' && 'Create a new company COA entry'}
            {mode === 'edit' && 'Update company COA information'}
            {mode === 'view' && 'View company COA details'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coaCode">COA Code *</Label>
              <Input
                id="coaCode"
                value={formData.coaCode}
                onChange={(e) => setFormData({ ...formData, coaCode: e.target.value })}
                disabled={isViewMode}
                placeholder="e.g., COA001"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coaName">COA Name *</Label>
              <Input
                id="coaName"
                value={formData.coaName}
                onChange={(e) => setFormData({ ...formData, coaName: e.target.value })}
                disabled={isViewMode}
                placeholder="e.g., Operating Expenses"
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
              placeholder="Enter COA description"
              rows={3}
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              {isViewMode ? 'Close' : 'Cancel'}
            </Button>
            {!isViewMode && (
              <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary-dark">
                {mode === 'create' ? 'Create' : 'Save Changes'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
