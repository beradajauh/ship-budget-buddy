import { Ship, FileText, CheckCircle, XCircle, Clock, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [approvalDialog, setApprovalDialog] = useState<{
    open: boolean;
    type: 'approve' | 'reject' | null;
    item: any;
  }>({ open: false, type: null, item: null });
  const [remarks, setRemarks] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  // Mock data for admin dashboard
  const debitNotes = [
    { id: 'DN-001', vendor: 'Marina Services', vessel: 'MV Ocean Star', amount: 45000, status: 'paid', date: '2024-01-15' },
    { id: 'DN-002', vendor: 'Ship Supply Co', vessel: 'MV Sea Explorer', amount: 32000, status: 'unpaid', date: '2024-01-20' },
    { id: 'DN-003', vendor: 'Tech Marine', vessel: 'MV Wave Rider', amount: 28000, status: 'paid', date: '2024-01-18' },
    { id: 'DN-004', vendor: 'Ocean Parts Ltd', vessel: 'MV Ocean Star', amount: 51000, status: 'unpaid', date: '2024-01-22' },
  ];

  const budgetRealizations = [
    { company: 'PT Samudra Jaya', vessel: 'MV Ocean Star', budget: 125000, realization: 98000, variance: 27000, percentage: 78 },
    { company: 'PT Maritim Nusantara', vessel: 'MV Sea Explorer', budget: 150000, realization: 145000, variance: 5000, percentage: 97 },
    { company: 'PT Samudra Jaya', vessel: 'MV Wave Rider', budget: 180000, realization: 165000, variance: 15000, percentage: 92 },
    { company: 'PT Pelayaran Sejahtera', vessel: 'MV Blue Horizon', budget: 200000, realization: 175000, variance: 25000, percentage: 88 },
  ];

  const vendorSubmissions = [
    { id: 1, type: 'Budget Realization', vendor: 'Marina Services', vessel: 'MV Ocean Star', amount: 98000, status: 'pending', date: '2024-01-15' },
    { id: 2, type: 'Debit Note', vendor: 'Ship Supply Co', vessel: 'MV Sea Explorer', amount: 32000, status: 'pending', date: '2024-01-20' },
    { id: 3, type: 'Budget Realization', vendor: 'Tech Marine', vessel: 'MV Wave Rider', amount: 165000, status: 'pending', date: '2024-01-18' },
    { id: 4, type: 'Debit Note', vendor: 'Ocean Parts Ltd', vessel: 'MV Blue Horizon', amount: 51000, status: 'pending', date: '2024-01-22' },
  ];

  const handleApproveReject = (type: 'approve' | 'reject', item: any) => {
    setApprovalDialog({ open: true, type, item });
    setRemarks('');
  };

  const confirmApproveReject = () => {
    if (!approvalDialog.item) return;
    
    const action = approvalDialog.type === 'approve' ? 'approved' : 'rejected';
    toast({
      title: `Submission ${action}`,
      description: `${approvalDialog.item.type} from ${approvalDialog.item.vendor} has been ${action}.`,
    });
    
    setApprovalDialog({ open: false, type: null, item: null });
    setRemarks('');
  };

  // Mock data for vendor dashboard  
  const vendorSubmissionsData = [
    { id: 1, type: 'Budget Realization', vessel: 'MV Ocean Star', amount: 125000, status: 'approved', date: '2024-01-15' },
    { id: 2, type: 'Debit Note', vessel: 'MV Sea Explorer', amount: 45000, status: 'pending', date: '2024-01-20' },
    { id: 3, type: 'Budget Realization', vessel: 'MV Wave Rider', amount: 89000, status: 'rejected', date: '2024-01-18' },
    { id: 4, type: 'Debit Note', vessel: 'MV Ocean Star', amount: 32000, status: 'approved', date: '2024-01-22' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
      case 'paid':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> {status === 'paid' ? 'Paid' : 'Approved'}</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      case 'unpaid':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Unpaid</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
    }
  };

  if (userRole === 'vendor') {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vendor Dashboard</h2>
          <p className="text-muted-foreground">
            Track your submissions and approval status
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vendorSubmissionsData.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {vendorSubmissionsData.filter(s => s.status === 'approved').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {vendorSubmissionsData.filter(s => s.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submissions List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>Your budget realizations and debit notes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vendorSubmissionsData.map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{submission.type}</p>
                      {getStatusBadge(submission.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{submission.vessel}</p>
                    <p className="text-xs text-muted-foreground">{submission.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">${submission.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <p className="text-muted-foreground">Overview and approvals for budget management</p>
        </div>

        {/* 1. Debit Note Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Debit Note Analysis</CardTitle>
            <CardDescription>Status pembayaran debit notes</CardDescription>
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

        {/* 2. Budget Realization Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Realization Analysis</CardTitle>
            <CardDescription>Analisa budget per PT dan kapal berdasarkan realisasi vendor</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Vessel</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Realization</TableHead>
                  <TableHead>Variance</TableHead>
                  <TableHead>%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgetRealizations.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.company}</TableCell>
                    <TableCell>{item.vessel}</TableCell>
                    <TableCell>${item.budget.toLocaleString()}</TableCell>
                    <TableCell>${item.realization.toLocaleString()}</TableCell>
                    <TableCell className={item.variance > 0 ? 'text-green-600' : 'text-red-600'}>
                      ${item.variance.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.percentage >= 90 ? 'destructive' : 'secondary'}>
                        {item.percentage}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 3. Vendor Submitted */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor Submitted</CardTitle>
            <CardDescription>Budget dan Debit Notes yang menunggu approval</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Vessel</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendorSubmissions.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.type}</TableCell>
                    <TableCell>{item.vendor}</TableCell>
                    <TableCell>{item.vessel}</TableCell>
                    <TableCell>${item.amount.toLocaleString()}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleApproveReject('approve', item)}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleApproveReject('reject', item)}
                        >
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Approval/Reject Dialog */}
      <Dialog open={approvalDialog.open} onOpenChange={(open) => setApprovalDialog({ ...approvalDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalDialog.type === 'approve' ? 'Approve' : 'Reject'} Submission
            </DialogTitle>
            <DialogDescription>
              {approvalDialog.type === 'approve' 
                ? 'Konfirmasi approval untuk submission ini'
                : 'Konfirmasi penolakan untuk submission ini'}
            </DialogDescription>
          </DialogHeader>
          
          {approvalDialog.item && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Type:</div>
                <div className="font-medium">{approvalDialog.item.type}</div>
                <div className="text-muted-foreground">Vendor:</div>
                <div className="font-medium">{approvalDialog.item.vendor}</div>
                <div className="text-muted-foreground">Vessel:</div>
                <div className="font-medium">{approvalDialog.item.vessel}</div>
                <div className="text-muted-foreground">Amount:</div>
                <div className="font-medium">${approvalDialog.item.amount.toLocaleString()}</div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  placeholder="Masukkan catatan atau alasan..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApprovalDialog({ open: false, type: null, item: null })}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmApproveReject}
              className={approvalDialog.type === 'reject' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {approvalDialog.type === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}