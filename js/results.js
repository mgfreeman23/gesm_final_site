// access book recs from local storage
const books = JSON.parse(sessionStorage.getItem('books'));
// access the ordered list html item
const bookList = document.getElementById('book-list');
// add elements to it from books -> possible error here when selections lead to no books!
console.log(books.length);

if(books.length == 0){
    bookList.innerHTML += `<p> Preference selection too narrow, try again! </p>`;
}

for(let i = 0; i < books.length; i++){
    bookList.innerHTML += `<li style="margin-bottom: 10px;">${books[i]}</li>`;
}

// there might be an issue her with the redirection/removing from session storage
// maybe make it pass on the data by url instead and extract the parameters
// redirect when user wants to restart
document.getElementById('restartButton').addEventListener('click', function() {
    // Clear stored recommendations from sessionStorage
    sessionStorage.removeItem('books');
    console.log("button click sensed");
    // Redirect the user to the initial page
    // Redirect the user to the initial page after a brief delay (e.g., 500 milliseconds)
    setTimeout(function() {
        window.location.href = 'index.html';
    }, 500);
});

