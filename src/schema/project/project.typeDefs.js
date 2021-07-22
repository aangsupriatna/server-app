const { gql } = require('apollo-server-express');

const projectTypeDefs = gql`
    extend type Query {
        project(id: ID!): Project
        projects: [Project]
    }

    extend type Mutation {
        addProject(input: ProjectInput): Project
        updateProject(input: ProjectInput): Project
        removeProject(id: ID): Project
    }

    input ProjectInput {
        id: ID
        name: String
        scope: String
        location: String
        assignor: String
        address: String
        date: String
        number: String
        amount: String
        joint: Int
        with: String
        bastDate: String
        bast: String
    }
    
    type Project {
        id: ID
        name: String
        scope: String
        location: String
        assignor: String
        address: String
        date: String
        number: String
        amount: String
        joint: Int
        with: String
        bastDate: String
        bast: String
    }
`
module.exports = { projectTypeDefs }