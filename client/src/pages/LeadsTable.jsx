import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiEdit2, FiTrash2, FiFilter, FiCheck } from 'react-icons/fi';
import { leadService } from '../api';
import { useToast } from '../context/ToastContext';
import { Modal, Button, PremiumSelect } from '../components/UI';
import Header from '../components/Layout/Header';

const categories = ['Restaurant', 'Hotel', 'Shop', 'Office', 'Factory', 'Other'];
const statuses = ['pending', 'waiting', 'approved', 'rejected'];

const LeadModal = ({ lead, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    business_name: '',
    phone: '',
    category: 'Other',
    city: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (lead) {
      setFormData({
        business_name: lead.business_name,
        phone: lead.phone,
        category: lead.category,
        city: lead.city || '',
        notes: lead.notes || ''
      });
    }
  }, [lead]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      toast.success('Lead updated successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to update lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={!!lead} onClose={onClose} title="Edit Lead">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Business Name</label>
          <input
            type="text"
            value={formData.business_name}
            onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
            className="glass-input"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="glass-input"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <PremiumSelect
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={categories.map(cat => ({ value: cat, label: cat }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="glass-input"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="glass-input min-h-[80px] resize-none"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const PriceModal = ({ isOpen, onClose, onSubmit }) => {
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!price || parseFloat(price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    setLoading(true);
    try {
      await onSubmit(parseFloat(price));
      toast.success('Lead approved with price!');
      onClose();
      setPrice('');
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enter Deal Price (INR)">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Deal Price (INR)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="glass-input"
            placeholder="Enter the deal value in INR"
            autoFocus
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Saving...' : 'Approve Lead'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      toast.success('Lead deleted successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to delete lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Lead" size="sm">
      <p className="text-text-secondary mb-6">Are you sure you want to delete this lead? This action cannot be undone.</p>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
        <Button variant="danger" onClick={handleConfirm} disabled={loading} className="flex-1">
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </Modal>
  );
};

const LeadsTable = ({ status, title }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [editLead, setEditLead] = useState(null);
  const [deleteLead, setDeleteLead] = useState(null);
  const [priceModal, setPriceModal] = useState({ isOpen: false, lead: null });
  const toast = useToast();

  useEffect(() => {
    fetchLeads();
  }, [status, search, categoryFilter]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = { status };
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;
      
      const res = await leadService.getAll(params);
      setLeads(res.data);
    } catch (error) {
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (lead, newStatus) => {
    if (newStatus === 'approved') {
      setPriceModal({ isOpen: true, lead });
      return;
    }
    
    try {
      await leadService.updateStatus(lead.id, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      fetchLeads();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handlePriceSubmit = async (price) => {
    await leadService.updateStatus(priceModal.lead.id, { status: 'approved', price });
    fetchLeads();
  };

  const handleEdit = async (formData) => {
    await leadService.update(editLead.id, formData);
    fetchLeads();
  };

  const handleDelete = async () => {
    await leadService.delete(deleteLead.id);
    fetchLeads();
  };

  const totalRevenue = leads.reduce((sum, lead) => sum + (parseFloat(lead.price) || 0), 0);

  return (
    <div className="min-h-screen">
      <Header title={title} />
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden"
        >
          <div className="p-4 border-b border-accent-primary/20 flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="glass-input pl-11"
                placeholder="Search leads..."
              />
            </div>
            <PremiumSelect
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={categories.map(cat => ({ value: cat, label: cat }))}
              placeholder="All Categories"
              icon={FiFilter}
              className="w-auto min-w-[140px]"
            />
            {status === 'approved' && (
              <div className="text-sm text-text-secondary">
                Total Revenue: <span className="text-emerald-400 font-semibold">₹{totalRevenue.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-accent-primary/10">
                  <th className="text-left p-4 text-sm font-medium text-text-secondary">Business</th>
                  <th className="text-left p-4 text-sm font-medium text-text-secondary">Phone</th>
                  <th className="text-left p-4 text-sm font-medium text-text-secondary">Category</th>
                  <th className="text-left p-4 text-sm font-medium text-text-secondary">City</th>
                  <th className="text-left p-4 text-sm font-medium text-text-secondary">Status</th>
                  {status === 'approved' && (
                    <th className="text-left p-4 text-sm font-medium text-text-secondary">Price</th>
                  )}
                  <th className="text-left p-4 text-sm font-medium text-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-text-secondary">Loading...</td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-text-secondary">No leads found</td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-accent-primary/10 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-medium">{lead.business_name}</div>
                        <div className="text-xs text-text-secondary">{new Date(lead.created_at).toLocaleDateString()}</div>
                      </td>
                      <td className="p-4 text-text-secondary">{lead.phone}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-md bg-accent-primary/20 text-accent-primary text-sm">
                          {lead.category}
                        </span>
                      </td>
                      <td className="p-4 text-text-secondary">{lead.city || '-'}</td>
                      <td className="p-4">
                        <div className="relative group">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead, e.target.value)}
                            className={`
                              appearance-none cursor-pointer
                              bg-background-primary/60 backdrop-blur-sm
                              border border-accent-primary/20 rounded-lg
                              py-1.5 px-3 pr-8
                              text-sm font-medium
                              focus:outline-none focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/20
                              transition-all duration-300
                              ${
                                lead.status === 'pending' ? 'text-amber-400 border-amber-400/30' :
                                lead.status === 'waiting' ? 'text-blue-400 border-blue-400/30' :
                                lead.status === 'approved' ? 'text-emerald-400 border-emerald-400/30' :
                                'text-red-400 border-red-400/30'
                              }
                            `}
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'right 6px center',
                              backgroundSize: '14px'
                            }}
                          >
                            {statuses.map(s => (
                              <option key={s} value={s} className="bg-background-secondary">
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      {status === 'approved' && (
                        <td className="p-4 text-emerald-400 font-semibold">
                          ₹{parseFloat(lead.price || 0).toLocaleString('en-IN')}
                        </td>
                      )}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditLead(lead)}
                            className="p-2 rounded-lg hover:bg-accent-primary/20 transition-colors"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteLead(lead)}
                            className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      <LeadModal lead={editLead} onClose={() => setEditLead(null)} onSave={handleEdit} />
      <PriceModal 
        isOpen={priceModal.isOpen} 
        onClose={() => setPriceModal({ isOpen: false, lead: null })} 
        onSubmit={handlePriceSubmit}
      />
      <DeleteModal 
        isOpen={!!deleteLead} 
        onClose={() => setDeleteLead(null)} 
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default LeadsTable;
