const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const slug = require('mongoose-slug-generator');
const slugify = require('slugify');
const mongooseDelete = require('mongoose-delete')
const BaiVietSchema = new Schema({
  title: { type: String },
  image: { type: String },
  category: { type: String },
  content: { type: mongoose.Schema.Types.String },
  slug: { type: String, unique: true },
  date: { type: String },
  createdAt: { type: Date, default: Date.now }
});

//add plugin
// mongoose.plugin(slug);
BaiVietSchema.plugin(mongooseDelete, {
  deleteAt: true,
  overrideMethods: 'all'
});

BaiVietSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true });
  }
  next();
});


module.exports = mongoose.model('baiviets', BaiVietSchema)