import { handleSearchTrendingGifs } from "./action.js";
import { rootElement } from "./index.js";

let trendingGifs = [];
let trendingEle = document.getElementById("parentTenor");
let direction;

/**
 * To move next data of trending Gif.
 */
 document.getElementById("nextTrendingGifs").addEventListener("click", function(){
    direction = -1;
    document.getElementById("tenor").style.justifyContent = 'flex-start';
    rootElement.style.setProperty("--trendingLeft","-10%");

});

/**
 * To move Previous data of trending Gif.
 */
document.getElementById("prevTrendingGifs").addEventListener("click", function(){
    if(direction === -1){
        direction = 1;
        trendingEle.appendChild(trendingEle.firstElementChild);
    }
    document.getElementById("tenor").style.justifyContent = 'flex-end';
    rootElement.style.setProperty("--trendingLeft","10%");
});

trendingEle.addEventListener("transitionend", function(){
    if(direction === 1){
        trendingEle.prepend(trendingEle.lastElementChild);
    }
    else{
        trendingEle.appendChild(trendingEle.firstElementChild);
    }
    trendingEle.style.transition = 'none';
    rootElement.style.setProperty("--trendingLeft","0%");
    setTimeout(() =>{
        trendingEle.style.transition = 'all 0.5s linear';
    });

},false);

export function fetchTrendingGifs(){
    return handleSearchTrendingGifs()
}

export function renderTrendyGifs(data){
    let tagElement="";
    trendingGifs = data.tags || [];
    for(let i=0;i<(trendingGifs.length)/5;i++){
        let num = i*5;
        tagElement+=constructParentToTrendingGif(trendingGifs.slice(num,(5+num)));
    }
    
    trendingEle.insertAdjacentHTML("beforeend",tagElement);
}

function constructParentToTrendingGif(trendingGifs){
    let parentEle = "<div class='tenorDiv'>";
    trendingGifs.forEach((gifInfo)=>{
        parentEle += constructTrendingGifElement(gifInfo.searchterm,gifInfo.image);
    });
    parentEle+="</div>";
    
    return parentEle;
}

/**
 * 
 * @param {*} imageName to constuct element with its name
 * @param {*} imageUrl to show image Gif
 * @returns element to append.
 */
 function constructTrendingGifElement(imageName,imageUrl){
    let divEle = "<div class='imageAlign' id='"+imageName+"' onclick='showSelectedTopic(this.id)'><img src='"+imageUrl+"' class='trendingGif'><div class='imgNameAlign'>"+imageName+"</div></div>";
    return divEle;
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