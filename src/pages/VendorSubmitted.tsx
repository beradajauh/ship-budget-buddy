import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ThumbsUp, ThumbsDown, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function VendorSubmitted() {
  const [approvalDialog, setApprovalDialog] = useState<{
    open: boolean;
    type: 'approve' | 'reject' | null;
    item: any;
  }>({ open: false, type: null, item: null });
  const [remarks, setRemarks] = useState('');
  const { toast } = useToast();

  const vendorSubmissions = [
    { id: 1, type: 'Budget Realization', vendor: 'Marina Services', vessel: 'MV Ocean Star', amount: 98000, status: 'pending', date: '2024-01-15' },
    { id: 2, type: 'Debit Note', vendor: 'Ship Supply Co', vessel: 'MV Sea Explorer', amount: 32000, status: 'pending', date: '2024-01-20' },
    { id: 3, type: 'Budget Realization', vendor: 'Tech Marine', vessel: 'MV Wave Rider', amount: 165000, status: 'pending', date: '2024-01-18' },
    { id: 4, type: 'Debit Note', vendor: 'Ocean Parts Ltd', vessel: 'MV Blue Horizon', amount: 51000, status: 'pending', date: '2024-01-22' },
    { id: 5, type: 'Budget Realization', vendor: 'Marina Services', vessel: 'MV Pacific Dream', amount: 92000, status: 'pending', date: '2024-01-25' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
    }
  };

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

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Vendor Submitted</h2>
          <p className="text-muted-foreground">Budget dan Debit Notes yang menunggu approval</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Submissions yang perlu di-review dan approve/reject</CardDescription>
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
