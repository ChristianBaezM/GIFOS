
function addMouseOver ( element ) {
    
    let parent = element.parentNode;
    let content = document.querySelector('.selected .options').cloneNode(true);
    parent.appendChild(content);

    let buttonsContainer = element.nextSibling.childNodes[3];
    let span = document.createElement('span');
    span.classList.add('fullview-button');
    buttonsContainer.appendChild(span);

    let username = element.nextSibling.children[0].children[0];
    let title = element.nextSibling.children[0].children[1];

    // Reeplaces the Object GIF data into the card
    title.textContent = element.gif.title;
    username.textContent = element.gif.username;

    configureFavButton( element );
}

function replaceMouseOver( element ) {

    let username = element.nextSibling.children[0].children[0];
    let title = element.nextSibling.children[0].children[1];

    // Reeplaces the Object GIF data into the card
    title.textContent = element.gif.title;
    username.textContent = element.gif.username;

    let gifID = element.gif.id;
    let favButton = element.nextSibling.children[1].children[0];
    statusGif = gifInLocalStorage( gifID , favButton );  
}

function configureFavButton( element ) {

    let gifID = element.gif.id;
    let favButton = element.nextSibling.children[1].children[0];
    statusGif = gifInLocalStorage( gifID , favButton );
    // Change Gif status property and set or remove GIF object from local storage
    favButton.addEventListener("click" , (e) => changeGifStatus ( favButton , e )); 
}

let urlBlobDesktop = "";
function configureDownloadDesktop( cardsContainer ) {
    for (const card of cardsContainer) {
        let button = card.children[1].children[1].children[2];
        let img = card.children[0];
        button.addEventListener( "click" , (e) => {displayFavDesktop( img )}) // Expands GIF, configures download when expanded and removes blob on closing
        card.addEventListener( "mouseenter" , configureDownloadOnHover ); // Configures download on "hover" (not expanded)
        card.addEventListener( "mouseleave" , () => URL.revokeObjectURL(urlBlobDesktop) ); // Removes blob on mouseleave
    }
}

async function configureDownloadOnHover( event ) {

    gifObject = event.target.children[0].gif
    const downloadButton = event.target.children[1].children[1].children[1];
    let favButton = event.target.children[1].children[1].children[0];
    statusGif = gifInLocalStorage( gifObject.id , favButton );

    const gifFetch = await fetch( gifObject.downloadSrc );
    const file = await gifFetch.blob();
    downloadButton.download = `${gifObject.title}_${gifObject.id}`;
    urlBlobDesktop = URL.createObjectURL( file );

    downloadButton.href = urlBlobDesktop;
}

function displayFavDesktop( img ) {
    
    let scroll = window.scrollY;
    selected.style.top = `${scroll}px`; 
    window.scrollTo(0,scroll);
    gifSelected = img.gif;
    
    // Assign the GIF Object properties to the HTML tag, text content attribute
    let imgSelected = document.querySelector(".selected img");
    let username = document.querySelector(".selected .username");
    let title = document.querySelector(".selected .title");
    
    imgSelected.src = img.gif.src;
    title.textContent = img.gif.title;
    username.textContent = img.gif.username;

    let favButton = document.querySelector(".selected .fav-button");
    favButton.classList.remove("fav-button-selected");
    let gifID = img.gif.id;
    let dButton = document.querySelector(".selected .download-button");
    // // Looks if the selected gif is in the localStorage, returns a true or a false
    // // The statusGif is set to indicate if whenever the fav button is clicked it must be setted or removed into LocalStorage, used in changeGifStatus
    statusGif = gifInLocalStorage( gifID , favButton );

    selected.classList.add("display-selected"); 
    document.body.classList.add("display-selected"); 

    navbar.classList.add('hide');
    configureDownload( gifSelected , dButton);
}



