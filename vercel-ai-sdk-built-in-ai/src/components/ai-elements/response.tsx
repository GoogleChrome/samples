import { memo } from 'react';
import type { HTMLAttributes } from 'react';
import ReactMarkdown, { type Options } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import hardenReactMarkdown from 'harden-react-markdown';
import { cn } from '@/lib/utils';

function parseIncompleteMarkdown(text: string): string {
  let result = text;

  const linkMatch = result.match(/(!?\[)([^\]]*?)$/);
  if (linkMatch) result = result.substring(0, result.lastIndexOf(linkMatch[1]));

  if (((result.match(/\*\*/g) ?? []).length % 2) === 1) result += '**';
  if (((result.match(/__/g) ?? []).length % 2) === 1) result += '__';

  if ((result.match(/```/g) ?? []).length % 2 === 0) {
    let singles = 0;
    for (let i = 0; i < result.length; i++) {
      if (result[i] === '`' && result[i - 1] !== '`' && result[i + 1] !== '`') singles++;
    }
    if (singles % 2 === 1) result += '`';
  }

  if (((result.match(/~~/g) ?? []).length % 2) === 1) result += '~~';

  return result;
}

const HardenedMarkdown = hardenReactMarkdown(ReactMarkdown);

const components: Options['components'] = {
  ol: ({ children, ...props }) => <ol className="ml-4 list-outside list-decimal" {...props}>{children}</ol>,
  ul: ({ children, ...props }) => <ul className="ml-4 list-outside list-disc" {...props}>{children}</ul>,
  li: ({ children, ...props }) => <li className="py-0.5" {...props}>{children}</li>,
  a: ({ children, ...props }) => <a className="font-medium text-primary underline underline-offset-4" target="_blank" rel="noreferrer" {...props}>{children}</a>,
  pre: ({ children }) => <pre className="my-3 overflow-x-auto rounded-md bg-muted p-4 text-sm font-mono">{children}</pre>,
  code: ({ children, ...props }) => <code className="rounded bg-muted px-1 py-0.5 text-sm font-mono" {...props}>{children}</code>,
  h1: ({ children, ...props }) => <h1 className="mt-6 mb-2 text-3xl font-semibold" {...props}>{children}</h1>,
  h2: ({ children, ...props }) => <h2 className="mt-6 mb-2 text-2xl font-semibold" {...props}>{children}</h2>,
  h3: ({ children, ...props }) => <h3 className="mt-6 mb-2 text-xl font-semibold" {...props}>{children}</h3>,
  strong: ({ children, ...props }) => <strong className="font-semibold" {...props}>{children}</strong>,
};

export type ResponseProps = HTMLAttributes<HTMLDivElement> & {
  children: Options['children'];
  parseIncompleteMarkdown?: boolean;
};

export const Response = memo(
  ({ className, children, parseIncompleteMarkdown: shouldParse = true, ...props }: ResponseProps) => {
    const content = typeof children === 'string' && shouldParse
      ? parseIncompleteMarkdown(children)
      : children;

    return (
      <div className={cn('size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0', className)} {...props}>
        <HardenedMarkdown
          remarkPlugins={[remarkGfm]}
          components={components}
          allowedImagePrefixes={['*']}
          allowedLinkPrefixes={['*']}
        >
          {content}
        </HardenedMarkdown>
      </div>
    );
  },
  (prev, next) => prev.children === next.children,
);
