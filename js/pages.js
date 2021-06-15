const itemsPagination = document.querySelectorAll(".pagination .page");
const paginationPrev = document.querySelector(".pagination .fa-chevron-left");
const paginationNext = document.querySelector(".pagination .fa-chevron-right");

for (const item of itemsPagination) {  
    item.addEventListener("click", (e) => {

        let rPagination = pagination(item.textContent);    
        pageNumber = item.textContent;
        switch (view) {
            case "Favoritos":
                pageNumber == (pages - 1) ? createGifsElement ( gifsPages , pageNumber ) : replaceGifs( gifsPages , pageNumber );
                break;
            case "Mis GIFOS":
                break;
            default:
                offset = rPagination[0];
                search(e); // Search clicking on any pagination number
                break;
        }
    });
}

paginationPrev.addEventListener ("click" , (e) => { 
    
    for (const item of itemsPagination) {   
        if (item.classList[1])  pageNumber = item.textContent; // assigns the clicked number
    }
    if (pageNumber != 1) {
        let rPagination = pagination(pageNumber - 1); 
        offset = rPagination[0];
        pageNumber = rPagination[1];
        switch (view) {
            case "Favoritos": 
                pageNumber == (pages - 1) ? createGifsElement ( gifsPages , pageNumber ) : replaceGifs( gifsPages , pageNumber );
                break;
            case "Mis GIFOS":
                break;
            default:
                search(e); // Search clicking on prev button
                break;
        }
    }
});

paginationNext.addEventListener ("click" , (e) => {

    for (const item of itemsPagination) {   
        if (item.classList[1])  {
            pageNumber = item.textContent;
        }
    }
    
    if (pageNumber != pages) {
        let rPagination = pagination(Number(pageNumber) + Number(1)); 
        offset = rPagination[0];
        pageNumber = rPagination[1];
        switch (view) {
            case "Favoritos": 
                replaceGifs( gifsPages , pageNumber );
                break;
            case "Mis GIFOS":
                break;
            default:
                search(e); // Search clicking on prev button
                break;
        }
    }
});

let dark = "";
function pagination(pageNumber) {
    pageNumber = parseInt(pageNumber);
    let offset = 0;
    dark = night_mode ? "dark-selected" : "";
    if (pageNumber > pages && pages != 0) pageNumber = pages; // It prevents changing to any page that doesn't exist
    switch (pageNumber){
        case 1:
            setNumeration( 1 );
            itemsPagination[0].classList.add("li-selected");
            itemsPagination[0].id = dark;
            break;
        case 2:
            setNumeration( 1 );
            itemsPagination[1].classList.add("li-selected");
            itemsPagination[1].id = dark;
            break;
        case pages-1 :
            setNumeration( pages - 4 );
            itemsPagination[3].classList.add("li-selected");
            itemsPagination[3].id = dark;
            break;
        case pages:
            if  ( pages < 5 ) { 
                setNumeration ( 1 , pages );
                itemsPagination[pages-1].classList.add("li-selected");
                itemsPagination[pages-1].id = dark;
            } else {
                setNumeration( pages - 4 );
                itemsPagination[4].classList.add("li-selected");
                itemsPagination[4].id = dark;
            }
            break;
        default:
            setNumeration( pageNumber - 2 );
            itemsPagination[2].classList.add("li-selected");
            itemsPagination[2].id = dark;
            break;
    }
    if (pages < 5) hideNumeration() // Hides numeration when there are less than 5 pages
    offset = (pageNumber - 1) * 12;
    return [ offset , pageNumber ]
}        

// Assigns the numbers for the correct numeration
function setNumeration( firstNumber , pagesNumber ){
    if (pagesNumber) { pagesNumber = pagesNumber } else { pagesNumber = 5}
    for (let index = 0; index < pagesNumber; index++){
        itemsPagination[index].classList.remove("li-selected"); // Clear background color for all the numbers - "selection"
        itemsPagination[index].removeAttribute('id'); // Clear background color for all the numbers - "selection"
        itemsPagination[index].textContent = index + firstNumber ;
    }
}

function hideNumeration () {

    for (let index = pages; index < 5; index++) {
        itemsPagination[index].id = 'pagination-hide';
    }
}
