import mongoose from 'mongoose';

const productsSchema = new mongoose.Schema(
    {
        title: { type: String, },
        description: { type: String },
        collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
        media: [String],
        thumbnail: { type: String },
        price: { type: Number },
        discount: { type: Number },
        rating: { type: Number },
        stock: { type: Number },
        tags: [String],
        category: { type: String },
    },
    { timestamps: true }
);

productsSchema.set('toJSON', { getters: true });

const Product = mongoose.models.Product || mongoose.model('Product', productsSchema);

export default Product;
