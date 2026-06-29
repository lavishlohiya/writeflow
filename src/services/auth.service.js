const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/user.repository");

async function registerUser(username, email, password) {

    const existingUser = await userRepository.getUserByEmail(email);

    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    return userRepository.createUser(username, email, hashPassword);

};

async function loginUser(email, password) {

    const existingUser = await userRepository.getUserByEmail(email);

    if (!existingUser) {
        throw new Error("User does not exists");
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign({
        id: existingUser.id,
        role: existingUser.role
    }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return token;

};

async function getCurrentUser(userId) {
    const user = await userRepository.getUserById(userId);

    if (!user) {
        throw new Error("User does not exists");
    }

    delete user.password;

    return user;
}

module.exports = { registerUser, loginUser, getCurrentUser };
