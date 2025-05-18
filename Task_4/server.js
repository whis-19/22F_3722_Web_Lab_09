const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "lab_9"
});

// Function to seed database
function seedDatabase() {
    db.query("SELECT COUNT(*) AS count FROM jobs", (err, results) => {
        if (results[0].count === 0) {
            console.log("Seeding database with Pakistani names...");

            // Insert sample jobs
            db.query(`
                INSERT INTO jobs (title, description) VALUES
                ('Software Engineer', 'Develop and maintain web applications.'),
                ('Data Analyst', 'Analyze and interpret complex data.'),
                ('Project Manager', 'Manage project timelines and resources.'),
                ('UX Designer', 'Design user-friendly web interfaces.'),
                ('Cybersecurity Analyst', 'Ensure data security and mitigate threats.');
            `);

            // Insert sample applicants with Pakistani names
            db.query(`
                INSERT INTO applicants (job_id, name, email, resume) VALUES
                (1, 'Ahmed Khan', 'ahmed.khan@example.com', 'https://drive.google.com/ahmed-resume'),
                (1, 'Ayesha Siddiqui', 'ayesha.siddiqui@example.com', 'https://drive.google.com/ayesha-resume'),
                (2, 'Bilal Chaudhry', 'bilal.chaudhry@example.com', 'https://drive.google.com/bilal-resume'),
                (3, 'Fatima Sheikh', 'fatima.sheikh@example.com', 'https://drive.google.com/fatima-resume'),
                (4, 'Hassan Raza', 'hassan.raza@example.com', 'https://drive.google.com/hassan-resume');
            `);
        } else {
            console.log("Database already seeded.");
        }
    });
}

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL");
    seedDatabase();
});

app.get("/api/jobs", (req, res) => {
    db.query("SELECT * FROM jobs", (err, results) => res.json(results));
});

app.post("/api/apply", (req, res) => {
    const { jobId, name, email, resume } = req.body;
    db.query("INSERT INTO applicants (job_id, name, email, resume) VALUES (?, ?, ?, ?)",
        [jobId, name, email, resume],
        (err) => res.json({ message: err ? "Error" : "Application submitted" })
    );
});

app.get("/api/applicants/:jobId", (req, res) => {
    db.query("SELECT * FROM applicants WHERE job_id = ?", [req.params.jobId],
        (err, results) => res.json(results)
    );
});

app.listen(5000, () => console.log("Server running on port 5000"));
