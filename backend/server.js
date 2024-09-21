import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import Product from './models/productModel.js';

const port = process.env.PORT || 5000;
// connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
// const imagurl1=
app.use('/api/users', userRoutes);
// app.use(express.static(path.join(__dirname, 'public')));
const products=[
  {
      "title": "Stylish Sneakers 1",
      "description": "Comfortable and stylish sneakers for everyday wear.",
      "price": 79.99,
      "discountPercentage": 10,
      "rating": 4.5,
      "stock": 150,
      "brand": "SneakerCo",
      "category": "Footwear",
      "thumbnail": "https://example.com/images/sneakers.jpg",
      "images": [
          "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dXJsfGVufDB8fDB8fHww"
      ],
      "highlights": ["Comfortable", "Durable", "Lightweight"]
  },
  {
      "title": "Smartwatch 1",
      "description": "A feature-rich smartwatch with health tracking.",
      "price": 249.99,
      "discountPercentage": 5,
      "rating": 4.6,
      "stock": 50,
      "brand": "TechGiant",
      "category": "Wearables",
      "thumbnail": "https://example.com/images/smartwatch.jpg",
      "images": [
         "https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dXJsfGVufDB8fDB8fHww"
      ],
      "highlights": ["Health Tracking", "Notifications", "Water Resistant"]
  }
]

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}
// Function to populate the database with products
const populateProducts = async () => {
  try {
    for (const item of products) {
      const product = new Product(item);
      product.discountPrice = Math.round(product.price * (1 - product.discountPercentage / 100));
      await product.save();
      console.log(`Inserted product: ${product.title}`);
    }
  } catch (err) {
    console.error('Error inserting products:', err);
  }
};

app.use('/api/products', productRoutes); // Mount the product routes

// Call the populateProducts function after connecting to the database
connectDB().then(() => {
  populateProducts();
});
// 
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
