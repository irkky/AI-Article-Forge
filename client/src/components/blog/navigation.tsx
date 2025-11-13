import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, BookOpen } from "lucide-react";
import { useState } from "react";

export function Navigation() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-3 py-2 cursor-pointer">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg">AI Blog</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="/blog" data-testid="link-blog">
              <Button 
                variant="ghost" 
                className={location === '/blog' ? 'bg-accent' : ''}
              >
                Blog
              </Button>
            </Link>
            <Link href="/admin" data-testid="link-admin">
              <Button 
                variant="ghost"
                className={location.startsWith('/admin') ? 'bg-accent' : ''}
              >
                Admin
              </Button>
            </Link>
          </div>
          
          <div className="flex-1 max-w-md mx-4 hidden sm:block">
            <div className="relative">
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
        </div>
      </div>
    </nav>
  );
}
