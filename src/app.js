const express = require('express');
const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const { schema } = require('./schema');
const { graphqlUploadExpress } = require('graphql-upload');
const db = require('./utils/db');

const startApolloServer = async () => {
    const server = new ApolloServer({
        schema,
        context: ({ req, res }) => {
            const { authorization } = req.headers
            let user = {}
            if (!authorization) {
                user.isAuth = false;
                user = {};
                return
            }
            try {
                const token = authorization.split(' ')[1]
                user = jwt.verify(token, process.env.JWT_KEY);
                user.isAuth = true
            } catch (error) {
                user.isAuth = false;
                user = {};
                throw new AuthenticationError("Auth error")
            }
            if (!user) {
                user.isAuth = false;
                user = {};
                throw new AuthenticationError("Auth error")
            }
            return { user }
        }
    });

    await server.start();
    const app = express();
    app.use('*', express.static('public'), graphqlUploadExpress());

    server.applyMiddleware({
        app,
        path: '/',
        cors: true,
        playground: process.env.NODE_ENV === 'development' ? true : false,
        introspection: true,
        tracing: true,
        onHealthCheck: () =>
            new Promise((resolve, reject) => {
                if (db.connection.readyState > 0) {
                    resolve();
                } else {
                    reject();
                }
            }),
    });
    await new Promise(resolve => {
        app.listen({ port: process.env.PORT }, () => {
            console.log(`🚀 Server ready at http://localhost:${process.env.PORT}`);
            console.log(`😷 Health checks available at http://localhost:${process.env.PORT}/.well-known/apollo/server-health`);
        });
        resolve(app);
    });

    return { server, app };
}

module.exports = {
    startApolloServer
}