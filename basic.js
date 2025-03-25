const BasicStrategy = require('passport-http').BasicStrategy;
const users = require('../models/users');
const bcrypt = require('bcrypt');

const verifyPassword = async function (user, password) {
    return await bcrypt.compare(password, user.password); // Compare hashed password
};

const checkUserAndPass = async (username, password, done) => {
    try {
        console.log(`Checking username: ${username}`); // Log the username
        const result = await users.findByUsername(username);
        console.log('User fetched from database:', result); // Debug user result

        if (!result) {
            console.log(`No user found with username ${username}`);
            return done(null, false); // No user found
        }

        const user = result;
        const isPasswordValid = await verifyPassword(user, password); // Compare passwords
        console.log('Password from request:', password); // Log the entered password
        console.log('Password from database:', user.password); // Log the hashed password
        console.log('Password comparison result:', isPasswordValid); // Log the comparison result

        if (isPasswordValid) {
            console.log(`Successfully authenticated user ${username}`);
            return done(null, user);
        } else {
            console.log(`Password incorrect for user ${username}`);
            return done(null, false); // Invalid password
        }
    } catch (error) {
        console.error(`Error during authentication for user ${username}`, error);
        return done(error);
    }
};

const strategy = new BasicStrategy(checkUserAndPass); // Define the strategy
module.exports = strategy;

