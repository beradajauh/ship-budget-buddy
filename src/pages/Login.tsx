import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Anchor } from 'lucide-react';
import { toast } from 'sonner';

const DEMO_USERS = {
  admin: { email: 'admin@ship.com', password: 'admin123', role: 'admin' },
  vendor: { email: 'vendor@ship.com', password: 'vendor123', role: 'vendor' }
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (userType: 'admin' | 'vendor') => {
    const user = DEMO_USERS[userType];
    setEmail(user.email);
    setPassword(user.password);
    
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userEmail', user.email);
    toast.success(`Logged in as ${userType}`);
    navigate('/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = Object.values(DEMO_USERS).find(
      u => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userEmail', user.email);
      toast.success('Login successful!');
      navigate('/');
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <Anchor className="h-12 w-12 text-primary mb-2" />
          <CardTitle className="text-2xl font-bold">Ship Management System</CardTitle>
          <CardDescription>Login to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or quick login as
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => handleLogin('admin')}
            >
              Admin
            </Button>
            <Button
              variant="outline"
              onClick={() => handleLogin('vendor')}
            >
              Vendor
            </Button>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Admin:</strong> admin@ship.com / admin123</p>
            <p><strong>Vendor:</strong> vendor@ship.com / vendor123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
