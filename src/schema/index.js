const { makeExecutableSchema } = require('graphql-tools');
const { merge } = require('lodash');

// Typedefs
const { userTypeDefs } = require('./user/user.typeDefs');
const { projectTypeDefs } = require('./project/project.typeDefs');
const { uploadTypeDefs } = require('./upload/upload.typeDefs');

// Resolvers
const { userResolvers } = require('./user/user.resolvers');
const { projectResolvers } = require('./project/project.resolvers');
const { uploadResolvers } = require('./upload/upload.resolvers');

const schema = makeExecutableSchema({
    typeDefs: [
        userTypeDefs,
        projectTypeDefs,
        uploadTypeDefs,
    ],
    resolvers: merge(
        userResolvers,
        projectResolvers,
        uploadResolvers,
    )

})

module.exports = {
    schema
}