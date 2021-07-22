const { gql } = require('apollo-server-express');

const uploadTypeDefs = gql`
    scalar Upload

    extend type Mutation {
        singleUpload(file: Upload!): File!
        multiUpload(files: [Upload!]!): [File!]!
    }

    extend type Query {
        uploads: [File!]!
    }

    type File {
        id: ID!
        filename: String!
        path: String!
        mimetype: String!
        encoding: String!
    }
`;

module.exports = { uploadTypeDefs }