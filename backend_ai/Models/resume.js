const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    resumeName: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    score: {
        type: String,
    },
    feedback: {
        type: String,
    },
    matchedSkills: {
        type: [String],
    },
    missingSkills: {
        type: [String],
    }
}, { timestamps: true })

const ResumeModel = mongoose.model("resumes", ResumeSchema);

module.exports = ResumeModel;