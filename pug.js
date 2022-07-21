const express = require ('express');
const { Router } =  express;
const Contenedor = require ('./contenedor')

const app = express()
const router = Router()

const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
})

server.on('error', error => console.log(`Hubo un error en el servidor ${error}`))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set ('views', './views')
app.set ('view engine', 'pug')

const contenedor = new Contenedor (__dirname + '/productos.json'); 

router.get('/', async (req, res) => {
    const productos = await contenedor.getAll()
    res.json(productos)
})

router.get('/:id', async (req, res) => {
    let id = req.params.id
    const product = await contenedor.getById(id)
    res.send(product)
})

router.post('/', async (req, res) => {
    const obj = req.body
    await contenedor.save(obj)
    res.redirect('/productos')
})

router.put('/:id', async (req, res) => {
    const obj = req.body
    const id = req.params.id
    const product = await contenedor.updateById(id, obj)
    res.send(product)
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id
    const product = await contenedor.deleteById(id)
    res.send(product)
})

app.use('/api/productos', router)

app.get('/', (req, res) => {
    res.render('pug/form')
})

app.get('/productos', async (req, res) => {
    const productos = await contenedor.getAll()
    res.render('pug/productos', {
        productos: productos
    })
})