import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="font-serif text-4xl font-bold mt-8 mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-serif text-3xl font-bold mt-8 mb-4">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-serif text-2xl font-bold mt-6 mb-3">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="font-serif text-xl font-bold mt-6 mb-3">{children}</h4>
          ),
          h5: ({ children }) => (
            <h5 className="font-serif text-lg font-bold mt-4 mb-2">{children}</h5>
          ),
          h6: ({ children }) => (
            <h6 className="font-serif text-base font-bold mt-4 mb-2">{children}</h6>
          ),
          p: ({ children }) => (
            <p className="text-lg leading-relaxed mb-6">{children}</p>
          ),
          a: ({ href, children }) => (
            <a href={href} className="text-primary hover:underline font-medium">
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-6 italic my-6 text-muted-foreground">
              {children}
            </blockquote>
          ),
          code: ({ className, children }) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            
            if (language) {
              return (
                <div className="my-6 rounded-lg overflow-hidden">
                  <SyntaxHighlighter
                    language={language}
                    style={oneDark}
                    customStyle={{
                      margin: 0,
                      padding: '1.5rem',
                      fontSize: '0.95rem',
                    }}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              );
            }
            
            return (
              <code className="bg-muted px-2 py-1 rounded font-mono text-sm">
                {children}
              </code>
            );
          },
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 mb-6 ml-4">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-6 ml-4">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-lg leading-relaxed">{children}</li>
          ),
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt || ''}
              className="w-full rounded-lg my-8"
            />
          ),
          hr: () => <hr className="my-8 border-border" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
