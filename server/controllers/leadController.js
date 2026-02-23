const { pool } = require('../config/db');

exports.getAllLeads = async (req, res) => {
  try {
    const { status, category, search } = req.query;
    
    let query = 'SELECT * FROM leads WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (category) {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (search) {
      query += ` AND (business_name ILIKE $${paramIndex} OR phone ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leads WHERE id = $1', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createLead = async (req, res) => {
  try {
    const { business_name, phone, category, city, notes, status } = req.body;

    if (!business_name || !phone) {
      return res.status(400).json({ message: 'Business name and phone are required' });
    }

    const result = await pool.query(
      'INSERT INTO leads (business_name, phone, category, city, notes, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [business_name, phone, category || 'Other', city || '', notes || '', status || 'pending']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const { business_name, phone, category, city, notes } = req.body;

    const result = await pool.query(
      'UPDATE leads SET business_name = $1, phone = $2, category = $3, city = $4, notes = $5 WHERE id = $6 RETURNING *',
      [business_name, phone, category, city, notes, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM leads WHERE id = $1 RETURNING id', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, price } = req.body;

    if (!['pending', 'waiting', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    if (status === 'approved' && price === undefined) {
      return res.status(400).json({ message: 'Price is required for approved leads' });
    }

    const result = await pool.query(
      'UPDATE leads SET status = $1, price = $2 WHERE id = $3 RETURNING *',
      [status, status === 'approved' ? price : null, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await pool.query('SELECT COUNT(*) as count FROM leads');
    const pending = await pool.query("SELECT COUNT(*) as count FROM leads WHERE status = 'pending'");
    const waiting = await pool.query("SELECT COUNT(*) as count FROM leads WHERE status = 'waiting'");
    const approved = await pool.query("SELECT COUNT(*) as count FROM leads WHERE status = 'approved'");
    const rejected = await pool.query("SELECT COUNT(*) as count FROM leads WHERE status = 'rejected'");
    const revenue = await pool.query("SELECT COALESCE(SUM(price), 0) as total FROM leads WHERE status = 'approved' AND price IS NOT NULL");

    res.json({
      total: parseInt(total.rows[0].count),
      pending: parseInt(pending.rows[0].count),
      waiting: parseInt(waiting.rows[0].count),
      approved: parseInt(approved.rows[0].count),
      rejected: parseInt(rejected.rows[0].count),
      revenue: parseFloat(revenue.rows[0].total)
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getChartData = async (req, res) => {
  try {
    const leads = await pool.query('SELECT category, status, price, created_at FROM leads');

    const categoryMap = {};
    const statusMap = {};
    const revenueMap = {};

    leads.rows.forEach(lead => {
      categoryMap[lead.category] = (categoryMap[lead.category] || 0) + 1;
      statusMap[lead.status] = (statusMap[lead.status] || 0) + 1;

      if (lead.status === 'approved' && lead.price) {
        const month = new Date(lead.created_at).toISOString().slice(0, 7);
        revenueMap[month] = (revenueMap[month] || 0) + parseFloat(lead.price);
      }
    });

    const categoryData = Object.entries(categoryMap).map(([category, count]) => ({ category, count }));
    const statusData = Object.entries(statusMap).map(([status, count]) => ({ status, count }));
    const revenueData = Object.entries(revenueMap)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);

    res.json({
      categoryData,
      statusData,
      revenueData
    });
  } catch (error) {
    console.error('Get chart data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
