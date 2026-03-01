import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBriefcase, FiPhone, FiMapPin, FiFileText, FiSave, FiPlus, FiChevronDown } from 'react-icons/fi';
import { leadService } from '../api';
import { useToast } from '../context/ToastContext';
import { PremiumSelect } from '../components/UI';
import Header from '../components/Layout/Header';

const categories = ['Restaurant', 'Hotel', 'Shop', 'Office', 'Factory', 'Other'];

const InputField = ({ icon: Icon, label, required, children, error }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-2"
  >
    <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider">
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl opacity-0 group-hover:opacity-10 group-focus-within:opacity-20 transition-opacity duration-300" />
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary group-focus-within:text-accent-primary transition-colors" />
        )}
        {children}
      </div>
    </div>
    {error && <p className="text-red-400 text-xs">{error}</p>}
  </motion.div>
);

const AddLead = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    phone: '',
    category: 'Other',
    city: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await leadService.create(formData);
      toast.success('Lead created successfully!');
      navigate('/pending');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="Add Lead" />
      <div className="p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center">
                <FiPlus className="w-6 h-6 text-accent-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Create New Lead</h2>
                <p className="text-text-secondary text-sm">Add a new business lead to your pipeline</p>
              </div>
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            {/* Card Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary rounded-2xl opacity-20 blur-sm" />
            
            <form onSubmit={handleSubmit} className="relative bg-background-secondary/90 backdrop-blur-xl border border-accent-primary/20 rounded-2xl p-6 md:p-8 space-y-6">
              
              {/* Business Info Section */}
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-accent-primary uppercase tracking-wider mb-4">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField icon={FiBriefcase} label="Business Name" required>
                    <input
                      type="text"
                      name="business_name"
                      value={formData.business_name}
                      onChange={handleChange}
                      className="w-full bg-background-primary/50 border border-accent-primary/20 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-text-secondary/50 focus:outline-none focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/20 transition-all duration-300"
                      placeholder="Enter business name"
                      required
                    />
                  </InputField>

                  <InputField icon={FiPhone} label="Phone Number" required>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-background-primary/50 border border-accent-primary/20 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-text-secondary/50 focus:outline-none focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/20 transition-all duration-300"
                      placeholder="Enter phone number"
                      required
                    />
                  </InputField>
                </div>
              </div>

              {/* Location Section */}
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-accent-primary uppercase tracking-wider mb-4">Location Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField icon={FiMapPin} label="Category">
                    <PremiumSelect
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      options={categories.map(cat => ({ value: cat, label: cat }))}
                      className="py-3.5"
                    />
                  </InputField>

                  <InputField icon={FiMapPin} label="City">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-background-primary/50 border border-accent-primary/20 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-text-secondary/50 focus:outline-none focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/20 transition-all duration-300"
                      placeholder="Enter city"
                    />
                  </InputField>
                </div>
              </div>

              {/* Notes Section */}
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-accent-primary uppercase tracking-wider mb-4">Additional Details</h3>
                <InputField icon={FiFileText} label="Notes">
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-background-primary/50 border border-accent-primary/20 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-text-secondary/50 focus:outline-none focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/20 transition-all duration-300 resize-none"
                    placeholder="Add any additional notes about this lead..."
                  />
                </InputField>
              </div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="pt-4"
              >
                <button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full relative group overflow-hidden rounded-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary bg-[length:200%_100%] animate-gradient-x" />
                  <div className="relative py-4 flex items-center justify-center gap-2 text-white font-semibold">
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <FiSave className="w-5 h-5" />
                        <span>Create Lead</span>
                      </>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
                </button>
              </motion.div>

              {/* Decorative corner elements */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-accent-primary/30 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-accent-secondary/30 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-accent-secondary/30 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-accent-primary/30 rounded-br-2xl" />
            </form>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="glass-card p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
                <FiBriefcase className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-xs text-text-secondary">Business name is required</p>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mx-auto mb-2">
                <FiPhone className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-xs text-text-secondary">Phone number is required</p>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mx-auto mb-2">
                <FiMapPin className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-xs text-text-secondary">Categorize your lead</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddLead;
