const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide activity name'],
      trim: true,
      maxlength: [200, 'Activity name cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    // Which trip this activity belongs to
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true
    },
    // Date and time of activity
    date: {
      type: Date,
      required: [true, 'Please provide activity date']
    },
    startTime: {
      type: String,  // Format: "09:00 AM"
      trim: true
    },
    endTime: {
      type: String,  // Format: "12:00 PM"
      trim: true
    },
    // Location details
    location: {
      name: {
        type: String,
        trim: true
      },
      address: {
        type: String,
        trim: true
      },
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    // Budget for this activity
    cost: {
      type: Number,
      default: 0,
      min: [0, 'Cost cannot be negative']
    },
    category: {
      type: String,
      enum: [
        'accommodation',
        'transport',
        'food',
        'sightseeing',
        'adventure',
        'shopping',
        'entertainment',
        'other'
      ],
      default: 'other'
    },
    status: {
      type: String,
      enum: ['planned', 'confirmed', 'completed', 'cancelled'],
      default: 'planned'
    },
    notes: {
      type: String,
      trim: true
    },
    // Booking/confirmation details
    bookingReference: {
      type: String,
      trim: true
    },
    // Images for this activity
    images: [{
      type: String
    }],
    // Priority level
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient querying
activitySchema.index({ trip: 1, date: 1 });

// Method to check if activity is on the same day
activitySchema.methods.isSameDay = function(otherDate) {
  const activityDate = new Date(this.date);
  const compareDate = new Date(otherDate);
  
  return (
    activityDate.getFullYear() === compareDate.getFullYear() &&
    activityDate.getMonth() === compareDate.getMonth() &&
    activityDate.getDate() === compareDate.getDate()
  );
};

module.exports = mongoose.model('Activity', activitySchema);