import { fetchTrendingGifs, renderTrendyGifs } from "./trending.js";
import { fetchSearchStickers, fetchSearchTags, renderSearchStickers, renderSearchTags } from "./stickers.js";
import { fetchFeaturedGifs, fetchSearchGifs, renderGifs } from "./gifs.js";


let searchEle = document.getElementById("searchInput");
let searchBtnEle = document.getElementById("searchBtn");

export const rootElement = document.documentElement;

let root = document.documentElement;
export const rootCS = getComputedStyle(root);

window.featuredGifElements = [];


var timeout;

/**
 * To render all trending tenor anf Gifs.
 */
 window.onload = function(){
    let trendingGif = fetchTrendingGifs();
    let featuredGif = fetchFeaturedGifs();
    Promise.all([trendingGif, featuredGif]).then((data) =>{
        renderTrendyGifs(data[0]);
        renderGifs(data[1], "featured");
    });
};

function emptyGifElementColumns(){
    for(let i=0;i<featuredGifElements.length;i++){
        featuredGifElements[i].innerHTML="";
    }
}


function renderSearchItem(){

    emptyGifElementColumns();
    document.getElementById("homePage").style.display = "none";
    document.getElementById("searchPage").style.display = "grid";
    
    let searchValue = searchEle.value;

    let tags = fetchSearchTags(searchValue);
    let stickers = fetchSearchStickers(searchValue);
    let searchGifs = fetchSearchGifs(searchValue);

    Promise.all([tags, stickers, searchGifs]).then((data) =>{
        renderSearchTags(data[0]);
        renderSearchStickers(data[1]);
        renderGifs(data[2], "search");
    });  
}

searchBtnEle.addEventListener("click",renderSearchItem);

searchEle.addEventListener("keypress",function(event){
    if(event.key === "Enter"){
      event.preventDefault();
      searchBtnEle.click();
    }
});

searchEle.addEventListener("keyup", function(event){
    if(event.key !== "Enter"){
        clearTimeout(timeout);
        timeout = setTimeout(function(){
            searchBtnEle.click();
        },1000);
    }
});
