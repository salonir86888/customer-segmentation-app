import axios from 'axios';

// When running locally in dev, use local FastAPI (http://127.0.0.1:8000).
// In production on Vercel, use relative '' to call Vercel Serverless Functions (/api/*).
// Or use VITE_API_URL if an external backend is specified.
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://127.0.0.1:8000' : '');

// Local fallback accounts for seamless standalone execution
const FALLBACK_USERS_KEY = 'segmentiq_registered_users';

function getLocalUsers() {
  try {
    const saved = localStorage.getItem(FALLBACK_USERS_KEY);
    const users = saved ? JSON.parse(saved) : [];
    const defaultUser = {
      id: 'user-default-1',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@retailpulse.io',
      password: 'Password123!',
      role: 'Store Operations Director',
      role_badge: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      store_name: 'Downtown Flagship & Omni-channel'
    };
    if (!users.some(u => u.email.toLowerCase() === defaultUser.email.toLowerCase())) {
      users.push(defaultUser);
    }
    return users;
  } catch {
    return [];
  }
}

function saveLocalUsers(users) {
  try {
    localStorage.setItem(FALLBACK_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save local users', e);
  }
}

export const analyzeFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/api/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 15000,
    });
    return response.data;
  } catch (error) {
    // If server responded with a 4xx/5xx business error, throw it
    if (error.response && error.response.status !== 404 && error.response.status !== 502) {
      throw error;
    }

    // Client-side fallback parser if serverless route is not available
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
          if (lines.length < 2) {
            throw new Error('CSV file has no data rows.');
          }

          const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/["']/g, ''));
          const idIdx = headers.findIndex(h => h.includes('id') || h.includes('cust') || h.includes('client'));
          const nameIdx = headers.findIndex(h => h.includes('name') && !h.includes('item'));
          const amountIdx = headers.findIndex(h => h.includes('total') || h.includes('amount') || h.includes('spend') || h.includes('price'));
          const dateIdx = headers.findIndex(h => h.includes('date') || h.includes('time'));

          const customerMap = {};
          const now = new Date();

          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/["']/g, ''));
            const cid = idIdx !== -1 && values[idIdx] ? values[idIdx] : `CUST-${1000 + i}`;
            const cname = nameIdx !== -1 && values[nameIdx] ? values[nameIdx] : cid;
            const amt = amountIdx !== -1 && values[amountIdx] ? parseFloat(values[amountIdx].replace(/[^\d.]/g, '')) || 0 : 100;
            const dStr = dateIdx !== -1 ? values[dateIdx] : null;

            if (!customerMap[cid]) {
              customerMap[cid] = { customer_id: cid, customer_name: cname, monetary: 0, frequency: 0, latestDate: null };
            }
            customerMap[cid].monetary += amt;
            customerMap[cid].frequency += 1;
            if (dStr) {
              const d = new Date(dStr);
              if (!isNaN(d.getTime()) && (!customerMap[cid].latestDate || d > customerMap[cid].latestDate)) {
                customerMap[cid].latestDate = d;
              }
            }
          }

          const customers = Object.values(customerMap).map(c => {
            const r = c.latestDate ? Math.max(0, Math.floor((now - c.latestDate) / (1000 * 60 * 60 * 24))) : 15;
            const f = c.frequency;
            const m = Math.round(c.monetary * 100) / 100;

            let segment = 'Occasional / Newbies';
            if (m >= 35000 && f >= 8 && r <= 45) segment = 'VIP Champions';
            else if (r > 60) segment = 'At-Risk / Dormant';
            else if (f >= 10 && m < 35000) segment = 'Consistent Bargain Buyers';

            return {
              customer_id: c.customer_id,
              customer_name: c.customer_name,
              recency: r,
              frequency: f,
              monetary: m,
              segment
            };
          });

          const total_customers = customers.length;
          const total_revenue = customers.reduce((sum, c) => sum + c.monetary, 0);

          const segGroups = {};
          customers.forEach(c => {
            if (!segGroups[c.segment]) segGroups[c.segment] = { count: 0, total_m: 0, total_r: 0, total_f: 0 };
            segGroups[c.segment].count += 1;
            segGroups[c.segment].total_m += c.monetary;
            segGroups[c.segment].total_r += c.recency;
            segGroups[c.segment].total_f += c.frequency;
          });

          const segments_summary = Object.keys(segGroups).map(name => {
            const g = segGroups[name];
            return {
              segment_name: name,
              customer_count: g.count,
              avg_recency: Math.round((g.total_r / g.count) * 10) / 10,
              avg_frequency: Math.round((g.total_f / g.count) * 10) / 10,
              avg_spend: Math.round((g.total_m / g.count) * 100) / 100,
              percentage: Math.round((g.count / total_customers) * 1000) / 10
            };
          });

          resolve({ total_customers, total_revenue, segments_summary, customers });
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
};

export const predictCustomerSegment = async (recency, frequency, monetary) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/predict`, {
      recency_days: parseFloat(recency),
      frequency_orders: parseFloat(frequency),
      monetary_spend: parseFloat(monetary),
    });
    return response.data;
  } catch (err) {
    const r = parseFloat(recency) || 0;
    const f = parseFloat(frequency) || 0;
    const m = parseFloat(monetary) || 0;

    let cluster_id = 0;
    let segment_name = 'Occasional / Newbies';
    let description = 'Low frequency or newly onboarded clients.';
    let recommended_strategy = 'Send onboarding welcome gifts and reviews.';

    if (m >= 35000 && f >= 8 && r <= 45) {
      cluster_id = 1;
      segment_name = 'VIP Champions';
      description = 'Top tier spenders who buy repeatedly.';
      recommended_strategy = 'Offer concierge priority & reward multipliers.';
    } else if (r > 60) {
      cluster_id = 2;
      segment_name = 'At-Risk / Dormant';
      description = 'Have not bought anything recently.';
      recommended_strategy = 'Trigger 25% discount comeback campaign.';
    } else if (f >= 10 && m < 35000) {
      cluster_id = 3;
      segment_name = 'Consistent Bargain Buyers';
      description = 'Frequent shoppers with modest order amounts.';
      recommended_strategy = 'Send bundle deals & free shipping promotions.';
    }

    return { cluster_id, segment_name, description, recommended_strategy };
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (err) {
    // If the server responded with an error (e.g. 401 Incorrect password), always preserve it!
    if (err.response && err.response.data && err.response.data.detail) {
      throw err;
    }

    // Offline / client fallback check
    const users = getLocalUsers();
    const matched = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!matched) {
      const error = new Error('No account found with this email address.');
      error.response = { data: { detail: 'No account found with this email address.' }, status: 401 };
      throw error;
    }

    if (matched.password !== password) {
      const error = new Error('Incorrect password. Please verify and try again.');
      error.response = { data: { detail: 'Incorrect password. Please verify and try again.' }, status: 401 };
      throw error;
    }

    const { password: _, ...profile } = matched;
    return profile;
  }
};

export const signupUser = async ({ name, email, password, role, storeName }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
      name,
      email,
      password,
      role: role || 'Store Operations Lead',
      store_name: storeName || 'Local Retail POS Node',
    });
    return response.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.detail) {
      throw err;
    }

    // Offline / client fallback check
    const users = getLocalUsers();
    if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
      const error = new Error('An account with this email already exists.');
      error.response = { data: { detail: 'An account with this email already exists.' }, status: 400 };
      throw error;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: role || 'Store Operations Lead',
      role_badge: 'User',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      store_name: storeName || 'Local Retail POS Node'
    };

    users.push(newUser);
    saveLocalUsers(users);

    const { password: _, ...profile } = newUser;
    return profile;
  }
};