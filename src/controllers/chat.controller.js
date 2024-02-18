const { Router } = require('express')
const router = Router()

router.get('/', async (req, res) => {
    try {
     res.render ('chat', {style:'style.css'})   
    } catch (error) {
        console.error ('Error al cargar el chat:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

module.exports = router