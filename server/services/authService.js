import {
    findUserByEmail,
    createUser
} from "../models/userModel.js";

import {
    hashPassword,
    comparePassword
} from "../utils/hashPassword.js";

import { generateToken } from "../utils/generateToken.js";

// register new user
export async function register(user) {

    const existingUser = await findUserByEmail(user.email);

    if (existingUser) {
        throw new Error("email already exists");
    }

    const passwordHash = await hashPassword(user.password);

    await createUser({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password_hash: passwordHash,
        phone: user.phone,
        birth_date: user.birth_date,
        gender: user.gender
    });
}

// login existing user
export async function login(email, password) {

    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error("invalid email or password");
    }

    const isMatch = await comparePassword(
        password,
        user.password_hash
    );

    if (!isMatch) {
        throw new Error("invalid email or password");
    }

    const token = generateToken(user);

    return {
        token,
        user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
        }
    };
}