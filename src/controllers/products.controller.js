import { isValidObjectId } from "mongoose"
import { productsService } from "../services/products.service.js"

export default class ProductsController {

    static getProducts = async (req, res) => {
        try {

            let { limit, page, sort, status, category } = req.query

            if (sort) {
                sort = sort.toString().toLowerCase()
                if (sort !== 'asc' && sort !== 'desc') {
                    sort = 'desc'
                }
            }

            if (limit? limit = parseInt(limit): limit = 5)
            if (page? page = parseInt(page): page = 1)
            if (isNaN(limit) || isNaN(page)) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Limit y page deben ser números` })
            }
            if (limit < 1, page < 1) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Limit y page deben ser números mayores a 0` })
            }

            let data = await productsService.getAllProductsPaginate(limit, page, sort, status, category)
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json(data)
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json(
                {
                    error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle: `${error.message}`
                }
            )
        }

    }

    static getProductById = async (req, res) => {

        try {
            let id = req.params.pid
            if (!isValidObjectId(id)) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Ingrese un id de MongoDB válido` })
            }

            let product = await productsService.getProductById(id)
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json({ product })
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json(
                {
                    error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle: `${error.message}`
                }
            )
        }

    }

    static createProduct = async (req, res) => {
        try {
            let { title, description, price, thumbnail, stock, category, code, status = true } = req.body
            if (!title, !description, !price, !stock, !category, !code) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Faltan campos obligatorios` })
            }


            let existe = await productsService.getProductByCode(code)

            if (existe) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Ya existe un producto con código ${code}` })
            }


            let newProduct = await productsService.createProduct({ title, description, price, thumbnail, stock, category, code, status })
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ newProduct });

        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json(
                {
                    error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle: `${error.message}`
                }
            )
        }
    }

    static updateProduct = async (req, res) => {
        try {
            let id = req.params.pid
            if (!isValidObjectId(id)) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Ingrese un id de MongoDB válido` })
            }

            let modificacion = req.body

            let propiedadesValidasProduct = ["title", "description", "price", "thumbnail", "stock", "code", "status"]

            let propiedadesQueQuieroModificar = Object.keys(modificacion)

            let ok = propiedadesQueQuieroModificar.every(prop => propiedadesValidasProduct.includes(prop))

            if (!ok) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Está intentando ingresar un dato erróneo` })
            }

            let products = await productsService.getAllProducts();

            if (modificacion.code) {
                if (products.some(p => p.code === modificacion.code && p.id !== id)) {
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(400).json({ error: `Ya existe un producto con código ${modificacion.code}` })
                }
            }

            const indiceProduct = products.findIndex(p => p._id == id);

            if (indiceProduct === -1) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Este producto no existe` })
            }

            let respuesta = await productsService.update(id, modificacion)
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ respuesta });

        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json(
                {
                    error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle: `${error.message}`
                }
            )
        }
    }

    static deleteProduct = async (req, res) => {
        try {
            let id = req.params.pid
            if (!isValidObjectId(id)) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Ingrese un id de MongoDB válido` })
            }
            let respuesta = await productsService.delete(id)
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ respuesta });
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json(
                {
                    error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle: `${error.message}`
                }
            )
        }
    }
}