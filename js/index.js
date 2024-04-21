// get the value user entered as name and pass on to next
// html file
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('nameForm');

    // clear session storage again for good measure?
    sessionStorage.removeItem('books');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting normally

        // Retrieve the value entered by the user
        const nameInput = document.getElementById('name');
        const name = nameInput.value;
        console.log(name);

        // Redirect to the next page with the name as a URL parameter
        window.location.href = 'user_form.html?name=' + encodeURIComponent(name);
    });
});
