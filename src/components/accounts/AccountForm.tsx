import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartOfAccount, FormMode } from '@/types';

interface AccountFormProps {
  mode: FormMode;
  account?: ChartOfAccount | null;
  onSave: (account: Partial<ChartOfAccount>) => void;
  onClose: () => void;
}

// Mock parent categories
const mockParentCategories = [
  { id: '1', name: 'FUEL - Fuel & Lubricants' },
  { id: '2', name: 'CREW - Crew Expenses' },
  { id: '3', name: 'MAINT - Maintenance' },
  { id: '4', name: 'INS - Insurance' },
];

export default function AccountForm({ mode, account, onSave, onClose }: AccountFormProps) {
  const [formData, setFormData] = useState({
    coaCode: account?.coaCode || '',
    coaName: account?.coaName || '',
    parentCOAId: account?.parentCOAId || '',
    status: account?.status || 'Active',
  });

  const isReadonly = mode === 'view';
  const title = mode === 'create' ? 'Add New COA' : mode === 'edit' ? 'Edit COA' : 'COA Details';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode !== 'view') {
      onSave(formData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            {mode === 'create' ? 'Create a new expense account' : 
             mode === 'edit' ? 'Update COA information' : 
             'View COA details'}
          </p>
        </div>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">COA Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="coaCode">COA Code *</Label>
                <Input
                  id="coaCode"
                  value={formData.coaCode}
                  onChange={(e) => handleChange('coaCode', e.target.value)}
                  placeholder="e.g., FUEL, CREW, MAINT"
                  required
                  readOnly={isReadonly}
                />
                <p className="text-xs text-muted-foreground">
                  Use short codes like FUEL, CREW, MAINT for better organization
                </p>
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
              <Label htmlFor="coaName">COA Name *</Label>
              <Input
                id="coaName"
                value={formData.coaName}
                onChange={(e) => handleChange('coaName', e.target.value)}
                placeholder="e.g., Fuel & Lubricants, Crew Expenses"
                required
                readOnly={isReadonly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentCOAId">Parent COA (Optional)</Label>
              <Select 
                value={formData.parentCOAId} 
                onValueChange={(value) => handleChange('parentCOAId', value)}
                disabled={isReadonly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent COA (for sub-categories)" />
                </SelectTrigger>
                <SelectContent>
                  {mockParentCategories
                    .filter(cat => cat.id !== account?.id) // Don't allow self as parent
                    .map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Leave empty for main categories, select a parent for sub-categories
              </p>
            </div>

            {!isReadonly && (
              <div className="flex justify-end space-x-3 pt-6">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-dark">
                  <Save className="h-4 w-4 mr-2" />
                  {mode === 'create' ? 'Create COA' : 'Update COA'}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}