import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import BlogListing from "@/pages/blog-listing";
import BlogDetail from "@/pages/blog-detail";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminArticles from "@/pages/admin-articles";
import AdminGenerate from "@/pages/admin-generate";
import AdminEdit from "@/pages/admin-edit";

function AdminLayout({ children }: { children: React.ReactNode }) {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };
  
  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  const [location] = useLocation();
  const isAdmin = location.startsWith('/admin');
  
  return (
    <Switch>
      {/* Admin routes with layout */}
      <Route path="/admin/articles/:id/edit">
        {(params) => (
          <AdminLayout>
            <AdminEdit />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/articles">
        <AdminLayout>
          <AdminArticles />
        </AdminLayout>
      </Route>
      <Route path="/admin/generate">
        <AdminLayout>
          <AdminGenerate />
        </AdminLayout>
      </Route>
      <Route path="/admin">
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </Route>
      
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/blog" component={BlogListing} />
      <Route path="/blog/:slug" component={BlogDetail} />
      
      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
