const { gql } = require('apollo-server-express');

const userTypeDefs = gql`
    type Query {
        me: User
        user(id: ID!): User
        users: [User]
    }

    type Mutation {
        login(input: UserLogin): Token
        refreshLogin(refreshToken: String): Token
        forgetPassword(email: String, newPassword: String): Boolean!
        register(input: UserInput): Token
        updateUser(input: UserInput): User
        deleteUser(id: ID): User
    }

    type User {
        id: ID!
        username: String!
        email: String!
        password: String!
        isAdmin: Boolean
    }

    input UserInput {
        id: ID
        username: String
        email: String
        password: String
        isAdmin: Boolean
    }

    type Token {
        accessToken: String
        refreshToken: String
        user: User
    }

    input UserLogin {
        email: String!
        password: String!
        remember: Boolean
    }
`

module.exports = {
    userTypeDefs
}