import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

export default function DebitNoteAnalysis() {
  const debitNotes = [
    { id: 'DN-001', vendor: 'Marina Services', vessel: 'MV Ocean Star', amount: 45000, status: 'paid', date: '2024-01-15' },
    { id: 'DN-002', vendor: 'Ship Supply Co', vessel: 'MV Sea Explorer', amount: 32000, status: 'unpaid', date: '2024-01-20' },
    { id: 'DN-003', vendor: 'Tech Marine', vessel: 'MV Wave Rider', amount: 28000, status: 'paid', date: '2024-01-18' },
    { id: 'DN-004', vendor: 'Ocean Parts Ltd', vessel: 'MV Ocean Star', amount: 51000, status: 'unpaid', date: '2024-01-22' },
    { id: 'DN-005', vendor: 'Marina Services', vessel: 'MV Pacific Dream', amount: 38000, status: 'paid', date: '2024-01-25' },
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'paid') {
      return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Paid</Badge>;
    }
    return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Unpaid</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Debit Note Analysis</h2>
        <p className="text-muted-foreground">Status pembayaran debit notes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Status</CardTitle>
          <CardDescription>List debit notes dengan status pembayaran</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DN No</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Vessel</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {debitNotes.map((dn) => (
                <TableRow key={dn.id}>
                  <TableCell className="font-medium">{dn.id}</TableCell>
                  <TableCell>{dn.vendor}</TableCell>
                  <TableCell>{dn.vessel}</TableCell>
                  <TableCell>${dn.amount.toLocaleString()}</TableCell>
                  <TableCell>{dn.date}</TableCell>
                  <TableCell>{getStatusBadge(dn.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
