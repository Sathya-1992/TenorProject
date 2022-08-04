
let apiDomain = "https://tenor.googleapis.com";
let apiKey = "AIzaSyBKV66hMoCO9nD0lvEZOGDseK4Cw_pmGG4";
var trendingEle;
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
var searchValue;
var colors = ["rgb(166, 179, 139)","rgb(139, 152, 179)","rgb(152, 139, 179)","rgb(139, 179, 152)","rgb(139, 166, 179)","rgb(179, 179, 139)","rgb(179, 139, 179)","rgb(152, 139, 179)"]
var trendId = 1;

window.onload = async function(){
    let trendingGifs = await handleSearchTrendingGifs();
    renderTrendyGifs(trendingGifs);
};

function handleSearchTrendingGifs(){
    let url = apiDomain+"/v2/categories?key="+apiKey+"&type=trending";
    return fetch(url).then(function(res){
        return res.json();
    });
}

function renderTrendyGifs(data){
    trendingEle = document.getElementById("parentTenor");
    tags = data.tags || [];
    tags.forEach((tagInfo)=>{
        appendTagInfo(trendingEle,tagInfo.searchterm,tagInfo.image);
    })
}

function appendTagInfo(parentEle,imageName,imageUrl){
    let divEle = document.createElement("div");
    divEle.classList.add("imageAlign");
    divEle.id = "trend"+trendId;
    divEle.setAttribute("onclick","showSelectedTopic(this.id)");
    let imageEle = document.createElement("img");
    imageEle.setAttribute("src",imageUrl);
    imageEle.classList.add("trendingGif");
    let nameEle = document.createElement("div");
    nameEle.classList.add("imgNameAlign");
    let name = document.createTextNode(imageName);
    nameEle.appendChild(name);
    divEle.appendChild(imageEle);
    divEle.appendChild(nameEle);
    parentEle.appendChild(divEle);
    trendId++;
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
    updateButtonDisplay();
}

function movePreviousTrendingGifs(){
    getLeftValue();
    let newValue = leftValue + parentWidth;
    root.style.setProperty("--trendingLeft",newValue);
    nextClickCount--;
    updateButtonDisplay();
}

function updateButtonDisplay(){
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
    document.getElementById("searchBtn").click();
}

renderSearchItem = async function(){
    homePageEle.style.display = "none";
    searchPageEle.style.display = "grid";
    let searchSuggestion = await handleSearchSuggestion();
    let stickers = await handleSearchStickers();
    renderSearchSuggestion(searchSuggestion);
    renderSearchStickers(stickers);
}

function handleSearchSuggestion(){
    searchValue = searchEle.value;
    let url = apiDomain+"/v2/search_suggestions?key="+apiKey+"&q="+searchValue;
    return fetch(url).then(function(res){
        return res.json();
    });
}
  
function renderSearchSuggestion(data){
    let headerEle = document.querySelector(".headerTags");
    headerEle.innerHTML="";
    let headerValue = changeUpperCase();
    document.getElementById("heading").textContent = headerValue;
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

function changeUpperCase(){
    const words = searchValue.split(" ");
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    return words.join(" ");
}

function getRandomNumber(min,max){
    let index = Math.floor(Math.random() * (max - min) + min);
    return index;
}

function handleSearchStickers(){

}

function renderSearchStickers(data){

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
      document.getElementById("searchBtn").click();
    }
  });
