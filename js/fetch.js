let url = "https://api.giphy.com/v1";
let api_key = "7lxQjsbM6jE4iDEC1vs8DoDfcKBDGFte";

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

class Gif {  
    constructor( title, username, id , height, width, src, downloadSrc, from) {
      this.title = title;
      this.username = username;
      this.id = id;
      this.src = src;
      this.downloadSrc = downloadSrc;
      this.height = height;
      this.width = width;
      this.status = false;
      this.from = from;
    }
}

async function fetchTrendingTerms() {

    const urlTrendingTerms = `${url}/trending/searches?api_key=${api_key}`;
    const promiseTrendingTerms = await fetch(urlTrendingTerms);
    const jsonTrendingTerms = await promiseTrendingTerms.json();
    let trends = jsonTrendingTerms.data.slice(0,5);
    for (let i = 0; i < trends.length ; i++) {

        if (i != 4) {
            trends[i] = trends[i].capitalize() + ",";
        }
        else {
            trends[i] = trends[i].capitalize() + " ";
        }
    }
    return trends;
}

async function fetchAutocomplete(url) {

    const promiseAutocomplete = await fetch(url);
    const jsonAutocomplete = await promiseAutocomplete.json();
    const suggestions = jsonAutocomplete.data;
    let name = [];
    for (const suggestion of suggestions) {
        name.push(suggestion.name)
    }
    return name;
}

async function fetchTrendingGifs() {

    const urlTrendingGifs = `${url}/gifs/trending?api_key=${api_key}&limit=3`;
    return gifArray( urlTrendingGifs , "Trend" );
}

async function fetchSearch(input,offset) {

    const urlSearch = `${url}/gifs/search?api_key=${api_key}&q=${input.toLowerCase()}&limit=12&offset=${offset}`;
    return gifArray( urlSearch , input ) 
}

// Returns an array of Gif Objects and the # of result pages from the requested URL (The URL itself indicates the length of the response)
async function gifArray ( url , input ) {

    const promise = await fetch( url );
    const json = await promise.json();
    const gifs = json.data;
    let gifArray = [];
    let pages = Math.ceil(json.pagination.total_count/12);
    let empty = json.pagination.total_count == 0 ? true : false ;

    for (const gif of gifs) {
        
        let newGif = createGifObject(gif,);
        gifArray.push(newGif);
    }
    return { "gifArray" : gifArray , "pages" : pages, "empty" : empty}  
}

function createGifObject (gif ,from) {

    let title = gif.title ? gif.title.capitalize().split(" GIF",1)[0] : input;
    let username = gif.user && gif.user.display_name ? gif.user.display_name :
                                        gif.username ? gif.username          : "No Username";
    let id = gif.id;
    let src = gif.images.original.url;
    let downloadSrc = gif.images.original.url;
    let height = gif.images.original.height;
    let width = gif.images.original.width;
    let fr = from || "search";
    let newGif = new Gif ( title , username , id , height , width , src , downloadSrc , fr)

    return newGif
}
