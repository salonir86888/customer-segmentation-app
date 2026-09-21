// Shared user store for Vercel Serverless Functions
export const USERS = [
  {
    id: "user-1",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@retailpulse.io",
    password: "Password123!",
    role: "Store Operations Director",
    role_badge: "Admin",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    store_name: "Downtown Flagship & Omni-channel"
  },
  {
    id: "user-2",
    name: "Marcus Vance",
    email: "m.vance@retailpulse.io",
    password: "Password123!",
    role: "Lead Growth Strategist",
    role_badge: "Marketing Lead",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    store_name: "Northwest Region Outlets"
  }
];

export function findUserByEmail(email) {
  if (!email) return null;
  return USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
}

export function addUser(user) {
  USERS.push(user);
  return user;
}
