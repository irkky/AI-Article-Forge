import { ArticleTable } from "@/components/admin/article-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search, Plus } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import type { Article } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "@/components/ui/empty-state";

export default function AdminArticles() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  
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
  
  const filteredArticles = articles
    .filter(a => statusFilter === 'all' || a.status === statusFilter)
    .filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()));
  
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">Articles</h1>
            <p className="text-muted-foreground">Manage and organize your blog articles</p>
          </div>
          <Link href="/admin/generate">
            <Button data-testid="button-create-new">
              <Plus className="mr-2 h-4 w-4" />
              Generate New
            </Button>
          </Link>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <TabsList>
              <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
              <TabsTrigger value="published" data-testid="tab-published">Published</TabsTrigger>
              <TabsTrigger value="draft" data-testid="tab-drafts">Drafts</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search articles..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">Loading articles...</div>
        ) : filteredArticles.length > 0 ? (
          <ArticleTable
            articles={filteredArticles}
            onDelete={(id) => deleteMutation.mutate(id)}
            onTogglePublish={(id, status) => togglePublishMutation.mutate({ id, status })}
          />
        ) : (
          <EmptyState
            title="No articles found"
            description={searchQuery ? "No articles match your search query." : "Start by generating some articles!"}
            action={{
              label: "Generate Articles",
              onClick: () => window.location.href = "/admin/generate",
            }}
          />
        )}
      </div>
    </div>
  );
}
