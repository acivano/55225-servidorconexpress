const ProductManager = require('./ProdcutManager')

const express = require('express')
const app = express()

const productManager = new ProductManager('productos.json')

app.use(express.urlencoded({ extended: true}))

app.get('/products', async(req, res)=>{
    const limit = req.query.limit 
    const prd = await productManager.getProducts()
    let prdRes = prd
    if(limit){
        prdRes = prd.slice(0,limit)
    }
    res.send(prdRes)
})

app.get('/products/:pid', async(req, res)=>{
    const id = req.params.pid
    const prdRes = await productManager.getProductById(id)
    
    res.send(prdRes)
})


//---- Defino Express------

const port = 3000

app.listen(port, ()=>{
    console.log(`Express Server listening at http://localhost:${port}`)
})

//-------------------------



