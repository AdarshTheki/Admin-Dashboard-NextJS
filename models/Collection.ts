import mongoose from 'mongoose';

const CollectionSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Collection = mongoose.models.Collection || mongoose.model('Collection', CollectionSchema);

export default Collection;
