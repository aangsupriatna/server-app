const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../model/user');
const { AuthenticationError } = require('apollo-server-express');

const createTokens = async (user, secret, remember) => {
    const tokenExpire = remember ? '7d' : '2m';
    const createAccessToken = jwt.sign(
        {
            data: {
                id: user.id, isAdmin: user.isAdmin
            }
        },
        secret,
        { expiresIn: tokenExpire }
    );

    const createRefreshToken = jwt.sign(
        {
            data: { id: user.id }
        }
        ,
        secret,
        { expiresIn: '10d' }
    );

    return Promise.all([createAccessToken, createRefreshToken]);
}

const userResolvers = {
    Query: {
        me: async (parent, { id }, req) => {
            return await User.findById(req.user.data.id).exec();
        },
        user: async (parent, { id }, req) => {
            return await User.findById(id).exec();
        },
        users: async (parent, input, req) => {
            return await User.find({}).exec();
        }
    },

    Mutation: {
        login: async (parent, { input }, req) => {
            const { email, password, remember } = input;
            const user = await User.findOne({ email: email }).exec();
            if (!user) throw new AuthenticationError("User doesn't exists");

            if (!bcrypt.compareSync(password, user.password))
                throw new AuthenticationError("Unable to verify credentials");

            const refreshSecret = process.env.JWT_KEY + user.password;
            const [accessToken, refreshToken] = await createTokens(user, refreshSecret, remember);
            return {
                accessToken,
                refreshToken,
                user
            };
        },
        refreshLogin: async (parent, { refreshToken }, req) => {
            let userId = -1
            try {
                const { data: { id } } = await jwt.decode(refreshToken);
                userId = id
            } catch (error) {
                throw Error(error);
            }

            if (!userId) return {}

            const user = await User.findById(userId).exec();
            if (!user) return {}

            const refreshSecret = process.env.JWT_KEY + user.password;
            try {
                jwt.verify(refreshToken, refreshSecret);
            } catch (error) {
                throw Error(error);
            }
            const [newAccessToken, newRefreshToken] = await createTokens(user, process.env.JWT_KEY);
            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                user
            }
        },
        forgetPassword: async (parent, { email, newPassword }, req) => {
            try {
                await User.findOne({ email: email }).then(async (user) => {
                    await User.findByIdAndUpdate(user.id, { password: newPassword });
                });
                return true
            } catch (error) {
                return false
            }
        },
        register: async (parent, { input }, req) => {
            const { username, email, password } = input
            if (!username && !email && !password) throw Error("Credentials required");
            try {
                const user = await new User(input).save();
                const refreshSecret = process.env.JWT_KEY + user.password;
                const [newAccessToken, newRefreshToken] = await createTokens(user, refreshSecret);
                return {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                    user
                }
            } catch (error) {
                throw Error(error)
            }
        },
        updateUser: async (parent, { input }, req) => {
            return await User.findByIdAndUpdate(input.id, input);
        },
        deleteUser: async (parent, { id }, req) => {
            const removedUser = await User.findByIdAndRemove(id)
                .then(data => {
                    return data;
                });
            return removedUser;
        },
    }
}

module.exports = {
    userResolvers
}