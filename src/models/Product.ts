import { Schema, model, type InferSchemaType } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0 },
    category: { type: String, trim: true },
  },
  { timestamps: true }
);

productSchema.index({ name: "text" });

productSchema.statics.findByName = function (name: string) {
  return this.find({ name: new RegExp(name, "i") });
};

export type Product = InferSchemaType<typeof productSchema>;

export default model<Product>("Product", productSchema);
