import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Company, CompanyCOA, COAMapping, FormMode } from '@/types';

interface CompanyFormProps {
  mode: FormMode;
  company?: Company | null;
  onSave: (company: Partial<Company>) => void;
  onClose: () => void;
}

export default function CompanyForm({ mode, company, onSave, onClose }: CompanyFormProps) {
  const [formData, setFormData] = useState({
    companyCode: company?.companyCode || '',
    companyName: company?.companyName || '',
    address: company?.address || '',
    phone: company?.phone || '',
    email: company?.email || '',
    status: company?.status || 'Active',
  });

  // Mock data for view mode - Company COAs with their vendor mappings
  const mockCompanyCOAsWithMappings: Array<CompanyCOA & { mappings: COAMapping[] }> = [
    {
      id: '1',
      companyId: company?.id || '',
      coaCode: 'COA001',
      coaName: 'Operating Expenses',
      description: 'Day to day operational costs',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mappings: [
        {
          id: 'm1',
          companyCoaId: '1',
          vendorCoaId: 'v1',
          companyId: company?.id || '',
          vendorId: '1',
          relationshipType: 'Equivalent',
          vendorCOA: {
            id: 'v1',
            vendorId: '1',
            vendorCoaCode: 'VEN001',
            vendorCoaName: 'Services',
            description: 'Service charges',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'm2',
          companyCoaId: '1',
          vendorCoaId: 'v2',
          companyId: company?.id || '',
          vendorId: '1',
          relationshipType: 'Mapping',
          vendorCOA: {
            id: 'v2',
            vendorId: '1',
            vendorCoaCode: 'VEN002',
            vendorCoaName: 'Supplies',
            description: 'Material supplies',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: '2',
      companyId: company?.id || '',
      coaCode: 'COA002',
      coaName: 'Maintenance & Repairs',
      description: 'Vessel maintenance costs',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mappings: [
        {
          id: 'm3',
          companyCoaId: '2',
          vendorCoaId: 'v3',
          companyId: company?.id || '',
          vendorId: '2',
          relationshipType: 'Equivalent',
          vendorCOA: {
            id: 'v3',
            vendorId: '2',
            vendorCoaCode: 'VEN003',
            vendorCoaName: 'Materials',
            description: 'Raw materials',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    },
  ];

  const isReadonly = mode === 'view';
  const title = mode === 'create' ? 'Add New Company' : mode === 'edit' ? 'Edit Company' : 'Company Details';

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
            {mode === 'create' ? 'Create a new company record' : 
             mode === 'edit' ? 'Update company information' : 
             'View company details'}
          </p>
        </div>
      </div>

      {/* Header Form */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyCode">Company Code *</Label>
                <Input
                  id="companyCode"
                  value={formData.companyCode}
                  onChange={(e) => handleChange('companyCode', e.target.value)}
                  placeholder="e.g., PT001"
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
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="e.g., PT Pelayaran Nusantara"
                required
                readOnly={isReadonly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Company address"
                rows={3}
                readOnly={isReadonly}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+62 xxx xxx xxx"
                  readOnly={isReadonly}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="contact@company.com"
                  readOnly={isReadonly}
                />
              </div>
            </div>

            {!isReadonly && (
              <div className="flex justify-end space-x-3 pt-6">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {mode === 'create' ? 'Create Company' : 'Update Company'}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* COA List with Vendor Mappings - Only show in view mode */}
      {isReadonly && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">COA Perusahaan & Persamaan COA Vendor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {mockCompanyCOAsWithMappings.map((coa) => (
              <div key={coa.id} className="space-y-3">
                {/* Company COA Header */}
                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">COA Code</p>
                      <p className="font-semibold text-foreground">{coa.coaCode}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">COA Name</p>
                      <p className="font-semibold text-foreground">{coa.coaName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p className="text-foreground">{coa.description}</p>
                    </div>
                  </div>
                </div>

                {/* Vendor COA Mappings */}
                <div className="pl-4 border-l-2 border-primary/30">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Persamaan COA Vendor:</p>
                  {coa.mappings.length > 0 ? (
                    <div className="space-y-2">
                      {coa.mappings.map((mapping) => (
                        <div
                          key={mapping.id}
                          className="bg-background p-3 rounded border border-border flex items-center justify-between"
                        >
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                            <div>
                              <p className="text-xs text-muted-foreground">Vendor COA Code</p>
                              <p className="font-medium text-sm">{mapping.vendorCOA?.vendorCoaCode}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Vendor COA Name</p>
                              <p className="text-sm">{mapping.vendorCOA?.vendorCoaName}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Relationship</p>
                              <Badge
                                variant={mapping.relationshipType === 'Equivalent' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {mapping.relationshipType}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No vendor mappings</p>
                  )}
                </div>
              </div>
            ))}

            {mockCompanyCOAsWithMappings.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No COA records found
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}