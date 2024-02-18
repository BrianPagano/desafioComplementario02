const { Router } = require('express')
const router = Router()

router.get('/', async (req, res) => {
    try {
     res.render ('addProduct', {style:'style.css'})   
    } catch (error) {
        console.error ('Error al obtener los products:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

module.exports = router