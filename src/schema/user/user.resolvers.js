const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../model/user');

const createTokens = async (user, secret, remember) => {
    const tokenExpire = remember ? '7d' : '20m';

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
            console.log(input)
            const user = await User.findOne({ email: email }).exec();
            if (!user) throw Error("User doesn't exists");

            if (!bcrypt.compareSync(password, user.password))
                throw Error("Unable to verify credentials");

            const [accessToken, refreshToken] = await createTokens(user, process.env.JWT_KEY, remember);
            return {
                accessToken,
                refreshToken,
                user
            };
        },
        refreshLogin: async (parent, { refreshToken }, req) => {
            let userId = -1
            try {
                const { data: { id } } = await jwt.verify(refreshToken, process.env.JWT_KEY);
                userId = id
            } catch (error) {
                throw Error(error);
            }
            const user = await User.findById(userId).exec();
            const [newAccessToken, newRefreshToken] = await createTokens(user, process.env.JWT_KEY);
            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                user
            }
        },
        register: async (parent, { input }, req) => {
            const { username, email, password } = input
            if (!username && !email && !password) throw Error("Credentials required");
            try {
                const user = await new User(input).save();
                const [newAccessToken, newRefreshToken] = await createTokens(user, process.env.JWT_KEY);
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