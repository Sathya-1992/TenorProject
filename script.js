
var apiDomain = "https://tenor.googleapis.com";
var apiKey = "AIzaSyBKV66hMoCO9nD0lvEZOGDseK4Cw_pmGG4";
var trendingEle;
var stickerEle;
var root = document.documentElement;
var rootCS = getComputedStyle(root);
var parentWidth;
var leftValue;
var tags;
var nextClickCount = 1;
var previousClickCount;
var nextButton = document.querySelector(".nextButton");
var prevButton = document.querySelector(".prevButton");
var searchEle = document.getElementById("searchInput");
var homePageEle = document.getElementById("homePage");
var searchPageEle =document.getElementById("searchPage");
var searchBtnEle = document.getElementById("searchBtn");
var searchValue;
var colors = ["rgb(166, 179, 139)","rgb(139, 152, 179)","rgb(152, 139, 179)","rgb(139, 179, 152)","rgb(139, 166, 179)","rgb(179, 179, 139)","rgb(179, 139, 179)","rgb(152, 139, 179)"]
var trendId = 1;

window.onload = async function(){
    let trendingGifs = await handleSearchTrendingGifs();
    let featuredGifs = await featuredGifsRequestHandler(0);
    let featuredGifNext = featuredGifs.next;
    renderTrendyGifs(trendingGifs);
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
    let limit = 20;
    let url = apiDomain+"/v2/search?key="+apiKey+"&q="+searchValue+"&searchfilter=sticker&media_filter=tinygif_transparent&limit="+limit;
    return fetch(url).then(function(res){
        return res.json();
    });
}

function gifSearchRequestHandler(searchValue){
    let limit = 20;
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

function getLeftValue(){
    parentWidth = trendingEle.offsetWidth;
    leftValue = parseInt(rootCS.getPropertyValue("--trendingLeft"));
}

function moveNextTrendingGifs(){
    getLeftValue();
    let newValue = leftValue - parentWidth;
    root.style.setProperty("--trendingLeft",newValue);
    nextClickCount++;
    handleTrendyGifsPaginationUI();
}

function movePreviousTrendingGifs(){
    getLeftValue();
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
    if(nextClickCount===(tags.length/5)){
        nextButton.style.display="none";
    }
    else if(nextClickCount<(tags.length/5)){
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
    renderSearchSuggestion(searchSuggestion);
    renderSearchStickers(stickers);
}

function handleSearchSuggestion(searchValue){
    let url = apiDomain+"/v2/search_suggestions?key="+apiKey+"&q="+searchValue;
    return fetch(url).then(function(res){
        return res.json();
    });
}
  
function renderSearchSuggestion(data){
    let headerEle = document.querySelector(".headerTags");
    headerEle.innerHTML="";
    document.getElementById("heading").textContent = searchValue;
    let names = data.results || [];
    names.forEach((name) => {
        appendSearchRelatedInfo(headerEle,name);
    })
}


function appendSearchRelatedInfo(parentEle,value){
    let listEle = document.createElement("li");
    let index = getRandomNumber(0,colors.length);
    listEle.style.backgroundColor = colors[index];
    listEle.classList.add("listAlign");
    let listName = document.createTextNode(value);
    listEle.appendChild(listName);
    parentEle.appendChild(listEle);
}

function getRandomNumber(min,max){
    let index = Math.floor(Math.random() * (max - min) + min);
    return index;
}

function renderSearchStickers(data){
    stickerEle = document.getElementById("stickerData");
    let stickerDetails = data.results || [];
    if(stickerDetails){
        document.getElementById("stickerHeading").textContent="Stickers";
        stickerDetails.forEach((stickerInfo)=>{
            let stickerUrl = stickerInfo.media_formats.tinygif_transparent.url;
            let stickerChildEle = constructStickerElement(stickerUrl);
            stickerEle.appendChild(stickerChildEle);
        })
    }
}

function constructStickerElement(imageUrl){
    let divEle = document.createElement("div");
    let imgEle = document.createElement("img");

    divEle.classList.add("stickerAlign")
    imgEle.setAttribute("src",imageUrl);
    imgEle.classList.add("stickerImg");

    divEle.appendChild(imgEle);
    return divEle;
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
