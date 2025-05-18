document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:5000/api/jobs")
        .then(response => response.json())
        .then(jobs => {
            let jobSelect = document.getElementById("jobSelect");
            jobs.forEach(job => {
                let option = document.createElement("option");
                option.value = job.id;
                option.textContent = job.title;
                jobSelect.appendChild(option);
            });

            jobSelect.addEventListener("change", () => {
                let jobId = jobSelect.value;
                fetchApplicants(jobId);
            });
        });

    function fetchApplicants(jobId) {
        fetch(`http://localhost:5000/api/applicants/${jobId}`)
            .then(response => response.json())
            .then(applicants => {
                let tableBody = document.getElementById("applicantTable");
                tableBody.innerHTML = "";
                applicants.forEach(applicant => {
                    let row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${applicant.name}</td>
                        <td>${applicant.email}</td>
                        <td><a href="${applicant.resume}" target="_blank">View Resume</a></td>
                    `;
                    tableBody.appendChild(row);
                });
            });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:5000/api/jobs")
        .then(response => response.json())
        .then(jobs => {
            let jobContainer = document.getElementById("jobContainer");
            jobs.forEach(job => {
                let jobCard = document.createElement("div");
                jobCard.classList.add("col-md-4");
                jobCard.innerHTML = `
                    <div class="card p-3 mb-3">
                        <h5>${job.title}</h5>
                        <p>${job.description}</p>
                        <button class="btn btn-primary apply-btn" data-id="${job.id}">Apply Now</button>
                    </div>
                `;
                jobContainer.appendChild(jobCard);
            });

            document.querySelectorAll(".apply-btn").forEach(button => {
                button.addEventListener("click", (e) => {
                    let jobId = e.target.getAttribute("data-id");
                    document.getElementById("jobId").value = jobId;
                    new bootstrap.Modal(document.getElementById("applyModal")).show();
                });
            });
        });

    document.getElementById("applicationForm").addEventListener("submit", (e) => {
        e.preventDefault();
        let application = {
            jobId: document.getElementById("jobId").value,
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            resume: document.getElementById("resume").value
        };

        fetch("http://localhost:5000/api/apply", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(application)
        }).then(response => response.json())
        .then(data => alert(data.message))
        .catch(error => console.error("Error:", error));
    });
});
