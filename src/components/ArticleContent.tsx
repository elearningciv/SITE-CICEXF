import React from 'react';
import { CheckCircle2 } from 'lucide-react';

/**
 * Renders the Markdown-like text typed in the admin for news articles:
 * "#", "##", "###" headings, "-", "*", "•" and "1." lists, **bold**, *italic*, [links](url)
 * and bare URLs. A list made only of "**Label :** value" lines is shown as a facts sheet.
 * Placeholder text typed while testing (e.g. "XXXX…") is left out.
 */

const isPlaceholder = (text: string) => /(.)\1{7,}/i.test(text.replace(/\s/g, ''));

type Block =
  | { kind: 'heading'; level: number; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; ordered: boolean; items: string[] };

const LIST_RE = /^\s*(?:[-*•]|\d+[.)])\s+/;
const FACT_RE = /^\*\*(.+?)\s*:?\s*\*\*\s*:?\s*(.*)$/;

function parse(content: string): Block[] {
  // Inline lists ("… : - **A :** x - **B :** y") are put back on their own lines
  const normalised = content
    .replace(/\r\n/g, '\n')
    .replace(/\s-\s(?=\*\*)/g, '\n- ');
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  const flush = () => {
    if (paragraph.length) blocks.push({ kind: 'paragraph', text: paragraph.join(' ') });
    paragraph = [];
  };
  for (const raw of normalised.split('\n')) {
    const line = raw.trim();
    if (!line) { flush(); continue; }
    const heading = line.match(/^(#{1,4})\s*(.+)$/);
    if (heading) {
      flush();
      blocks.push({ kind: 'heading', level: heading[1].length, text: heading[2].replace(/\s*:\s*$/, '') });
      continue;
    }
    if (LIST_RE.test(line)) {
      flush();
      const ordered = /^\s*\d/.test(line);
      const item = line.replace(LIST_RE, '');
      const last = blocks[blocks.length - 1];
      if (last && last.kind === 'list' && last.ordered === ordered) last.items.push(item);
      else blocks.push({ kind: 'list', ordered, items: [item] });
      continue;
    }
    paragraph.push(line);
  }
  flush();
  const kept = blocks.filter(b => b.kind === 'list' ? b.items.some(i => !isPlaceholder(i)) : !isPlaceholder(b.text));
  // A heading left without content (its text was a placeholder) is dropped too
  return kept.filter((b, i) => {
    if (b.kind !== 'heading') return true;
    const next = kept[i + 1];
    return !!next && (next.kind !== 'heading' || next.level > b.level);
  });
}

/** **bold**, *italic*, [label](url) and bare links */
function inline(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<]+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={key++} className="font-bold text-slate-900 dark:text-white">{m[1]}</strong>);
    else if (m[2]) out.push(<em key={key++}>{m[2]}</em>);
    else {
      const href = m[4] || m[5];
      out.push(<a key={key++} href={href} target="_blank" rel="noreferrer" className="font-semibold text-brand-blue underline underline-offset-2 dark:text-sky-300 break-all">{m[3] || href}</a>);
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function ArticleContent({ content }: { content: string }) {
  const blocks = parse(content || '');
  return (
    <div className="space-y-5 text-base leading-relaxed text-slate-700 dark:text-slate-300">
      {blocks.map((b, i) => {
        if (b.kind === 'heading') {
          return b.level <= 2
            ? <h2 key={i} className="pt-4 font-display text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">{inline(b.text)}</h2>
            : <h3 key={i} className="pt-3 font-display text-lg font-bold text-slate-900 dark:text-white">{inline(b.text)}</h3>;
        }
        if (b.kind === 'list') {
          const facts = b.items.map(item => item.match(FACT_RE));
          if (!b.ordered && facts.every(Boolean)) {
            return (
              <dl key={i} className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-slate-200 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-800 sm:grid-cols-2">
                {facts.map((f, j) => (
                  <div key={j} className={`bg-white px-5 py-3.5 dark:bg-slate-900 ${j === facts.length - 1 && facts.length % 2 ? 'sm:col-span-2' : ''}`}>
                    <dt className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{f![1]}</dt>
                    <dd className="mt-0.5 font-semibold text-slate-900 dark:text-white">{inline(f![2]) }</dd>
                  </div>
                ))}
              </dl>
            );
          }
          const items = b.items.filter(item => !isPlaceholder(item));
          return b.ordered ? (
            <ol key={i} className="list-decimal space-y-2 pl-6 marker:font-bold marker:text-brand-emerald">
              {items.map((item, j) => <li key={j}>{inline(item)}</li>)}
            </ol>
          ) : (
            <ul key={i} className="space-y-2">
              {items.map((item, j) => (
                <li key={j} className="flex gap-2.5">
                  <CheckCircle2 className="mt-1 w-4 h-4 shrink-0 text-brand-emerald dark:text-orange-300" />
                  <span>{inline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }
        // A paragraph that is only bold text reads as a highlighted line
        const onlyBold = b.text.match(/^\*\*(.+)\*\*$/);
        return onlyBold
          ? <p key={i} className="rounded-xl border-l-4 border-brand-emerald bg-slate-50 px-5 py-3 font-display text-lg font-bold text-slate-900 dark:bg-slate-900 dark:text-white">{onlyBold[1]}</p>
          : <p key={i}>{inline(b.text)}</p>;
      })}
    </div>
  );
}
