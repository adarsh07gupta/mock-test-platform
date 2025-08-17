// Simple client-side mock authentication implementation for local development.
// Stores users and pending registrations in localStorage. This is not secure
// and only meant for local testing/demo when a backend is not available.

function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const USERS_KEY = 'mock_users_v1';
const PENDING_KEY = 'mock_pending_v1';
const TOKENS_KEY = 'mock_tokens_v1';

function _read(key) {
  try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
}
function _write(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

function _readArray(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function _writeArray(key, arr) { localStorage.setItem(key, JSON.stringify(arr)); }

function generateToken() {
  return 'tok_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function register({ name, email, password }) {
  await delay(400);
  const users = _readArray(USERS_KEY);
  if (users.find(u => u.email === email)) {
    const err = new Error('User with this email already exists');
    err.code = 'USER_EXISTS';
    throw err;
  }

  // create pending entry with OTP (for demo we use 123456)
  const pending = _read(PENDING_KEY) || {};
  const otp = '123456';
  pending[email] = { name, email, password, otp, createdAt: Date.now() };
  _write(PENDING_KEY, pending);

  return { ok: true, message: 'OTP sent', otpForTesting: otp };
}

export async function verifyOtp({ email, otp }) {
  await delay(400);
  const pending = _read(PENDING_KEY) || {};
  const entry = pending[email];
  if (!entry) {
    const err = new Error('No pending registration for this email');
    err.code = 'NO_PENDING';
    throw err;
  }
  if (entry.otp !== otp) {
    const err = new Error('Invalid OTP');
    err.code = 'INVALID_OTP';
    throw err;
  }

  // move to users
  const users = _readArray(USERS_KEY);
  const newUser = { name: entry.name, email: entry.email, password: entry.password };
  users.push(newUser);
  _writeArray(USERS_KEY, users);

  // remove pending
  delete pending[email];
  _write(PENDING_KEY, pending);

  // create token
  const token = generateToken();
  const tokens = _read(TOKENS_KEY) || {};
  tokens[token] = { email: newUser.email, createdAt: Date.now() };
  _write(TOKENS_KEY, tokens);

  return { token, user: { name: newUser.name, email: newUser.email } };
}

export async function login(email, password) {
  await delay(300);
  const users = _readArray(USERS_KEY);
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    const err = new Error('Invalid email or password');
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }
  const token = generateToken();
  const tokens = _read(TOKENS_KEY) || {};
  tokens[token] = { email: user.email, createdAt: Date.now() };
  _write(TOKENS_KEY, tokens);
  return { token, user: { name: user.name, email: user.email } };
}

export function logout() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}

export function setAuthSession(token, user) {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_user', JSON.stringify(user));
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function isAuthenticated() {
  return !!localStorage.getItem('auth_token');
}