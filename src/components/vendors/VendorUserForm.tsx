import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const vendorUserSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Email tidak valid" })
    .max(255, { message: "Email maksimal 255 karakter" }),
  password: z
    .string()
    .min(6, { message: "Password minimal 6 karakter" })
    .max(100, { message: "Password maksimal 100 karakter" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

type VendorUserFormData = z.infer<typeof vendorUserSchema>;

interface VendorUserFormProps {
  vendorId: string;
  vendorName: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VendorUserForm({
  vendorId,
  vendorName,
  open,
  onClose,
  onSuccess,
}: VendorUserFormProps) {
  const [formData, setFormData] = useState<VendorUserFormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof VendorUserFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");

    // Validate form data
    const validation = vendorUserSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof VendorUserFormData, string>> = {};
      validation.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as keyof VendorUserFormData] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      // Call edge function to create vendor user
      const { data, error } = await supabase.functions.invoke('create-vendor-user', {
        body: {
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          vendorId: vendorId,
        },
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to create vendor user');
      }

      toast({
        title: "Berhasil",
        description: `Akun vendor untuk ${vendorName} telah dibuat`,
      });

      // Reset form
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating vendor user:', error);
      setGeneralError(error.message || "Gagal membuat akun vendor");
      toast({
        title: "Gagal",
        description: error.message || "Gagal membuat akun vendor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setGeneralError("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Buat Akun Vendor</DialogTitle>
          <DialogDescription>
            Buat akun login untuk vendor: <strong>{vendorName}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {generalError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{generalError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="vendor@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                maxLength={255}
                required
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                maxLength={100}
                required
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Konfirmasi Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Ketik ulang password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                maxLength={100}
                required
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Membuat..." : "Buat Akun"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
