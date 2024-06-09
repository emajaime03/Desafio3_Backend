import {fakerES_MX as faker} from '@faker-js/faker'
import {ERRORS} from '../utils/EErrors.js'
import CustomError from '../utils/CustomError.js'

export default class MockingController {

    static createAndGetAllFakeProducts = async (req, res) => {

        try {
            
            let mockingProducts = []
            for (let i = 0; i < 100; i++) {
                mockingProducts.push({
                    id: faker.database.mongodbObjectId(),
                    code: faker.commerce.isbn(),
                    title: faker.commerce.productName(),
                    description: faker.commerce.productDescription(),
                    price: faker.commerce.price(),
                    stock: Math.floor(Math.random() * 100),
                    thumbnail: faker.image.url()
                })
            }

            res.setHeader('Content-Type', 'application/json')
            res.status(200).json({mockingProducts})
        } catch (error) {
            CustomError.createError({ name: 'Error', cause: error, message: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, code: ERRORS.INTERNAL_SERVER_ERROR })            
        }

    }
}