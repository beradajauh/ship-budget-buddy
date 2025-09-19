import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Vessel, FormMode } from '@/types';

interface VesselFormProps {
  mode: FormMode;
  vessel?: Vessel | null;
  onSave: (vessel: Partial<Vessel>) => void;
  onClose: () => void;
}

const vesselTypes = [
  { value: 'Tanker', label: 'Tanker' },
  { value: 'Tug', label: 'Tug Boat' },
  { value: 'Cargo', label: 'Cargo Ship' },
  { value: 'Container', label: 'Container Ship' },
  { value: 'Bulk Carrier', label: 'Bulk Carrier' },
  { value: 'Supply Vessel', label: 'Supply Vessel' },
];

// Mock data for dropdowns
const mockCompanies = [
  { id: '1', name: 'PT Pelayaran Nusantara' },
  { id: '2', name: 'PT Samudera Jaya' },
];

const mockVendors = [
  { id: '1', name: 'PT Marina Services' },
  { id: '2', name: 'PT Ocean Management' },
];

export default function VesselForm({ mode, vessel, onSave, onClose }: VesselFormProps) {
  const [formData, setFormData] = useState({
    vesselCode: vessel?.vesselCode || '',
    vesselName: vessel?.vesselName || '',
    imoNumber: vessel?.imoNumber || '',
    ownedByCompanyId: vessel?.ownedByCompanyId || '',
    managedByVendorId: vessel?.managedByVendorId || '',
    vesselType: vessel?.vesselType || '',
    buildYear: vessel?.buildYear || new Date().getFullYear(),
    status: vessel?.status || 'Active',
  });

  const isReadonly = mode === 'view';
  const title = mode === 'create' ? 'Add New Vessel' : mode === 'edit' ? 'Edit Vessel' : 'Vessel Details';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode !== 'view') {
      onSave(formData);
    }
  };

  const handleChange = (field: string, value: string | number) => {
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
            {mode === 'create' ? 'Add a new vessel to your fleet' : 
             mode === 'edit' ? 'Update vessel information' : 
             'View vessel details'}
          </p>
        </div>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Vessel Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="vesselCode">Vessel Code *</Label>
                <Input
                  id="vesselCode"
                  value={formData.vesselCode}
                  onChange={(e) => handleChange('vesselCode', e.target.value)}
                  placeholder="e.g., MV001"
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
              <Label htmlFor="vesselName">Vessel Name *</Label>
              <Input
                id="vesselName"
                value={formData.vesselName}
                onChange={(e) => handleChange('vesselName', e.target.value)}
                placeholder="e.g., MV Sinar Harapan"
                required
                readOnly={isReadonly}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="imoNumber">IMO Number</Label>
                <Input
                  id="imoNumber"
                  value={formData.imoNumber}
                  onChange={(e) => handleChange('imoNumber', e.target.value)}
                  placeholder="e.g., 9876543"
                  readOnly={isReadonly}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buildYear">Build Year *</Label>
                <Input
                  id="buildYear"
                  type="number"
                  value={formData.buildYear}
                  onChange={(e) => handleChange('buildYear', parseInt(e.target.value))}
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  required
                  readOnly={isReadonly}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vesselType">Vessel Type *</Label>
              <Select 
                value={formData.vesselType} 
                onValueChange={(value) => handleChange('vesselType', value)}
                disabled={isReadonly}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vessel type" />
                </SelectTrigger>
                <SelectContent>
                  {vesselTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ownedByCompanyId">Owned by Company *</Label>
                <Select 
                  value={formData.ownedByCompanyId} 
                  onValueChange={(value) => handleChange('ownedByCompanyId', value)}
                  disabled={isReadonly}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select owner company" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="managedByVendorId">Managed by Vendor *</Label>
                <Select 
                  value={formData.managedByVendorId} 
                  onValueChange={(value) => handleChange('managedByVendorId', value)}
                  disabled={isReadonly}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select managing vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockVendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!isReadonly && (
              <div className="flex justify-end space-x-3 pt-6">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-dark">
                  <Save className="h-4 w-4 mr-2" />
                  {mode === 'create' ? 'Create Vessel' : 'Update Vessel'}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}