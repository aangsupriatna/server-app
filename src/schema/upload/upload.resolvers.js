const { createWriteStream } = require('fs');
const { GraphQLUpload } = require('graphql-upload');
const mkdirp = require('mkdirp');
const Upload = require('../../model/upload');

const dateNow = new Date();
const dateName = dateNow.getFullYear() + "-" + dateNow.getMonth() + "-" + dateNow.getDate();
const uploadDir = `./uploads/${dateName}`
const checkDir = mkdirp.sync(uploadDir);

const storeUpload = ({ stream, filename }) => {
    const path = `${uploadDir}/${filename}`

    return new Promise((resolve, reject) =>
        stream
            .pipe(createWriteStream(path))
            .on("finish", () => resolve(path))
            .on("error", reject)
    );
}

const processUpload = async (file) => {
    const { createReadStream, filename, mimetype, encoding } = await file;
    const stream = createReadStream()
    const path = await storeUpload({ stream, filename });
    try {
        const upload = await new Upload({ filename, path, mimetype, encoding }).save();
        return upload
    } catch (error) {
        throw new Error("Upload file error.")
    }
}

const uploadResolvers = {
    Upload: GraphQLUpload,
    Query: {
        uploads: async () => {
            return await Upload.find({});
        }
    },
    Mutation: {
        singleUpload: async (parent, { file }) => await processUpload(file),
        multiUpload: (parent, { files }) => {
            return Promise.all(files.map(processUpload));
        },
    }
}

module.exports = {
    uploadResolvers
}