import { handleSearchSuggestion, stickersRequestHandler } from "./action.js";
import { constructHashTags, getRandomNumber } from "./commonUtils.js";
import { rootCS, rootElement } from "./index.js";


let searchEle = document.getElementById("searchInput");
let stickersList = [], stickerNextClickCount=1;

export function fetchSearchTags(searchValue){
    return handleSearchSuggestion(searchValue)
}


/**
 * 
 * @param {*} data to render the sticker suggestion topic.
 */
export function renderSearchTags(data){
    let headerEle = document.querySelector(".headerTags");
    let searchSuggestionChild = "";
    headerEle.innerHTML="";
    document.getElementById("heading").textContent = searchEle.value;
    let names = data.results || [];
    names.forEach((name) => {
        searchSuggestionChild += constructSearchSuggestionElement(name);
    });
    headerEle.insertAdjacentHTML("beforeend",searchSuggestionChild);
}
/**
 * 
 * @param {*} value to show the search related topic.
 * @returns element to append with search suggestion topic.
 */
function constructSearchSuggestionElement(value){
    let colors = ["rgb(166, 179, 139)","rgb(139, 152, 179)","rgb(152, 139, 179)","rgb(139, 179, 152)","rgb(139, 166, 179)","rgb(179, 179, 139)","rgb(179, 139, 179)","rgb(152, 139, 179)"]
    let index = getRandomNumber(0,colors.length);
    let listEle = "<li class='listAlign' id='"+value+"' onclick='showStickersForSelectedTopic(this.id)' style='background-color:"+colors[index]+";'>"+value+"</li>"
    return listEle;
}

/**
 * 
 * @param {*} searchTopic to search based on this topic
 */
 window.showStickersForSelectedTopic = function(searchTopic){
    searchEle.value= searchTopic;

    let searchBtnEle = document.getElementById("searchBtn");
    searchBtnEle.click();
}

export function fetchSearchStickers(searchValue){
    return stickersRequestHandler(searchValue)
}

export function renderSearchStickers(data){
    var stickerEle = document.getElementById("stickerData");
    stickerEle.innerHTML="";
    stickersList = data.results || [];
    if(stickersList.length){
        let stickerChildEle="";
        document.getElementById("showStickers").style.display="grid";
        document.getElementById("stickerHeading").textContent="Stickers";
        if(stickersList.length>5){
            document.querySelector(".buttons").style.display = "flex";
        }
        else{
            document.querySelector(".buttons").style.display = "none";
        }
        stickersList.forEach((stickerInfo)=>{
            stickerChildEle += constructStickerElement(stickerInfo.media_formats.tinygif_transparent.url,stickerInfo.tags);
        });
        stickerEle.insertAdjacentHTML("beforeend",stickerChildEle);
        rootElement.style.setProperty("--stickerLeft","0%");
        stickerNextClickCount = 1;
        handleStickersPaginationUI();
    }
    else{
        document.getElementById("showStickers").style.display = "none";
    }
}

/**
 * 
 * @param {*} imageUrl to show the stickers
 * @param {*} tagNames to show related topic of Sticker.
 * @returns element to append Stickers.
 */
 function constructStickerElement(imageUrl,tagNames){
    let ulElement="";
    if(tagNames){
        ulElement = constructHashTags(tagNames);
    }
    let divEle = "<div class='stickerAlign'><img src='"+imageUrl+"' class='stickerImg'>"+ulElement+"</div>"

    return divEle;
}

/**
 * To handle next and previous button of Stickers.
 */
 export function handleStickersPaginationUI(){
    var stickerPrevButton = document.getElementById("prevSticker");
    var stickerNextButton = document.getElementById("nextSticker");
    if(stickerNextClickCount>1){
        stickerPrevButton.style.pointerEvents="all";
        stickerPrevButton.style.opacity ="1";
    }
    else if(stickerNextClickCount==1){
        stickerPrevButton.style.pointerEvents="none";
        stickerPrevButton.style.opacity ="0.3";
    }
    if(stickerNextClickCount===Math.ceil((stickersList.length/5))){
        stickerNextButton.style.pointerEvents="none";
        stickerNextButton.style.opacity ="0.3";
    }
    else if(stickerNextClickCount<Math.ceil((stickersList.length/5))){
        stickerNextButton.style.pointerEvents="all";
        stickerNextButton.style.opacity ="1";
    }
}


/**
 * To move next data of searched Stickers.
 */
 document.getElementById("nextSticker").addEventListener("click", function(){
    let newValue = parseInt(rootCS.getPropertyValue("--stickerLeft")) + (-100);
    rootElement.style.setProperty("--stickerLeft",newValue+"%");
    stickerNextClickCount++;
    handleStickersPaginationUI();
});
 
/**
 * To move previous data of searched stickers.
 */
document.getElementById("prevSticker").addEventListener("click", function(){
    let newValue = parseInt(rootCS.getPropertyValue("--stickerLeft")) + 100;
    rootElement.style.setProperty("--stickerLeft",newValue+"%");
    stickerNextClickCount--;
    handleStickersPaginationUI();
});

/**
 * 
 * @param {*} selectedTag to search related Sticker ang Gifs
 */
 window.showSelectedStickersAndGifs = function(selectedTag){
    searchEle.value= selectedTag;
    let searchBtnEle = document.getElementById("searchBtn");
    searchBtnEle.click();
}
