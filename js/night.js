const footer = document.querySelector('footer');
const searchSection = document.querySelector('.search');
const selectedSection = document.querySelector('.selected');
const trendingSection = document.querySelector('.trending');
const resultsSection = document.querySelector('.results');
const sectionNewGif = document.querySelector('.create-gif')
const gifosLogo = document.querySelector('.logo span');
const searchContainer = document.querySelector('.search-container');
const iconSearch = document.querySelector('.search-button');
const menu = document.querySelector('.menu');
const firstLi = document.querySelector('.menu ul li'); // Just the first 
const favButtonDark = document.querySelector('.selected .options .fav-button');
const newGif = document.querySelector('.new-gif');
const navbar = document.querySelector("nav");
const menuItems = document.querySelector(".menu-items");
const burgerLogo = document.querySelector('.burger-logo');

let night_mode = localStorage.getItem( "night" );

if ( night_mode ) {
    switch ( night_mode ) {
        case "true":
            applyNight();
            night_mode = true;
            break;
        case "false":
            applyDay();
            night_mode = false;
            break;
    }
} else {
    localStorage.setItem( "night" , false );
    night_mode = false;
}

function changeMode( view ) {

    night_mode = !night_mode;
    // view = view.toLowerCase();
    localStorage.setItem( "night" , night_mode )

    if (night_mode) {
        applyNight();
    }
    else {
        applyDay();
    }
} 

function applyNight() {

    firstLi.textContent = "Modo Diurno";
    navbar.classList.add('night');
    gifosLogo.classList.add('night');
    screen.width > 767 ? menuItems.classList.add('night') : menuItems.classList.remove('night');
    searchSection.classList.add('night');
    trendingSection.classList.add('night');
    selectedSection.classList.add('night');
    resultsSection.classList.add('night');
    sectionNewGif.classList.add('night');
    footer.classList.add('night');

    paginationNext.classList.add('night');
    paginationPrev.classList.add('night');

    newGif.id = 'icon-new-gif';
}

function applyDay() {

    firstLi.textContent = "Modo Nocturno";
    navbar.classList.remove('night');
    gifosLogo.classList.remove('night');
    searchSection.classList.remove('night');
    trendingSection.classList.remove('night');
    selectedSection.classList.remove('night');
    resultsSection.classList.remove('night');
    sectionNewGif.classList.remove('night');
    footer.classList.remove('night');

    paginationNext.classList.remove('night');
    paginationPrev.classList.remove('night');

    newGif.removeAttribute('id');
}
