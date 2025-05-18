document.addEventListener("DOMContentLoaded", () => {
    const feedbackForm = document.getElementById("feedbackForm");
    const messageBox = document.getElementById("message");
    const feedbackList = document.getElementById("feedbackList");

    function loadFeedback() {
        fetch("http://localhost:5000/api/feedback")
            .then(response => response.json())
            .then(feedback => {
                feedbackList.innerHTML = "";
                feedback.forEach(entry => {
                    let row = `
                        <tr>
                            <td>${entry.name}</td>
                            <td>${entry.email}</td>
                            <td>${entry.message}</td>
                        </tr>
                    `;
                    feedbackList.innerHTML += row;
                });
            })
            .catch(error => console.error("Error fetching feedback:", error));
    }

    loadFeedback();

    feedbackForm.addEventListener("submit", (e) => {
        e.preventDefault();

        let feedback = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            message: document.getElementById("messageText").value
        };

        fetch("http://localhost:5000/api/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(feedback)
        })
        .then(response => response.json())
        .then(data => {
            messageBox.classList.remove("d-none", "alert-danger");
            messageBox.classList.add("alert-success");
            messageBox.textContent = "Feedback submitted successfully!";
            
            feedbackForm.reset();
            loadFeedback();
        })
        .catch(error => {
            messageBox.classList.remove("d-none", "alert-success");
            messageBox.classList.add("alert-danger");
            messageBox.textContent = "Error submitting feedback.";
            console.error("Error:", error);
        });
    });
});
