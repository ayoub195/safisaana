import { db } from '@/app/firebase/config';
import { collection, addDoc, getDocs, query, orderBy, Timestamp, deleteDoc, updateDoc, doc, where } from 'firebase/firestore';

// Products Collection Reference
const productsCollection = collection(db, 'products');

// Add a new product
export const addProduct = async (productData: any) => {
  try {
    const docRef = await addDoc(productsCollection, {
      ...productData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Get all products
export const getProducts = async () => {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get featured products
export const getFeaturedProducts = async () => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('featured', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

// Update a product
export const updateProduct = async (productId: string, productData: any) => {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: Timestamp.now(),
    });
    return productId;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (productId: string) => {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
    return productId;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}; 