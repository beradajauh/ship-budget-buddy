import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Ship } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Vessel, FormMode } from '@/types';
import VesselForm from './VesselForm';

// Mock data
const mockVessels: Vessel[] = [
  {
    id: '1',
    vesselCode: 'MV001',
    vesselName: 'MV Sinar Harapan',
    imoNumber: '9876543',
    ownedByCompanyId: '1',
    managedByVendorId: '1',
    vesselType: 'Tanker',
    buildYear: 2018,
    status: 'Active',
    company: { id: '1', companyName: 'PT Pelayaran Nusantara' } as any,
    vendor: { id: '1', vendorName: 'PT Marina Services' } as any,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    vesselCode: 'TB002',
    vesselName: 'TB Nusantara',
    ownedByCompanyId: '2',
    managedByVendorId: '2',
    vesselType: 'Tug',
    buildYear: 2020,
    status: 'Active',
    company: { id: '2', companyName: 'PT Samudera Jaya' } as any,
    vendor: { id: '2', vendorName: 'PT Ocean Management' } as any,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
];

export default function VesselList() {
  const [vessels] = useState<Vessel[]>(mockVessels);
  const [searchTerm, setSearchTerm] = useState('');
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filteredVessels = vessels.filter(vessel =>
    vessel.vesselName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vessel.vesselCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setFormMode('create');
    setSelectedVessel(null);
    setShowForm(true);
  };

  const handleEdit = (vessel: Vessel) => {
    setFormMode('edit');
    setSelectedVessel(vessel);
    setShowForm(true);
  };

  const handleView = (vessel: Vessel) => {
    setFormMode('view');
    setSelectedVessel(vessel);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedVessel(null);
  };

  if (showForm) {
    return (
      <VesselForm
        mode={formMode}
        vessel={selectedVessel}
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
          <h2 className="text-2xl font-bold text-foreground">Vessels</h2>
          <p className="text-muted-foreground">Manage your fleet vessels</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add Vessel
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vessels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Vessels grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVessels.map((vessel) => (
          <Card key={vessel.id} className="border-border hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-foreground">{vessel.vesselCode}</CardTitle>
                <Badge 
                  variant={vessel.status === 'Active' ? 'default' : 'secondary'}
                  className={vessel.status === 'Active' ? 'bg-success text-success-foreground' : ''}
                >
                  {vessel.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h3 className="font-semibold text-foreground">{vessel.vesselName}</h3>
                <p className="text-sm text-muted-foreground mt-1">{vessel.vesselType} • Built {vessel.buildYear}</p>
                {vessel.imoNumber && (
                  <p className="text-xs text-muted-foreground">IMO: {vessel.imoNumber}</p>
                )}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Owner:</span>
                <span className="text-foreground font-medium text-right flex-1 ml-2">{vessel.company?.companyName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Managed by:</span>
                <span className="text-foreground font-medium text-right flex-1 ml-2">{vessel.vendor?.vendorName}</span>
              </div>
              
              <div className="flex justify-end space-x-2 pt-3">
                <Button variant="ghost" size="sm" onClick={() => handleView(vessel)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(vessel)}>
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

      {filteredVessels.length === 0 && (
        <Card className="border-border">
          <CardContent className="text-center py-10">
            <Ship className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No vessels found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first vessel.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}