import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  Ship, 
  Building2, 
  Users, 
  FileText, 
  DollarSign, 
  Menu, 
  X,
  Anchor,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Ship,
  },
  {
    name: 'Budget Analysis',
    href: '/budget-analysis',
    icon: FileText,
  },
  {
    name: 'DN Analysis',
    href: '/debitnote-analysis',
    icon: FileText,
  },
  {
    name: 'DN Approval',
    href: '/debitnote-approval',
    icon: FileText,
  },
  {
    name: 'Master Data',
    icon: FileText,
    children: [
      { name: 'Vendors', href: '/vendors', icon: Users },
      { name: 'Companies', href: '/companies', icon: Building2 },
      { name: 'Vessels', href: '/vessels', icon: Ship },
    ],
  },
  {
    name: 'Transactions',
    icon: DollarSign,
    children: [
      { name: 'Yearly Budget', href: '/yearly-budgets', icon: DollarSign },
      { name: 'Monthly Budget', href: '/budgets', icon: DollarSign },
      { name: 'Budget Realization', href: '/expenses', icon: FileText },
      { name: 'Debit Notes', href: '/debitnotes', icon: Users },
      { name: 'DN Payments', href: '/debitnote-payments', icon: DollarSign },
    ],
  },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/login");
      return;
    }

    // Check if admin
    const { data: admin } = await supabase
      .from("admin_users")
      .select("*")
      .eq("auth_user_id", session.user.id)
      .maybeSingle();

    if (!admin) {
      await supabase.auth.signOut();
      navigate("/login");
      return;
    }

    setAdminUser(admin);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout berhasil",
      description: "Anda telah keluar dari sistem",
    });
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-primary transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 bg-primary-dark">
          <div className="flex items-center">
            <Anchor className="h-8 w-8 text-primary-foreground" />
            <span className="ml-2 text-xl font-bold text-primary-foreground">ShipMS</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-primary-foreground hover:bg-primary-light"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <nav className="mt-6 px-3">
          {navigation.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <div className="mb-4">
                  <div className="flex items-center px-3 py-2 text-sm font-medium text-primary-foreground/80">
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.name}
                  </div>
                  {item.children.map((child) => (
                    <NavLink
                      key={child.name}
                      to={child.href}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center pl-9 pr-3 py-2 text-sm rounded-md transition-colors",
                          isActive
                            ? "bg-primary-light text-primary-foreground"
                            : "text-primary-foreground/70 hover:bg-primary-light hover:text-primary-foreground"
                        )
                      }
                    >
                      <child.icon className="h-4 w-4 mr-3" />
                      {child.name}
                    </NavLink>
                  ))}
                </div>
              ) : (
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-3 py-2 mb-1 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary-light text-primary-foreground"
                        : "text-primary-foreground/70 hover:bg-primary-light hover:text-primary-foreground"
                    )
                  }
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.name}
                </NavLink>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <header className="bg-card border-b border-border">
          <div className="flex items-center justify-between h-16 px-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Ship Management System</h1>
            <div className="flex items-center space-x-4">
              {adminUser && (
                <span className="text-sm text-muted-foreground">
                  Welcome, {adminUser.full_name}
                </span>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}