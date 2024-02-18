const { Router } = require('express')
const router = Router()

const CartManager = require ('../DAO/cartManagerDb')
const cartManager = new CartManager()
const ProductManager = require ('../DAO/productManagerDb')
const productManager = new ProductManager()

//crear un carrito
router.post('/', async (req, res) => {
    try {
        const result = await cartManager.addCart(); // Capturar el resultado de addCart()
        res.status(201).json({ message: 'Carrito creado correctamente', cid: result.cid });
    } catch (error) {
        console.error('Error al cargar productos:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//mostrar el carrito elegido
router.get('/:cid', async (req, res) => {
    try {
        //utilizo params el id
        const { cid } = req.params
        //realizo una busqueda por id
        const filterById =  await cartManager.getCartByID(cid)
        if (!filterById) {
            return res.status(404).json({ error: 'El carrito con el ID buscado no existe.'})
        } else {
            // Calcular los subtotales
            const subtotal = filterById.products.map(product => product.quantity * product.product.price)

            // Calcular el total del carrito
            const total = subtotal.reduce((acc, subtotal) => acc + subtotal, 0)
            res.render ('cart', { 
                filterById,
                total,
                style: 'style.css',})
        }
    } catch (error) {
        console.error ('Error al obtener el carrito:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

//agregar producto indicando el carrito (cid) y el producto (pid)
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const product = await productManager.getProductByID(pid)

        if (!product) {
            return res.status(404).json({ error: 'El producto con el ID proporcionado no existe.' })
        }
        const result = await cartManager.addProductInCart(cid, pid)
        if (result.success) {
            // Actualizar el valor de user.cart en la sesión del usuario
            req.session.user.cart = cid;
            res.status(201).json({ message: result.message })
        } else {
            res.status(500).json({ error: result.message })
        }
    } catch (error) {
        console.error('Error al cargar productos:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

//actualizar el carrito con un array de productos 
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const { products } = req.body

        const result = await cartManager.updateCart(cid, products)

        if (result.success) {
            res.status(201).json({ message: result.message })
        } else {
            res.status(500).json({ error: result.message })
        }
    } catch (error) {
        console.error('Error al actualizar los productos del carrito:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

//actualizar producto pasando el cid y pid
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const { quantity } = req.body

        const result = await cartManager.updateProductQuantity(cid, pid, quantity)

        if (result.success) {
            res.status(200).json({ message: result.message })
        } else {
            res.status(500).json({ error: result.message })
        }
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto:', error.message)
            res.status(500).json({ error: 'Internal Server Error' })
        }
})



//borrar un solo producto del carrito enviando por parametros el cid y pid
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const result = await cartManager.deleteProductInCart(cid, pid)

        if (result.success) {
            res.status(201).json({ message: result.message })
        } else {
            res.status(500).json({ error: result.message })
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

//delete de todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const result = await cartManager.deleteProductsInCart(cid)

        if (result.success) {
            res.status(201).json({ message: result.message })
        } else {
            res.status(500).json({ error: result.message })
        }
    } catch (error) {
        console.error('Error al eliminar los productos:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

module.exports = router
 