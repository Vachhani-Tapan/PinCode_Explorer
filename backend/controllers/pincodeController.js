const mongoose = require('mongoose');

// Since the MongoDB collection has a field "stateName" with 39 trailing spaces,
// we must use the raw collection driver and trim values manually.
const getCollection = () => {
  return mongoose.connection.db.collection('data');
};

// Helper: the actual key in MongoDB for stateName has trailing spaces
const STATE_FIELD = 'stateName                                       ';

// 1. Get All States
exports.getStates = async (req, res) => {
  try {
    const col = getCollection();
    const states = await col.distinct(STATE_FIELD);
    const cleaned = states.filter(Boolean).map(s => s.trim()).filter(Boolean);
    const unique = [...new Set(cleaned)].sort();
    res.json(unique);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get Districts by State
exports.getDistricts = async (req, res) => {
  try {
    const { state } = req.params;
    const col = getCollection();
    const districts = await col.distinct('districtName', {
      [STATE_FIELD]: new RegExp('^\\s*' + state + '\\s*$', 'i')
    });
    res.json(districts.filter(Boolean).map(d => d.trim()).sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Get Taluks by District
exports.getTaluks = async (req, res) => {
  try {
    const { state, district } = req.params;
    const col = getCollection();
    const taluks = await col.distinct('taluk', {
      [STATE_FIELD]: new RegExp('^\\s*' + state + '\\s*$', 'i'),
      districtName: new RegExp('^\\s*' + district + '\\s*$', 'i')
    });
    res.json(taluks.filter(Boolean).map(t => t.trim()).sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Get Filtered PIN Code Data (MAIN API)
exports.getPincodes = async (req, res) => {
  try {
    let { state, district, taluk, page = 1, limit = 20 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};
    if (state) query[STATE_FIELD] = new RegExp('^\\s*' + state + '\\s*$', 'i');
    if (district) query.districtName = new RegExp('^\\s*' + district + '\\s*$', 'i');
    if (taluk) query.taluk = new RegExp('^\\s*' + taluk + '\\s*$', 'i');

    const col = getCollection();
    const total = await col.countDocuments(query);
    const data = await col.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const cleaned = data.map(doc => {
      const obj = { ...doc };
      obj.stateName = (obj[STATE_FIELD] || '').trim();
      if (STATE_FIELD !== 'stateName') delete obj[STATE_FIELD];
      if (obj.districtName) obj.districtName = obj.districtName.trim();
      if (obj.officeName) obj.officeName = obj.officeName.trim();
      if (obj.officeType) obj.officeType = obj.officeType.trim();
      if (obj.divisionName) obj.divisionName = obj.divisionName.trim();
      if (obj.regionName) obj.regionName = obj.regionName.trim();
      if (obj.circleName) obj.circleName = obj.circleName.trim();
      if (obj.taluk) obj.taluk = obj.taluk.trim();
      return obj;
    });

    res.json({ data: cleaned, total, page, limit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Search API
exports.searchPincodes = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const col = getCollection();
    const orConditions = [
      { officeName: new RegExp(q, 'i') },
      { districtName: new RegExp(q, 'i') },
      { [STATE_FIELD]: new RegExp(q, 'i') }
    ];

    if (!isNaN(q)) {
      orConditions.push({ pincode: Number(q) });
    }

    const data = await col.find({ $or: orConditions }).limit(10).toArray();

    const cleaned = data.map(doc => {
      const obj = { ...doc };
      obj.stateName = (obj[STATE_FIELD] || '').trim();
      if (STATE_FIELD !== 'stateName') delete obj[STATE_FIELD];
      if (obj.districtName) obj.districtName = obj.districtName.trim();
      if (obj.officeName) obj.officeName = obj.officeName.trim();
      return obj;
    });

    res.json(cleaned);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Get Details by PIN Code
exports.getPincodeDetails = async (req, res) => {
  try {
    const { pincode } = req.params;
    const col = getCollection();
    const data = await col.findOne({ pincode: Number(pincode) });
    if (!data) return res.status(404).json({ message: 'Pincode not found' });

    const obj = { ...data };
    obj.stateName = (obj[STATE_FIELD] || '').trim();
    if (STATE_FIELD !== 'stateName') delete obj[STATE_FIELD];
    if (obj.districtName) obj.districtName = obj.districtName.trim();
    if (obj.officeName) obj.officeName = obj.officeName.trim();
    if (obj.officeType) obj.officeType = obj.officeType.trim();
    if (obj.divisionName) obj.divisionName = obj.divisionName.trim();
    if (obj.regionName) obj.regionName = obj.regionName.trim();
    if (obj.circleName) obj.circleName = obj.circleName.trim();
    if (obj.taluk) obj.taluk = obj.taluk.trim();

    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 7. Dashboard Stats API
exports.getStats = async (req, res) => {
  try {
    const col = getCollection();
    const totalPincodes = await col.countDocuments();
    const states = await col.distinct(STATE_FIELD);
    const totalStates = [...new Set(states.filter(Boolean).map(s => s.trim()))].length;
    const deliveryOffices = await col.countDocuments({ deliveryStatus: 'Delivery' });
    const nonDeliveryOffices = await col.countDocuments({ deliveryStatus: 'Non-Delivery' });

    res.json({ totalPincodes, totalStates, deliveryOffices, nonDeliveryOffices });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 8. State-wise Distribution — FIXED: aggregate and merge duplicate state names
exports.getStateDistribution = async (req, res) => {
  try {
    const col = getCollection();
    const data = await col.aggregate([
      {
        $group: {
          _id: { $trim: { input: `$${STATE_FIELD}` } },
          count: { $sum: 1 }
        }
      },
      { $match: { _id: { $ne: null }, count: { $gt: 0 } } },
      { $sort: { count: -1 } }
    ]).toArray();

    // Extra safety: merge any remaining duplicates in JS
    const mergeMap = {};
    data.forEach(d => {
      const key = (d._id || '').trim().toUpperCase();
      if (!key) return;
      mergeMap[key] = (mergeMap[key] || 0) + d.count;
    });

    const cleaned = Object.entries(mergeMap)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count);

    res.json(cleaned);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 9. Delivery Status Distribution
exports.getDeliveryDistribution = async (req, res) => {
  try {
    const col = getCollection();
    const delivery = await col.countDocuments({ deliveryStatus: 'Delivery' });
    const nonDelivery = await col.countDocuments({ deliveryStatus: 'Non-Delivery' });
    res.json({ delivery, nonDelivery });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 10. Office Type Distribution (H.O, S.O, B.O)
exports.getOfficeTypeDistribution = async (req, res) => {
  try {
    const col = getCollection();
    const data = await col.aggregate([
      {
        $group: {
          _id: { $trim: { input: '$officeType' } },
          count: { $sum: 1 }
        }
      },
      { $match: { _id: { $ne: null } } },
      { $sort: { count: -1 } }
    ]).toArray();

    const result = {};
    data.forEach(d => {
      const key = (d._id || '').trim();
      if (key) result[key] = d.count;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 11. Region Distribution
exports.getRegionDistribution = async (req, res) => {
  try {
    const col = getCollection();
    const data = await col.aggregate([
      {
        $group: {
          _id: { $trim: { input: '$regionName' } },
          count: { $sum: 1 }
        }
      },
      { $match: { _id: { $ne: null }, count: { $gt: 0 } } },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]).toArray();

    const cleaned = data
      .filter(d => d._id && d._id.trim())
      .map(d => ({ region: d._id.trim(), count: d.count }));

    res.json(cleaned);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 12. Top Districts by PIN count
exports.getTopDistricts = async (req, res) => {
  try {
    const col = getCollection();
    const data = await col.aggregate([
      {
        $group: {
          _id: { $trim: { input: '$districtName' } },
          count: { $sum: 1 }
        }
      },
      { $match: { _id: { $ne: null }, count: { $gt: 0 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray();

    const cleaned = data
      .filter(d => d._id && d._id.trim())
      .map(d => ({ district: d._id.trim(), count: d.count }));

    res.json(cleaned);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 13. Export API
exports.exportData = async (req, res) => {
  try {
    const { Parser } = require('json2csv');
    const { state } = req.query;
    const query = {};
    if (state) query[STATE_FIELD] = new RegExp('^\\s*' + state + '\\s*$', 'i');

    const col = getCollection();
    const data = await col.find(query).toArray();
    if (data.length === 0) return res.status(404).json({ message: 'No data found' });

    const cleaned = data.map(doc => ({
      pincode: doc.pincode,
      officeName: (doc.officeName || '').trim(),
      officeType: (doc.officeType || '').trim(),
      deliveryStatus: doc.deliveryStatus,
      divisionName: (doc.divisionName || '').trim(),
      regionName: (doc.regionName || '').trim(),
      circleName: (doc.circleName || '').trim(),
      taluk: (doc.taluk || '').trim(),
      districtName: (doc.districtName || '').trim(),
      stateName: (doc[STATE_FIELD] || '').trim()
    }));

    const fields = ['pincode', 'officeName', 'officeType', 'deliveryStatus', 'divisionName', 'regionName', 'circleName', 'taluk', 'districtName', 'stateName'];
    const parser = new Parser({ fields });
    const csv = parser.parse(cleaned);

    res.header('Content-Type', 'text/csv');
    res.attachment('pincodes.csv');
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
