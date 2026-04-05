const mongoose = require('mongoose');

const pincodeSchema = new mongoose.Schema({
  officeName: { type: String },
  pincode: { type: Number },
  officeType: { type: String },
  deliveryStatus: { type: String },
  divisionName: { type: String },
  regionName: { type: String },
  circleName: { type: String },
  taluk: { type: String },
  districtName: { type: String },
  stateName: { type: String },
  telephone: { type: String },
  relatedSuboffice: { type: String },
  relatedHeadoffice: { type: String },
  longitude: { type: String },
  latitude: { type: String }
}, {
  collection: 'data',
  strict: false
});

module.exports = mongoose.model('Pincode', pincodeSchema);
