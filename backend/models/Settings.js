import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  deliveryCharge: {
    type: Number,
    required: true,
    default: 200,
    min: 0,
  },
}, {
  timestamps: true,
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = new this({
      deliveryCharge: 200,
    });
    await settings.save();
  }
  return settings;
};

export default mongoose.model('Settings', settingsSchema);

