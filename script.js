
var apiDomain = "https://tenor.googleapis.com";
var apiKey = "AIzaSyBKV66hMoCO9nD0lvEZOGDseK4Cw_pmGG4";
var trendingEle;
var stickerEle;
var featuredGifEle;
var parentColumnEle;
var root = document.documentElement;
var rootCS = getComputedStyle(root);
var parentWidth;
var stickerParentWidth;
var leftValue;
var stickerLeftValue;
var tags;
var stickerDetails;
var nextClickCount = 1;
var stickerNextClickCount = 1;
var previousClickCount;
var nextButton = document.querySelector(".nextButton");
var prevButton = document.querySelector(".prevButton");
var searchEle = document.getElementById("searchInput");
var homePageEle = document.getElementById("homePage");
var searchPageEle =document.getElementById("searchPage");
var searchBtnEle = document.getElementById("searchBtn");
var stickerPrevButton = document.querySelector(".prevSticker");
var stickerNextButton = document.querySelector(".nextSticker");
var showStickers = document.getElementById("showStickers");
var stickerMoveButton = document.querySelector(".buttons");
var containerElement = document.getElementById('container');
var navElement = document.getElementsByTagName("nav")[0];
var searchValue;
var colors = ["rgb(166, 179, 139)","rgb(139, 152, 179)","rgb(152, 139, 179)","rgb(139, 179, 152)","rgb(139, 166, 179)","rgb(179, 179, 139)","rgb(179, 139, 179)","rgb(152, 139, 179)"]
var trendId = 1;
var featuredGifNext;
var searchFeaturedGifNext;
var renderSearchGif;
var featuredGifElements;

/**
 * To render all trending tenor anf Gifs.
 */
window.onload = async function(){
    let trendingGifs = await handleSearchTrendingGifs();
    let featuredGifs = await featuredGifsRequestHandler(0);
    featuredGifNext = featuredGifs.next;
    renderTrendyGifs(trendingGifs);
    renderFeaturedGifs(featuredGifs,"start");

    containerElement.addEventListener("scroll", function(event){
        let containerScrollTop = event.target.scrollTop;
        let navElementHeight = navElement.offsetHeight;
        if(containerScrollTop > navElementHeight){
            root.style.setProperty("--inputPosition","9rem");
        } 
        else{
            root.style.setProperty("--inputPosition","0");
        }
        if((containerScrollTop+containerElement.clientHeight) >= containerElement.scrollHeight){
            if(renderSearchGif){
                fetchNextSearchFeatureRequest();
            }
            else{
                fetchNextFeaturedRequest();
            }     
        }
        else{
            
        }
    });
};

/** Request Handlers */
/**
 * Fetch trending Gifs
 * @returns data of trending request.
 */
function handleSearchTrendingGifs(){
    let url = apiDomain+"/v2/categories?key="+apiKey+"&type=trending";
    return fetch(url).then(function(res){
        return res.json();
    });
}
/**
 * 
 * @param {*} nextPos to give value to pos parameter
 * @returns data of trending Gifs.
 */
function featuredGifsRequestHandler(nextPos){
    let limit = 20;
    let url = apiDomain+"/v2/featured?key="+apiKey+"&media_filter=gif&limit="+limit;
    if(nextPos){
        url = url + "&pos="+nextPos;
    }
    return fetch(url).then(function(res){
        return res.json();
    });
}
/**
 * 
 * @param {*} searchValue to give value to q parameter.
 * @returns data of searcherd sticker.
 */
function stickersRequestHandler(searchValue){
    let limit = 50;
    let url = apiDomain+"/v2/search?key="+apiKey+"&q="+searchValue+"&searchfilter=sticker&media_filter=tinygif_transparent&limit="+limit;
    return fetch(url).then(function(res){
        return res.json();
    });
}
/**
 * 
 * @param {*} searchValue to give value to q parameter. 
 * @returns data of search suggestion topic.
 */
function handleSearchSuggestion(searchValue){
    let url = apiDomain+"/v2/search_suggestions?key="+apiKey+"&q="+searchValue;
    return fetch(url).then(function(res){
        return res.json();
    });
}
/**
 * 
 * @param {*} searchValue searchValue to give value to q parameter. 
 * @param {*} nextPos to give value to pos parameter
 * @returns data of search related Gif.
 */
function gifSearchRequestHandler(searchValue,nextPos){
    let limit = 20;
    let url = apiDomain+"/v2/search?key="+apiKey+"&q="+searchValue+"&media_filter=tinygif&limit="+limit;
    if(nextPos){
        url = url + "&pos="+nextPos;
    }
    return fetch(url).then(function(res){
        return res.json();
    });
}
/**
 * 
 * @param {*} data to render trending Gifs
 */
function renderTrendyGifs(data){
    trendingEle = document.getElementById("parentTenor");
    tags = data.tags || [];
    tags.forEach((tagInfo)=>{
        let tagElement = constructTagElement(tagInfo.searchterm,tagInfo.image)
        trendingEle.appendChild(tagElement);
    })
}
/**
 * 
 * @param {*} data to render featured and searched Gifs
 * @param {*} process to identify featured Gif or searched Gif for rendering Process.
 */
function renderFeaturedGifs(data,process){
    if(process==="start"){
        featuredGifElements = document.getElementsByClassName("column");
    }
    else if(process==="search"){
        featuredGifElements = document.getElementsByClassName("searchColumn");
    }
    let featuredGifTags = data.results || [];
    let index = 0;
    let gifChildEle;
    if(featuredGifTags){
        document.getElementById("gifs").textContent="GIFs"
        featuredGifTags.forEach((gifInfo) => {
            if(process==="start"){
                gifChildEle = constructFeaturedGifElement(gifInfo.media_formats.gif.url,gifInfo.tags);
            }
            else if(process==="search"){
                gifChildEle = constructFeaturedGifElement(gifInfo.media_formats.tinygif.url,gifInfo.tags);
            }
            if(index>(featuredGifElements.length-1)){
                index=0;
            }
            parentColumnEle = featuredGifElements[index];
            parentColumnEle.appendChild(gifChildEle);
            index++; 
        })
    }
}
/**
 * 
 * @param {*} imageName to constuct element with its name
 * @param {*} imageUrl to show image Gif
 * @returns element to append.
 */
function constructTagElement(imageName,imageUrl){
    let divEle = document.createElement("div");
    let imageEle = document.createElement("img");
    let nameEle = document.createElement("div");

    divEle.classList.add("imageAlign");
    divEle.id = "trend"+trendId;
    divEle.setAttribute("onclick","showSelectedTopic(this.id)");
    
    imageEle.setAttribute("src",imageUrl);
    imageEle.classList.add("trendingGif");
    nameEle.classList.add("imgNameAlign");
    
    let name = document.createTextNode(imageName);
    nameEle.appendChild(name);
    
    divEle.appendChild(imageEle);
    divEle.appendChild(nameEle);
    
    trendId++;
    return divEle;
}
/**
 * 
 * @param {*} gifUrl to show Gif image.
 * @param {*} gifTags to show the text related with image
 * @returns element to append with related topic.
 */
function constructFeaturedGifElement(gifUrl,gifTags){
    let divEle = document.createElement("div");
    let imgEle = document.createElement("img");

    divEle.classList.add("featureAlign");
    imgEle.classList.add("featuredGif");
    imgEle.setAttribute("src",gifUrl);

    divEle.appendChild(imgEle);

    if(gifTags){
        let ulElement = constructHashTags(gifTags);
        divEle.appendChild(ulElement);
    }
    return divEle;
}
/**
 * To get next value from Json Data and render the data.
 */
fetchNextFeaturedRequest = async function(){
    let nextFeaturedGifs = await featuredGifsRequestHandler(featuredGifNext);
    featuredGifNext = nextFeaturedGifs.next;
    renderFeaturedGifs(nextFeaturedGifs,"start");
}
/**
 * To get next value from searched Json data and render the next data.
 */
fetchNextSearchFeatureRequest = async function(){
    let nextSearchFeaturedGifs = await gifSearchRequestHandler(searchValue,searchFeaturedGifNext);
    searchFeaturedGifNext = nextSearchFeaturedGifs.next;
    renderFeaturedGifs(nextSearchFeaturedGifs,"search"); 
}
/**
 * To get width of trending Gif for carousel.
 */
function getTrendingWidthValue(){
    parentWidth = trendingEle.offsetWidth;
    leftValue = parseInt(rootCS.getPropertyValue("--trendingLeft"));
}
/**
 * To move next data of trending Gif.
 */
function moveNextTrendingGifs(){
    getTrendingWidthValue();
    let newValue = leftValue - parentWidth;
    root.style.setProperty("--trendingLeft",newValue);
    nextClickCount++;
    handleTrendyGifsPaginationUI();
}
/**
 * To move Previous data of trending Gif.
 */
function movePreviousTrendingGifs(){
    getTrendingWidthValue();
    let newValue = leftValue + parentWidth;
    root.style.setProperty("--trendingLeft",newValue);
    nextClickCount--;
    handleTrendyGifsPaginationUI();
}
/**
 * To handle next and previous button UI.
 */
function handleTrendyGifsPaginationUI(){
    if(nextClickCount>1){
        prevButton.style.display="block";
    }
    else if(nextClickCount==1){
        prevButton.style.display="none";
    }
    if(nextClickCount===Math.ceil((tags.length/5))){
        nextButton.style.display="none";
    }
    else if(nextClickCount<Math.ceil((tags.length/5))){
        nextButton.style.display="block";
    }
}
/**
 * 
 * @param {*} elementId to get the input of searched value.
 */
function showSelectedTopic(elementId){
    let searchName = document.getElementById(elementId).lastChild.textContent;
    searchEle.value= searchName;
    searchBtnEle.click();
}
/**
 * To render the Search related Stickers and Gifs.
 */
renderSearchItem = async function(){
    if(featuredGifElements){
        for(let i=0;i<featuredGifElements.length;i++){
            featuredGifElements[i].innerHTML="";
        }
    }  
    homePageEle.style.display = "none";
    searchPageEle.style.display = "grid";
    searchValue = searchEle.value;
    renderSearchGif = true;
    let searchSuggestion = await handleSearchSuggestion(searchValue);
    let stickers = await stickersRequestHandler(searchValue);
    let searchGifs = await gifSearchRequestHandler(searchValue,0);
    searchFeaturedGifNext = searchGifs.next;
    renderSearchSuggestion(searchSuggestion);
    renderSearchStickers(stickers);
    renderFeaturedGifs(searchGifs,"search");  
}
/**
 * 
 * @param {*} data to render the sticker suggestion topic.
 */
function renderSearchSuggestion(data){
    let headerEle = document.querySelector(".headerTags");
    headerEle.innerHTML="";
    document.getElementById("heading").textContent = searchValue;
    let names = data.results || [];
    names.forEach((name) => {
        let searchSuggestionChild = constructSearchSuggestionElement(name);
        headerEle.appendChild(searchSuggestionChild);
    })
}
/**
 * 
 * @param {*} value to show the search related topic.
 * @returns element to append with search suggestion topic.
 */
function constructSearchSuggestionElement(value){
    let listEle = document.createElement("li");
    let index = getRandomNumber(0,colors.length);
    listEle.style.backgroundColor = colors[index];
    listEle.classList.add("listAlign");
    listEle.id = value;
    listEle.setAttribute("onclick","showStickersForSelectedTopic(this.id)");
    let listName = document.createTextNode(value);
    listEle.appendChild(listName);
    return listEle;
}
/**
 * 
 * @param {*} min to get random number greater than min value.
 * @param {*} max to get random number within max value
 * @returns random value to get random color.
 */
function getRandomNumber(min,max){
    let index = Math.floor(Math.random() * (max - min) + min);
    return index;
}
/**
 * 
 * @param {*} searchTopic to search based on this topic
 */
function showStickersForSelectedTopic(searchTopic){
    searchEle.value= searchTopic;
    searchBtnEle.click();
}
/**
 * 
 * @param {*} data to render search related stickers.
 */
function renderSearchStickers(data){
    stickerEle = document.getElementById("stickerData");
    stickerEle.innerHTML="";
    stickerDetails = data.results || [];
    if(stickerDetails.length){
        showStickers.style.display="grid";
        document.getElementById("stickerHeading").textContent="Stickers";
        if(stickerDetails.length>5){
            stickerMoveButton.style.display = "flex";
        }
        else{
            stickerMoveButton.style.display = "none";
        }
        stickerDetails.forEach((stickerInfo)=>{
            let stickerChildEle = constructStickerElement(stickerInfo.media_formats.tinygif_transparent.url,stickerInfo.tags);
            stickerEle.appendChild(stickerChildEle);
        })
    }
    else{
        showStickers.style.display = "none";
    }
}
/**
 * 
 * @param {*} imageUrl to show the stickers
 * @param {*} tagNames to show related topic of Sticker.
 * @returns element to append Stickers.
 */
function constructStickerElement(imageUrl,tagNames){
    let divEle = document.createElement("div");
    let imgEle = document.createElement("img");

    divEle.classList.add("stickerAlign")
    imgEle.setAttribute("src",imageUrl);
    imgEle.classList.add("stickerImg");
    
    divEle.appendChild(imgEle);
    if(tagNames){
        let ulElement = constructHashTags(tagNames);
        divEle.appendChild(ulElement);
    }

    return divEle;
}
/**
 * 
 * @param {*} tagNames to show hash tags of related Gifs
 * @returns element to append with Image
 */
function constructHashTags(tagNames){
    let ulEle = document.createElement("ul");
        ulEle.classList.add("tagsParent");
        tagNames.forEach((tag) => {
            let liEle = document.createElement("li");
            liEle.classList.add("tagList");
            liEle.id=tag;
            liEle.setAttribute("onclick","showSelectedStickersAndGifs(this.id)");
            let liText = document.createTextNode("#"+tag);
            liEle.appendChild(liText);
            ulEle.appendChild(liEle);
        })
        return ulEle;
}
/**
 * 
 * @param {*} selectedTag to search related Sticker ang Gifs
 */
function showSelectedStickersAndGifs(selectedTag){
    searchEle.value= selectedTag;
    searchBtnEle.click();
}
/**
 * To get Sticker element width value for carousel.
 */
function getStickerWidthValue(){
    stickerParentWidth = stickerEle.offsetWidth;
    stickerLeftValue = parseInt(rootCS.getPropertyValue("--stickerLeft"));
}
/**
 * To move next data of searched Stickers.
 */
function moveNextStickers(){
    getStickerWidthValue();
    let newValue = stickerLeftValue - stickerParentWidth;
    root.style.setProperty("--stickerLeft",newValue);
    stickerNextClickCount++;
    handleStickersPaginationUI();
}
/**
 * To move previous data of searched stickers.
 */
function movePreviousStickers(){
    getStickerWidthValue();
    let newValue = stickerLeftValue + stickerParentWidth;
    root.style.setProperty("--stickerLeft",newValue);
    stickerNextClickCount--;
    handleStickersPaginationUI();
}
/**
 * To handle next and previous button of Stickers.
 */
function handleStickersPaginationUI(){
    if(stickerNextClickCount>1){
        stickerPrevButton.style.pointerEvents="all";
        stickerPrevButton.style.opacity ="1";
    }
    else if(stickerNextClickCount==1){
        stickerPrevButton.style.pointerEvents="none";
        stickerPrevButton.style.opacity ="0.3";
    }
    if(stickerNextClickCount===Math.ceil((stickerDetails.length/5))){
        stickerNextButton.style.pointerEvents="none";
        stickerNextButton.style.opacity ="0.3";
    }
    else if(stickerNextClickCount<Math.ceil((stickerDetails.length/5))){
        stickerNextButton.style.pointerEvents="all";
        stickerNextButton.style.opacity ="1";
    }
}

searchEle.addEventListener("keypress",function(event){
    if(event.key === "Enter"){
      event.preventDefault();
      searchBtnEle.click();
    }
});
