import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Vendor, FormMode } from '@/types';
import VendorForm from './VendorForm';

// Mock data
const mockVendors: Vendor[] = [
  {
    id: '1',
    vendorCode: 'VD001',
    vendorName: 'PT Marina Services',
    address: 'Jl. Pelabuhan No. 789, Surabaya',
    phone: '+62 31 1234567',
    email: 'contact@marina.com',
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
    phone: '+62 21 7777777',
    email: 'info@ocean.com',
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

      {/* Vendors table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Vendor List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor Code</TableHead>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tax ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.vendorCode}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{vendor.vendorName}</div>
                      <div className="text-sm text-muted-foreground">{vendor.address}</div>
                    </div>
                  </TableCell>
                  <TableCell>{vendor.phone}</TableCell>
                  <TableCell>{vendor.email}</TableCell>
                  <TableCell>{vendor.taxId}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={vendor.status === 'Active' ? 'default' : 'secondary'}
                      className={vendor.status === 'Active' ? 'bg-success text-success-foreground' : ''}
                    >
                      {vendor.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredVendors.length === 0 && (
            <div className="text-center py-10">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No vendors found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first vendor.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}