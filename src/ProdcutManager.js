const fs = require('fs/promises')
const path = require('path')

class ProductManager {

    constructor(file){
        this.filepath = path.join(__dirname, file)
    }

    async addProduct({code, title, description, price, thumbnail, stock}){


        if(!title || !description || !price || !thumbnail || !stock || !code){
            console.log('Todos los datos deben ser obligatorios')
            return 'Todos los datos deben ser obligatorios'
        }else{
            const data = await fs.readFile(this.filepath, 'utf-8')
            const products = JSON.parse(data)

            if(!products.find(element => element.code === code)){
                const id = products.length  ? Math.max(...products.map(prd => prd.id)) + 1 : 1

                products.push({
                    id,
                    code,
                    title,
                    description,
                    price,
                    thumbnail,
                    stock
                })
                await fs.writeFile(this.filepath, JSON.stringify(products))
                console.log(`Producto con code= ${code} insertado con éxito`)
            }else{
                console.log(`El producto con code= ${code} ya existe`)
                return 'El producto ya existe'
            }
        }
    }

    async getProducts(){
        const data = await fs.readFile(this.filepath, 'utf-8')
        const products = JSON.parse(data)
        const prds = products ? products.sort((a,b) => a.id - b.id) : []
        return prds
    }

    async getProductById(productId){
        const data = await fs.readFile(this.filepath, 'utf-8')
        const products = JSON.parse(data)

        let position = products.findIndex(prd => {
            return prd.id == productId})
        if(position === -1){

            return 'Not Found'
        }
        return products[position]
    }

    async deleteProduct(productId){
        const data = await fs.readFile(this.filepath, 'utf-8')
        const products = JSON.parse(data)

        let position = products ? products.findIndex(prd => {
            return prd.id == productId}) : -1
        if(position === -1){
            console.log(`deleteProduct: 
             ${productId} - Not Found`)

            return 'Not Found'
        }
        const newArray = products.filter(prd => prd.id !== productId)
        await fs.writeFile(this.filepath, JSON.stringify(newArray))
        console.log(newArray)
    }

    async updateProduct(productId, prd){


        const data = await fs.readFile(this.filepath, 'utf-8')
        const products = JSON.parse(data)

        let prdOld = products.filter(prd => prd.id === productId)
        let prdLast = products.filter(prd => prd.id !== productId)


        if(prdOld.length == 0){
            console.log(`updateProduct: id ${productId} - Not Found`)
            return -1
        }
        const objprdOld = prdOld[0]
        const prdNew = {...objprdOld, ...prd}
        prdLast.push(prdNew)

        await fs.writeFile(this.filepath, JSON.stringify(prdLast.sort((a,b)=> a.id-b.id)))
        
    }


}

module.exports = ProductManager