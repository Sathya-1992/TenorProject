import { fetchTrendingGifs, renderTrendyGifs } from "./trending.js";
import { fetchSearchStickers, fetchSearchTags, renderSearchStickers, renderSearchTags } from "./stickers.js";
import { fetchFeaturedGifs, fetchSearchGifs, renderGifs } from "./gifs.js";
import { changeHash } from "./commonUtils.js";


let searchEle = document.getElementById("searchInput");
let searchBtnEle = document.getElementById("searchBtn");

export const rootElement = document.documentElement;

let root = document.documentElement;
export const rootCS = getComputedStyle(root);

window.featuredGifElements = [];


var timeout;


function splitHashAndQueryParams(hash){
    let splittedValue = hash.split("?");
    return {
        hash : splittedValue[0],
        queryParams : splittedValue[1]
    };
}

function constructQueryParamGroup(queryParams){
    let splittedParams = queryParams.split("&");
    let object = {};
    for(let i=0;i<splittedParams.length;i++){
        let param = splittedParams[i];
        let splitParam = param.split("=");
        object = Object.assign(object, {
            [splitParam[0]] : splitParam[1]
        })
    }
    return object;
}

/**
 * To render all trending tenor anf Gifs.
 */

function init(){
    let trendingGif = fetchTrendingGifs();
    let featuredGif = fetchFeaturedGifs();
    Promise.all([trendingGif, featuredGif]).then((data) =>{
        renderTrendyGifs(data[0]);
        renderGifs(data[1], "featured");
    });

    let {hash, queryParams} = splitHashAndQueryParams(window.location.hash);
    if(window.location.hash == ""){
        history.replaceState(null, null, document.location.pathname + '#home');
    }
    if(hash === "#search"){
        let queryParamObject = constructQueryParamGroup(queryParams);
        let searchEle = document.getElementById("searchInput");
        searchEle.value = decodeURIComponent(queryParamObject['filter']); 
        renderSearchItem(queryParamObject.filter);
    }else{
        searchEle.value = "";
        document.getElementById("homePage").style.display = "grid";
        document.getElementById("searchPage").style.display = "none";
    }
}

window.goToHomePage = function(){
    window.location.hash="#home";
}

window.onload = function(){
     init();
};

function emptyGifElementColumns(){
    for(let i=0;i<featuredGifElements.length;i++){
        featuredGifElements[i].innerHTML="";
    }
}


function renderSearchItem(searchValue){

    emptyGifElementColumns();
    document.getElementById("homePage").style.display = "none";
    document.getElementById("searchPage").style.display = "grid";
    
    searchValue = searchValue || searchEle.value;

    let tags = fetchSearchTags(searchValue);
    let stickers = fetchSearchStickers(searchValue);
    let searchGifs = fetchSearchGifs(searchValue);

    Promise.all([tags, stickers, searchGifs]).then((data) =>{
        renderSearchTags(data[0]);
        renderSearchStickers(data[1]);
        renderGifs(data[2], "search");
    });  
}


window.addEventListener("hashchange",function(){
    init();
})

searchBtnEle.addEventListener("click",function(){
    changeHash("#search?filter="+searchEle.value);
    renderSearchItem();
});

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
