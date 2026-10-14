import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile as fbUpdateProfile,
  updatePassword as fbUpdatePassword,
} from "firebase/auth";
import { firebaseAuth, isFirebaseConfigured } from "../lib/firebase";
import { KEYS, store } from "../lib/storage";

/**
 * Auth service.
 *  - Firebase Authentication when VITE_FIREBASE_* variables are present.
 *  - Local (browser) accounts otherwise, or when Firebase is unreachable /
 *    misconfigured, so the shop never gets stuck on an auth error.
 */

export class AuthError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

const PASSWORD_MIN = 6;

/* ---------- helpers ---------- */

export function parseIdentifier(raw = "") {
  const value = String(raw).trim();
  if (!value) return null;
  if (value.includes("@")) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? { type: "email", value: value.toLowerCase() } : null;
  }
  const digits = value.replace(/[\s\-().]/g, "");
  return /^\+?\d{7,15}$/.test(digits) ? { type: "phone", value: digits } : null;
}

// Firebase only understands e-mail addresses, so phone numbers are mapped to a pseudo e-mail.
const toFirebaseEmail = (id) => (id.type === "email" ? id.value : `${id.value.replace("+", "")}@phone.exclusive.app`);

async function hash(text) {
  try {
    const data = new TextEncoder().encode(`exclusive::${text}`);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return btoa(unescape(encodeURIComponent(`exclusive::${text}`)));
  }
}

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, address: u.address || "" });
const saveSession = (u) => {
  const pub = publicUser(u);
  store.set(KEYS.session, pub);
  return pub;
};
const localUsers = () => store.get(KEYS.users, []);

function validate({ name, identifier, password }, needName) {
  if ((needName && !String(name || "").trim()) || !identifier || !password) throw new AuthError("missing-fields");
  const id = parseIdentifier(identifier);
  if (!id) throw new AuthError("invalid-identifier");
  if (String(password).length < PASSWORD_MIN) throw new AuthError("weak-password");
  return id;
}

/* ---------- local provider ---------- */

async function localSignup({ name, id, password }) {
  const users = localUsers();
  if (users.some((u) => u.email === id.value)) throw new AuthError("email-in-use");
  const user = {
    id: `u_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    name: name.trim(),
    email: id.value,
    address: "",
    hash: await hash(password),
  };
  store.set(KEYS.users, [...users, user]);
  return saveSession(user);
}

async function localLogin({ id, password }) {
  const user = localUsers().find((u) => u.email === id.value);
  if (!user || user.hash !== (await hash(password))) throw new AuthError("invalid-credentials");
  return saveSession(user);
}

/* ---------- public API ---------- */

export const authService = {
  usesFirebase: isFirebaseConfigured,

  getSession: () => store.get(KEYS.session, null),

  async signup({ name, identifier, password }) {
    const id = validate({ name, identifier, password }, true);
    if (isFirebaseConfigured) {
      try {
        const cred = await createUserWithEmailAndPassword(firebaseAuth, toFirebaseEmail(id), password);
        await fbUpdateProfile(cred.user, { displayName: name.trim() }).catch(() => {});
        // Keep a local profile record too (address book, profile edits).
        const users = localUsers().filter((u) => u.email !== id.value);
        const record = { id: cred.user.uid, name: name.trim(), email: id.value, address: "", hash: await hash(password) };
        store.set(KEYS.users, [...users, record]);
        return saveSession(record);
      } catch (err) {
        if (err.code === "auth/email-already-in-use") throw new AuthError("email-in-use");
        if (err.code === "auth/weak-password") throw new AuthError("weak-password");
        if (err.code === "auth/invalid-email") throw new AuthError("invalid-identifier");
        // Any other problem (bad config, network, provider disabled…) → fall back to the local store.
        console.warn("Firebase signup unavailable, using local account store:", err.code);
      }
    }
    return localSignup({ name, id, password });
  },

  async login({ identifier, password }) {
    const id = validate({ identifier, password }, false);
    if (isFirebaseConfigured) {
      try {
        const cred = await signInWithEmailAndPassword(firebaseAuth, toFirebaseEmail(id), password);
        const existing = localUsers().find((u) => u.email === id.value);
        return saveSession(
          existing
            ? { ...existing, id: cred.user.uid }
            : { id: cred.user.uid, name: cred.user.displayName || id.value.split("@")[0], email: id.value }
        );
      } catch {
        /* fall through to the local store (account may have been created offline) */
      }
    }
    return localLogin({ id, password });
  },

  async loginWithGoogle() {
    if (!isFirebaseConfigured) throw new AuthError("google-unavailable");
    try {
      const cred = await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
      return saveSession({
        id: cred.user.uid,
        name: cred.user.displayName || cred.user.email,
        email: cred.user.email,
      });
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") throw new AuthError("cancelled");
      throw new AuthError("google-unavailable");
    }
  },

  async logout() {
    store.remove(KEYS.session);
    if (isFirebaseConfigured && firebaseAuth) await signOut(firebaseAuth).catch(() => {});
  },

  async updateAccount(user, { name, address, currentPassword, newPassword }) {
    const users = localUsers();
    const idx = users.findIndex((u) => u.id === user.id || u.email === user.email);
    const record = idx >= 0 ? { ...users[idx] } : { id: user.id, name: user.name, email: user.email, address: "", hash: "" };

    if (newPassword) {
      if (newPassword.length < PASSWORD_MIN) throw new AuthError("weak-password");
      if (record.hash && record.hash !== (await hash(currentPassword || ""))) throw new AuthError("wrong-current-password");
      record.hash = await hash(newPassword);
      if (isFirebaseConfigured && firebaseAuth?.currentUser) await fbUpdatePassword(firebaseAuth.currentUser, newPassword).catch(() => {});
    }
    record.name = name?.trim() || record.name;
    record.address = address ?? record.address;
    if (isFirebaseConfigured && firebaseAuth?.currentUser) {
      await fbUpdateProfile(firebaseAuth.currentUser, { displayName: record.name }).catch(() => {});
    }
    const next = idx >= 0 ? users.map((u, i) => (i === idx ? record : u)) : [...users, record];
    store.set(KEYS.users, next);
    return saveSession(record);
  },
};
