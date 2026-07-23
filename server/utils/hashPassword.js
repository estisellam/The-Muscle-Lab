import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// hash password
export async function hashPassword(password) {

    return await bcrypt.hash(password, SALT_ROUNDS);
}

// compare password
export async function comparePassword(password, passwordHash) {

    return await bcrypt.compare(password, passwordHash);
}