import { isValidObjectId } from "mongoose"
import { productsService } from "../services/products.service.js"
import CustomError from "../utils/CustomError.js"
import { ERRORS } from "../utils/EErrors.js"
import { invalidId, generateProductErrorInfo } from "../utils/info.js"

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
                CustomError.createError({ name: 'Error', cause: 'Limit y page deben ser números', message: `Limit y page deben ser números`, code: ERRORS.BAD_REQUEST })
            }
            if (limit < 1, page < 1) {
                CustomError.createError({ name: 'Error', cause: 'Limit y page deben ser números mayores a 0', message: `Limit y page deben ser números mayores a 0`, code: ERRORS.BAD_REQUEST })
            }

            let data = await productsService.getAllProductsPaginate(limit, page, sort, status, category)
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json(data)
        } catch (error) {
            CustomError.createError({ name: 'Error', cause: error, message: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, code: ERRORS.INTERNAL_SERVER_ERROR })
        }

    }

    static getProductById = async (req, res) => {

        try {
            let id = req.params.pid
            if (!isValidObjectId(id)) {
                CustomError.createError({ name: 'Error', cause: invalidId(id), message: "El id ingresado no tiene el formato correcto", code: ERRORS.BAD_REQUEST })
            }

            let product = await productsService.getProductById(id)
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json({ product })
        } catch (error) {
            CustomError.createError({ name: 'Error', cause: error, message: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, code: ERRORS.INTERNAL_SERVER_ERROR })
        }

    }

    static createProduct = async (req, res) => {
        try {
            let { title, description, price, thumbnail, stock, category, code, status = true } = req.body
            if (!title, !description, !price, !stock, !category, !code) {
                // res.setHeader('Content-Type', 'application/json');
                // return res.status(400).json({ error: `Faltan campos obligatorios` })
                CustomError.createError({ name: 'Error', cause: 'Faltan campos obligatorios', message: `Faltan campos obligatorios`, code: ERRORS.BAD_REQUEST })
            }

            let existe = await productsService.getProductByCode(code)

            if (existe) {
                CustomError.createError({ name: 'Error', cause: 'Producto ya existe', message: `Ya existe un producto con código ${code}`, code: ERRORS.BAD_REQUEST })
            }


            let newProduct = await productsService.createProduct({ title, description, price, thumbnail, stock, category, code, status })
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ newProduct });

        } catch (error) {
            CustomError.createError({ name: 'Error', cause: error, message: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, code: ERRORS.INTERNAL_SERVER_ERROR })
        }
    }

    static updateProduct = async (req, res) => {
        try {
            let id = req.params.pid
            if (!isValidObjectId(id)) {
                CustomError.createError({ name: 'Error', cause: invalidId(id), message: "El id ingresado no tiene el formato correcto", code: ERRORS.BAD_REQUEST })
            }

            let modificacion = req.body

            let propiedadesValidasProduct = ["title", "description", "price", "thumbnail", "stock", "code", "status"]

            let propiedadesQueQuieroModificar = Object.keys(modificacion)

            let ok = propiedadesQueQuieroModificar.every(prop => propiedadesValidasProduct.includes(prop))

            if (!ok) {
                CustomError.createError({ name: 'Error', cause: generateProductErrorInfo(), message: `Propiedades inválidas`, code: ERRORS.BAD_REQUEST })
            }

            let products = await productsService.getAllProducts();

            if (modificacion.code) {
                if (products.some(p => p.code === modificacion.code && p.id !== id)) {
                    CustomError.createError({ name: 'Error', cause: 'Codigo repetido', message: `Ya existe un producto con código ${modificacion.code}`, code: ERRORS.BAD_REQUEST })
                }
            }

            const indiceProduct = products.findIndex(p => p._id == id);

            if (indiceProduct === -1) {
                CustomError.createError({ name: 'Error', cause: 'Producto no encontrado', message: `No se encontró un producto con id ${id}`, code: ERRORS.BAD_REQUEST })
            }

            let respuesta = await productsService.update(id, modificacion)
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ respuesta });

        } catch (error) {
            CustomError.createError({ name: 'Error', cause: error, message: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, code: ERRORS.INTERNAL_SERVER_ERROR })            
        }
    }

    static deleteProduct = async (req, res) => {
        try {
            let id = req.params.pid
            if (!isValidObjectId(id)) {
                CustomError.createError({ name: 'Error', cause: invalidId(id), message: "El id ingresado no tiene el formato correcto", code: ERRORS.BAD_REQUEST })
            }
            let respuesta = await productsService.delete(id)
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ respuesta });
        } catch (error) {
            CustomError.createError({ name: 'Error', cause: error, message: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, code: ERRORS.INTERNAL_SERVER_ERROR })
        }
    }
}