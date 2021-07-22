const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Upload = Schema({
    filename: {
        type: String, required: true,
    },
    path: {
        type: String, required: true,
    },
    mimetype: {
        type: String, required: true,
    },
    encoding: {
        type: String, required: true,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("Upload", Upload);