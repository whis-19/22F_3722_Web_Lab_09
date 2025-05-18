document.addEventListener("DOMContentLoaded", () => {
    
    const emailInput = document.getElementById("email");
    const emailMessage = document.getElementById("emailMessage");
    const registrationForm = document.getElementById("registrationForm");
    const messageBox = document.getElementById("message");

    emailInput.addEventListener("blur", async () => {
        const email = emailInput.value.trim();
        if (email) {
            try {
                const response = await fetch(`http://localhost:5000/api/students/check-email/${email}`);
                const data = await response.json();
                emailMessage.textContent = data.available ? "" : "Email already in use";
            } catch (error) {
                console.error("Error checking email:", error);
            }
        }
    });

    registrationForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const student = {
            name: document.getElementById("name").value,
            email: emailInput.value,
            password: document.getElementById("password").value,
            department: document.getElementById("department").value
        };

        try {
            const response = await fetch("http://localhost:5000/api/students/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(student)
            });

            const result = await response.json();
            messageBox.classList.remove("d-none", "alert-danger");
            messageBox.classList.add("alert-success");
            messageBox.textContent = result.message;

        } catch (error) {
            messageBox.classList.remove("d-none", "alert-success");
            messageBox.classList.add("alert-danger");
            messageBox.textContent = "Error occurred while registering.";
            console.error("Registration Error:", error);
        }
    });

});
