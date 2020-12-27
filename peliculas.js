class Omdb {
    constructor(){
        this.commonUrl = "https://www.omdbapi.com/?apikey="
        this.apiKey = "6b9eb479";    
    }

    search(title,year,type,page){
        let titleWithSpace = title.replaceAll(" ", "+");   
        let url = `${this.commonUrl}${this.apiKey}&s=${titleWithSpace}`;
        if(year){
            const d = new Date();
            const yearNumber = Number(year);
            if(Number.isInteger(yearNumber)&&yearNumber>0&&year<=d.getFullYear()){
                console.log("Entro al if");
                url+=`&y=${year}`;
            }
        }
        if(type==="Series"||type==="Movie"||type==="Episode"||type==="Game"){
            url+= `&type="${type}`;
        }
        if(Number.isInteger(page)&&page>0){
            url+=`&page=${page}`;
        }
        return {
            promise: fetch(url),
            link: url
        };
    }
    searchElement(id){
        let url = this.commonUrl+this.apiKey+"&i="+id;
        return fetch(url);
    }
}

class SearchBarController{
    constructor(loadSearchPage){
        this.loadSearchPage = loadSearchPage;
        this.form = document.getElementById("form");
        this.formSubmitHandler = this.formSubmitHandler.bind(this);
        this.form.addEventListener("submit",this.formSubmitHandler);
        this.title = document.getElementById("title");
        this.year = document.getElementById("year");
        this.type = document.getElementById("type");
        this.selectedType = undefined;
        this.errorMessage = document.getElementById("error");
        this.titleField = document.getElementById("title");
        this.errorMessageTimeout = this.errorMessageTimeout.bind(this);
    }
    
    formSubmitHandler(e){
        e.preventDefault();
        this.selectedType = this.type[this.type.selectedIndex].value;
        if(this.title.value){
            this.loadSearchPage(true);
        }else{
            this.createErrorMessage("Type something in the \"Title\" field");
        }
    }
    createErrorMessage(message){
        this.errorMessage.innerHTML = `<span>${message}</span>`;
        this.errorMessage.style.visibility = "visible";
        this.title.classList.add("borderError");
        setTimeout(this.errorMessageTimeout,3000);
    }
    errorMessageTimeout(){
        this.errorMessage.style.visibility = "hidden";
        this.title.classList.remove("borderError");
    }
}

class Pagination {
    constructor(loadSearchPage, getFinalPage){
        this.loadSearchPage = loadSearchPage
        this.getFinalPage = getFinalPage;
        this.page = 1;
        this.pagination1 = document.getElementById("paging1");
        this.pagination2 = document.getElementById("paging2");
        this.pagingListener = this.pagingListener.bind(this);
        this.pagination1.addEventListener("click", this.pagingListener);
        this.pagination2.addEventListener("click", this.pagingListener); 
        this.showPaging = this.showPaging.bind(this);
        this.makePaging = this.makePaging.bind(this);
    }

    showPaging(topBottom,visible){
        if(topBottom===1&&visible){
            this.pagination1.style.visibility = "visible";
        }else if(topBottom===1&&!visible){
            this.pagination1.style.visibility = "hidden";
        }else if(topBottom===2&&visible){
            this.pagination2.style.visibility = "visible";
        }else if(topBottom===2&&!visible){
            this.pagination2.style.visibility = "hidden";
        }
    }

    makePaging(topBottom){
        let linkContainer;
        if(topBottom===1){
            linkContainer = this.pagination1;
        }
        else if(topBottom===2){
            linkContainer = this.pagination2;
        }
        if(linkContainer.style.visibility==="hidden"){
            linkContainer.style.visibility="visible"; 
        }
        if(linkContainer.innerHTML!==""){
            linkContainer.innerHTML = "";
        }
        let linkBackwards = document.createElement("div");
        let linkForward = document.createElement("div");
        
        linkForward.classList.add("forward");
        linkBackwards.classList.add("backwards");
        
        linkBackwards.innerText = "<<";
        linkForward.innerText = ">>";

        let pagingTen = Math.floor((this.page-1)/10)*10;

        linkContainer.appendChild(linkBackwards);
        for(let j=1+pagingTen;j<=10+pagingTen&&j<=this.getFinalPage();++j){
            let page = document.createElement("div");
            if(j===this.page){
                page.classList.add("selected-page");
            }
            page.classList.add("result-page");
            page.innerText = j;
            linkContainer.appendChild(page);
        }
        linkContainer.appendChild(linkForward);
    }

    pagingListener(e){
        this.finalPage = this.getFinalPage();
        const clicked = e.target;
        if((clicked.className==="forward"&&this.page<this.finalPage)||(clicked.className==="backwards"&&this.page!==1)
        ||(clicked.className==="result-page")){
            if(clicked.className==="forward"&&this.page<this.finalPage){
                ++this.page;
            }else if (clicked.className==="backwards"&&this.page!==1){
                --this.page;
            }else if (clicked.className==="result-page"){
                this.page = parseInt(clicked.innerText);
            }
            this.loadSearchPage(false);
        }
    }
}

class Results {
    constructor(createElement){   
        this.createElement = createElement;
        this.createResults = this.createResults.bind(this);
        this.results = document.getElementById("results");
        this.resultsClickHandler = this.resultsClickHandler.bind(this);
        this.results.addEventListener("click",this.resultsClickHandler);
        this.resultsLayer = document.getElementById("resultsLayer");
        this.body = document.getElementById("body");
        this.bodyMouseMoveHandler = this.bodyMouseMoveHandler.bind(this);
        this.body.addEventListener("mousemove", this.bodyMouseMoveHandler);
        this.tooltip;
        this.showResultsLayer = this.showResultsLayer.bind(this);
    }
    resultsClickHandler(e){
        if(e.target.className==="layer-link"){
            this.createElement(e);
        }
    }

    bodyMouseMoveHandler(e){
        if(e.target.className==="layer-link"){
            this.tooltip=e.target.firstChild;
            if(e.offsetX>20&&e.offsetX<141&&e.offsetY>20&&e.offsetY<41){
                this.tooltip.style.visibility = "visible";
            }else{
                this.tooltip.style.visibility = "hidden";
            }
        }else{
            if(this.tooltip!==undefined){
                if(this.tooltip.style.visibility==="visible"){
                this.tooltip.style.visibility = "hidden";
                }
            }
        }
    }

    showResultsLayer(show){
        if(show){
            this.resultsLayer.style.visibility = "visible";
        }else{
            this.resultsLayer.style.visibility = "hidden";
        }
    }

    createResults(data){
        const queryRes = data.Search;
        queryRes.forEach(movie => {              
            let container = document.createElement("div");
            let layerLink = document.createElement("div");
            let innerContainer = document.createElement("div");
            let info = document.createElement("div");
            let title = document.createElement("div");
            let year = document.createElement("div");
            let tooltip = document.createElement("div");
            container.classList.add("container");
            layerLink.classList.add("layer-link");
            innerContainer.classList.add("inner-container");
            info.classList.add("info");
            title.classList.add("title");
            year.classList.add("year");
            tooltip.classList.add("tooltip");
            if(movie.Title.length>30){
                title.innerText = movie.Title.substring(0,29)+"...";
            }else{
                title.innerText = movie.Title;
            }
            tooltip.innerText = movie.Title;
            year.innerText = movie.Year;
            info.appendChild(title);
            info.appendChild(year);
            let image = document.createElement("img");
            image.classList.add("list-image");
            layerLink.setAttribute("value", movie.imdbID);
            if(movie.Poster==="N/A"){
                image = document.createElement("div");
                image.classList.add("image-not-available");
                image.innerHTML = "<span>Image<br>not<br>available</span>";
            }else{
                image.setAttribute("src",movie.Poster);
            }
            innerContainer.appendChild(info);
            innerContainer.appendChild(image);
            container.appendChild(layerLink);
            container.appendChild(innerContainer);
            this.resultsLayer.appendChild(container);
            layerLink.appendChild(tooltip);
            image.onerror = this.imageResultsError;
        });
    }

    imageResultsError(e){
        let innerContainer = e.target.parentElement;
        innerContainer.removeChild(e.target);
        let image = document.createElement("div");
        image.classList.add("image-not-available");
        image.innerHTML = "<span>Image<br>not<br>available</span>";
        innerContainer.appendChild(image);
    }

    showMovieNotFound(){
        let movieNotFound = document.createElement("div");
        movieNotFound.classList.add("movie-not-found");
        movieNotFound.innerHTML = "<span>Not<br>Found</span>";
        this.resultsLayer.appendChild(movieNotFound);
    }
}

class Detail {
    constructor(linkBack,isFromSearch){
        this.isFromSearch = isFromSearch;
        this.linkBack = linkBack;
        this.detail = document.getElementById("detail");
        this.linkBackHandler = this.linkBackHandler.bind(this);
        this.detail.addEventListener("click",this.linkBackHandler);
        this.createElement = this.createElement.bind(this);
    }

    getContentId(){
        return document.querySelector(".element-container").getAttribute("id");
    }

    linkBackHandler(e){
        if(e.target.className==="link-back"){
            this.linkBack(true);
        }
    }


            
    createElement(data){
        window.scrollTo(0,0);
        let wraper = document.createElement("div");
        let elementContainer = document.createElement("div");
        let information = document.createElement("div");
        let elementImage = document.createElement("img");
        let elementImageNotAvailable = document.createElement("div");
        wraper.classList.add("wraper");
        elementContainer.classList.add("element-container");
        elementContainer.setAttribute("id", data.imdbID);
        information.classList.add("information");
        information.innerHTML = `
            <h2>${data.Title}</h2>
            <b>Year:</b> ${data.Year}<br>
            <b>Type:</b> ${data.Type}<br>
            <b>Genre:</b> ${data.Genre}<br>
            <b>Plot:</b> ${data.Plot}<br>
            <b>Director:</b> ${data.Director}<br>
            <b>Actors:</b> ${data.Actors}<br>
            <b>Awards:</b> ${data.Awards}<br>
            <b>Country:</b> ${data.Country}<br>
            `
        elementContainer.appendChild(information);
        if(data.Poster==="N/A"){
            elementImageNotAvailable.classList.add("element-image-not-available");
            elementImageNotAvailable.innerHTML = "<span>Image<br>not<br>available</span>";
            elementContainer.appendChild(elementImageNotAvailable);
        }else{
            elementImage.setAttribute("src",data.Poster);
            elementImage.classList.add("element-image");
            elementContainer.appendChild(elementImage);
            elementImage.onerror = function(){
                elementContainer.removeChild(elementImage);
                elementImageNotAvailable.classList.add("element-image-not-available");
                elementImageNotAvailable.innerHTML = "<span>Image<br>not<br>available</span>";
                elementContainer.appendChild(elementImageNotAvailable);
            }
        }
        if(this.detail.innerHTML!==""){
            this.detail.innerHTML = "";
        }
        this.detail.style.visibility = "visible";
        if(this.isFromSearch()){
            let linkBack = document.createElement("div");
            linkBack.innerText = "Back to Results";
            linkBack.classList.add("link-back");
            wraper.appendChild(linkBack);
        }
        wraper.appendChild(elementContainer);
        this.detail.appendChild(wraper);
    }
}

class UiController {
    constructor(instOmdb,queryString){
        this.form = document.getElementById("form");
        this.createElement = this.createElement.bind(this);
        this.searchResults = this.searchResults.bind(this);
        this.makeElement = this.makeElement.bind(this);
        this.showLoading = this.showLoading.bind(this);
        this.loading = document.getElementById("loading");

        this.title;
        this.type;
        this.year;
        this.finalPage;
        this.fromSearchUrl = true;
        this.originPageType;
        this.currentPageType;
        this.currentPageCode;
        this.previousToOriginCode;
        this.pageCodeTracker = [];
        this.DETAILTYPE = "Detail";
        this.SEARCHTYPE = "Search";

        this.getFinalPage = this.getFinalPage.bind(this);
        this.showResults = this.showResults.bind(this);
        this.createSearchFromURL = this.createSearchFromURL.bind(this);
        this.createElementFromURL = this.createElementFromURL.bind(this);
        this.loadSearchPage = this.loadSearchPage.bind(this);
        this.isFromSearch = this.isFromSearch.bind(this);
        this.popstateHandler = this.popstateHandler.bind(this);
        this.cleanScreen = this.cleanScreen.bind(this);
        this.updateNavigationState = this.updateNavigationState.bind(this);
        this.showDetail = this.showDetail.bind(this);
        this.removeDetail = this.removeDetail.bind(this);

        this.instOmdb = instOmdb;
        this.queryString = queryString;
        this.instSearchBar = new SearchBarController(this.loadSearchPage.bind(this));
        this.instPagination = new Pagination(this.loadSearchPage.bind(this),this.getFinalPage);
        this.instResults = new Results(this.createElement.bind(this));
        this.instDetail = new Detail(this.linkBack.bind(this),this.isFromSearch.bind(this));  
        
        if(this.queryString.includes("id=tt")){
            this.currentPageType = this.DETAILTYPE;
            this.createElementFromURL(this.queryString);
        }else if(this.queryString.includes("s=")){
            this.currentPageType = this.SEARCHTYPE;
            this.createSearchFromURL(this.queryString);
        }
        
        if(window.history.state===null){
            window.history.replaceState({pageCode: Date.now()},"",this.queryString);
        }
        window.addEventListener("popstate", this.popstateHandler);
    }

    popstateHandler(){
        const currentQueryString = window.location.search;
        this.updateNavigationState();
        if(this.currentPageType===this.DETAILTYPE){
            if(this.originPageType===this.SEARCHTYPE){
                if (this.instDetail.detail.innerHTML!==""){
                    const contentId = this.instDetail.getContentId();
                    if(contentId===window.history.state.id){    
                        this.showDetail(true);
                    }else{
                        this.createElementFromURL(currentQueryString);
                    }
                }else{
                    this.createElementFromURL(currentQueryString);
                }
            }
        }else if(this.currentPageType===this.SEARCHTYPE){
            if(this.originPageType===this.SEARCHTYPE||this.originPageType===undefined){
                this.createSearchFromURL(currentQueryString);
            }
            else if(this.originPageType===this.DETAILTYPE){
                if(this.previousToOriginCode===this.currentPageCode){
                    this.linkBack(false);
                }else{
                    this.createSearchFromURL(currentQueryString);
                }
            }
        }else{
            this.cleanScreen();
        }
    }

    updateNavigationState(){
        const currentQueryString = window.location.search;
        this.originPageType = this.currentPageType;
        this.currentPageCode = window.history.state.pageCode;
        this.pageCodeTracker.unshift(this.currentPageCode);
        this.previousToOriginCode = this.pageCodeTracker[2];
        this.pageCodeTracker.splice(3);
        if(currentQueryString.includes("tt")){
            this.currentPageType = this.DETAILTYPE
        }else if(currentQueryString.includes("s=")){
            this.currentPageType = this.SEARCHTYPE;
        }else{
            this.currentPageType = undefined;
        }
    }

    showDetail(visible){
        if(visible){
            this.instResults.resultsLayer.style.visibility = "hidden";
            this.instPagination.showPaging(1,false);
            this.instPagination.showPaging(2,false);
            this.instDetail.detail.style.visibility = "visible";
        }
        else{
            this.instResults.resultsLayer.style.visibility = "visible";
            this.instPagination.showPaging(1,true);
            this.instPagination.showPaging(2,true);
            this.instDetail.detail.style.visibility = "hidden";
        }
    }

    removeDetail(){
        this.instDetail.detail.innerHTML = "";
    }

    createSearchFromURL(urlSearchRaw){
        let urlSearch = urlSearchRaw.slice(1);
        let usp = new URLSearchParams(urlSearch);
        this.title = usp.get("s");
        if(usp.has("p")){
            const pageNumber = Number(usp.get("p"));
            if(typeof pageNumber==="number"){
                this.instPagination.page = pageNumber;
            }else{
                this.instPagination.page = 1;
            } 
        }
        
        if(usp.has("t")){
            this.type = usp.get("t");
        }
        if(usp.has("y")){
            this.year = usp.get("y");
        }
        this.searchResults();
    }

    createElement(e){
        const elementId = e.target.getAttribute("value");
        const elementSearchObject = {
            id: elementId,
            fromSearch: true
        };
        const usp = new URLSearchParams(elementSearchObject);
        const newCode = Date.now();
        window.history.pushState({pageCode: newCode, id:elementId},"", `?${usp.toString()}`);
        this.updateNavigationState();
        const elementResponse = this.instOmdb.searchElement(usp.get("id"));
        this.showElement(elementResponse);
    }

    createElementFromURL(urlSearchRaw){
        const urlSearch = urlSearchRaw.slice(1);
        const usp = new URLSearchParams(urlSearch);
        if(usp.get("fromSearch")){
            this.fromSearchUrl = true;
        }else{
            this.fromSearchUrl = false;
        }
        const elementResponse = this.instOmdb.searchElement(usp.get("id"));
        this.showElement(elementResponse);
    }

    showElement(res){
        this.instResults.showResultsLayer(false);
        this.instPagination.showPaging(1,false);
        this.instPagination.showPaging(2,false);
        this.showLoading(true);  
        res.then(function(resp){
            return resp.json();
        })
        .then(this.makeElement);
    }

    makeElement(data){
        if(data.Error){
            this.cleanScreen();
            this.instSearchBar.createErrorMessage("Incorrect Query String");
            return;
        }
        this.showLoading(false);
        this.instDetail.createElement(data);
    }

    linkBack(fromLinkBack){
        this.showDetail(false); 
        this.instPagination.pagination1.style.visibility = "visible";
        this.instPagination.pagination2.style.visibility = "visible";
        this.instResults.resultsLayer.style.visibility = "visible";
        if(fromLinkBack){
            window.history.back();
        }
    }

    isFromSearch(){
        return this.fromSearchUrl;
    }

    loadSearchPage(fromSearchBar){
        if(fromSearchBar){
            this.instPagination.page = 1;
            this.title = this.instSearchBar.title.value;
            this.year = this.instSearchBar.year.value;
            this.type = this.instSearchBar.selectedType
        }
        let urlParameters = {
            s: this.title,
            p: this.instPagination.page,
        };
        if(this.year !== ""&&this.year!==undefined){
            urlParameters.y = this.year;
        }
        if(this.type !== ""&&this.type!==undefined){
            urlParameters.t = this.type;
        }
        let usp = new URLSearchParams(urlParameters);

        const newCode = Date.now();
        window.history.pushState({pageCode: newCode},"", `?${usp.toString()}`);
        this.updateNavigationState();
        this.searchResults();
    }

    searchResults(){
        const resSearch = this.instOmdb.search(this.title,this.year,this.type,this.instPagination.page);
        this.showDetail(false);
        this.showLoading(true);
        this.instPagination.showPaging(1,false);
        this.instPagination.showPaging(2,false);
        if(this.instResults.resultsLayer.innerHTML!==""){
            this.instResults.resultsLayer.innerHTML="";
        }
        resSearch.promise.then(function(res){
            return res.json();
        })
        .then(this.showResults);
    }

    showResults(data){
        if(data.Error==="Movie not found!"){
            this.showLoading(false);
            this.instPagination.showPaging(1,false);
            this.instPagination.showPaging(2,false);
            this.instResults.showResultsLayer(true);
            this.instResults.showMovieNotFound();
        }else if(data.Error){
            this.cleanScreen();
            this.instSearchBar.createErrorMessage("Incorrect Query String");
            return;
        }else{
            this.finalPage = Math.ceil(data.totalResults/10);
            this.showLoading(false);
            this.showDetail(false);
            this.instResults.showResultsLayer(true);
            this.instPagination.makePaging(1);
            this.instResults.createResults(data);
            this.instPagination.makePaging(2);
        }
    }

    showLoading(show){
        if(show){
            this.loading.style.visibility = "visible";
        }else{
            this.loading.style.visibility = "hidden";
        }
    }   

    getFinalPage(){
        return this.finalPage;
    }

    cleanScreen(){
        this.instResults.resultsLayer.innerHTML = "";
        this.instDetail.detail.innerHTML = "";
        this.instPagination.showPaging(1,false);
        this.instPagination.showPaging(2,false);
        this.showLoading(false);
    }
}

window.onload = function(){
    const queryString = window.location.search

    let instOmdb;
    let ui; 

    instOmdb = new Omdb();
    ui = new UiController(instOmdb,queryString);
}
