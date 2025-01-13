import { database } from "../config/firebase";
import {ref, set, update, get} from "firebase/database";


// AddCategories Function
export const addCategories = async (idcategory, name, create_at, update_at) => {
    try {
        const categoryRef = ref(database, `categories/${idcategory}`);

        await set(categoryRef, {
            idcategory,
            name,
            create_at,
            update_at
        });

        return {success: true, message: "Kategori berhasil ditambahkan."};
    } catch (error) {
        return {success: false, message: "Kategori gagal ditambahkan."};
    }
};

// AddSubCategories Function
export const addSubCategories = async (idsubcategory, idcategory,name, create_at, update_at) => {
    try {
        const categoryRef = ref(database, `subcategories/${idcategory}`);

        await set(categoryRef, {
            idsubcategory,
            idcategory,
            name,
            create_at,
            update_at
        });

        return {success: true, message: "Kategori berhasil ditambahkan."};
    } catch (error) {
        return {success: false, message: "Kategori gagal ditambahkan."};
    }
};


// GetSubCategories Function
export const getSubCategories = async (idcategory) => {
    try {
        const subcategoryRef = ref(database, `subcategories/${idcategory}`);
        const snapshot = await get(subcategoryRef);

        if (snapshot.exists()) {
            return {success: true, data: snapshot.val()};
        } else {
            return {success: false, message: "Data kategori tidak ditemukan."};
        }
    } catch (error) {
        return {success: false, message: "Terjadi kesalahan saat mengambil data."};
    }
};



//AddProduct Function
export const addProduct = async (idproduct, idsubcategory, name, price, description ,create_at, update_at) => {
    try {
        const productRef = ref(database, `products/${idsubcategory}/${idproduct}`);
        await set(productRef, {
            idproduct,
            idsubcategory,
            name,
            price,
            description,
            create_at,
            update_at,
        });

        return {success: true, message: "Produk berhasil ditambahkan."};
    } catch (error) {
        return {success: false, message: "Produk gagal ditambahkan."};
    }
};

// GetProduct Function
export const getProduct = async () => {
  try {
    const productRef = ref(database, `products`);
    const snapshot = await get(productRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const productList = [];

      Object.keys(data).forEach((subCategoryId) => {
        Object.keys(data[subCategoryId]).forEach((productId) => {
          const product = data[subCategoryId][productId];
          productList.push({
            id: productId,
            subCategoryId,
            ...product,
          });
        });
      });

      return { success: true, data: productList };
    } else {
      return { success: false, message: "Data produk tidak ditemukan." };
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      message: `Terjadi kesalahan saat mengambil data: ${error.message}`,
    };
  }
};

  
// UpdateProduct Function
export const updateProduct = async (idproduct, idsubcategory, name, price, description, update_at) => {
    try {
        const productRef = ref(database, `products/${idsubcategory}/${idproduct}`);
        await update(productRef, {
            name,
            price,
            description,
            update_at,
        });

        return {success: true, message: "Produk berhasil diupdate."};
    } catch (error) {
        return {success: false, message: "Produk gagal diupdate."};
    }
}