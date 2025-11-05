import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import VendorBudgetRealization from "@/components/vendor/VendorBudgetRealization";
import VendorDebitNotes from "@/components/vendor/VendorDebitNotes";
import { LogOut } from "lucide-react";

export default function VendorPortal() {
  const [vendorInfo, setVendorInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/vendor-login");
        return;
      }

      // Get vendor info
      const { data: vendorUser, error } = await supabase
        .from("vendor_users")
        .select("*")
        .eq("auth_user_id", session.user.id)
        .single();

      if (error || !vendorUser) {
        await supabase.auth.signOut();
        navigate("/vendor-login");
        return;
      }

      setVendorInfo(vendorUser);
    } catch (error) {
      navigate("/vendor-login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout berhasil",
      description: "Terima kasih telah menggunakan portal vendor",
    });
    navigate("/vendor-login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Vendor Portal</CardTitle>
                <CardDescription>
                  Email: {vendorInfo?.email}
                </CardDescription>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="budget" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="budget">Budget Realization</TabsTrigger>
            <TabsTrigger value="debitnotes">Debit Notes</TabsTrigger>
          </TabsList>
          <TabsContent value="budget" className="mt-6">
            <VendorBudgetRealization vendorId={vendorInfo?.vendor_id} />
          </TabsContent>
          <TabsContent value="debitnotes" className="mt-6">
            <VendorDebitNotes vendorId={vendorInfo?.vendor_id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
