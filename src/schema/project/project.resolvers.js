const Project = require("../../model/project");

const projectResolvers = {
    Query: {
        project: async (parent, { id }, req) => {
            const result = await Project.findById(id);
            return result
        },
        projects: async (parent, { input }, req) => {
            return await Project.find({});
        }
    },
    Mutation: {
        addProject: async (parent, { input }, req) => {
            return await new Project(input).save();
        },
        updateProject: async (parent, { input }, req) => {
            return await Project.findByIdAndUpdate(input.id, input);
        },
        removeProject: async (parent, { id }, req) => {
            const removedProject = await Project.findByIdAndRemove(id).then(data => {
                return data;
            });
            return removedProject;
        },
    }
}

module.exports = {
    projectResolvers
}