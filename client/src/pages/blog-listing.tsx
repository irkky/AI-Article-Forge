import { Navigation } from "@/components/blog/navigation";
import { Footer } from "@/components/blog/footer";
import { ArticleCard } from "@/components/blog/article-card";
import { SkeletonArticleCard } from "@/components/ui/skeleton-article-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import type { Article } from "@shared/schema";
import { useState } from "react";

export default function BlogListing() {
  const [filter, setFilter] = useState<'all' | 'published'>('published');
  
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
  });
  
  const filteredArticles = filter === 'published' 
    ? articles?.filter(a => a.status === 'published')
    : articles;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4" data-testid="text-page-title">
              Blog Articles
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover AI-generated articles on various topics
            </p>
          </div>
          
          <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'published')} className="mb-8">
            <TabsList>
              <TabsTrigger value="published" data-testid="tab-published">Published</TabsTrigger>
              <TabsTrigger value="all" data-testid="tab-all">All Articles</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <SkeletonArticleCard key={i} />
              ))}
            </div>
          ) : filteredArticles && filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="grid-articles">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title="No articles yet"
              description="There are no published articles at the moment. Check back soon!"
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
