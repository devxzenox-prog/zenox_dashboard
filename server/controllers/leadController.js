const { supabase } = require('../config/db');

exports.getAllLeads = async (req, res) => {
  try {
    const { status, category, search } = req.query;
    
    let query = supabase.from('leads').select('*');

    if (status) {
      query = query.eq('status', status);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`business_name.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    query = query.order('created_at', { ascending: false });

    const { data: leads, error } = await query;

    if (error) throw error;

    res.json(leads || []);
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', req.params.id);
    
    if (error) throw error;

    if (!leads || leads.length === 0) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(leads[0]);
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

    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          business_name,
          phone,
          category: category || 'Other',
          city: city || '',
          notes: notes || '',
          status: status || 'pending'
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const { business_name, phone, category, city, notes } = req.body;

    const { data, error } = await supabase
      .from('leads')
      .update({
        business_name,
        phone,
        category,
        city,
        notes
      })
      .eq('id', req.params.id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(data[0]);
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;

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

    const updateData = {
      status,
      price: status === 'approved' ? price : null
    };

    const { data, error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', req.params.id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(data[0]);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const { data: totalData } = await supabase.from('leads').select('id', { count: 'exact' });
    const { data: pendingData } = await supabase.from('leads').select('id', { count: 'exact' }).eq('status', 'pending');
    const { data: waitingData } = await supabase.from('leads').select('id', { count: 'exact' }).eq('status', 'waiting');
    const { data: approvedData } = await supabase.from('leads').select('id', { count: 'exact' }).eq('status', 'approved');
    const { data: rejectedData } = await supabase.from('leads').select('id', { count: 'exact' }).eq('status', 'rejected');
    const { data: revenueData } = await supabase.from('leads').select('price').eq('status', 'approved').not('price', 'is', null);

    const totalRevenue = revenueData?.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0) || 0;

    res.json({
      total: totalData?.length || 0,
      pending: pendingData?.length || 0,
      waiting: waitingData?.length || 0,
      approved: approvedData?.length || 0,
      rejected: rejectedData?.length || 0,
      revenue: totalRevenue
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getChartData = async (req, res) => {
  try {
    const { data: leads } = await supabase.from('leads').select('category, status, price, created_at');

    const categoryMap = {};
    const statusMap = {};
    const revenueMap = {};

    leads?.forEach(lead => {
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
