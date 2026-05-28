const resumeModel = require('../Models/resume');
const pdfParse = require('pdf-parse/lib/pdf-parse');
const Groq = require('groq-sdk');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.uploadResume = async (req, res) => {
    try {
        const { userId, jobDescription } = req.body;

        if (!userId || userId === "undefined") {
            return res.status(400).json({ error: "userId is required" });
        }
        if (!req.file) {
            return res.status(400).json({ error: "Resume file is required" });
        }
        if (!jobDescription) {
            return res.status(400).json({ error: "Job description is required" });
        }

        const resumeName = req.file.originalname;

        // step 1 — parse PDF directly from buffer
        const pdfData = req.file.buffer;
        const parsedData = await pdfParse(pdfData);
        console.log("PDF Parsed Successfully");

        // step 2 — upload to cloudinary
        const cloudinaryUrl = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'resumes', resource_type: 'raw', format: 'pdf' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result.secure_url);
                }
            );
            stream.end(req.file.buffer);
        });
        console.log("Uploaded to Cloudinary:", cloudinaryUrl);

        // step 3 — build the prompt
        const resumeText = parsedData.text.slice(0, 4000); // ✅ limit to avoid token limits
        const prompt = `
            You are an expert resume screener and career coach.
            Your job is to compare the given resume with the job description and evaluate how well the candidate matches the role.

            Resume:
            ${resumeText}

            Job Description:
            ${jobDescription}

            Evaluate the resume and respond ONLY in the following JSON format, nothing else, no extra text, no markdown:
            { 
                "score": <number between 0 and 100>,
                "matchedSkills": [<list of skills from resume that match the job>],
                "missingSkills": [<list of important skills from job description missing in resume>],
                "feedback": "<3-4 sentences on how to improve the resume to better match this job>"
            }

            Scoring rules:
            - 80-100 : Strong match, most required skills present
            - 60-79  : Moderate match, some key skills missing
            - 40-59  : Weak match, many important skills missing
            - 0-39   : Poor match, resume not suited for this role
        `;

        // step 4 — call groq
        const response = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.5,
        });

        // step 5 — extract and parse result
        let result = response.choices[0].message.content;
        console.log("Raw AI Response:", result);

        const cleanResult = result.replace(/```json|```/g, '').trim();
        const parsedResult = JSON.parse(cleanResult);
        console.log("Score:", parsedResult.score);
        console.log("Feedback:", parsedResult.feedback);

        // step 6 — save to database
        const newResume = new resumeModel({
            userId,
            jobDescription,
            resumeName,
            resumePath: cloudinaryUrl,
            score: parsedResult.score,
            feedback: parsedResult.feedback,
            matchedSkills: parsedResult.matchedSkills,
            missingSkills: parsedResult.missingSkills,
        });

        await newResume.save();

        // step 7 — send response
        res.status(200).json({
            message: "Resume uploaded successfully",
            resume: newResume,
            analysis: parsedResult,
        });

    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Server Error", message: err.message });
    }
}

exports.getallResumeforUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        const resumes = await resumeModel
            .find({ userId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Resumes fetched successfully",
            resumes
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ error: "Server Error", message: err.message });
    }
}

exports.getallResumeforAdmin = async (req, res) => {
    try {
        const resumes = await resumeModel
            .find({})
            .sort({ createdAt: -1 })
            .populate('userId');

        return res.status(200).json({
            message: "Resumes fetched successfully",
            resumes
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ error: "Server Error", message: err.message });
    }
}