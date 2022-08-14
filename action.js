var apiDomain = "https://tenor.googleapis.com";
var apiKey = "AIzaSyBKV66hMoCO9nD0lvEZOGDseK4Cw_pmGG4";

/** Request Handlers */

/**
 * 
 * @param {Url of the api} url 
 * @param {method of the api} method 
 * @param {payload of the api} payload 
 * @returns 
 */
function requestHandler(url, method){
    method = method || "GET";
    return fetch(url, {
        method
    }).then((res)=>{
        return res.json();
    })
}

/**
 * Fetch trending Gifs
 * @returns data of trending request.
 */
export function handleSearchTrendingGifs(){
    let url = apiDomain+"/v2/categories?key="+apiKey+"&type=trending";
    return requestHandler(url);
}
/**
 * 
 * @param {*} nextPos to give value to pos parameter
 * @returns data of trending Gifs.
 */
export function featuredGifsRequestHandler(nextPos){
    let limit = 50;
    let url = apiDomain+"/v2/featured?key="+apiKey+"&media_filter=gif&limit="+limit;
    if(nextPos){
        url = url + "&pos="+nextPos;
    }
    return requestHandler(url);
}
/**
 * 
 * @param {*} searchValue to give value to q parameter.
 * @returns data of searcherd sticker.
 */
export function stickersRequestHandler(searchValue){
    let limit = 50;
    let url = apiDomain+"/v2/search?key="+apiKey+"&q="+searchValue+"&searchfilter=sticker&media_filter=tinygif_transparent&limit="+limit;
    return requestHandler(url);
}
/**
 * 
 * @param {*} searchValue to give value to q parameter. 
 * @returns data of search suggestion topic.
 */
export function handleSearchSuggestion(searchValue){
    let url = apiDomain+"/v2/search_suggestions?key="+apiKey+"&q="+searchValue;
    return requestHandler(url);
}
/**
 * 
 * @param {*} searchValue searchValue to give value to q parameter. 
 * @param {*} nextPos to give value to pos parameter
 * @returns data of search related Gif.
 */
export function gifSearchRequestHandler(searchValue,nextPos){
    let limit = 50;
    let url = apiDomain+"/v2/search?key="+apiKey+"&q="+searchValue+"&media_filter=tinygif&limit="+limit;
    if(nextPos){
        url = url + "&pos="+nextPos;
    }
    return requestHandler(url);
}