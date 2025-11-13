import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Sparkles, Loader2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function AdminGenerate() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [titles, setTitles] = useState("");
  const [progress, setProgress] = useState(0);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  
  const generateMutation = useMutation({
    mutationFn: async (titleList: string[]) => {
      setTotalCount(titleList.length);
      setGeneratedCount(0);
      setProgress(0);
      
      const results = [];
      for (let i = 0; i < titleList.length; i++) {
        const result = await apiRequest('POST', '/api/articles/generate', {
          title: titleList[i],
        });
        results.push(result);
        setGeneratedCount(i + 1);
        setProgress(((i + 1) / titleList.length) * 100);
      }
      
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      toast({
        title: "Articles generated successfully!",
        description: `${totalCount} article(s) have been created.`,
      });
      setTimeout(() => {
        setLocation("/admin/articles");
      }, 1500);
    },
    onError: (error: any) => {
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate articles",
        variant: "destructive",
      });
    },
  });
  
  const handleGenerate = () => {
    const titleList = titles
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    
    if (titleList.length === 0) {
      toast({
        title: "No titles provided",
        description: "Please enter at least one article title",
        variant: "destructive",
      });
      return;
    }
    
    generateMutation.mutate(titleList);
  };
  
  const titleCount = titles.split('\n').filter(t => t.trim().length > 0).length;
  
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">
            Generate Articles
          </h1>
          <p className="text-muted-foreground">
            Enter article titles and let AI generate comprehensive content
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Article Titles</CardTitle>
            <CardDescription>
              Enter one title per line. The AI will generate full articles with markdown formatting.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Textarea
                placeholder="How to Build a React Application&#10;The Future of AI in Web Development&#10;Understanding TypeScript Basics"
                className="min-h-64 font-mono text-sm"
                value={titles}
                onChange={(e) => setTitles(e.target.value)}
                disabled={generateMutation.isPending}
                data-testid="textarea-titles"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span data-testid="text-title-count">
                  {titleCount} {titleCount === 1 ? 'title' : 'titles'} entered
                </span>
                <span>
                  {titles.length} characters
                </span>
              </div>
            </div>
            
            {generateMutation.isPending && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Generating articles...</span>
                  <span data-testid="text-progress">
                    {generatedCount} / {totalCount}
                  </span>
                </div>
                <Progress value={progress} />
              </div>
            )}
            
            <Button
              onClick={handleGenerate}
              disabled={generateMutation.isPending || titleCount === 0}
              className="w-full"
              size="lg"
              data-testid="button-generate"
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating {generatedCount}/{totalCount}...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate {titleCount} {titleCount === 1 ? 'Article' : 'Articles'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
