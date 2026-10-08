import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";

/**
 * Blog yazısı gövdesi. Ham HTML işlenmez (react-markdown varsayılanı) —
 * panelden gelen metin sayfaya betik sokamaz. Öğeler sitenin tipografisiyle
 * çizilir; ayrı bir "prose" eklentisi yok.
 */
const components: Components = {
  h1: ({ children }) => <h2 className="font-display text-brand-900 mt-10 text-2xl first:mt-0 sm:text-3xl">{children}</h2>,
  h2: ({ children }) => <h2 className="font-display text-brand-900 mt-10 text-2xl first:mt-0 sm:text-3xl">{children}</h2>,
  h3: ({ children }) => <h3 className="text-ink mt-8 text-lg font-semibold">{children}</h3>,
  h4: ({ children }) => <h4 className="text-ink mt-6 font-semibold">{children}</h4>,
  p: ({ children }) => <p className="text-ink/85 mt-5 leading-relaxed first:mt-0">{children}</p>,
  a: ({ href, children }) => {
    const external = href?.startsWith("http");
    return (
      <a
        href={href?.startsWith("/") ? asset(href) : href}
        className="text-brand-800 decoration-brand-800/30 hover:decoration-brand-800 underline underline-offset-2"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  },
  ul: ({ children }) => (
    <ul className="text-ink/85 marker:text-brand-700 mt-5 flex list-disc flex-col gap-2 pl-6 leading-relaxed">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="text-ink/85 marker:text-muted mt-5 flex list-decimal flex-col gap-2 pl-6 leading-relaxed">{children}</ol>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-brand-700 text-muted mt-6 border-l-2 pl-5 italic [&>p]:mt-2">{children}</blockquote>
  ),
  hr: () => <hr className="border-line my-10" />,
  table: ({ children }) => (
    <div className="border-line mt-6 overflow-x-auto rounded-2xl border">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="bg-cream-deep border-line border-b px-4 py-2 font-semibold">{children}</th>,
  td: ({ children }) => <td className="border-line border-b px-4 py-2">{children}</td>,
  img: ({ src, alt }) =>
    typeof src === "string" ? (
      // Gövde görselleri dış adreslerden gelebilir; boyutları bilinmez.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt ?? ""} loading="lazy" className="mt-6 h-auto w-full rounded-2xl" />
    ) : null,
};

export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("min-w-0", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
