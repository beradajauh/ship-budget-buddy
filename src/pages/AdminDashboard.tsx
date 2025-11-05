import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, TrendingUp, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBudgetRealizations: 0,
    approvedDebitNotes: 0,
    totalBudgetAmount: 0,
    totalDebitAmount: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchStats();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/login");
      return;
    }

    // Check if admin
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("auth_user_id", session.user.id)
      .maybeSingle();

    if (!adminUser) {
      navigate("/login");
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch budget realizations count
      const { count: budgetCount } = await supabase
        .from("budget_realizations")
        .select("*", { count: "exact", head: true });

      // Fetch approved debit notes count
      const { count: debitCount } = await supabase
        .from("debit_notes")
        .select("*", { count: "exact", head: true })
        .eq("status", "Approved");

      // Fetch total budget amount
      const { data: budgetData } = await supabase
        .from("budget_realizations")
        .select("budget_amount");

      const totalBudget = budgetData?.reduce((sum, item) => sum + Number(item.budget_amount), 0) || 0;

      // Fetch total debit amount
      const { data: debitData } = await supabase
        .from("debit_notes")
        .select("total_amount")
        .eq("status", "Approved");

      const totalDebit = debitData?.reduce((sum, item) => sum + Number(item.total_amount), 0) || 0;

      setStats({
        totalBudgetRealizations: budgetCount || 0,
        approvedDebitNotes: debitCount || 0,
        totalBudgetAmount: totalBudget,
        totalDebitAmount: totalDebit,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Ringkasan budget realization dan debit notes</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget Realizations</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBudgetRealizations}</div>
            <p className="text-xs text-muted-foreground">Total records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Debit Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedDebitNotes}</div>
            <p className="text-xs text-muted-foreground">Debit notes approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalBudgetAmount)}</div>
            <p className="text-xs text-muted-foreground">All budget realizations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Approved Debit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalDebitAmount)}</div>
            <p className="text-xs text-muted-foreground">Approved debit notes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Budget Realization</CardTitle>
            <CardDescription>Monitor penggunaan budget vendor</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate("/budget-realization")} 
              className="w-full"
            >
              Lihat Budget Realization
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Debit Notes</CardTitle>
            <CardDescription>Kelola debit notes yang diajukan vendor</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate("/admin-debitnotes")} 
              className="w-full"
            >
              Lihat Debit Notes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
