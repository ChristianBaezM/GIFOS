// Event to display "full screen" gif if any image on the result section is selected
function favListener(element) {
    element.addEventListener("click", (e) => {displayFav(e)});
}

// Adding event to display full screen gif if any image in the trending section is selected or Creates the card for desktop card hover ...
setTimeout( function() {  
    for (const img of imgTrends) {
        if ( screen.width < 1024 ) img.addEventListener("click", (e) => {displayFav(e)});
        if ( screen.width > 1023 ) { 
            modifyGifCard(img);
            addMouseOver(img);
            const trendingCardsContainer = document.querySelectorAll('.trending-card-container');
            configureDownloadDesktop( trendingCardsContainer );
        }
    }
}, 300); // Time out to add the events once the images in trend section were fetched and created


// Display the favorites section with the selected Gif img, title and username
const selected = document.querySelector(".selected");
const favButton = document.querySelector(".fav-button");

favButton.addEventListener("click" , (e) => {changeGifStatus(e.target)} ); // Change Gif status property and set or remove GIF object from local storage

let gifSelected;
let statusGif;

function displayFav (event) {

    let scroll = window.scrollY;
    selected.style.top = `${scroll}px`; 
    window.scrollTo(0,scroll);
    gifSelected = event.target.gif;
    
    // Assign the GIF Object properties to the HTML tag, text content attribute
    let imgSelected = document.querySelector(".selected img");
    let username = document.querySelector(".username");
    let title = document.querySelector(".title");
    
    imgSelected.src = event.target.src;
    title.textContent = event.target.gif.title;
    username.textContent = event.target.gif.username;

    favButton.classList.remove("fav-button-selected");
    let gifID = event.target.gif.id;

    // Looks if the selected gif is in the localStorage, returns a true or a false
    // The statusGif is set to indicate if whenever the fav button is clicked it must be setted or removed into LocalStorage, used in changeGifStatus
    statusGif = gifInLocalStorage( gifID , favButton );

    selected.classList.add("display-selected"); 
    document.body.classList.add("display-selected"); 

    const downloadButton = document.querySelector(".selected .download-button");
    configureDownload( event.target.gif , downloadButton ); 
}

function gifInLocalStorage( gifID , favButton ) {

    let statusStorage = false;
    favButton.classList.remove("fav-button-selected");
    for (let index = 0; index < localStorage.length; index++) {
        
        if ( gifID == localStorage.key(index) ){

            let key = localStorage.key(index);
            let value = localStorage.getItem(key);
            statusStorage = true;
            favButton.classList.add("fav-button-selected");
        }
    }
    return statusStorage;
}

const closeSelected = document.querySelector(".close-selected");
function changeGifStatus ( favButton , event ) {

    // Getting the gif status from the local storage using the event at fav button on desktop,
    // on mobile all the data is set just clicking on the image to expand the gif.
    try { 
        gifSelected = event.path[3].firstChild.gif;
        gifID = gifSelected.id
        statusGif = gifInLocalStorage( gifID , favButton );
    } catch {}

    statusGif = !statusGif;
    gifSelected.status = statusGif;
    let key = gifSelected.id;

    if (statusGif) {
        let value = JSON.stringify(gifSelected);
        localStorage.setItem( key , value );
        favButton.classList.add("fav-button-selected");
    } else {
        localStorage.removeItem( key );
        favButton.classList.remove("fav-button-selected");
    }
}

let urlBlob = "";
// Closes the favorite window and removes te Blob
closeSelected.addEventListener("click", () => {

    selected.classList.remove("display-selected");
    document.body.classList.remove("display-selected");
    URL.revokeObjectURL(urlBlob); // Removes blob from memory
    navbar.classList.remove('hide'); // Shows the sticky navbar once the expanded GIF is closed.
});

async function configureDownload( gifObject , button ) {
    
    const gifFetch = await fetch( gifObject.downloadSrc );
    const file = await gifFetch.blob();

    button.download = `${gifObject.title}_${gifObject.id}`;
    urlBlob = URL.createObjectURL( file );

    button.href = urlBlob;
}