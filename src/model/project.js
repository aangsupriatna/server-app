const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Project = Schema({
    name: {
        type: String, unique: true, required: true, dropDups: true
    },
    scope: String,
    location: String,
    assignor: String,
    address: String,
    date: String,
    number: String,
    amount: String,
    joint: Number,
    with: String,
    bastDate: String,
    bast: String,
}, {
    timestamps: true
});

module.exports = mongoose.model("Project", Project);