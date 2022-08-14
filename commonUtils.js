export function getRandomNumber(min,max){
    let index = Math.floor(Math.random() * (max - min) + min);
    return index;
}

export function changeHash(newHash){
    window.location.hash = newHash;
}

export function constructHashTags(tagNames){
    let liEle="";
    tagNames.forEach((tag) =>{
        liEle += "<li class='tagList' id='"+tag+"' onclick='showSelectedStickersAndGifs(this.id)'>#"+tag+"</li>"
    });
    let ulEle = "<ul class='tagsParent'>"+liEle+"</ul>"
    return ulEle;
}