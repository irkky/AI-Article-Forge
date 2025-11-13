import { StatsCard } from "@/components/admin/stats-card";
import { ArticleTable } from "@/components/admin/article-table";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FileText, CheckCircle, FileEdit, TrendingUp, Sparkles } from "lucide-react";
import { Link } from "wouter";
import type { Article } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { toast } = useToast();
  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/articles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      toast({ title: "Article deleted successfully" });
    },
  });
  
  const togglePublishMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest('PATCH', `/api/articles/${id}`, {
        status: status === 'published' ? 'draft' : 'published',
        publishedAt: status === 'published' ? null : new Date().toISOString(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      toast({ title: "Article status updated" });
    },
  });
  
  const stats = {
    total: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    drafts: articles.filter(a => a.status === 'draft').length,
    thisWeek: articles.filter(a => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(a.createdAt) > weekAgo;
    }).length,
  };
  
  const recentArticles = articles.slice(0, 5);
  
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2" data-testid="text-dashboard-title">Dashboard</h1>
            <p className="text-muted-foreground">Manage your AI-generated blog content</p>
          </div>
          <Link href="/admin/generate">
            <Button data-testid="button-generate-articles">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Articles
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Articles"
            value={stats.total}
            icon={FileText}
          />
          <StatsCard
            title="Published"
            value={stats.published}
            icon={CheckCircle}
          />
          <StatsCard
            title="Drafts"
            value={stats.drafts}
            icon={FileEdit}
          />
          <StatsCard
            title="This Week"
            value={stats.thisWeek}
            icon={TrendingUp}
          />
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Articles</h2>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <ArticleTable
              articles={recentArticles}
              onDelete={(id) => deleteMutation.mutate(id)}
              onTogglePublish={(id, status) => togglePublishMutation.mutate({ id, status })}
            />
          )}
        </div>
      </div>
    </div>
  );
}
