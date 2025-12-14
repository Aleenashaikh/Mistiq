import mongoose from 'mongoose';

const announcementBannerSchema = new mongoose.Schema({
  text: {
    type: String,
    default: 'Opening Sale Live',
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Ensure only one banner exists
announcementBannerSchema.statics.getActive = async function() {
  let banner = await this.findOne();
  if (!banner) {
    banner = new this({
      text: 'Opening Sale Live',
      isActive: false,
    });
    await banner.save();
  }
  return banner;
};

export default mongoose.model('AnnouncementBanner', announcementBannerSchema);

