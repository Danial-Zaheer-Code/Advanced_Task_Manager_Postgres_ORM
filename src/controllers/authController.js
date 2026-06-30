import dotenv from "dotenv"
dotenv.config();

import jwt from "jsonwebtoken"
import * as userServices from "../services/userServices.js"
import { hash, compare } from '../utils/utils.js';

export async function register(req, res) {
    try {
        const user = req.body;

        if (await userServices.getUser(user.email) != null) {
            return res.status(409).json({
                message: 'User already exists.'
            })
        }

        if(await userServices.isPhoneNumberExist(user.phone)){
            return res.status(409).json({
                message: "Phone Number already exists"
            });
        }


        user.password = await hash(user.password);
        const result = await userServices.addUser(user)

        return res.status(201).json({
            message: 'User created successfully'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong. Try again later.'
        })
    }
}

export async function login(req, res) {
    const user = req.body;

    try {
        const existingUser = await userServices.getUser(user.email);
        if (!existingUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const isMatch = await compare(user.password, existingUser.password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Wrong Password'
            });
        }
        
        const token = jwt.sign(
            {
                userId: existingUser.id,
            },
            process.env.SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: 'Login Successful',
            success: true,
            user: {
                name: existingUser.name,
                token: token
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something wnet wrong. Try again later.',
            success: false
        });
    }
}