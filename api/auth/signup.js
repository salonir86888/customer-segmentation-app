import { findUserByEmail, addUser } from '../_users.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ detail: 'Method not allowed' });
  }

  const { name, email, password, role, store_name } = req.body || {};

  if (!name || !name.trim()) {
    return res.status(400).json({ detail: 'Full Name is required.' });
  }
  if (!email || !email.includes('@')) {
    return res.status(400).json({ detail: 'A valid email address is required.' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ detail: 'Password must be at least 6 characters long.' });
  }

  const existing = findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ detail: 'An account with this email already exists.' });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    role: role || 'Store Operations Lead',
    role_badge: 'User',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    store_name: store_name || 'Local Retail POS Node'
  };

  addUser(newUser);

  const { password: _, ...userProfile } = newUser;
  return res.status(200).json(userProfile);
}
