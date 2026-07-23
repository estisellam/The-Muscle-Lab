import {
    register,
    login
} from "../services/authService.js";

// register user
export async function registerUser(req, res) {

    try {

        await register(req.body);

        res.status(201).json({
            message: "user registered successfully"
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

}

// login user
export async function loginUser(req, res) {

    try {

        const { email, password } = req.body;

        const result = await login(email, password);

        res.status(200).json(result);

    } catch (error) {

        res.status(401).json({
            message: error.message
        });

    }

}