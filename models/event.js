const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  datetime: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  coordinates: {
    type: String,
    required: true
  },
 image: {
    type: String,
    required: true
  },
  video: {
    type: String
  },
  observations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Observation'
  }]
});


module.exports = mongoose.model('Event', eventSchema);