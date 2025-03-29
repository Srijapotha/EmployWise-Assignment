
import { Product } from '@/types/types';

const API_URL = 'https://dummyjson.com';

export async function getProducts(page: number = 1, limit: number = 8) {
  const skip = (page - 1) * limit;
  const response = await fetch(`${API_URL}/products?limit=${limit}&skip=${skip}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  const data = await response.json();
  return {
    products: data.products as Product[],
    total: data.total as number,
  };
}

export async function getProductById(id: number) {
  const response = await fetch(`${API_URL}/products/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  
  return await response.json() as Product;
}

export async function getProductsByCategory(category: string) {
  const response = await fetch(`${API_URL}/products/category/${category}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch products by category');
  }
  
  const data = await response.json();
  return {
    products: data.products as Product[],
    total: data.total as number,
  };
}

export async function searchProducts(query: string) {
  const response = await fetch(`${API_URL}/products/search?q=${query}`);
  
  if (!response.ok) {
    throw new Error('Failed to search products');
  }
  
  const data = await response.json();
  return {
    products: data.products as Product[],
    total: data.total as number,
  };
}

export async function getCategories() {
  const response = await fetch(`${API_URL}/products/categories`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  
  return await response.json();
}
