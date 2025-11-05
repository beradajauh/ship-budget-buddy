import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        redirectUser(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        redirectUser(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const redirectUser = async (userId: string) => {
    try {
      // Check if admin
      const { data: adminUser } = await supabase
        .from("admin_users")
        .select("*")
        .eq("auth_user_id", userId)
        .maybeSingle();

      if (adminUser) {
        navigate("/");
        return;
      }

      // Check if vendor
      const { data: vendorUser } = await supabase
        .from("vendor_users")
        .select("*")
        .eq("auth_user_id", userId)
        .maybeSingle();

      if (vendorUser) {
        navigate("/vendor-portal");
        return;
      }

      // Unknown user type
      await supabase.auth.signOut();
      toast({
        title: "Akses ditolak",
        description: "Akun Anda tidak memiliki akses ke sistem",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error checking user type:", error);
    }
  };

  const handleSetupSampleData = async () => {
    setSetupLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('setup-sample-users');

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Setup berhasil",
          description: "Sample users telah dibuat. Silakan login dengan credentials di atas.",
        });
      } else {
        throw new Error(data?.error || 'Setup failed');
      }
    } catch (error: any) {
      toast({
        title: "Setup gagal",
        description: error.message || "Gagal membuat sample users",
        variant: "destructive",
      });
    } finally {
      setSetupLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;

      // User will be redirected by the auth state change listener
    } catch (error: any) {
      toast({
        title: "Login gagal",
        description: error.message || "Email atau password salah",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Masuk ke sistem menggunakan email dan password Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Sample Login:</strong><br/>
              Admin: admin@company.com / admin123<br/>
              Vendor: vendor@marina.com / vendor123
            </AlertDescription>
          </Alert>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Pertama kali?
                </span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={handleSetupSampleData}
              disabled={setupLoading}
            >
              {setupLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setup Sample Data...
                </>
              ) : (
                "Setup Sample Data"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
