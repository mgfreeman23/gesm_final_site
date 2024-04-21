// check if button was clicked to return back to the home page
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('homeForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting normally

        // Redirect back to the home page
        window.location.href = 'index.html';
    });
});