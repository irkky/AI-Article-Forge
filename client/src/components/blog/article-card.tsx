import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import type { Article } from "@shared/schema";
import placeholderImage from "@assets/generated_images/Article_card_placeholder_gradient_aac45699.png";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const publishDate = article.publishedAt || article.createdAt;
  const readTime = Math.ceil(article.content.split(' ').length / 200);
  
  return (
    <Link href={`/blog/${article.slug}`} data-testid={`link-article-${article.id}`}>
      <Card className="overflow-hidden hover-elevate active-elevate-2 transition-all cursor-pointer h-full flex flex-col">
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={article.featuredImage || placeholderImage}
            alt={article.title}
            className="w-full h-full object-cover"
            data-testid={`img-article-${article.id}`}
          />
        </div>
        
        <CardHeader className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge 
              variant={article.status === 'published' ? 'default' : 'secondary'}
              data-testid={`badge-status-${article.id}`}
            >
              {article.status}
            </Badge>
          </div>
          <h3 className="font-serif text-2xl font-bold line-clamp-2" data-testid={`text-title-${article.id}`}>
            {article.title}
          </h3>
        </CardHeader>
        
        <CardContent>
          <p className="text-muted-foreground line-clamp-3 leading-relaxed" data-testid={`text-excerpt-${article.id}`}>
            {article.excerpt}
          </p>
        </CardContent>
        
        <CardFooter className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span data-testid={`text-date-${article.id}`}>
              {format(new Date(publishDate), 'MMM d, yyyy')}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{readTime} min read</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
