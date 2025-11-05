import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import BudgetAnalysis from "./components/BudgetAnalysis";
import CompanyList from "./components/companies/CompanyList";
import VesselList from "./components/vessels/VesselList";
import VendorList from "./components/vendors/VendorList";
import AccountList from "./components/accounts/AccountList";
import YearlyBudgetList from "./components/budgets/YearlyBudgetList";
import BudgetList from "./components/budgets/BudgetList";
import ExpenseList from "./components/expenses/ExpenseList";
import DebitNoteList from "./components/debitnotes/DebitNoteList";
import DebitNotePaymentList from "./components/debitnotes/DebitNotePaymentList";
import DebitNoteAnalysis from "./components/debitnotes/DebitNoteAnalysis";
import DebitNoteApproval from "./components/debitnotes/DebitNoteApproval";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const userRole = localStorage.getItem('userRole');
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="budget-analysis" element={<BudgetAnalysis />} />
            <Route path="companies" element={<CompanyList />} />
            <Route path="vessels" element={<VesselList />} />
            <Route path="vendors" element={<VendorList />} />
            <Route path="accounts" element={<AccountList />} />
            <Route path="yearly-budgets" element={<YearlyBudgetList />} />
            <Route path="budgets" element={<BudgetList />} />
            <Route path="expenses" element={<ExpenseList />} />
            <Route path="debitnotes" element={<DebitNoteList />} />
            <Route path="debitnote-payments" element={<DebitNotePaymentList />} />
            <Route path="debitnote-analysis" element={<DebitNoteAnalysis />} />
            <Route path="debitnote-approval" element={<DebitNoteApproval />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
