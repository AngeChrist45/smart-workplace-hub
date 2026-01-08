import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Tasks from "./pages/Tasks";
import Clients from "./pages/Clients";
import QRScanner from "./pages/QRScanner";
import Invoices from "./pages/Invoices";
import Payslips from "./pages/Payslips";
import Inventory from "./pages/Inventory";
import Messaging from "./pages/Messaging";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/qr-scanner" element={<QRScanner />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/payslips" element={<Payslips />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/messaging" element={<Messaging />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
