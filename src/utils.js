import {fileURLToPath} from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { config } from './config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const creaHash=password=>bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validaPassword = (usuario, password) => bcrypt.compareSync(password, usuario.password);

const transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        port: 587,
        auth: {
            user: config.general.EMAIL,
            pass: config.general.EMAIL_PASS
        }
    }
);

export const sendMail = async (to, subject, message) => {
    return await transporter.sendMail({
            from: config.general.EMAIL,
            to, subject,
            html: message
        });
};