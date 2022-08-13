var apiDomain = "https://tenor.googleapis.com";
var apiKey = "AIzaSyBKV66hMoCO9nD0lvEZOGDseK4Cw_pmGG4";
var root = document.documentElement;
var rootCS = getComputedStyle(root);
var tags;
var stickerDetails;
var nextClickCount = 1;
var stickerNextClickCount = 1;
var trendingEle = document.getElementById("parentTenor");
var searchEle = document.getElementById("searchInput");
var searchBtnEle = document.getElementById("searchBtn");
var containerElement = document.getElementById('container');
var searchValue;
var featuredGifNext;
var searchFeaturedGifNext;
var renderSearchGif;
var featuredGifElements;
var nextFeatGif;
var startValue;
var featuredGifTags;
var isFetchNextGif=false;
var gifParentIndex = 0;
var timeout;

/**
 * To render all trending tenor anf Gifs.
 */
window.onload = function(){

    let trendingGif = handleSearchTrendingGifs();
    let featuredGif = featuredGifsRequestHandler(0);
    Promise.all([trendingGif,featuredGif]).then((data) =>{
        renderTrendyGifs(data[0]);
        featuredGifNext = data[1].next;
        renderFeaturedGifs(data[1],"start");
    });

    containerElement.addEventListener("scroll", function(event){
        let containerScrollTop = event.target.scrollTop;
        let navElementHeight = document.getElementsByTagName("nav")[0].offsetHeight;
        let scrollValue = containerElement.scrollHeight-containerElement.clientHeight-300;
        if(containerScrollTop > navElementHeight){
            root.style.setProperty("--inputPosition","9rem");
        } 
        else{
            root.style.setProperty("--inputPosition","0");
        }

        if(containerScrollTop >= scrollValue && !isFetchNextGif){
            isFetchNextGif = true;
            if(renderSearchGif){
                if(startValue === 0){
                    startValue = 25;
                    addFeaturedGifToParent("search");
                }
                else{
                    fetchNextSearchFeatureRequest();
                }
            }
            else if(nextFeatGif){
                if(startValue === 0){
                    startValue = 25;
                    addFeaturedGifToParent("start");
                }
                else{
                    fetchNextFeaturedRequest();
                }  
            } 
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
    let limit = 50;
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
    let limit = 50;
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
    let tagElement="";
    let trendId = 1;
    tags = data.tags || [];
    tags.forEach((tagInfo)=>{
        tagElement += constructTagElement(tagInfo.searchterm,tagInfo.image,trendId);
        trendId++;
    });
    trendingEle.insertAdjacentHTML("beforeend",tagElement);
}
/**
 * 
 * @param {*} data to render featured and searched Gifs
 * @param {*} process to identify featured Gif or searched Gif for rendering Process.
 */
function renderFeaturedGifs(data,process){
    if(process==="start"){
        featuredGifElements = document.getElementsByClassName("column");
        nextFeatGif = true;
    }
    else if(process==="search"){
        featuredGifElements = document.getElementsByClassName("searchColumn");
        renderSearchGif = true;
    }
    featuredGifTags = data.results || [];
    if(featuredGifTags){
        startValue = 0;
        addFeaturedGifToParent(process);
    }
}

function addFeaturedGifToParent(process){
    let gifChildEle = "";
    document.getElementById("gifs").textContent="GIFs";
    featuredGifTags.slice(startValue,startValue+25).forEach((gifInfo) => {
        if(process==="start"){
            gifChildEle = constructFeaturedGifElement(gifInfo.media_formats.gif.url,gifInfo.tags);
        }
        else if(process==="search"){
            gifChildEle = constructFeaturedGifElement(gifInfo.media_formats.tinygif.url,gifInfo.tags);
        }
        if(gifParentIndex>(featuredGifElements.length-1)){
            gifParentIndex=0;
        }
        var parentColumnEle = featuredGifElements[gifParentIndex];
        parentColumnEle.insertAdjacentHTML("beforeend",gifChildEle);
        gifParentIndex++; 
    });
    isFetchNextGif = false;
}
/**
 * 
 * @param {*} imageName to constuct element with its name
 * @param {*} imageUrl to show image Gif
 * @returns element to append.
 */
function constructTagElement(imageName,imageUrl,trendId){
    let divEle = "<div class='imageAlign' id='trend"+trendId+"' onclick=showSelectedTopic(this.id)><img src='"+imageUrl+"' class='trendingGif'><div class='imgNameAlign'>"+imageName+"</div></div>";
    return divEle;
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
 * To get next value from Json Data and render the data.
 */
fetchNextFeaturedRequest = async function(){
    let nextFeaturedGifs = await featuredGifsRequestHandler(featuredGifNext);
    featuredGifNext = nextFeaturedGifs.next;
    renderFeaturedGifs(nextFeaturedGifs,"start");
    isFetchNextGif = false;
}
/**
 * To get next value from searched Json data and render the next data.
 */
fetchNextSearchFeatureRequest = async function(){
    let nextSearchFeaturedGifs = await gifSearchRequestHandler(searchValue,searchFeaturedGifNext);
    searchFeaturedGifNext = nextSearchFeaturedGifs.next;
    renderFeaturedGifs(nextSearchFeaturedGifs,"search"); 
    isFetchNextGif = false;
}

/**
 * To handle next and previous button UI.
 */
function handleTrendyGifsPaginationUI(){
    var nextButton = document.getElementById("nextGif");
    var prevButton = document.getElementById("prevGif");
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
renderSearchItem = function(){
    nextFeatGif = false;
    if(featuredGifElements){
        for(let i=0;i<featuredGifElements.length;i++){
            featuredGifElements[i].innerHTML="";
        }
    }  
    document.getElementById("homePage").style.display = "none";
    document.getElementById("searchPage").style.display = "grid";
    searchValue = searchEle.value;
    renderSearchGif = false;

    let searchSuggestion = handleSearchSuggestion(searchValue);
    let stickers = stickersRequestHandler(searchValue);
    let searchGifs = gifSearchRequestHandler(searchValue,0);

    Promise.all([searchSuggestion,stickers,searchGifs]).then((data) =>{
        renderSearchSuggestion(data[0]);
        renderSearchStickers(data[1]);
        searchFeaturedGifNext = data[2].next;
        renderFeaturedGifs(data[2],"search");
    });  
}
/**
 * 
 * @param {*} data to render the sticker suggestion topic.
 */
function renderSearchSuggestion(data){
    let headerEle = document.querySelector(".headerTags");
    let searchSuggestionChild = "";
    headerEle.innerHTML="";
    document.getElementById("heading").textContent = searchValue;
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
    var stickerEle = document.getElementById("stickerData");
    stickerEle.innerHTML="";
    stickerDetails = data.results || [];
    if(stickerDetails.length){
        let stickerChildEle="";
        document.getElementById("showStickers").style.display="grid";
        document.getElementById("stickerHeading").textContent="Stickers";
        if(stickerDetails.length>5){
            document.querySelector(".buttons").style.display = "flex";
        }
        else{
            document.querySelector(".buttons").style.display = "none";
        }
        stickerDetails.forEach((stickerInfo)=>{
            stickerChildEle += constructStickerElement(stickerInfo.media_formats.tinygif_transparent.url,stickerInfo.tags);
        });
        stickerEle.insertAdjacentHTML("beforeend",stickerChildEle);
        root.style.setProperty("--stickerLeft","0%");
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
 * 
 * @param {*} tagNames to show hash tags of related Gifs
 * @returns element to append with Image
 */
function constructHashTags(tagNames){
    let liEle="";
    tagNames.forEach((tag) =>{
        liEle += "<li class='tagList' id='"+tag+"' onclick='showSelectedStickersAndGifs(this.id)'>#"+tag+"</li>"
    });
    let ulEle = "<ul class='tagsParent'>"+liEle+"</ul>"
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
 * To handle next and previous button of Stickers.
 */
function handleStickersPaginationUI(){
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
    if(stickerNextClickCount===Math.ceil((stickerDetails.length/5))){
        stickerNextButton.style.pointerEvents="none";
        stickerNextButton.style.opacity ="0.3";
    }
    else if(stickerNextClickCount<Math.ceil((stickerDetails.length/5))){
        stickerNextButton.style.pointerEvents="all";
        stickerNextButton.style.opacity ="1";
    }
}

searchBtnEle.addEventListener("click",renderSearchItem);

searchEle.addEventListener("keypress",function(event){
    if(event.key === "Enter"){
      event.preventDefault();
      searchBtnEle.click();
    }
});

searchEle.addEventListener("keyup", function(event){
    clearTimeout(timeout);
    timeout = setTimeout(function(){
        searchBtnEle.click();
    },1000);
});

/**
 * To move next data of trending Gif.
 */
document.getElementById("nextGif").addEventListener("click", function(){
    let newValue = parseInt(rootCS.getPropertyValue("--trendingLeft")) + (-100);
    root.style.setProperty("--trendingLeft",newValue+"%");
    nextClickCount++;
    handleTrendyGifsPaginationUI();

});

/**
 * To move Previous data of trending Gif.
 */
document.getElementById("prevGif").addEventListener("click", function(){
    let newValue = parseInt(rootCS.getPropertyValue("--trendingLeft")) + 100;
    root.style.setProperty("--trendingLeft",newValue+"%");
    nextClickCount--;
    handleTrendyGifsPaginationUI();
});

/**
 * To move next data of searched Stickers.
 */
document.getElementById("nextSticker").addEventListener("click", function(){
    let newValue = parseInt(rootCS.getPropertyValue("--stickerLeft")) + (-100);
    root.style.setProperty("--stickerLeft",newValue+"%");
    stickerNextClickCount++;
    handleStickersPaginationUI();
});
 
/**
 * To move previous data of searched stickers.
 */
document.getElementById("prevSticker").addEventListener("click", function(){
    let newValue = parseInt(rootCS.getPropertyValue("--stickerLeft")) + 100;
    root.style.setProperty("--stickerLeft",newValue+"%");
    stickerNextClickCount--;
    handleStickersPaginationUI();
});
