import mongoose from 'mongoose';

const productsSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        media: [String],
        category: String,
        collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
        tags: [String],
        sizes: [String],
        colors: [String],
        price: Number,
        expense: Number,
    },
    { timestamps: true }
);

productsSchema.set('toJSON', { getters: true });

const Product = mongoose.models.Product || mongoose.model('Product', productsSchema);

export default Product;
