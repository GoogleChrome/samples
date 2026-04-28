import { StrictMode, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useChat } from '@ai-sdk/react';
import { DirectChatTransport, ToolLoopAgent, type UIMessage } from 'ai';
import { browserAI } from '@browser-ai/core';
import { ArrowDown, Sparkles } from 'lucide-react';
import { MessageContent } from '@/components/ai-elements/message';
import { Response } from '@/components/ai-elements/response';
import { Shimmer } from '@/components/ai-elements/shimmer';
import { Loader } from '@/components/ai-elements/loader';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import './index.css';

function createLazyGoogleModel() {
  let inner: any = null;

  const resolve = async () => {
    if (inner) return inner;
    let apiKey = localStorage.getItem('geminiApiKey');
    if (!apiKey) {
      apiKey = prompt('Enter your Gemini API key:') ?? '';
      if (apiKey) localStorage.setItem('geminiApiKey', apiKey);
    }
    const { createGoogleGenerativeAI } = await import('@ai-sdk/google');
    inner = createGoogleGenerativeAI({ apiKey })('gemini-2.5-flash');
    return inner;
  };

  return {
    specificationVersion: 'v3' as const,
    provider: 'google.generative-ai',
    modelId: 'gemini-2.5-flash',
    defaultObjectGenerationMode: 'json' as const,
    doGenerate: async (options: any) => (await resolve()).doGenerate(options),
    doStream: async (options: any) => (await resolve()).doStream(options),
  };
}

const agentPromise: Promise<ToolLoopAgent> = (async () => {
  const builtIn = browserAI();
  let model: any = builtIn;

  if (typeof builtIn.availability === 'function') {
    const availability = await builtIn.availability();
    if (availability === 'unavailable') {
      model = createLazyGoogleModel();
    } else if (availability === 'downloadable') {
      await builtIn.createSessionWithProgress(() => {});
    }
  }

  return new ToolLoopAgent({ model, instructions: 'You are a helpful assistant.' });
})();

const AIIcon = () => (
  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground ring-1 ring-border/50">
    <Sparkles size={13} />
  </div>
);

const ThinkingMessage = () => (
  <div className="flex items-start gap-3">
    <div className="flex h-[calc(13px*1.65)] items-center">
      <AIIcon />
    </div>
    <div className="flex h-[calc(13px*1.65)] items-center text-[13px] leading-[1.65]">
      <Shimmer className="font-medium">Thinking…</Shimmer>
    </div>
  </div>
);

const ChatMessage = ({ message, isStreaming }: { message: UIMessage; isStreaming: boolean }) => {
  const isUser = message.role === 'user';

  const textParts = message.parts.map((part, i) => {
    if (part.type !== 'text') return null;
    if (isUser) return <span key={i}>{part.text}</span>;
    return <Response key={i} parseIncompleteMarkdown={isStreaming}>{part.text}</Response>;
  });

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-2 animate-fade-up">
        <MessageContent className="w-fit max-w-[min(80%,56ch)] overflow-hidden break-words rounded-2xl rounded-br-lg border border-border/30 bg-gradient-to-br from-secondary to-muted px-3.5 py-2 text-[13px] leading-[1.65] shadow-[var(--shadow-card)]">
          {textParts}
        </MessageContent>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-[calc(13px*1.65)] items-center">
        <AIIcon />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <MessageContent className="text-[13px] leading-[1.65]">
          {textParts}
        </MessageContent>
      </div>
    </div>
  );
};

const Greeting = () => (
  <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
    <div className="flex flex-col items-center gap-2 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">How can I help?</h1>
      <p className="text-sm text-muted-foreground">Ask me anything.</p>
    </div>
  </div>
);

function Chat({ agent }: { agent: ToolLoopAgent }) {
  const transport = useMemo(() => new DirectChatTransport({ agent }), [agent]);
  const { messages, sendMessage, status, stop } = useChat({ transport });
  const [input, setInput] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const isStreaming = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    if (isAtBottom) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status, isAtBottom]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setIsAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 50);
  };

  const scrollToBottom = () =>
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });

  return (
    <div className="flex flex-col h-dvh max-w-3xl mx-auto">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <span className="text-sm font-medium">Built-in AI Chatbot</span>
        <a href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">← Back</a>
      </header>

      <div className="relative flex-1 bg-background overflow-hidden">
        {messages.length === 0 && <Greeting />}

        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="absolute inset-0 overflow-y-auto"
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6">
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isStreaming={isStreaming && index === messages.length - 1}
              />
            ))}

            {status === 'submitted' && messages.at(-1)?.role !== 'assistant' && (
              <ThinkingMessage />
            )}

            <div ref={endRef} className="min-h-6 min-w-6 shrink-0" />
          </div>
        </div>

        <button
          aria-label="Scroll to bottom"
          onClick={scrollToBottom}
          type="button"
          className={cn(
            'absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full border border-border/50 bg-card/90 h-7 w-7 shadow-[var(--shadow-float)] backdrop-blur-lg transition-all duration-200',
            isAtBottom ? 'pointer-events-none scale-90 opacity-0' : 'scale-100 opacity-100',
          )}
        >
          <ArrowDown className="size-3 text-muted-foreground" />
        </button>
      </div>

      <div className="p-4">
        <form
          onSubmit={e => {
            e.preventDefault();
            if (!input.trim() || isStreaming) return;
            sendMessage({ text: input });
            setInput('');
          }}
          className="flex items-end gap-2 rounded-2xl border border-border/30 bg-card/70 px-4 py-3 shadow-[var(--shadow-composer)] focus-within:shadow-[var(--shadow-composer-focus)] transition-shadow"
        >
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (input.trim() && !isStreaming) {
                  sendMessage({ text: input });
                  setInput('');
                }
              }
            }}
            disabled={isStreaming}
            placeholder="Send a message…"
            rows={1}
            className="flex-1 resize-none bg-transparent text-[13px] leading-[1.65] placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
            style={{ maxHeight: '10rem', overflowY: 'auto' }}
            onInput={e => {
              const el = e.currentTarget;
              el.style.height = 'auto';
              el.style.height = `${el.scrollHeight}px`;
            }}
          />
          {isStreaming ? (
            <Button type="button" variant="outline" size="sm" onClick={stop}>Stop</Button>
          ) : (
            <Button type="submit" size="sm" disabled={!input.trim()}>Send</Button>
          )}
        </form>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

function App() {
  const [agent, setAgent] = useState<ToolLoopAgent | null>(null);

  useEffect(() => {
    agentPromise.then(setAgent);
  }, []);

  if (!agent) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <Loader size={20} />
      </div>
    );
  }

  return <Chat agent={agent} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
