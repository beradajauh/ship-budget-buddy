import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface BudgetRealization {
  id: string;
  vendor_id: string;
  period: string;
  budget_amount: number;
  actual_amount: number;
  variance: number;
  currency: string;
  company_id: string;
  vessel_id: string;
}

export default function BudgetRealizationPage() {
  const [budgets, setBudgets] = useState<BudgetRealization[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchBudgets();
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

  const fetchBudgets = async () => {
    try {
      const { data, error } = await supabase
        .from("budget_realizations")
        .select("*")
        .order("period", { ascending: false });

      if (error) throw error;
      setBudgets(data || []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBudgets = budgets.filter(
    (budget) =>
      budget.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
      budget.vendor_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getUtilizationPercent = (actual: number, budget: number) => {
    return Math.min((actual / budget) * 100, 100);
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Budget Realization</h2>
        <p className="text-muted-foreground">Monitor penggunaan budget vendor</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Budget Realizations</CardTitle>
          <CardDescription>Daftar semua budget realization dari vendor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan period atau vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {filteredBudgets.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                {searchTerm ? "Tidak ada hasil pencarian" : "Tidak ada data budget realization"}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Vendor ID</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Actual</TableHead>
                      <TableHead>Variance</TableHead>
                      <TableHead>Utilization</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBudgets.map((budget) => (
                      <TableRow key={budget.id}>
                        <TableCell className="font-medium">{budget.period}</TableCell>
                        <TableCell>{budget.vendor_id}</TableCell>
                        <TableCell>{formatCurrency(budget.budget_amount, budget.currency)}</TableCell>
                        <TableCell>{formatCurrency(budget.actual_amount, budget.currency)}</TableCell>
                        <TableCell>
                          <Badge variant={budget.variance >= 0 ? "default" : "destructive"}>
                            {formatCurrency(budget.variance, budget.currency)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <Progress 
                              value={getUtilizationPercent(budget.actual_amount, budget.budget_amount)}
                              className="h-2"
                            />
                            <span className="text-sm text-muted-foreground">
                              {getUtilizationPercent(budget.actual_amount, budget.budget_amount).toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
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
