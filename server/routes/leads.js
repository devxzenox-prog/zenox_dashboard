const express = require('express');
const router = express.Router();
const { 
  getAllLeads, 
  getLeadById, 
  createLead, 
  updateLead, 
  deleteLead, 
  updateStatus,
  getStats,
  getChartData
} = require('../controllers/leadController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/stats', getStats);
router.get('/chart-data', getChartData);
router.get('/:id', getLeadById);
router.put('/:id/status', updateStatus);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);
router.get('/', getAllLeads);
router.post('/', createLead);

module.exports = router;
