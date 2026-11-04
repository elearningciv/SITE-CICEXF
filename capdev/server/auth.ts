import crypto from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';

// Principal administrator: one account, defined by ADMIN_EMAIL + ADMIN_PASSWORD_HASH.
// The session is a signed, HttpOnly cookie; nothing about it is readable by page scripts.

const isProd = process.env.NODE_ENV === 'production';
const COOKIE = 'capdev_admin';
const SESSION_HOURS = 12;

const SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
if (!process.env.SESSION_SECRET) {
  console.warn('[auth] SESSION_SECRET absent : un secret temporaire est utilisé (les sessions expirent au redémarrage).');
}

// Development fallback so the admin can be tried locally without configuration.
const DEV_EMAIL = 'admin@capdev.local';
const DEV_PASSWORD = 'capdev-admin';

export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || (isProd ? '' : DEV_EMAIL)).trim().toLowerCase();
const ADMIN_HASH = process.env.ADMIN_PASSWORD_HASH || (isProd ? '' : hashPassword(DEV_PASSWORD, 'capdev-dev-salt'));
if (!process.env.ADMIN_PASSWORD_HASH && !isProd) {
  console.warn(`[auth] Compte admin de développement : ${DEV_EMAIL} / ${DEV_PASSWORD}`);
}

/** Format: scrypt$<salt>$<hex key> */
export function hashPassword(password: string, salt = crypto.randomBytes(16).toString('hex')) {
  const key = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${key}`;
}

function verifyPassword(password: string, stored: string) {
  const [algo, salt, key] = stored.split('$');
  if (algo !== 'scrypt' || !salt || !key) return false;
  const candidate = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(key, 'hex');
  return expected.length === candidate.length && crypto.timingSafeEqual(candidate, expected);
}

function sign(payload: string) {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
}

function issueToken(email: string) {
  const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + SESSION_HOURS * 3600_000 })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function readToken(token: string | undefined): string | null {
  if (!token) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const expected = sign(payload);
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const { email, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (typeof exp !== 'number' || exp < Date.now()) return null;
    return email === ADMIN_EMAIL ? email : null;
  } catch {
    return null;
  }
}

function cookieValue(req: Request, name: string) {
  const header = req.headers.cookie || '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return undefined;
}

export function currentAdmin(req: Request) {
  return readToken(cookieValue(req, COOKIE));
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!currentAdmin(req)) return res.status(401).json({ error: 'Connexion administrateur requise.' });
  next();
}

// Brute-force protection: 8 failed attempts per IP per 15 minutes
const attempts = new Map<string, { count: number; until: number }>();

export function login(req: Request, res: Response) {
  const ip = req.ip || 'unknown';
  const rec = attempts.get(ip);
  if (rec && rec.until > Date.now() && rec.count >= 8) {
    return res.status(429).json({ error: 'Trop de tentatives. Réessayez dans 15 minutes.' });
  }
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!ADMIN_EMAIL || !ADMIN_HASH) {
    return res.status(503).json({ error: "L'administrateur principal n'est pas encore configuré sur le serveur." });
  }
  const ok = email === ADMIN_EMAIL && verifyPassword(password, ADMIN_HASH);
  if (!ok) {
    const next = rec && rec.until > Date.now() ? { count: rec.count + 1, until: rec.until } : { count: 1, until: Date.now() + 15 * 60_000 };
    attempts.set(ip, next);
    return res.status(401).json({ error: 'Adresse e-mail ou mot de passe incorrect.' });
  }
  attempts.delete(ip);
  res.setHeader('Set-Cookie', `${COOKIE}=${issueToken(email)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_HOURS * 3600}${isProd ? '; Secure' : ''}`);
  res.json({ admin: true, email });
}

export function logout(_req: Request, res: Response) {
  res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${isProd ? '; Secure' : ''}`);
  res.json({ admin: false });
}
