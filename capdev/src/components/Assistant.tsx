import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Bot, SendHorizontal, X, RotateCcw } from 'lucide-react';
import { useSite } from '../lib/site';
import { api, visitorId } from '../lib/api';
import { navigate } from '../lib/router';

interface Msg { role: 'user' | 'assistant'; text: string }

/** Tiny formatter: **bold**, bullet lines, and "page /xxx" turned into links that navigate inside the site */
function Rich({ text, onNav }: { text: string; onNav: (to: string) => void }) {
  const blocks = text.split(/\n{2,}/);
  const inline = (s: string, key: string) => {
    const parts = s.split(/(\*\*[^*]+\*\*|\/(?:institut|recherche|publications|chercheurs|formations|expertise|actualites|opportunites|contact)\b)/g);
    return parts.map((p, i) => {
      if (p.startsWith('**') && p.endsWith('**')) return <strong key={key + i}>{p.slice(2, -2)}</strong>;
      if (/^\/[a-z]+$/.test(p)) return <a key={key + i} href={p} onClick={e => { e.preventDefault(); onNav(p); }}>{p}</a>;
      return <React.Fragment key={key + i}>{p}</React.Fragment>;
    });
  };
  const BULLET = /^\s*([•\-*]|\d+[.)])\s+/;
  const out: React.ReactNode[] = [];
  blocks.forEach((b, bi) => {
    let list: string[] = [];
    const flush = (k: string) => {
      if (list.length) out.push(<ul key={k}>{list.map((l, li) => <li key={li}>{inline(l, `${k}-${li}`)}</li>)}</ul>);
      list = [];
    };
    b.split('\n').forEach((line, li) => {
      if (BULLET.test(line)) list.push(line.replace(BULLET, ''));
      else { flush(`u${bi}-${li}`); if (line.trim()) out.push(<p key={`p${bi}-${li}`}>{inline(line, `${bi}-${li}`)}</p>); }
    });
    flush(`u${bi}-end`);
  });
  return <>{out}</>;
}

export default function Assistant() {
  const { content, t, lang, assistantOpen, openAssistant, closeAssistant, pendingQuestion, consumeQuestion } = useSite();
  const name = content?.settings.assistantName || 'Docteur';
  const greeting = t(content?.settings.assistantGreeting || '');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState('');
  const conv = useRef<string | undefined>(undefined);
  const log = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    t('Quels sont vos axes de recherche ?'),
    t("Publications sur l'emploi des jeunes"),
    t('Prochaines formations'),
    t('Bourses et stages'),
    t('Proposer un partenariat')
  ];

  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight, behavior: 'smooth' }); }, [messages, busy]);
  useEffect(() => { if (assistantOpen) setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 300); }, [assistantOpen]);
  useEffect(() => {
    if (assistantOpen && pendingQuestion) { consumeQuestion(); send(pendingQuestion); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assistantOpen, pendingQuestion]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const history = messages;
    setMessages(m => [...m, { role: 'user', text: q }]);
    setInput('');
    setBusy(true);
    try {
      const res = await api.ask({ message: q, history, lang, conversationId: conv.current, visitorId: visitorId() });
      conv.current = res.conversationId;
      setMessages(m => [...m, { role: 'assistant', text: res.answer }]);
    } catch (err) {
      setMessages(m => [...m, { role: 'assistant', text: t("Je n'arrive pas à répondre pour le moment. Réessayez dans un instant ou écrivez-nous depuis la page Contact.") }]);
    } finally {
      setBusy(false);
    }
  }

  const goTo = (to: string) => { navigate(to); if (window.innerWidth < 620) closeAssistant(); };

  return (
    <>
      <motion.button className="fab" type="button" aria-expanded={assistantOpen} aria-controls="assistant-panel"
        onClick={() => (assistantOpen ? closeAssistant() : openAssistant())}
        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 22 }}
        whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }}>
        <span className="av">{!assistantOpen && <span className="ring" />}<span className="bot-avatar">{assistantOpen ? <X /> : <Bot />}</span></span>
        <span className="label">{assistantOpen ? t('Fermer') : `${name} · ${t('assistant virtuel')}`}</span>
      </motion.button>

      <AnimatePresence>
        {assistantOpen && (
          <motion.div id="assistant-panel" className="chat" role="dialog" aria-label={`${name}, ${t('assistant virtuel')}`}
            initial={{ opacity: 0, scale: 0.85, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 16 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}>
            <div className="chat-head">
              <span className="bot-avatar"><Bot /></span>
              <div><b>{name}</b><small><i /> {t('Assistant virtuel de')} {content?.settings.siteName}</small></div>
              {messages.length > 0 && <button className="x" type="button" aria-label={t('Nouvelle conversation')} title={t('Nouvelle conversation')} onClick={() => { setMessages([]); conv.current = undefined; }} style={{ marginLeft: 'auto' }}><RotateCcw size={16} /></button>}
              <button className="x" type="button" aria-label={t('Fermer')} onClick={closeAssistant} style={messages.length ? { marginLeft: 6 } : undefined}><X size={18} /></button>
            </div>
            <div className="chat-log" ref={log} aria-live="polite">
              <motion.div className="msg bot" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <p>{greeting}</p>
              </motion.div>
              {messages.map((m, i) => (
                <motion.div key={i} className={`msg ${m.role === 'user' ? 'me' : 'bot'}`} initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3 }}>
                  {m.role === 'user' ? m.text : <Rich text={m.text} onNav={goTo} />}
                </motion.div>
              ))}
              {busy && <div className="typing" aria-label={t('Réponse en cours')}><i /><i /><i /></div>}
            </div>
            {messages.length < 2 && (
              <div className="chat-sugg">
                {suggestions.map(s => <button key={s} type="button" onClick={() => send(s)}>{s}</button>)}
              </div>
            )}
            <form className="chat-form" onSubmit={e => { e.preventDefault(); send(input); }}>
              <label htmlFor="assistant-input" className="hp">{t('Votre question')}</label>
              <input id="assistant-input" ref={inputRef} value={input} onChange={e => setInput(e.target.value)} placeholder={t('Posez votre question…')} autoComplete="off" maxLength={1500} />
              <button type="submit" aria-label={t('Envoyer')} disabled={busy}><SendHorizontal size={19} /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
