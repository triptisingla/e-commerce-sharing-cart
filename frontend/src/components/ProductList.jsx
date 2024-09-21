// src/components/ProductList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products'); // Adjust the URL if needed
        setProducts(response.data);
      } catch (err) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Product List</h1>
      <div className="product-list">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <img src={product.thumbnail} alt={product.title} />
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Discount Price: ${product.discountPrice}</p>
            <p>Rating: {product.rating}</p>
            <p>Stock: {product.stock}</p>

            <button id={product._id}>Add to cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
