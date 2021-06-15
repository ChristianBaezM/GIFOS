window.addEventListener( "scroll" , configureSticky ) 

let navHeight = navbar.offsetHeight;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function configureSticky() {

    if (window.pageYOffset >= navHeight) {
        navbar.classList.add("sticky"); // 1024px.css
    } else {
        navbar.classList.remove("sticky");
    }
}

// console.log(screen.width)
if (screen.width > 1023) {

    const searchNav = document.querySelector('.search-container').cloneNode(true);
    searchNav.children[1].remove();
    menu.insertBefore( searchNav , menu.firstChild);
    
    const inputNav = document.querySelector(".input-search");

    inputNav.addEventListener("keyup", (e) => {
        if (e.key == "Enter") { 
            search(e);
        } 
    });
    
} 