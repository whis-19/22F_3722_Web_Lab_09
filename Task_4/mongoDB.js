const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Replace with your MongoDB URI
const mongoURI = "mongodb://localhost:27017/lab_9";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
        seedDatabase();
    })
    .catch(err => console.error("MongoDB connection error:", err));

// Schemas
const jobSchema = new mongoose.Schema({
    title: String,
    description: String
});

const applicantSchema = new mongoose.Schema({
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    name: String,
    email: String,
    resume: String
});

const Job = mongoose.model("Job", jobSchema);
const Applicant = mongoose.model("Applicant", applicantSchema);

// Function to seed database
async function seedDatabase() {
    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
        console.log("Seeding database with Pakistani names...");

        const jobs = await Job.insertMany([
            { title: "Software Engineer", description: "Develop and maintain web applications." },
            { title: "Data Analyst", description: "Analyze and interpret complex data." },
            { title: "Project Manager", description: "Manage project timelines and resources." },
            { title: "UX Designer", description: "Design user-friendly web interfaces." },
            { title: "Cybersecurity Analyst", description: "Ensure data security and mitigate threats." }
        ]);

        await Applicant.insertMany([
            { job_id: jobs[0]._id, name: "Ahmed Khan", email: "ahmed.khan@example.com", resume: "https://drive.google.com/ahmed-resume" },
            { job_id: jobs[0]._id, name: "Ayesha Siddiqui", email: "ayesha.siddiqui@example.com", resume: "https://drive.google.com/ayesha-resume" },
            { job_id: jobs[1]._id, name: "Bilal Chaudhry", email: "bilal.chaudhry@example.com", resume: "https://drive.google.com/bilal-resume" },
            { job_id: jobs[2]._id, name: "Fatima Sheikh", email: "fatima.sheikh@example.com", resume: "https://drive.google.com/fatima-resume" },
            { job_id: jobs[3]._id, name: "Hassan Raza", email: "hassan.raza@example.com", resume: "https://drive.google.com/hassan-resume" }
        ]);
    } else {
        console.log("Database already seeded.");
    }
}

// Routes
app.get("/api/jobs", async (req, res) => {
    const jobs = await Job.find();
    res.json(jobs);
});

app.post("/api/apply", async (req, res) => {
    const { jobId, name, email, resume } = req.body;
    try {
        await Applicant.create({ job_id: jobId, name, email, resume });
        res.json({ message: "Application submitted" });
    } catch (err) {
        res.json({ message: "Error" });
    }
});

app.get("/api/applicants/:jobId", async (req, res) => {
    const applicants = await Applicant.find({ job_id: req.params.jobId });
    res.json(applicants);
});

app.listen(5000, () => console.log("Server running on port 5000"));
