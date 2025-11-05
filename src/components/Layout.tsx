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
  Anchor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Ship,
  },
  {
    name: 'Analysis',
    icon: FileText,
    children: [
      { name: 'DN Analysis', href: '/debitnote-analysis', icon: FileText },
      { name: 'Budget Realization', href: '/budget-realization-analysis', icon: FileText },
      { name: 'Vendor Submitted', href: '/vendor-submitted', icon: FileText },
    ],
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
    name: 'Budgeting',
    icon: FileText,
    children: [
      { name: 'Yearly Budget', href: '/yearly-budgets', icon: DollarSign },
      { name: 'Monthly Budget', href: '/budgets', icon: DollarSign },
    ],
  },
  {
    name: 'Transaction',
    icon: DollarSign,
    children: [
      { name: 'Budget Realization', href: '/expenses', icon: FileText },
      { name: 'Debit Notes', href: '/debitnotes', icon: Users },
      { name: 'DN Payments', href: '/debitnote-payments', icon: DollarSign },
    ],
  },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const filteredNavigation = userRole === 'vendor' 
    ? navigation.filter(item => 
        item.name === 'Dashboard' || 
        (item.children && item.children.some(child => 
          child.name === 'Budget Realization' || child.name === 'Debit Notes'
        ))
      ).map(item => {
        if (item.children) {
          return {
            ...item,
            children: item.children.filter(child => 
              child.name === 'Budget Realization' || child.name === 'Debit Notes'
            )
          };
        }
        return item;
      })
    : navigation;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-primary transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 bg-primary-dark flex-shrink-0">
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
        
        <nav className="flex-1 overflow-y-auto px-3 py-6">
          {filteredNavigation.map((item) => (
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
              <span className="text-sm text-muted-foreground">
                Welcome, {userRole === 'admin' ? 'Admin' : 'Vendor'}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
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