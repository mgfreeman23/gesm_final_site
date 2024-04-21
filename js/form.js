// form for user input
const userForm = document.getElementById("userForm");
// get user's entered name from url
const params = new URLSearchParams(window.location.search);
const user = params.get('name');
// Customize the header based on the name parameter
const header = document.getElementById('welcome-header');
header.innerHTML = `Hi ${user}!`;

// process user input info
userForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Retrieve the values entered by the user

    // Extract what user doesn't want to see from checkboxes 
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="s"]');
    const unselectedFeatures = [];
    checkboxes.forEach(function(checkbox) {
        if (!checkbox.checked) {
            unselectedFeatures.push(checkbox.id);
        }
    });

    console.log(unselectedFeatures);
    // Retrieve the value selected by the user for dystopian sci-fi
    const dystopianNo = document.getElementById('dys-n').checked;
    // Retrieve the value selected by the user for apocalypse sci-fi
    const apocNo = document.getElementById('apoc-n').checked;
    // Retrieve the value selected by the user for cyberpunk sci-fi
    const cybNo = document.getElementById('cyb-n').checked;
    // Retrieve the value selected by the user for alt-history sci-fi
    const altHistNo = document.getElementById('alt-h-n').checked;
    // Retrieve the value selected by the user for alt-universe sci-fi
    const altUniNo = document.getElementById('alt-u-n').checked;
    
    // Retrieve the value selected by the user for rating count preference
    const moreRatings = document.getElementById('more_ratings').checked;
    const lessRatings = document.getElementById('less_ratings').checked;
    let ratingCountPref;
    if (moreRatings) {
        ratingCountPref = 'Many';
    } else if (lessRatings) {
        ratingCountPref = 'Few';
    } else {
        // If neither option is selected
        ratingCountPref = 'idc';
    }
    console.log(ratingCountPref);

    // Retrieve the value selected by the user for rating score preference
    const highRating = document.getElementById('higher_score').checked;
    const lowRating = document.getElementById('lower_score').checked;
    let ratingPref;
    if (highRating) {
        ratingPref = 'High';
    } else if (lowRating) {
         ratingPref = 'Low';
    } else {
        // If neither option is selected
        ratingPref = 'idc';
    }
    console.log(ratingPref);

     // Retrieve the value selected by the user for publication recency
     const moreRecent = document.getElementById('more_recent').checked;
     const lessRecent = document.getElementById('less_recent').checked;
     let recentPref;
     if (moreRecent) {
         recentPref = 'More';
     } else if (lessRecent) {
          recentPref = 'Less';
     } else {
         // If neither option is selected
         recentPref = 'idc';
     }
     console.log(recentPref);


    // Fetch the CSV file
    fetch('data/feminism_df.csv')
        .then(response => response.text())
        .then(csvData => {
        // Parse CSV data into an array of objects
        const feminist_data = parseCSV(csvData);

        // Filter data based on user's preference for dystopian sci-fi
        // do the filtering here!! then pass title/author to next href
        let userData = feminist_data;

        // first filter based on rating, rating count, and publication preferences
        // filter based on rating scores user wants
        let avgRating = getRatingAvg(userData);
        console.log(avgRating);
        if(ratingCountPref == 'High'){
            userData = userData.filter(item => parseInt(item.Rating_score) >= parseFloat(avgRating));
        } else if(ratingCountPref == 'Low'){
            userData = userData.filter(item => parseInt(item.Rating_score) <= parseFloat(avgRating));
        } 


        // filter based on how many ratings the user wants
        let avgRatingCount = getRatingCountAvg(userData);
        console.log(avgRatingCount);
        if(ratingCountPref == 'Many'){
            userData = userData.filter(item => parseInt(item.Rating_votes) >= parseFloat(avgRatingCount));
        } else if(ratingCountPref == 'Few'){
            userData = userData.filter(item => parseInt(item.Rating_votes) <= parseFloat(avgRatingCount));
        } 
        console.log(userData);

        console.log(userData);
        // filter data based on publication recency
        let avgYear = getYearAvg(userData);
        console.log(avgYear);
        if(recentPref == 'More'){
            userData = userData.filter(item => parseInt(item.Year_published) >= parseFloat(avgYear));
        } else if(recentPref == 'Less'){
            userData = userData.filter(item => parseInt(item.Year_published) <= parseFloat(avgYear));
        } 

        // filter data based on quality checkboxes
        for(let i = 0; i < unselectedFeatures.length; i++){
            userData = userData.filter(item => item.Sf_class !== unselectedFeatures[i]);
        }
        console.log(userData);

        // filter out dystopias if user doesn't prefer that 
        if (dystopianNo) {
           userData = userData.filter(item => item.Sf_class !== 'dystopia');
        } 
        console.log(userData);
        // filter out if apocalypse not preferred
        if(apocNo){
            userData = userData.filter(item => item.Sf_class !== 'apocalyptic');
        }
        console.log(userData);
        // filter out cyperpunk if not preferred 
        if(cybNo){
            userData = userData.filter(item => item.Sf_class !== 'cyperpunk');
        } 
        console.log(userData);
        // filter out alt histories if not preferred
        if(altHistNo){
            userData = userData.filter(item => item.Sf_class !== 'alternate_history');
        }
        console.log(userData);
        // filter out alt universes if not preferred
        if(altUniNo){
            userData = userData.filter(item => item.Sf_class !== 'alternate_universe');
        }
        console.log(userData);


        // log finally filtered data to the console
        console.log("Final selection options: " + userData);


        let numRecs;
        if(userData.length > 10){
            numRecs = 5;
        } else if (userData.length >= 3){
            numRecs = 3;
        } else {
            numRecs = userData.length;
        }
        console.log(numRecs);

        let recs = getRandomElements(userData, numRecs);
        console.log(recs);

        let books = [];
        recs.forEach(function(item){
            let book = item['Book_Title'] + " by " + item['Author_Name'];
            books.push(book);
        });


        console.log(books.length)
        console.log(books);

        // save books array in session storage
        sessionStorage.setItem('books', JSON.stringify(books));

        })

        .catch(error => {
            console.error('Error fetching CSV file:', error);
        });
        

        // link to next page
        window.location.href = 'results.html';

    
});

// properly parse the data from csv file into js array
function parseCSV(csvData){
    // Split CSV data into lines
    const lines = csvData.split('\n');
    // Extract headers
    const headers = lines[0].split(',').map(header => header.trim());
    // Initialize data array
    const dataArr = [];
    
    // Iterate over lines starting from the second line
    for (let i = 1; i < lines.length; i++){
        // Separate each column of information
        const sections = lines[i].split(',').map(section => section.trim().replace(/\r$/, ''));
        // Initialize empty object for row data
        const rowData = {};
        
        // Iterate over the columns for that row to create the object info
        for(let j = 0; j < sections.length; j++){
            rowData[headers[j]] = sections[j];
        }
        
        // Add this row to the main array of objects
        dataArr.push(rowData);
    }
    
    // Return the array when done looping through
    return dataArr;
}


// function to get average rating count
function getRatingCountAvg(userData) {
    // Initialize variables for sum and count
    let sum = 0;
    let count = 0;

    // Iterate over the array and calculate sum and count
    userData.forEach(function(item) {
        // Check if Rating_votes property exists and is a number
        if (!isNaN(parseInt(item.Rating_votes))) {
            sum += parseInt(item.Rating_votes); // Convert string to number and add to sum
            count++; // Increment count
        }
    });

    const average = count > 0 ? (sum / count).toFixed(2) : 0;
    return average;
}


// function to get average rating score
function getRatingAvg(userData){

    // Initialize variables for sum and count
    let sum = 0;
    let count = 0;
    
    // Iterate over the array and calculate sum and count
    userData.forEach(function(item) {
        // Check if Rating_votes property exists and is a number
        if (!isNaN(parseInt(item.Rating_score))) {
            sum += parseInt(item.Rating_score); // Add Rating_votes value to sum
            count++; // Increment count
          }
    });
    
    const average = count > 0 ? (sum / count).toFixed(2) : 0;
    return average;

}

// get average publication year
function getYearAvg(userData){
    // Initialize variables for sum and count
    let sum = 0;
    let count = 0;

    // Iterate over the array and calculate sum and count
    userData.forEach(function(item) {
        // Check if Rating_votes property exists and is a number
        if (!isNaN(item.Year_published)) {
            sum += parseInt(item.Year_published); // Add Rating_votes value to sum
            count++; // Increment count
          }
    });
    
    const average = count > 0 ? (sum / count).toFixed(2) : 0;
    return average;
}
// function to get the random elements from array
function getRandomElements(array, numberOfElements) {
    const shuffledArray = array.sort(() => Math.random() - 0.5); // Shuffle the array
    return shuffledArray.slice(0, numberOfElements); // Return the first numberOfElements elements
}

// function to check for repeat values in an array
function hasDuplicates(books){
    return new Set(books).size !== books.length;
}
