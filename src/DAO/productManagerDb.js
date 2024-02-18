const Products = require('./models/products.model')


class ProductManagerDb {

  
      async getProductByID (id) {
        try {
          const findID = await Products.findOne({ _id: id})
          if (findID) return findID
        } catch (error) {
            console.log ('Not Found')
          } 
      }

    async addProduct(product) {
      try {
          const { title, description, price, thumbnail, code, stock, status, category } = product
          //Valido que todos los campos son obligatorios
          if (!title || !description || !price || !code || !stock || !category) {
            console.error ("Todos los campos son obligatorios. Producto no agregado.")
            return { success: false, message: "Todos los campos son obligatorios. Producto no agregado." }
          }

          //valido si ya existe el code
          const codeExist = await Products.findOne({ code: code})
          if (codeExist) {
            console.error (`El producto con code: ${code} ya existe. Por favor, seleccione otro.`)
            return { success: false, message: `El producto con code: ${code} ya existe. Por favor, seleccione otro.` }
          }

          const newProduct = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status: status ?? true,
            category
          }

          //pusheo el nuevo producto
          await Products.create(newProduct)

          // Retorna el éxito si se crea el producto
          return { success: true }

      } catch (error) {
        console.error('Error al cargar productos:', error.message)
        return { success: false, message: 'Error interno al procesar la solicitud.' }
      }
    }

    async updateProduct(productUpdated) {
        try {
          // busco por id y realizo un update proporcionando el objeto completo con sus props a cambiar
          const result = await Products.findOneAndUpdate( {_id: productUpdated.id}, productUpdated )
          console.log (result)
          if (!productUpdated.id) {
            console.error("Producto no encontrado con ID:", productUpdated.id)
            throw new Error("Producto no encontrado")
          } 
          console.log("Producto actualizado correctamente:", productUpdated.id)
        } catch (error) {
          console.error("Error al actualizar el producto:", error.message)
          throw error
        }
      }

    async deleteProduct(id) {
      try {
          // busco por id y cambio el status a false, para hacer un soft Delete de producto.     
        const idExist = await Products.updateOne({ _id: id }, { $set: { status: false } })
        if (idExist) {
          console.log("Producto borrado correctamente")}
      } catch (error) {
        console.error("Error al borrar el producto:", error.message)
        return false
      }
    }
  }

module.exports = ProductManagerDb


