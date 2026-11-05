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

    if (!user || typeof user.first_name !== "string" || !user.first_name.trim() ||
        typeof user.last_name !== "string" || !user.last_name.trim() ||
        typeof user.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email) ||
        typeof user.password !== "string" || user.password.length < 6 ||
        Buffer.byteLength(user.password) > 72) {
        throw new Error("Valid names, email, and a password of at least 6 characters (at most 72 bytes) are required");
    }

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

    if (typeof email !== "string" || typeof password !== "string" || !password) {
        throw new Error("invalid email or password");
    }

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