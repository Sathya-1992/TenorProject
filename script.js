
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
var stickerDetails
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
var searchValue;
var colors = ["rgb(166, 179, 139)","rgb(139, 152, 179)","rgb(152, 139, 179)","rgb(139, 179, 152)","rgb(139, 166, 179)","rgb(179, 179, 139)","rgb(179, 139, 179)","rgb(152, 139, 179)"]
var trendId = 1;

window.onload = async function(){
    let trendingGifs = await handleSearchTrendingGifs();
    let featuredGifs = await featuredGifsRequestHandler(0);
    let featuredGifNext = featuredGifs.next;
    renderTrendyGifs(trendingGifs);
    renderFeaturedGifs(featuredGifs,"start");
};

/** Request Handlers */
function handleSearchTrendingGifs(){
    let url = apiDomain+"/v2/categories?key="+apiKey+"&type=trending";
    return fetch(url).then(function(res){
        return res.json();
    });
}

function featuredGifsRequestHandler(nextPos){
    let url = apiDomain+"/v2/featured?key="+apiKey+"&media_filter=gif";
    if(nextPos){
        url = url + "&pos="+nextPos;
    }
    return fetch(url).then(function(res){
        return res.json();
    });
}

function stickersRequestHandler(searchValue){
    let limit = 50;
    let url = apiDomain+"/v2/search?key="+apiKey+"&q="+searchValue+"&searchfilter=sticker&media_filter=tinygif_transparent&limit="+limit;
    return fetch(url).then(function(res){
        return res.json();
    });
}

function handleSearchSuggestion(searchValue){
    let url = apiDomain+"/v2/search_suggestions?key="+apiKey+"&q="+searchValue;
    return fetch(url).then(function(res){
        return res.json();
    });
}

function gifSearchRequestHandler(searchValue){
    let limit = 50;
    let url = apiDomain+"/v2/search?key="+apiKey+"&q="+searchValue+"&media_filter=tinygif&limit="+limit;
    return fetch(url).then(function(res){
        return res.json();
    });
}

function renderTrendyGifs(data){
    trendingEle = document.getElementById("parentTenor");
    tags = data.tags || [];
    tags.forEach((tagInfo)=>{
        let tagElement = constructTagElement(tagInfo.searchterm,tagInfo.image)
        trendingEle.appendChild(tagElement);
    })
}

function renderFeaturedGifs(data,process){
    if(process==="start"){
        featuredGifElements = document.getElementsByClassName("column");
    }
    else if(process==="search"){
        featuredGifElements = document.getElementsByClassName("searchColumn");
        for(let i=0;i<featuredGifElements.length;i++){
            featuredGifElements[i].innerHTML="";
        }
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

function constructFeaturedGifElement(gifUrl,gifTags){
    let divEle = document.createElement("div");
    let imgEle = document.createElement("img");
    let ulEle = document.createElement("ul");

    divEle.classList.add("featureAlign");

    imgEle.classList.add("featuredGif");
    imgEle.setAttribute("src",gifUrl);

    divEle.appendChild(imgEle);

    return divEle;
}

function getTrendingWidthValue(){
    parentWidth = trendingEle.offsetWidth;
    leftValue = parseInt(rootCS.getPropertyValue("--trendingLeft"));
}

function moveNextTrendingGifs(){
    getTrendingWidthValue();
    let newValue = leftValue - parentWidth;
    root.style.setProperty("--trendingLeft",newValue);
    nextClickCount++;
    handleTrendyGifsPaginationUI();
}

function movePreviousTrendingGifs(){
    getTrendingWidthValue();
    let newValue = leftValue + parentWidth;
    root.style.setProperty("--trendingLeft",newValue);
    nextClickCount--;
    handleTrendyGifsPaginationUI();
}

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

function showSelectedTopic(elementId){
    let searchName = document.getElementById(elementId).lastChild.textContent;
    searchEle.value= searchName;
    searchBtnEle.click();
}

renderSearchItem = async function(){
    homePageEle.style.display = "none";
    searchPageEle.style.display = "grid";
    searchValue = searchEle.value;
    let searchSuggestion = await handleSearchSuggestion(searchValue);
    let stickers = await stickersRequestHandler(searchValue);
    let searchGifs = await gifSearchRequestHandler(searchValue);
    renderSearchSuggestion(searchSuggestion);
    renderSearchStickers(stickers);
    renderFeaturedGifs(searchGifs,"search");
    
}

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

function getRandomNumber(min,max){
    let index = Math.floor(Math.random() * (max - min) + min);
    return index;
}

function showStickersForSelectedTopic(searchTopic){
    searchEle.value= searchTopic;
    searchBtnEle.click();
}

function renderSearchStickers(data){
    stickerEle = document.getElementById("stickerData");
    stickerEle.innerHTML="";
    stickerDetails = data.results || [];
    if(stickerDetails){
        document.getElementById("stickerHeading").textContent="Stickers";
        stickerDetails.forEach((stickerInfo)=>{
            let stickerChildEle = constructStickerElement(stickerInfo.media_formats.tinygif_transparent.url,stickerInfo.tags);
            stickerEle.appendChild(stickerChildEle);
        })
    }
}

function constructStickerElement(imageUrl,tagNames){
    let divEle = document.createElement("div");
    let imgEle = document.createElement("img");

    divEle.classList.add("stickerAlign")
    imgEle.setAttribute("src",imageUrl);
    imgEle.classList.add("stickerImg");
    
    divEle.appendChild(imgEle);
    if(tagNames){
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
        divEle.appendChild(ulEle);
    }

    return divEle;
}

// function rendersearchGifs(data){
//     stickerEle = document.getElementById("stickerData");
//     stickerEle.innerHTML="";
//     stickerDetails = data.results || [];
//     if(stickerDetails){
//         document.getElementById("stickerHeading").textContent="Stickers";
//         stickerDetails.forEach((stickerInfo)=>{
//             let stickerChildEle = constructStickerElement(stickerInfo.media_formats.tinygif_transparent.url,stickerInfo.tags);
//             stickerEle.appendChild(stickerChildEle);
//         })
//     }
// }

function showSelectedStickersAndGifs(selectedTag){
    searchEle.value= selectedTag;
    searchBtnEle.click();
}

function getStickerWidthValue(){
    stickerParentWidth = stickerEle.offsetWidth;
    stickerLeftValue = parseInt(rootCS.getPropertyValue("--stickerLeft"));
}

function moveNextStickers(){
    getStickerWidthValue();
    let newValue = stickerLeftValue - stickerParentWidth;
    root.style.setProperty("--stickerLeft",newValue);
    stickerNextClickCount++;
    handleStickersPaginationUI();
}

function movePreviousStickers(){
    getStickerWidthValue();
    let newValue = stickerLeftValue + stickerParentWidth;
    root.style.setProperty("--stickerLeft",newValue);
    stickerNextClickCount--;
    handleStickersPaginationUI();
}

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

// const containerElement = document.getElementById('container');
//     const navElement = document.getElementsByTagName("nav")[0];

//     containerElement.addEventListener("scroll", function(event){
    
//         let containerScrollTop = event.target.scrollTop;
//         let navElementHeight = navElement.offsetHeight;
        
//         if(containerScrollTop > navElementHeight){
                // root.style.setProperty("--inputPosition","30rem");
//         } else{
                    // root.style.setProperty("--inputPosition","0");
//         }
//     });

searchEle.addEventListener("keypress",function(event){
    if(event.key === "Enter"){
      event.preventDefault();
      searchBtnEle.click();
    }
  });
