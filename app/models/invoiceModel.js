const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);