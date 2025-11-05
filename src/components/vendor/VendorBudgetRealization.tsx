import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface BudgetRealization {
  id: string;
  period: string;
  budget_amount: number;
  actual_amount: number;
  variance: number;
  currency: string;
}

export default function VendorBudgetRealization({ vendorId }: { vendorId: string }) {
  const [budgets, setBudgets] = useState<BudgetRealization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (vendorId) {
      fetchBudgets();
    }
  }, [vendorId]);

  const fetchBudgets = async () => {
    try {
      const { data, error } = await supabase
        .from("budget_realizations")
        .select("*")
        .eq("vendor_id", vendorId)
        .order("period", { ascending: false });

      if (error) throw error;
      setBudgets(data || []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getUtilizationPercent = (actual: number, budget: number) => {
    return Math.min((actual / budget) * 100, 100);
  };

  const getVarianceColor = (variance: number) => {
    if (variance >= 0) return "bg-green-500";
    return "bg-red-500";
  };

  if (loading) {
    return <Card><CardContent className="p-6">Loading...</CardContent></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Realization</CardTitle>
        <CardDescription>
          Monitor penggunaan budget Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        {budgets.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Tidak ada data budget realization
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Actual</TableHead>
                  <TableHead>Variance</TableHead>
                  <TableHead>Utilization</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgets.map((budget) => (
                  <TableRow key={budget.id}>
                    <TableCell className="font-medium">{budget.period}</TableCell>
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
      </CardContent>
    </Card>
  );
}
