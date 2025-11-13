import { Navigation } from "@/components/blog/navigation";
import { Footer } from "@/components/blog/footer";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { useRoute, Link } from "wouter";
import { format } from "date-fns";
import type { Article } from "@shared/schema";
import placeholderImage from "@assets/generated_images/Tech_themed_article_placeholder_24ce237b.png";

export default function BlogDetail() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;
  
  const { data: article, isLoading } = useQuery<Article>({
    queryKey: [`/api/articles/slug/${slug}`],
    enabled: !!slug,
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 py-12">
          <div className="max-w-4xl mx-auto px-4 animate-pulse">
            <div className="h-8 bg-muted rounded w-32 mb-8" />
            <div className="h-12 bg-muted rounded w-3/4 mb-4" />
            <div className="h-6 bg-muted rounded w-48 mb-8" />
            <div className="aspect-video bg-muted rounded-lg mb-8" />
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
            <Link href="/blog">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const publishDate = article.publishedAt || article.createdAt;
  const readTime = Math.ceil(article.content.split(' ').length / 200);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <article className="max-w-4xl mx-auto">
          <Link href="/blog">
            <Button variant="ghost" className="mb-8" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
          
          <div className="mb-8">
            <Badge className="mb-4" data-testid="badge-status">
              {article.status}
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6" data-testid="text-article-title">
              {article.title}
            </h1>
            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span data-testid="text-publish-date">
                  {format(new Date(publishDate), 'MMMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>
          
          {article.featuredImage && (
            <div className="mb-12">
              <img
                src={article.featuredImage || placeholderImage}
                alt={article.title}
                className="w-full rounded-lg"
                data-testid="img-featured"
              />
            </div>
          )}
          
          <div className="mb-8" data-testid="content-article">
            <MarkdownContent content={article.content} />
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
