import { handleSearchTrendingGifs } from "./action.js";
import { rootCS, rootElement } from "./index.js";

let trendingGifs = [], nextClickCount=1;
let trendingEle = document.getElementById("parentTenor");


/**
 * To move next data of trending Gif.
 */
 document.getElementById("nextTrendingGifs").addEventListener("click", function(){
    let newValue = parseInt(rootCS.getPropertyValue("--trendingLeft")) + (-100);
    rootElement.style.setProperty("--trendingLeft",newValue+"%");
    nextClickCount++;
    handleTrendyGifsPaginationUI();

});

/**
 * To move Previous data of trending Gif.
 */
document.getElementById("prevTrendingGifs").addEventListener("click", function(){
    let newValue = parseInt(rootCS.getPropertyValue("--trendingLeft")) + 100;
    rootElement.style.setProperty("--trendingLeft",newValue+"%");
    nextClickCount--;
    handleTrendyGifsPaginationUI();
});

export function fetchTrendingGifs(){
    return handleSearchTrendingGifs()
}

export function renderTrendyGifs(data){
    let tagElement="", trendId = 1;
    trendingGifs = data.tags || [];
    trendingGifs.forEach((gifInfo)=>{
        tagElement += constructTrendingGifElement(gifInfo.searchterm,gifInfo.image,trendId);
        trendId++;
    });
    trendingEle.insertAdjacentHTML("beforeend",tagElement);
}

/**
 * 
 * @param {*} imageName to constuct element with its name
 * @param {*} imageUrl to show image Gif
 * @returns element to append.
 */
 function constructTrendingGifElement(imageName,imageUrl,trendId){
    let divEle = "<div class='imageAlign' id='"+imageName+"' onclick='showSelectedTopic(this.id)'><img src='"+imageUrl+"' class='trendingGif'><div class='imgNameAlign'>"+imageName+"</div></div>";
    return divEle;
}


function handleTrendyGifsPaginationUI(){
    var nextButton = document.getElementById("nextTrendingGifs");
    var prevButton = document.getElementById("prevTrendingGifs");
    if(nextClickCount>1){
        prevButton.style.display="block";
    }
    else if(nextClickCount==1){
        prevButton.style.display="none";
    }
    if(nextClickCount===Math.ceil((trendingGifs.length/5))){
        nextButton.style.display="none";
    }
    else if(nextClickCount<Math.ceil((trendingGifs.length/5))){
        nextButton.style.display="block";
    }
}

/**
 * 
 * @param {*} elementId to get the input of searched value.
 */
 window.showSelectedTopic = function(searchGifName){
    let searchEle = document.getElementById("searchInput");
    let searchBtnEle = document.getElementById("searchBtn");
    searchEle.value= searchGifName;
    searchBtnEle.click();
}