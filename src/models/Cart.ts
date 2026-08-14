import { Model, Schema, Types, model, type InferSchemaType } from "mongoose";

const cartItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);

cartSchema.statics.findByUser = function (userId: string) {
  return this.findOne({ userId });
};

cartSchema.methods.addItem = function (
  productId: string,
  quantity: number
): Promise<unknown> {
  const existing = this.items.find(
    (item: { productId: { toString: () => string } }) =>
      item.productId.toString() === productId.toString()
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    this.items.push({ productId, quantity });
  }

  return this.save();
};

cartSchema.methods.updateItemQuantity = function (
  productId: string,
  quantity: number
): Promise<unknown> {
  const existing = this.items.find(
    (item: { productId: { toString: () => string } }) =>
      item.productId.toString() === productId.toString()
  );

  if (existing) {
    existing.quantity = quantity;
  } else {
    this.items.push({ productId, quantity });
  }

  return this.save();
};

cartSchema.methods.removeItem = function (productId: string): Promise<unknown> {
  this.items = this.items.filter(
    (item: { productId: { toString: () => string } }) =>
      item.productId.toString() !== productId.toString()
  );
  return this.save();
};

interface CartItem {
  productId: Types.ObjectId | string;
  quantity: number;
}

interface CartMethods {
  addItem(productId: string, quantity: number): Promise<CartDocument>;
  updateItemQuantity(productId: string, quantity: number): Promise<CartDocument>;
  removeItem(productId: string): Promise<CartDocument>;
}

interface CartStatics {
  findByUser(userId: string): Promise<CartDocument | null>;
}

type Cart = InferSchemaType<typeof cartSchema>;

type CartDoc = Omit<Cart, "userId"> & { userId: Types.ObjectId | string };

interface CartDocument extends CartDoc, CartMethods {}

interface CartModel extends Model<CartDocument>, CartStatics {}

export type { CartDocument };

export default model("Cart", cartSchema) as unknown as CartModel;
