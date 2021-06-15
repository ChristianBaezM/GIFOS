const favorites = document.querySelector(".favorites");
const searchBlock = document.querySelector(".search-block");
const results = document.querySelector(".results");
const resultsDivisor = document.querySelector('.results-divisor');
const checkBox = document.querySelector('.checkbox');
const main = document.querySelector('main');
const h1 = document.querySelector('h1');

let view;
// let gifsPages = [];
const ul = document.querySelector('.menu ul');
ul.addEventListener( "click" , (e) => { displayFavorites(e) });

const logo = document.querySelector('.logo');
logo.addEventListener( "click" , (e) => { displayFavorites(e) });

function displayFavorites (e) {
    
    checkBox.checked = false; //Close menu automatically
    view = e.target.classList[0] == "new-gif" ? "Nuevo GIF" : e.target.textContent || "GIFOS";
    h2SearchedTerm.textContent = view;
    showMain();
    resetSearch();
    switch (view) {
        case "Favoritos":
            removeAllChildNodes(gifsResultContainer);
            searchInLocalStorage("search");
            displayGifs( view , "fav-gif-icon" , "my-gif-icon" ); // Just graphics 
            break;
        case "Mis GIFOS":
            removeAllChildNodes(gifsResultContainer);
            searchInLocalStorage("upload");
            displayGifs( view , "my-gif-icon" , "fav-gif-icon" ); // Just graphics 
            break;
        case "Nuevo GIF":
            removeAllChildNodes(gifsResultContainer);
            hideMain(); // Also displays the new-gif container
            break;
        case "GIFOS":
            goHome();
            break;
        default: // Click on night or day mode
            goHome();
            changeMode();
            break;
    }
}

// selected "view", class to add, class to remove. Each class changes the icon to display according to the selected view
function displayGifs( view , addClass , removeClass ) {

    const span = document.querySelector('.section-image');
    h1.classList.add('display-none');
    h2SearchedTerm.textContent = view;
    searchBlock.classList.add('display-none');
    results.classList.add('d-inline-block');
    span.classList.remove(`${removeClass}`);
    span.classList.add(`${addClass}`);
}

function searchInLocalStorage(searchFrom) {

    let localStorageGifs = [];
    for (let index = 0; index < localStorage.length; index++) {

        const key = localStorage.key(index);
        let gif = localStorage.getItem(key);
        
        try { gif = JSON.parse(gif) } 
        catch (error) { gif = null }
        
        if (gif.from == searchFrom) localStorageGifs.push(gif); // LocalStorageGifs stores all the gifs in the LocalStorage, avoids including the night mode key
    }
   
    if ( localStorageGifs.length == 0) { searchFrom == "search" ? displayFavEmpty() : displayGifosEmpty() } 
    else {
        gifsResultContainer.removeAttribute('id');
        paginationContainer.removeAttribute('id');
        pages = Math.ceil( localStorageGifs.length / 12); // Sets the global variable pages for pagination
        gifsPages = createGifsPages( localStorageGifs , 1); // Creates an array, each position is a 12 Gifs page
        pagination(1);
        createGifsElement( gifsPages , 1 );
    }  
}

function displayFavEmpty() {

    gifsResultContainer.id = 'empty';
    const span = document.createElement('span');
    span.removeAttribute('class'); //Clears any class in order to display the correct image
    span.classList.add('empty-favs');
    gifsResultContainer.appendChild(span);

    h2 = document.createElement('h2');
    h2.innerHTML = "¡Guarda tu primer GIFO en Favoritos <br> para que se muestre aquí!";
    gifsResultContainer.appendChild(h2);

    paginationContainer.id = 'pagination-hide';
}

function displayGifosEmpty() {

    gifsResultContainer.id = 'empty';
    const span = document.createElement('span');
    span.removeAttribute('class'); //Clears any class in order to display the correct image
    span.classList.add('empty-my-gifs');
    gifsResultContainer.appendChild(span);

    h2 = document.createElement('h2');
    h2.innerHTML = "¡Anímate a crear tu primer GIFO!";
    gifsResultContainer.appendChild(h2);

    paginationContainer.id = 'pagination-hide';
}

function goHome() {
    searchBlock.classList.remove('display-none');
    results.classList.remove('d-inline-block');
    const span = document.querySelector('.results .section-image');
    span.removeAttribute('class');
    span.classList.add('section-image');
    h1.classList.remove('display-none');
}

function createGifsElement ( gifPage , actualPage ) {
    removeAllChildNodes(gifsResultContainer);
    for (const gif of gifPage[actualPage - 1]) { //page number is a global variable that indicates the current page
        let img = createGifCard( gif )
        if ( screen.width < 1024 ) favListener( img ); // Adding event to display full screen gif if the image is clicked
        if ( screen.width > 1023 ) addMouseOver( img ); // Creates the card for desktop card hover ...
    }
    if ( screen.width > 1023 ) {
        let cardsContainer = document.querySelectorAll('.card-container');
        configureDownloadDesktop( cardsContainer )
    };
}

function replaceGifs ( gifPage , actualPage ) {

    let page = gifPage[actualPage - 1];
    let resultImages = document.querySelectorAll(".gifs-result-container img");

    for (let index = 0; index < 12; index++) {

        if (page[index]) {
            resultImages[index].src = page[index].src;
            resultImages[index].gif = page[index];
            if ( screen.width > 1023 ) replaceMouseOver( resultImages[index] ); // Creates the card for desktop card hover ...
        } else {
            resultImages[index].parentNode.remove()
        }
    }
    if ( screen.width > 1023 ) {
        let cardsContainer = document.querySelectorAll('.card-container');
        configureDownloadDesktop( cardsContainer )
    };
}

// Creates an array, each position is a 12 Gifs page. Receives an array of GIF Objects
function createGifsPages( localStorageGifs ) {
    let gifPagesArray = [];
    for (let index = 0; index < pages; index++) {

        let inicio = ( index * 12 );
        let fin = ( inicio + 12);
        let gifPage = localStorageGifs.slice( inicio , fin );

        gifPagesArray.push(gifPage); // Creates an array, each position is a 12 Gifs page
    }
    return gifPagesArray;
}

function hideMain() {

    searchSection.classList.add('display-none');
    trendingSection.classList.add('display-none');
    sectionNewGif.classList.add('display-flex');
}

function showMain() {
    
    searchSection.classList.remove('display-none');
    trendingSection.classList.remove('display-none');
    sectionNewGif.classList.remove('display-flex');
}
