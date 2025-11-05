import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DebitNote {
  id: string;
  vendor_id: string;
  debit_note_no: string;
  debit_note_date: string;
  vendor_invoice_no: string;
  total_amount: number;
  currency: string;
  status: string;
  linked_ap_doc: string | null;
}

export default function AdminDebitNotesPage() {
  const [debitNotes, setDebitNotes] = useState<DebitNote[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchDebitNotes();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/login");
      return;
    }

    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("auth_user_id", session.user.id)
      .maybeSingle();

    if (!adminUser) {
      navigate("/login");
    }
  };

  const fetchDebitNotes = async () => {
    try {
      const { data, error } = await supabase
        .from("debit_notes")
        .select("*")
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
      note.vendor_invoice_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.vendor_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const approvedDebitNotes = filteredDebitNotes.filter(note => note.status === "Approved");

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
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Debit Notes</h2>
        <p className="text-muted-foreground">Kelola debit notes yang diajukan vendor</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Debit Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{debitNotes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{approvedDebitNotes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Approved Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                approvedDebitNotes.reduce((sum, note) => sum + Number(note.total_amount), 0),
                "USD"
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Debit Notes</CardTitle>
          <CardDescription>Daftar semua debit notes dari vendor</CardDescription>
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
                      <TableHead>Vendor ID</TableHead>
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
                        <TableCell>{note.vendor_id}</TableCell>
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
    </div>
  );
}
