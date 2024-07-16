import { isValidObjectId } from "mongoose"
import { usersService } from "../services/users.service.js"
import { ERRORS } from "../utils/EErrors.js"
import CustomError from "../utils/CustomError.js"
import UserDTO from "../dao/dto/UserDTO.js"

export default class UsersController {

    static getAllUsers = async (req, res) => {

        try {
            const users = await usersService.getAllUsers();
            users = users.map(user => UserDTO.create(user))
            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json(users)
        } catch (error) {
            CustomError.createError({ name: 'Error', cause: error, message: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, code: ERRORS.INTERNAL_SERVER_ERROR })
        }

    }

    static getUserById = async (req, res) => {

        try {
            let id = req.params.uid
            if (!isValidObjectId(id)) {
                CustomError.createError({ name: 'Error', cause: invalidId(id), message: "El id ingresado no tiene el formato correcto", code: ERRORS.BAD_REQUEST })
            }

            let user = await usersService.getUserById(id)
            if (!user) {
                CustomError.createError({ name: 'Error', cause: invalidId(id), message: "El usuario no existe", code: ERRORS.BAD_REQUEST })
            }
            user = new UserDTO(user)
            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json({ user })
        } catch (error) {
            CustomError.createError({ name: 'Error', cause: error, message: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, code: ERRORS.INTERNAL_SERVER_ERROR })
        }
    }

    static changeRole = async (req, res) => {
        try {
            let id = req.params.uid
            if (!isValidObjectId(id)) {
                CustomError.createError({ name: 'Error', cause: invalidId(id), message: "El id ingresado no tiene el formato correcto", code: ERRORS.BAD_REQUEST })
            }

            let user = await usersService.getUserById(id)

            if (!user) {
                CustomError.createError({ name: 'Error', cause: invalidId(id), message: "El usuario no existe", code: ERRORS.BAD_REQUEST })
            }

            if (user.role === 'premium') {
                user.role = 'user'
            } else if (user.role === 'user') {
                user.role = 'premium'
            }
            
            let newUser = await usersService.update(id, user)
            newUser.role = user.role
            newUser = new UserDTO(newUser)
            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json({ user })
        } catch (error) {
            CustomError.createError({ name: 'Error', cause: error, message: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, code: ERRORS.INTERNAL_SERVER_ERROR })
        }
    }

    static uploadDocuments = async (req, res) => {
        try {
            const { uid } = req.params;
            const user = await usersService.getUserById(uid);
            if (!user) {
                CustomError.createError({ name: 'Error', cause: invalidId(uid), message: "El usuario no existe", code: ERRORS.BAD_REQUEST })
            }

            const files = req.files.map(file => ({
                name: file.originalname,
                reference: file.path
            }));

            user.documents = files;
    
            const response = await usersService.update(user._id, user);
            return res.status(200).json({ response:response ,success: true, message: "Documentos subidos con éxito" });
        } catch (error) {
            CustomError.createError({ name: 'Error', cause: error, message: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, code: ERRORS.INTERNAL_SERVER_ERROR })
        }
    }

    static deleteUserById = async (req, res) => {
        try {
            let id = req.params.uid
            if (!isValidObjectId(id)) {
                CustomError.createError({ name: 'Error', cause: invalidId(id), message: "El id ingresado no tiene el formato correcto", code: ERRORS.BAD_REQUEST })
            }

            let user = await usersService.getUserById(id)
            if (!user) {
                CustomError.createError({ name: 'Error', cause: invalidId(id), message: "El usuario no existe", code: ERRORS.BAD_REQUEST })
            }

            let deletedUser = await usersService.delete(id)
            deletedUser = new UserDTO(deletedUser)
            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json({ deletedUser })
        } catch (error) {
            CustomError.createError({ name: 'Error', cause: error, message: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`, code: ERRORS.INTERNAL_SERVER_ERROR })
        }
    }
}