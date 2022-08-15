import { rootElement } from "./index.js";
import { featuredGifsRequestHandler, gifSearchRequestHandler } from "./action.js";
import { constructHashTags } from "./commonUtils.js";

let featuredGifsFetchPosition = 0, searchGifsFetchPosition=0, gifsList = [], displayGifsFrom = 0, isFetchingGifs=false;

let gifParentIndex = 0;

export function fetchFeaturedGifs(){
    return featuredGifsRequestHandler(featuredGifsFetchPosition);
}

export function fetchSearchGifs(searchValue){
    return gifSearchRequestHandler(searchValue, searchGifsFetchPosition);
}
/**
 * 
 * @param {*} data 
 * @param {type of the rendering list featred/search} type 
 */
export function renderGifs(data, type){
    if(type === "featured"){
        featuredGifsFetchPosition = data.next;
    }else if(type === "search"){
        searchGifsFetchPosition = data.next;
    }
    gifsList = data.results || [];
    displayGifsFrom = 0;
    insertGifsElements(type);
}

function insertGifsElements(type){
    let gifChildEle = "";
    document.getElementById("gifs").textContent="GIFs";
    gifsList.slice(displayGifsFrom,displayGifsFrom+25).forEach((gifInfo) => {
        if(type==="featured"){
            featuredGifElements = document.getElementsByClassName("column");
            gifChildEle = constructFeaturedGifElement(gifInfo.media_formats.gif.url,gifInfo.tags);
        }
        else if(type==="search"){
            featuredGifElements = document.getElementsByClassName("searchColumn");
            gifChildEle = constructFeaturedGifElement(gifInfo.media_formats.tinygif.url,gifInfo.tags);
        }
        if(gifParentIndex>(featuredGifElements.length-1)){
            gifParentIndex=0;
        }
        var parentColumnEle = featuredGifElements[gifParentIndex];
        parentColumnEle.insertAdjacentHTML("beforeend",gifChildEle);
        gifParentIndex++; 
    });
}

/**
 * 
 * @param {*} gifUrl to show Gif image.
 * @param {*} gifTags to show the text related with image
 * @returns element to append with related topic.
 */
 function constructFeaturedGifElement(gifUrl,gifTags){
    let ulElement = "";
    if(gifTags){
        ulElement = constructHashTags(gifTags);
    }

    let divEle = "<div class='featureAlign'><img src='"+gifUrl+"' class='featuredGif'>"+ulElement+"</div>";
    return divEle;
}

/**
 * OnScroll Functions
 */
let containerElement = document.getElementById('container');
containerElement.addEventListener("scroll", function(event){
    let searchEle = document.getElementById("searchInput");
    let isSearch = searchEle.value.length ? true : false;

    let containerScrollTop = event.target.scrollTop;
    let navElementHeight = document.getElementsByTagName("nav")[0].offsetHeight;
    let scrollValue = containerElement.scrollHeight-containerElement.clientHeight-200;
    if(containerScrollTop > navElementHeight){
        rootElement.style.setProperty("--inputPosition","9rem");
    } 
    else{
        rootElement.style.setProperty("--inputPosition","0");
    }

    if(containerScrollTop >= scrollValue && !isFetchingGifs){
        if(isSearch){
            if(displayGifsFrom === 0){
                displayGifsFrom = 25;
                insertGifsElements("search", true);
            }
            else{
                isFetchingGifs = true;
                gifSearchRequestHandler(searchEle.value, searchGifsFetchPosition).then((res)=>{
                    searchGifsFetchPosition = res.next;
                    isFetchingGifs = false;
                    renderGifs(res, "search");
                });
            }
        }else{
            if(displayGifsFrom === 0){
                displayGifsFrom = 25;
                insertGifsElements("featured", true);
            }
            else{
                isFetchingGifs = true;
                featuredGifsRequestHandler(featuredGifsFetchPosition).then((res)=>{
                    featuredGifsFetchPosition = res.next;
                    isFetchingGifs = false;
                    renderGifs(res, "featured");
                });
            }  
        } 
    }
    
});