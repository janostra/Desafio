const fs = require('fs').promises;

class ProductManager {
    constructor(path) {
      this.products = [];
      this.productIdCounter = 1;
      this.path = path;
    }
  
//Añadir producto
    async addProduct(title, description, price, thumbnail, code, stock) {
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.log("Todos los campos son obligatorios");
        return null;
      }
  
      if (await this.isCodeDuplicate(code)) {
        console.log("El código ya está en uso. Por favor, elija otro código.");
        return null;
      }
  
      const array = await this.readFile();

      const maxId = array.length > 0 ? Math.max(...array.map(product => product.id)) : 0;
      const newProductId = maxId + 1;

      const product = {
        id: newProductId,
        title,
        description,
        price,
        thumbnail,
        code,
        stock
      };
  
      array.push(product);

      await this.saveFile(array);
    }

//Checkeo de codigo existente
    async isCodeDuplicate(code) {
      const products = await this.readFile();
      return products.some(product => product.code === code);
    }

//Obtener todos los productos
    async getAllProducts() {
      return this.readFile();
    }
  
//Obtener productos por ID
    async getProductById(id) {
      try {
        const array = await this.readFile()
        const p = array.find(item => item.id === id);
        if (p) {
          return p;
        } else {
          console.log("No hubo coincidencias");
          return null;
        }
      } catch (error) {
        console.log("No se encontró el producto", error);
      }
    }

//Borrar producto por ID
    async deleteProduct(id) {
      try {
          let array = await this.readFile();
          const index = array.findIndex(product => product.id === id);

          if (index !== -1) {
              array.splice(index, 1);
              await this.saveFile(array);
              console.log(`Producto con ID ${id} eliminado correctamente.`);
          } else {
              console.log(`No se encontró un producto con ID ${id}.`);
          }
      } catch (error) {
          console.log("Error al eliminar el producto", error);
      }
  }

//Actualizar campo de producto por ID
  async updateProduct(id, field, value) {
      try {
          let array = await this.readFile();
          const productIndex = array.findIndex(product => product.id === id);

          if (productIndex !== -1) {
              array[productIndex][field] = value;
              await this.saveFile(array);
              console.log(`Campo ${field} del producto con ID ${id} actualizado correctamente.`);
          } else {
              console.log(`No se encontró un producto con ID ${id}.`);
          }
      } catch (error) {
          console.log("Error al actualizar el producto", error);
      }
  }

//Leer archivo
  async readFile() {
    try {
        const answer = await fs.readFile(this.path, "utf-8");

        if (!answer.trim()) {
            // Si el archivo está vacío, devuelve un array vacío
            return [];
        }

        const array = JSON.parse(answer);
        return array;
    } catch (error) {
        console.log("Error al leer el archivo", error.message);
        // Devuelve un array vacío en caso de error
        return [];
    }
}

//Guardar archivo
    async saveFile(array){
      try {
        await fs.writeFile(this.path, JSON.stringify(array, null, 2));
      } catch (error) {
        console.log("Error al guardar el archivo", error);
      }
    }
  }

// Uso de la clase
const productManager = new ProductManager('./Productos.JSON');
productManager.addProduct("Producto 5", "Descripción 5", 50, "imagen5.jpg", "CODE5", 500);
productManager.deleteProduct(2); // Ejemplo de eliminación por ID
// productManager.updateProduct(1, 'price', 25); // Ejemplo de actualización por ID y campo
const allProducts = productManager.getAllProducts();
console.log(allProducts);