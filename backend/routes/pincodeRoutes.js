const express = require('express');
const router = express.Router();
const {
  getStates,
  getDistricts,
  getTaluks,
  getPincodes,
  searchPincodes,
  getPincodeDetails,
  getStats,
  getStateDistribution,
  getDeliveryDistribution,
  getOfficeTypeDistribution,
  getRegionDistribution,
  getTopDistricts,
  exportData
} = require('../controllers/pincodeController');

router.get('/states', getStates);
router.get('/states/:state/districts', getDistricts);
router.get('/states/:state/districts/:district/taluks', getTaluks);
router.get('/pincodes', getPincodes);
router.get('/search', searchPincodes);
router.get('/pincode/:pincode', getPincodeDetails);
router.get('/stats', getStats);
router.get('/stats/state-distribution', getStateDistribution);
router.get('/stats/delivery-distribution', getDeliveryDistribution);
router.get('/stats/office-type-distribution', getOfficeTypeDistribution);
router.get('/stats/region-distribution', getRegionDistribution);
router.get('/stats/top-districts', getTopDistricts);
router.get('/export', exportData);

module.exports = router;
