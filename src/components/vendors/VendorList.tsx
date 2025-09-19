import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Vendor, FormMode } from '@/types';
import VendorForm from './VendorForm';

// Mock data
const mockVendors: Vendor[] = [
  {
    id: '1',
    vendorCode: 'VD001',
    vendorName: 'PT Marina Services',
    address: 'Jl. Pelabuhan No. 789, Surabaya',
    contactPerson: 'Captain John Doe',
    bankAccountInfo: 'BCA 1234567890',
    taxId: 'NPWP-001-234-567',
    status: 'Active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    vendorCode: 'VD002',
    vendorName: 'PT Ocean Management',
    address: 'Jl. Bahari No. 321, Jakarta',
    contactPerson: 'Captain Jane Smith',
    bankAccountInfo: 'Mandiri 0987654321',
    taxId: 'NPWP-002-345-678',
    status: 'Active',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
];

export default function VendorList() {
  const [vendors] = useState<Vendor[]>(mockVendors);
  const [searchTerm, setSearchTerm] = useState('');
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filteredVendors = vendors.filter(vendor =>
    vendor.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.vendorCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setFormMode('create');
    setSelectedVendor(null);
    setShowForm(true);
  };

  const handleEdit = (vendor: Vendor) => {
    setFormMode('edit');
    setSelectedVendor(vendor);
    setShowForm(true);
  };

  const handleView = (vendor: Vendor) => {
    setFormMode('view');
    setSelectedVendor(vendor);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedVendor(null);
  };

  if (showForm) {
    return (
      <VendorForm
        mode={formMode}
        vendor={selectedVendor}
        onClose={handleFormClose}
        onSave={() => {
          // Handle save logic here
          handleFormClose();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Vendors</h2>
          <p className="text-muted-foreground">Manage vessel management vendors</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Vendors grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <Card key={vendor.id} className="border-border hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-foreground">{vendor.vendorCode}</CardTitle>
                <Badge 
                  variant={vendor.status === 'Active' ? 'default' : 'secondary'}
                  className={vendor.status === 'Active' ? 'bg-success text-success-foreground' : ''}
                >
                  {vendor.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h3 className="font-semibold text-foreground">{vendor.vendorName}</h3>
                <p className="text-sm text-muted-foreground mt-1">{vendor.address}</p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Contact:</span>
                <span className="text-foreground font-medium">{vendor.contactPerson}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax ID:</span>
                <span className="text-foreground font-medium">{vendor.taxId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bank:</span>
                <span className="text-foreground font-medium">{vendor.bankAccountInfo}</span>
              </div>
              
              <div className="flex justify-end space-x-2 pt-3">
                <Button variant="ghost" size="sm" onClick={() => handleView(vendor)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(vendor)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <Card className="border-border">
          <CardContent className="text-center py-10">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No vendors found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first vendor.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}