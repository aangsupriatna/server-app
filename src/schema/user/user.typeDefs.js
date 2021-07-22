const { gql } = require('apollo-server-express');

const userTypeDefs = gql`
    type Query {
        me: User
        user(id: ID!): User
        users: [User]
    }

    type Mutation {
        signin(input: UserLogin): Token
        refreshLogin(refreshToken: String): Token
        addUser(input: UserInput): Token
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
        expire: Boolean
    }
`

module.exports = {
    userTypeDefs
}