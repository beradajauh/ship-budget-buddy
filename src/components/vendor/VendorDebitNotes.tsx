import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface DebitNote {
  id: string;
  debit_note_no: string;
  debit_note_date: string;
  vendor_invoice_no: string;
  total_amount: number;
  currency: string;
  status: string;
  linked_ap_doc: string | null;
}

export default function VendorDebitNotes({ vendorId }: { vendorId: string }) {
  const [debitNotes, setDebitNotes] = useState<DebitNote[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (vendorId) {
      fetchDebitNotes();
    }
  }, [vendorId]);

  const fetchDebitNotes = async () => {
    try {
      const { data, error } = await supabase
        .from("debit_notes")
        .select("*")
        .eq("vendor_id", vendorId)
        .order("debit_note_date", { ascending: false });

      if (error) throw error;
      setDebitNotes(data || []);
    } catch (error) {
      console.error("Error fetching debit notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDebitNotes = debitNotes.filter(
    (note) =>
      note.debit_note_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.vendor_invoice_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-gray-500";
      case "Submitted":
        return "bg-blue-500";
      case "Approved":
        return "bg-green-500";
      case "Paid":
        return "bg-purple-500";
      case "Rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return <Card><CardContent className="p-6">Loading...</CardContent></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Debit Notes</CardTitle>
        <CardDescription>
          Daftar debit notes yang terkait dengan vendor Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari debit note..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredDebitNotes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {searchTerm ? "Tidak ada hasil pencarian" : "Tidak ada debit notes"}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Debit Note No</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Invoice No</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>AP Doc</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDebitNotes.map((note) => (
                    <TableRow key={note.id}>
                      <TableCell className="font-medium">{note.debit_note_no}</TableCell>
                      <TableCell>{formatDate(note.debit_note_date)}</TableCell>
                      <TableCell>{note.vendor_invoice_no}</TableCell>
                      <TableCell>{formatCurrency(note.total_amount, note.currency)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(note.status)}>
                          {note.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{note.linked_ap_doc || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
