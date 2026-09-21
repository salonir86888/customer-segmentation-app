export const config = {
  api: {
    bodyParser: false
  }
};

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase().replace(/\s+/g, '_'));

  const idIdx = headers.findIndex(h => h.includes('id') && (h.includes('cust') || h.includes('client') || h.includes('user'))) !== -1
    ? headers.findIndex(h => h.includes('id') && (h.includes('cust') || h.includes('client') || h.includes('user')))
    : headers.findIndex(h => h.includes('cust') || h.includes('client') || h.includes('id'));

  const nameIdx = headers.findIndex(h => h.includes('name') && h !== 'product_name' && h !== 'item_name');
  const dateIdx = headers.findIndex(h => h.includes('date') || h.includes('time'));
  const amountIdx = headers.findIndex(h => h.includes('total') || h.includes('amount') || h.includes('spend') || h.includes('price'));

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (const ch of lines[i]) {
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        values.push(current.trim().replace(/^["']|["']$/g, ''));
        current = '';
      } else {
        current += ch;
      }
    }
    values.push(current.trim().replace(/^["']|["']$/g, ''));

    const customerId = idIdx !== -1 && values[idIdx] ? values[idIdx] : `CUST-${1000 + i}`;
    const customerName = nameIdx !== -1 && values[nameIdx] ? values[nameIdx] : customerId;
    const amountStr = amountIdx !== -1 && values[amountIdx] ? values[amountIdx].replace(/[^\d.]/g, '') : '100';
    const amount = parseFloat(amountStr) || 0;
    const dateStr = dateIdx !== -1 && values[dateIdx] ? values[dateIdx] : null;

    rows.push({ customerId, customerName, amount, dateStr });
  }

  const customerMap = {};
  const now = new Date();

  rows.forEach(r => {
    if (!customerMap[r.customerId]) {
      customerMap[r.customerId] = {
        customer_id: r.customerId,
        customer_name: r.customerName,
        monetary: 0,
        frequency: 0,
        latestDate: null
      };
    }
    customerMap[r.customerId].monetary += r.amount;
    customerMap[r.customerId].frequency += 1;

    if (r.dateStr) {
      const parsedDate = new Date(r.dateStr);
      if (!isNaN(parsedDate.getTime())) {
        if (!customerMap[r.customerId].latestDate || parsedDate > customerMap[r.customerId].latestDate) {
          customerMap[r.customerId].latestDate = parsedDate;
        }
      }
    }
  });

  const customers = Object.values(customerMap).map(c => {
    let recency = 15;
    if (c.latestDate) {
      recency = Math.max(0, Math.floor((now - c.latestDate) / (1000 * 60 * 60 * 24)));
    }

    const m = Math.round(c.monetary * 100) / 100;
    const f = c.frequency;
    const r = recency;

    let segment = 'Occasional / Newbies';
    if (m >= 35000 && f >= 8 && r <= 45) {
      segment = 'VIP Champions';
    } else if (r > 60) {
      segment = 'At-Risk / Dormant';
    } else if (f >= 10 && m < 35000) {
      segment = 'Consistent Bargain Buyers';
    }

    return {
      customer_id: c.customer_id,
      customer_name: c.customer_name,
      recency: r,
      frequency: f,
      monetary: m,
      segment
    };
  });

  return customers;
}

export default async function handler(req, res) {
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

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  const buffer = Buffer.concat(chunks);
  const bodyText = buffer.toString('utf-8');

  let csvText = bodyText;
  if (bodyText.includes('Content-Disposition: form-data;')) {
    const parts = bodyText.split(/--[^\r\n]+/);
    for (const part of parts) {
      if (part.includes('filename="') || part.includes('name="file"')) {
        const headerSplit = part.split(/\r?\n\r?\n/);
        if (headerSplit.length > 1) {
          csvText = headerSplit.slice(1).join('\n\n').trim();
          break;
        }
      }
    }
  }

  const customers = parseCSV(csvText);
  if (!customers || customers.length === 0) {
    return res.status(400).json({ detail: 'No valid customer transaction rows found in file.' });
  }

  const total_customers = customers.length;
  const total_revenue = customers.reduce((sum, c) => sum + c.monetary, 0);

  const segGroups = {};
  customers.forEach(c => {
    if (!segGroups[c.segment]) {
      segGroups[c.segment] = { count: 0, total_m: 0, total_r: 0, total_f: 0 };
    }
    segGroups[c.segment].count += 1;
    segGroups[c.segment].total_m += c.monetary;
    segGroups[c.segment].total_r += c.recency;
    segGroups[c.segment].total_f += c.frequency;
  });

  const segments_summary = Object.keys(segGroups).map(segName => {
    const g = segGroups[segName];
    return {
      segment_name: segName,
      customer_count: g.count,
      avg_recency: Math.round((g.total_r / g.count) * 10) / 10,
      avg_frequency: Math.round((g.total_f / g.count) * 10) / 10,
      avg_spend: Math.round((g.total_m / g.count) * 100) / 100,
      percentage: Math.round((g.count / total_customers) * 1000) / 10
    };
  });

  return res.status(200).json({
    total_customers,
    total_revenue,
    segments_summary,
    customers
  });
}
