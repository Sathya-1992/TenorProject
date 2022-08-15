import { fetchTrendingGifs, renderTrendyGifs } from "./trending.js";
import { fetchSearchStickers, fetchSearchTags, renderSearchStickers, renderSearchTags } from "./stickers.js";
import { fetchFeaturedGifs, fetchSearchGifs, renderGifs } from "./gifs.js";
import { changeHashSilently } from "./commonUtils.js";


let searchEle = document.getElementById("searchInput");
let searchBtnEle = document.getElementById("searchBtn");

let isSearchFetching = false;
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

        let trendingGif = fetchTrendingGifs();
        let featuredGif = fetchFeaturedGifs();
        Promise.all([trendingGif, featuredGif]).then((data) =>{
            renderTrendyGifs(data[0]);
            renderGifs(data[1], "featured");
        });
        
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

    isSearchFetching = true;

    Promise.all([tags, stickers, searchGifs]).then((data) =>{
        renderSearchTags(data[0]);
        renderSearchStickers(data[1]);
        renderGifs(data[2], "search");
        isSearchFetching = false;
    });  
}


window.addEventListener("hashchange",function(){
    init();
})

searchBtnEle.addEventListener("click",function(){
    changeHashSilently("#search?filter="+searchEle.value);
    if(!isSearchFetching){
        renderSearchItem();
    }
});

searchEle.addEventListener("keyup", function(event){
    if(event.key === "Enter"){
        event.preventDefault();
        searchBtnEle.click();
    }
    else{
        clearTimeout(timeout);
        timeout = setTimeout(function(){
            searchBtnEle.click();
        },1000);
    }
});
