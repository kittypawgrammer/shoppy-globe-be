import "dotenv/config";

import mongoose from "mongoose";
import Product from "./models/Product.js";
import { connectDB, disconnectDB } from "./config/db.js";

const products = [
  {
    name: "Wireless Headphones",
    price: 2499,
    description: "Over-ear Bluetooth headphones with active noise cancellation.",
    stock: 15,
    category: "Electronics",
  },
  {
    name: "Smart Watch",
    price: 3999,
    description: "Fitness tracking smartwatch with heart-rate monitor.",
    stock: 10,
    category: "Electronics",
  },
  {
    name: "Bluetooth Speaker",
    price: 1499,
    description: "Portable waterproof speaker with 12-hour battery life.",
    stock: 25,
    category: "Electronics",
  },
  {
    name: "Laptop Backpack",
    price: 1299,
    description: "Water-resistant backpack with a padded 15-inch laptop sleeve.",
    stock: 30,
    category: "Accessories",
  },
  {
    name: "Cotton T-Shirt",
    price: 499,
    description: "100% organic cotton crew-neck t-shirt in multiple colours.",
    stock: 50,
    category: "Fashion",
  },
  {
    name: "Running Shoes",
    price: 2999,
    description: "Lightweight running shoes with cushioned sole.",
    stock: 20,
    category: "Footwear",
  },
  {
    name: "Stainless Steel Water Bottle",
    price: 699,
    description: "Insulated bottle that keeps drinks cold for 24 hours.",
    stock: 40,
    category: "Home & Kitchen",
  },
  {
    name: "Desk Lamp",
    price: 899,
    description: "LED desk lamp with adjustable brightness and USB port.",
    stock: 18,
    category: "Home & Kitchen",
  },
  {
    name: "Mechanical Keyboard",
    price: 3499,
    description: "RGB backlit mechanical keyboard with hot-swappable switches.",
    stock: 12,
    category: "Electronics",
  },
  {
    name: "Yoga Mat",
    price: 799,
    description: "Non-slip extra-thick yoga mat with carry strap.",
    stock: 35,
    category: "Fitness",
  },
];

async function seed() {
  try {
    await connectDB();

    const count = await Product.countDocuments();

    if (count > 0) {
      console.log(
        `Seed skipped: ${count} product(s) already exist in the collection.`
      );
    } else {
      const inserted = await Product.insertMany(products);
      console.log(`Seed complete: inserted ${inserted.length} products.`);
    }
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
    await mongoose.connection.close();
    process.exit(process.exitCode ?? 0);
  }
}

seed();
