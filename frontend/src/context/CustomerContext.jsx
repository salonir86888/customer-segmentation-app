import React, { createContext, useContext, useState, useEffect } from 'react';

const CustomerContext = createContext();

export const INITIAL_CUSTOMERS = [
  {
    customer_id: "CUST-9011",
    customer_name: "Aditi Rao",
    email: "aditi.rao@gmail.com",
    phone: "+91 98450 12384",
    recency: 3,
    frequency: 18,
    monetary: 78500.0,
    segment: "VIP Champions",
    store_location: "Mumbai Flagship",
    date_added: "2026-08-12",
    notes: "High value luxury buyer, prefers premium designer apparel and cosmetics.",
    tags: ["High LTV", "Fashion", "Priority"],
    loyalty_tier: "Platinum"
  },
  {
    customer_id: "CUST-8402",
    customer_name: "Vikram Malhotra",
    email: "vikram.m@zenithcorp.in",
    phone: "+91 98200 87312",
    recency: 5,
    frequency: 14,
    monetary: 62400.0,
    segment: "VIP Champions",
    store_location: "Bangalore Tech Hub",
    date_added: "2026-08-15",
    notes: "Regular corporate shopper. Orders multiple electronics and accessories.",
    tags: ["Corporate", "Tech Enthusiast"],
    loyalty_tier: "Platinum"
  },
  {
    customer_id: "CUST-7210",
    customer_name: "Ananya Sharma",
    email: "ananya.s@outlook.com",
    phone: "+91 99341 55201",
    recency: 8,
    frequency: 12,
    monetary: 51200.0,
    segment: "VIP Champions",
    store_location: "Delhi NCR Mall",
    date_added: "2026-08-20",
    notes: "Brand loyalist. Responds promptly to exclusive preview invitations.",
    tags: ["Early Adopter", "Luxury"],
    loyalty_tier: "Gold"
  },
  {
    customer_id: "CUST-6103",
    customer_name: "Rohan Kulkarni",
    email: "rohan.kulkarni@yahoo.com",
    phone: "+91 97112 34900",
    recency: 12,
    frequency: 19,
    monetary: 14200.0,
    segment: "Consistent Bargain Buyers",
    store_location: "Pune Express",
    date_added: "2026-07-28",
    notes: "High visit frequency, shops primarily during discount campaigns and buy-1-get-1 sales.",
    tags: ["Deal Hunter", "High Frequency"],
    loyalty_tier: "Silver"
  },
  {
    customer_id: "CUST-5519",
    customer_name: "Meera Patel",
    email: "meera.patel92@gmail.com",
    phone: "+91 98980 43219",
    recency: 15,
    frequency: 16,
    monetary: 16800.0,
    segment: "Consistent Bargain Buyers",
    store_location: "Ahmedabad Central",
    date_added: "2026-08-01",
    notes: "Consistently purchases grocery essentials and household items during weekend offers.",
    tags: ["FMCG", "Weekend Shopper"],
    loyalty_tier: "Silver"
  },
  {
    customer_id: "CUST-4982",
    customer_name: "Karan Johar",
    email: "karan.johar@rediffmail.com",
    phone: "+91 97654 88123",
    recency: 18,
    frequency: 22,
    monetary: 18900.0,
    segment: "Consistent Bargain Buyers",
    store_location: "Mumbai Flagship",
    date_added: "2026-07-10",
    notes: "Always uses coupon codes and loyalty discount redemptions.",
    tags: ["Coupons", "Bargain"],
    loyalty_tier: "Silver"
  },
  {
    customer_id: "CUST-3820",
    customer_name: "Pooja Hegde",
    email: "pooja.h@gmail.com",
    phone: "+91 98401 22934",
    recency: 78,
    frequency: 7,
    monetary: 34500.0,
    segment: "At-Risk / Dormant",
    store_location: "Hyderabad Midtown",
    date_added: "2026-06-11",
    notes: "Has not visited in 75+ days despite past substantial basket sizes. Needs immediate re-engagement win-back.",
    tags: ["Dormant", "Win-Back Target"],
    loyalty_tier: "Gold"
  },
  {
    customer_id: "CUST-2991",
    customer_name: "Siddharth Roy",
    email: "sid.roy@gmail.com",
    phone: "+91 98110 39485",
    recency: 95,
    frequency: 5,
    monetary: 24800.0,
    segment: "At-Risk / Dormant",
    store_location: "Kolkata City Center",
    date_added: "2026-05-19",
    notes: "Previously active seasonal shopper. Last bought winter collection items.",
    tags: ["High Recency", "Seasonal"],
    loyalty_tier: "Bronze"
  },
  {
    customer_id: "CUST-1904",
    customer_name: "Tanya Sen",
    email: "tanya.sen@gmail.com",
    phone: "+91 96500 11982",
    recency: 110,
    frequency: 4,
    monetary: 19500.0,
    segment: "At-Risk / Dormant",
    store_location: "Delhi NCR Mall",
    date_added: "2026-04-25",
    notes: "Dormant. Send exclusive 20% reactivation promo code.",
    tags: ["Reactivation", "At Risk"],
    loyalty_tier: "Bronze"
  },
  {
    customer_id: "CUST-1120",
    customer_name: "Arjun Verma",
    email: "arjun.v@gmail.com",
    phone: "+91 99887 66554",
    recency: 2,
    frequency: 1,
    monetary: 3200.0,
    segment: "Occasional / Newbies",
    store_location: "Bangalore Tech Hub",
    date_added: "2026-09-17",
    notes: "First time customer onboarded this week through digital Instagram promo.",
    tags: ["New Customer", "First Visit"],
    loyalty_tier: "Bronze"
  },
  {
    customer_id: "CUST-1045",
    customer_name: "Neha Nair",
    email: "neha.nair99@gmail.com",
    phone: "+91 98711 00293",
    recency: 24,
    frequency: 2,
    monetary: 5600.0,
    segment: "Occasional / Newbies",
    store_location: "Kochi Marine Drive",
    date_added: "2026-08-25",
    notes: "Bought gift hampers. Opportunity for second-purchase conversion sequence.",
    tags: ["Gifting", "Follow-up"],
    loyalty_tier: "Bronze"
  },
  {
    customer_id: "CUST-1008",
    customer_name: "Deepak Chawla",
    email: "d.chawla@hotmail.com",
    phone: "+91 98199 44332",
    recency: 32,
    frequency: 3,
    monetary: 7900.0,
    segment: "Occasional / Newbies",
    store_location: "Chandigarh Sector 17",
    date_added: "2026-08-18",
    notes: "Browsed festive specials. Low frequency but good responsiveness to SMS.",
    tags: ["Newbie", "Potential"],
    loyalty_tier: "Bronze"
  }
];

// Helper to classify persona based on standard RFM heuristics
export const determineSegment = (recency, frequency, monetary) => {
  const r = parseFloat(recency) || 0;
  const f = parseFloat(frequency) || 0;
  const m = parseFloat(monetary) || 0;

  if (m >= 35000 && f >= 8 && r <= 45) {
    return "VIP Champions";
  } else if (r > 60) {
    return "At-Risk / Dormant";
  } else if (f >= 10 && m < 35000) {
    return "Consistent Bargain Buyers";
  } else {
    return "Occasional / Newbies";
  }
};

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem('segmentiq_customers_data');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [lastUploadedMeta, setLastUploadedMeta] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('segmentiq_customers_data', JSON.stringify(customers));
    } catch (e) {
      console.error('Failed to persist customers', e);
    }
  }, [customers]);

  // Compute live summaries
  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((acc, c) => acc + (parseFloat(c.monetary) || 0), 0);
  const totalOrders = customers.reduce((acc, c) => acc + (c.frequency || 1), 0);
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;
  const avgCustomerFrequency = totalCustomers > 0 ? (totalOrders / totalCustomers) : 0;
  const vipOrdersCount = customers.filter(c => c.segment === "VIP Champions").reduce((acc, c) => acc + (c.frequency || 1), 0);
  // Segments breakdown
  const segmentsSummary = React.useMemo(() => {
    const grouped = {};
    customers.forEach(c => {
      const seg = c.segment || "Occasional / Newbies";
      if (!grouped[seg]) {
        grouped[seg] = {
          segment_name: seg,
          customer_count: 0,
          total_spend: 0,
          total_recency: 0,
          total_freq: 0
        };
      }
      grouped[seg].customer_count += 1;
      grouped[seg].total_spend += parseFloat(c.monetary) || 0;
      grouped[seg].total_recency += parseFloat(c.recency) || 0;
      grouped[seg].total_freq += parseFloat(c.frequency) || 0;
    });

    return Object.values(grouped).map(g => ({
      segment_name: g.segment_name,
      customer_count: g.customer_count,
      avg_spend: Math.round(g.total_spend / g.customer_count),
      avg_recency: Math.round((g.total_recency / g.customer_count) * 10) / 10,
      avg_frequency: Math.round((g.total_freq / g.customer_count) * 10) / 10,
      percentage: totalCustomers > 0 ? Math.round((g.customer_count / totalCustomers) * 1000) / 10 : 0
    }));
  }, [customers, totalCustomers]);

  // Add new customer filled from form
  const addCustomer = (customerData) => {
    const assignedSegment = customerData.segment || determineSegment(customerData.recency, customerData.frequency, customerData.monetary);
    const newRecord = {
      customer_id: customerData.customer_id || `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_name: customerData.customer_name || "New Customer",
      email: customerData.email || "",
      phone: customerData.phone || "",
      recency: parseFloat(customerData.recency) || 0,
      frequency: parseInt(customerData.frequency, 10) || 1,
      monetary: parseFloat(customerData.monetary) || 0.0,
      segment: assignedSegment,
      store_location: customerData.store_location || "Online Store",
      date_added: new Date().toISOString().split('T')[0],
      notes: customerData.notes || "",
      tags: customerData.tags || [assignedSegment.split(" ")[0]],
      loyalty_tier: customerData.monetary > 50000 ? "Platinum" : customerData.monetary > 20000 ? "Gold" : "Silver"
    };

    setCustomers(prev => [newRecord, ...prev]);
    return newRecord;
  };

  // Update existing customer
  const updateCustomer = (customerId, updatedFields) => {
    setCustomers(prev =>
      prev.map(c => {
        if (c.customer_id === customerId) {
          const updated = { ...c, ...updatedFields };
          // Re-evaluate segment if RFM metrics were modified
          if ('recency' in updatedFields || 'frequency' in updatedFields || 'monetary' in updatedFields) {
            updated.segment = determineSegment(updated.recency, updated.frequency, updated.monetary);
          }
          return updated;
        }
        return c;
      })
    );
  };

  // Delete customer
  const deleteCustomer = (customerId) => {
    setCustomers(prev => prev.filter(c => c.customer_id !== customerId));
  };

  // Bulk action dispatcher (Email, Loyalty, SMS, etc.)
  const executeBulkAction = (actionType, customerIds, payload = {}) => {
    let affectedCount = 0;
    setCustomers(prev =>
      prev.map(c => {
        if (customerIds.includes(c.customer_id)) {
          affectedCount++;
          const updated = { ...c };
          if (actionType === 'UPGRADE_LOYALTY') {
            updated.loyalty_tier = payload.tier || 'Gold';
            updated.notes = `${updated.notes || ''} [Loyalty upgraded to ${payload.tier} on ${new Date().toLocaleDateString()}]`.trim();
          } else if (actionType === 'SEND_CAMPAIGN') {
            updated.notes = `${updated.notes || ''} [Campaign "${payload.campaignName || 'Special Offer'}" sent on ${new Date().toLocaleDateString()}]`.trim();
          } else if (actionType === 'TAG_CUSTOMERS') {
            if (payload.tag && !updated.tags?.includes(payload.tag)) {
              updated.tags = [...(updated.tags || []), payload.tag];
            }
          }
          return updated;
        }
        return c;
      })
    );
    return { success: true, count: affectedCount };
  };

  // Load from backend analyzeFile response
  const setUploadedData = (backendResponse) => {
    if (backendResponse && backendResponse.customers) {
      setCustomers(backendResponse.customers.map((c, i) => ({
        customer_id: c.customer_id || `CUST-${2000 + i}`,
        customer_name: c.customer_name && c.customer_name !== 'Unknown' ? c.customer_name : `Customer ${c.customer_id}`,
        email: `${c.customer_id.toLowerCase()}@example.com`,
        phone: "+91 98" + Math.floor(10000000 + Math.random() * 90000000),
        recency: c.recency,
        frequency: c.frequency,
        monetary: c.monetary,
        segment: c.segment,
        store_location: "Retail Ingest Node",
        date_added: new Date().toISOString().split('T')[0],
        notes: `Imported via POS Ingestion Engine. Assigned to ${c.segment}.`,
        tags: [c.segment.split(" ")[0]],
        loyalty_tier: c.monetary > 40000 ? "Platinum" : c.monetary > 15000 ? "Gold" : "Silver"
      })));
      setLastUploadedMeta({
        total_customers: backendResponse.total_customers,
        total_revenue: backendResponse.total_revenue,
        segments_summary: backendResponse.segments_summary
      });
    }
  };

  // Reset to initial demo dataset
  const resetToDemoData = () => {
    setCustomers(INITIAL_CUSTOMERS);
    setLastUploadedMeta(null);
  };

  // Export to CSV / JSON
  const exportCustomers = (format = 'csv', selectedIds = null) => {
    const exportSet = selectedIds && selectedIds.length > 0
      ? customers.filter(c => selectedIds.includes(c.customer_id))
      : customers;

    if (format === 'csv') {
      const headers = ["Customer ID", "Customer Name", "Email", "Phone", "Recency (Days)", "Frequency (Orders)", "Monetary (₹)", "Persona Segment", "Store Location", "Loyalty Tier", "Date Added"];
      const rows = exportSet.map(c => [
        `"${c.customer_id}"`,
        `"${c.customer_name}"`,
        `"${c.email}"`,
        `"${c.phone}"`,
        c.recency,
        c.frequency,
        c.monetary,
        `"${c.segment}"`,
        `"${c.store_location}"`,
        `"${c.loyalty_tier}"`,
        `"${c.date_added}"`
      ]);

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `SegmentIQ_Customers_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportSet, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `SegmentIQ_Customers_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        totalCustomers,
        totalRevenue,
        avgOrderValue,
        avgCustomerFrequency,
        vipOrdersCount,
        segmentsSummary,
        lastUploadedMeta,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        executeBulkAction,
        setUploadedData,
        resetToDemoData,
        exportCustomers,
        determineSegment
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = () => useContext(CustomerContext);
