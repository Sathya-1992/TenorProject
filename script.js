
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

renderSearchItem = async function(){
    let searchSuggestion = await handleSearchSuggestion();
    renderSearchSuggestion(searchSuggestion);
}

function handleSearchSuggestion(){
    let searchTerm = document.getElementById("searchInput").value;
    let url = apiDomain+"/v2/search_suggestions?key="+apiKey+"&q="+searchTerm;
    return fetch(url).then(function(res){
        return res.json();
    });
}
  
function renderSearchSuggestion(data){
    let names = data.results || [];
    names.forEach((name) => {
        console.log(name);
    })
}

// const containerElement = document.getElementById('container');
//     const navElement = document.getElementsByTagName("nav")[0];

//     containerElement.addEventListener("scroll", function(event){
    
//         let containerScrollTop = event.target.scrollTop;
//         let navElementHeight = navElement.offsetHeight;
        
//         if(containerScrollTop > navElementHeight){
//         } else{

//         }
//     });
