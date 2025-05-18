$(document).ready(() => {
    if (localStorage.getItem('userId')) {
        showDashboard(localStorage.getItem('userId'));
    }

    $('#loginForm').submit(event => {
        event.preventDefault();
        const email = $('#email').val();
        const password = $('#password').val();

        $.post('http://localhost:3000/api/login', { email, password }, data => {
            if (data.success) {
                localStorage.setItem('userId', data.userId);
                showDashboard(data.userId);
            } else {
                alert('Invalid credentials!');
            }
        });
    });

    $('#logout').click(() => {
        localStorage.removeItem('userId');
        location.reload();
    });

    function showDashboard(userId) {
        $('#loginForm').hide();
        $('#dashboard').show();

        $.get(`http://localhost:3000/api/user/${userId}`, data => {
            $('#userInfo').text(`Logged in as: ${data.email}`);
        });
    }
});