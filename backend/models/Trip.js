const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a trip title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    destination: {
      type: String,
      required: [true, 'Please provide a destination'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide a start date']
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide an end date'],
      validate: {
        validator: function(value) {
          // End date must be after start date
          return value >= this.startDate;
        },
        message: 'End date must be after start date'
      }
    },
    budget: {
      total: {
        type: Number,
        default: 0,
        min: [0, 'Budget cannot be negative']
      },
      spent: {
        type: Number,
        default: 0,
        min: [0, 'Spent amount cannot be negative']
      }
    },
    status: {
      type: String,
      enum: ['planning', 'confirmed', 'ongoing', 'completed', 'cancelled'],
      default: 'planning'
    },
    // Reference to User who created this trip
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // Array to store image URLs (we'll add upload functionality later)
    images: [{
      type: String
    }]
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field: calculate remaining budget
tripSchema.virtual('remainingBudget').get(function() {
  return this.budget.total - this.budget.spent;
});

// Virtual field: calculate trip duration in days
tripSchema.virtual('duration').get(function() {
  const diffTime = Math.abs(this.endDate - this.startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual populate for activities (we'll use this later)
tripSchema.virtual('activities', {
  ref: 'Activity',
  localField: '_id',
  foreignField: 'trip'
});

module.exports = mongoose.model('Trip', tripSchema);