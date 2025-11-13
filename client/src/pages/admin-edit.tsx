import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Save, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import type { Article } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminEdit() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [, params] = useRoute("/admin/articles/:id/edit");
  const articleId = params?.id;
  
  const { data: article, isLoading } = useQuery<Article>({
    queryKey: ['/api/articles', articleId],
    enabled: !!articleId,
  });
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featuredImage: '',
  });
  
  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        featuredImage: article.featuredImage || '',
      });
    }
  }, [article]);
  
  const updateMutation = useMutation({
    mutationFn: () =>
      apiRequest('PATCH', `/api/articles/${articleId}`, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      toast({ title: "Article updated successfully" });
      setLocation("/admin/articles");
    },
  });
  
  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading article...</div>
      </div>
    );
  }
  
  if (!article) {
    return (
      <div className="p-8">
        <div className="text-center">Article not found</div>
      </div>
    );
  }
  
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/admin/articles")}
            data-testid="button-back"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold" data-testid="text-page-title">Edit Article</h1>
          </div>
          <Button
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
            data-testid="button-save"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    data-testid="input-title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={3}
                    data-testid="textarea-excerpt"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="featuredImage">Featured Image URL</Label>
                  <Input
                    id="featuredImage"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    data-testid="input-featured-image"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Content (Markdown)</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="font-mono text-sm min-h-96"
                    data-testid="textarea-content"
                  />
                </div>
              </div>
            </Card>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Preview</h2>
            <Card className="p-6">
              <h1 className="font-serif text-4xl font-bold mb-6">
                {formData.title || 'Untitled'}
              </h1>
              <MarkdownContent content={formData.content || '*No content yet*'} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
