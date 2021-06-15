const pTrends = document.querySelector(".trends");
const spanTrends = document.querySelectorAll(".trends span");
const h2SearchedTerm = document.querySelector(".searched-term");
const imgTrends = document.querySelectorAll(".trending-gif");
const ulAutocomplete = document.querySelector(".ul-autocomplete");
const spanAutocompleteDivisor = document.querySelector(".autocomplete-divisor");
const searchButton = document.querySelector(".search-button");
const gifsResultContainer = document.querySelector(".gifs-result-container");
const sectionResults = document.querySelector(".results");
const searchac = document.querySelector('.search-block .search-ac');
const input = document.querySelector(".input-search");

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.lastChild);
    }
}

(async function () { 
    
    const resultado = await Promise.all( [ fetchTrendingTerms(), fetchTrendingGifs() ] );
    const trend = resultado[0];
    const gifs = resultado[1].gifArray;

    for (let index = 0; index < trend.length; index++) { 
        spanTrends[index].textContent = trend[index]; 
    }

    // Assign the properties of the Gif object to the HTML tag
    for (let index = 0; index < gifs.length; index++) {  
        imgTrends[index].src = gifs[index].src;
        imgTrends[index].gif = gifs[index];
    }

    for (const span of spanTrends) {
        span.addEventListener("click", (e) => {
            let value = span.textContent.slice(0,-1);
            input.value = value;
            search(e); // Search clicking on trends (span Tag)
        }); 
    }
})();


input.addEventListener("input", () => {

    let inputValue = input.value;
    let urlAutocomplete = `${url}/gifs/search/tags?api_key=${api_key}&q=${inputValue}&limit=4`;

    
        
    if (inputValue == "" ) {
        searchButton.classList.remove("search-button-close");
        searchac.classList.remove("show");
        removeAutocomplete();  
    } else {
        searchButton.classList.add("search-button-close");
        searchac.classList.add("show");
    }
        
    
    try {
        const searchButtonNav = document.querySelector('.menu .search-button');
        const inputButtonNav = document.querySelector('.menu .input-search'); 
        let inputButtonValue = input.value;
        inputButtonValue == "" ? searchButtonNav.classList.remove("search-button-close") : searchButtonNav.classList.add("search-button-close");
    } catch {}

    if (night_mode) iconSearch.id = 'icon-search';    

    fetchAutocomplete(urlAutocomplete).then( result => {

        //Adds or removes the span divisor in the input box
        if (inputValue.length > 0 && result.length != 0) {
            spanAutocompleteDivisor.classList.add("d-inline-block");
        }
        else {
            spanAutocompleteDivisor.classList.remove("d-inline-block");
        };
        
        removeAllChildNodes(ulAutocomplete);

        // Creates and appends a list item to the "ul" filled with the autocomplete fetch
        for (let index = 0; index < result.length; index++) {

            let li = document.createElement("li");
            let spanIcon = document.createElement('span');
            let spanText = document.createElement('span');
            li.classList.add("li-autocomplete");
            spanIcon.classList.add("search-li");
            spanText.textContent = result[index];
            spanText.classList.add("text");
            li.appendChild(spanIcon);
            li.appendChild(spanText);
            ulAutocomplete.appendChild(li);
            spanText.addEventListener("click", (e) => {
                input.value = e.target.textContent;
                search(e); //Search clicking on autocomplete suggestions
            })
        }
    }
    );
});

searchButton.addEventListener("click", (e) => {search(e)}); // Search clicking on search button
input.addEventListener("keyup", (e) => {
    const inputButtonNav = document.querySelector('.menu .input-search');
    const searchButtonNav = document.querySelector('.menu .search-button');
    inputButtonNav.value = input.value;
    // searchButtonNav.classList.remove("search-button-close");
    if (e.key == "Enter") { 
        search(e);
        input.blur();
    } 
});

setTimeout( () => { 
    const searchButtonNav = document.querySelector('.menu .search-button');
    const inputButtonNav = document.querySelector('.menu .input-search'); 

    searchButtonNav.addEventListener("click", (e) => {search(e)}); // Search clicking on search button
    inputButtonNav.addEventListener("input", () => {

        searchButtonNav.classList.remove("search-button-close");
        searchButton.classList.remove("search-button-close");
        let inputNavValue = inputButtonNav.value;
        let inputValue = input.value;
        console.log(inputButtonNav)
        if (inputNavValue == "" ) {
            searchButtonNav.classList.remove("search-button-close");
            searchButton.classList.remove("search-button-close");
        } else {
            searchButtonNav.classList.add("search-button-close");
            searchButton.classList.add("search-button-close"); 
        }

        if (night_mode) searchButtonNav.id = 'icon-search';
        input.value = inputButtonNav.value; 
    })
}, 100);

let pages = 0;
const paginationContainer = document.querySelector('.pagination');

function search(e) {   

    let inputValue = (e.target.classList[0] == 'li-autocomplete') ? e.target.textContent : e.target.value; // Stores the input value of any input or text content for li autocomplete
    if (!inputValue) inputValue = input.value; // If there is not a value, ur clicking on search button then use the setted input.value
    checkBox.checked = false;
    let classesLength = e.target.classList.length;
    let fClass = classesLength == 1 ? e.target.classList[0] : 
                 classesLength == 2 ? e.target.classList[1] : // To avoid searching by clicking on the close icon
                 e.target.tagName;
    h2SearchedTerm.textContent = inputValue.capitalize() || view ; // View is the variable setted when you click on the navbar menu
    searchButton.classList.add("search-button-close"); // Change icon to close icon
    if (screen.width > 1023) {
        const searchButtonNav = document.querySelector('.menu .search-button');
        const inputButtonNav = document.querySelector('.menu .input-search'); 
        searchButtonNav.classList.add("search-button-close");
        inputButtonNav.value = inputValue;
        input.value = inputValue;
    }
    paginationContainer.removeAttribute('id');
    switch (fClass) {
        case "trend-suggestion":
        case "search-button":
        case "text":
        case "input-search":
            offset = 0;
            searchac.classList.remove("show");
            spanAutocompleteDivisor.classList.add("d-inline-block");
            fetchSearch( inputValue , offset).then( (result) => {
                let empty = result.empty;
                removeAllChildNodes(gifsResultContainer);
                if ( empty ) {
                    displayHomeEmpty();
                } else {
                    gifsResultContainer.removeAttribute('id');
                    graphResults(result.gifArray);
                    pages = result.pages;
                    pagination(1);
                }      
            });
            displaySearch();
            break;
        case "LI":
        case "SPAN":
        case "li-selected":
        case "fa-chevron-left":
        case "fa-chevron-right":
        case "page":
            fetchSearch(input.value, offset).then( (result) => {
                replaceResults(result.gifArray);
            });
            break;
        default:
            resetSearch();
            break;
    }
}

function resetSearch () {
    searchButton.classList.remove("search-button-close");
    searchac.classList.remove("show");
    removeAutocomplete();
    if (screen.width > 1023) {
        const searchButtonNav = document.querySelector('.menu .search-button'); 
        const inputButtonNav = document.querySelector('.menu .input-search'); 
        searchButtonNav.classList.remove("search-button-close");
        inputButtonNav.value = "";
    }
    if (night_mode) iconSearch.id = 'icon-search';
    sectionResults.classList.remove("d-inline-block");
    input.value = "";
}

function displaySearch () {

    removeAutocomplete();
    removeAllChildNodes(gifsResultContainer); // Remove everything inside the results container
    sectionResults.classList.add("d-inline-block"); // Display the results section
    
}

function removeAutocomplete () {
    removeAllChildNodes(ulAutocomplete); // Remove everything inside the autocomplete container
    spanAutocompleteDivisor.classList.remove("d-inline-block"); // Remove autocomplete divisor
}
//Assigns the GIF Object to each image
function graphResults (result){
    
    for (const gif of result) {
        let img = createGifCard( gif )
        if ( screen.width < 1024 ) favListener( img ); // Adding event to display full screen gif if the image is clicked
        if ( screen.width > 1023 ) addMouseOver( img ); // Creates the card for desktop card hover ...
    }
    if ( screen.width > 1023 ) {
        let cardsContainer = document.querySelectorAll('.card-container');
        configureDownloadDesktop( cardsContainer )
    };
}

//Assigns the GIF Object to each image
function replaceResults (result) {
    
    let resultImages = document.querySelectorAll(".gifs-result-container img");
    
    for (let index = 0; index < result.length; index++) {
        resultImages[index].src = result[index].src;
        resultImages[index].gif = result[index];

        if ( screen.width > 1023 ) replaceMouseOver( resultImages[index] ); // Creates the card for desktop card hover ...
    }
    if ( screen.width > 1023 ) {
        let cardsContainer = document.querySelectorAll('.card-container');
        configureDownloadDesktop( cardsContainer )
    };
}

function displayHomeEmpty() {
    gifsResultContainer.id = 'empty';
    const span = document.createElement('span');
    gifsResultContainer.appendChild(span);

    h2 = document.createElement('h2');
    h2.textContent = "Intenta con otra búsqueda.";
    gifsResultContainer.appendChild(h2);

    paginationContainer.id = 'pagination-hide';
}

function createGifCard( gif ) {
    let div = document.createElement('div');
    div.classList.add('card-container');
    let img = document.createElement('img');
    img.src = gif.src;
    img.gif = gif; // Adding the Gif object as a property to the HTML tag
    div.appendChild(img);
    gifsResultContainer.appendChild(div);

    return img
}

const trendingGifsContainer = document.querySelector('.trending-gifs-container');

function modifyGifCard ( img ) {
    let div = document.createElement('div');
    div.classList.add('trending-card-container');
    div.appendChild(img);
    trendingGifsContainer.appendChild(div);
}

