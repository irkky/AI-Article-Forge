import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import type { Article } from "@shared/schema";
import { Link } from "wouter";

interface ArticleTableProps {
  articles: Article[];
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, currentStatus: string) => void;
}

export function ArticleTable({ articles, onDelete, onTogglePublish }: ArticleTableProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No articles found
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articles.map((article) => (
          <TableRow key={article.id} data-testid={`row-article-${article.id}`}>
            <TableCell className="font-medium max-w-md">
              <div className="line-clamp-2" data-testid={`text-article-title-${article.id}`}>
                {article.title}
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={article.status === 'published' ? 'default' : 'secondary'}
                data-testid={`badge-article-status-${article.id}`}
              >
                {article.status}
              </Badge>
            </TableCell>
            <TableCell data-testid={`text-article-date-${article.id}`}>
              {format(new Date(article.createdAt), 'MMM d, yyyy')}
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-2">
                <Link href={`/blog/${article.slug}`} target="_blank">
                  <Button
                    variant="ghost"
                    size="icon"
                    data-testid={`button-preview-${article.id}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                
                <Link href={`/admin/articles/${article.id}/edit`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    data-testid={`button-edit-${article.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onTogglePublish(article.id, article.status)}
                  data-testid={`button-toggle-publish-${article.id}`}
                >
                  {article.status === 'published' ? (
                    <XCircle className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(article.id)}
                  data-testid={`button-delete-${article.id}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
