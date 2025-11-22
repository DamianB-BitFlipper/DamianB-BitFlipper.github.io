import React, { Component } from 'react';

export class Firefox extends Component {
    constructor() {
        super();
        this.home_url = 'https://www.wikipedia.org/';
        this.state = {
            url: 'https://www.wikipedia.org/',
            display_url: "https://www.wikipedia.org",
        }
    }

    componentDidMount() {
        let lastVisitedUrl = localStorage.getItem("firefox-url");
        let lastDisplayedUrl = localStorage.getItem("firefox-display-url");
        if (lastVisitedUrl !== null && lastVisitedUrl !== undefined) {
            this.setState({ url: lastVisitedUrl, display_url: lastDisplayedUrl }, this.refreshFirefox);
        }
    }

    storeVisitedUrl = (url, display_url) => {
        localStorage.setItem("firefox-url", url);
        localStorage.setItem("firefox-display-url", display_url);
    }

    refreshFirefox = () => {
        document.getElementById("firefox-screen").src += '';
    }

    goToHome = () => {
        this.setState({ url: this.home_url, display_url: "https://www.wikipedia.org" });
        this.refreshFirefox();
    }

    checkKey = (e) => {
        if (e.key === "Enter") {
            let url = e.target.value;
            let display_url = "";

            url = url.trim();
            if (url.length === 0) return;

            if (url.indexOf("http://") !== 0 && url.indexOf("https://") !== 0) {
                url = "https://" + url;
            }

            url = encodeURI(url);
            display_url = url;
            if (url.includes("google.com")) { // 😅
                url = 'https://www.google.com/webhp?igu=1';
                display_url = "https://www.google.com";
            }
            this.setState({ url, display_url: url });
            this.storeVisitedUrl(url, display_url);
            document.getElementById("firefox-url-bar").blur();
        }
    }

    handleDisplayUrl = (e) => {
        this.setState({ display_url: e.target.value });
    }

    handleBookmarkClick = (url, display_url) => {
        this.setState({ url, display_url });
        this.storeVisitedUrl(url, display_url);
    }

    displayUrlBar = () => {
        return (
            <div className="w-full pt-0.5 pb-1 flex justify-start items-center text-white text-sm border-b border-gray-900">
                <div onClick={this.refreshFirefox} className=" ml-2 mr-1 flex justify-center items-center rounded-full bg-gray-50 bg-opacity-0 hover:bg-opacity-10">
                    <img className="w-5" src="./themes/system_icons/chrome_refresh.svg" alt="Ubuntu Firefox Refresh" />
                </div>
                <div onClick={this.goToHome} className=" mr-2 ml-1 flex justify-center items-center rounded-full bg-gray-50 bg-opacity-0 hover:bg-opacity-10">
                    <img className="w-5" src="./themes/system_icons/chrome_home.svg" alt="Ubuntu Firefox Home" />
                </div>
                <input onKeyDown={this.checkKey} onChange={this.handleDisplayUrl} value={this.state.display_url} id="firefox-url-bar" className="outline-none bg-ub-grey rounded-full pl-3 py-0.5 mr-3 w-5/6 text-gray-300 focus:text-white" type="url" spellCheck={false} autoComplete="off" />
            </div>
        );
    }

    displayBookmarks = () => {
        const bookmarks = [
            { name: 'Wikipedia', url: 'https://www.wikipedia.org/', display: 'https://www.wikipedia.org/' },
            { name: 'Google', url: 'https://www.google.com/webhp?igu=1', display: 'https://www.google.com' },
            { name: 'OpenStreetMap', url: 'https://www.openstreetmap.org/export/embed.html?bbox=-71.09902024269105%2C42.35640332139344%2C-71.08593106269838%2C42.36264255914027&amp;layer=mapnik', display: 'https://www.openstreetmap.org/?#map=17/42.359523/-71.092476' },
            { name: 'MathWorld', url: 'https://mathworld.wolfram.com/', display: 'https://mathworld.wolfram.com/' },
            { name: 'YouTube', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1', display: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
            { name: 'StopJava', url: 'https://stopjava.com/', display: 'https://stopjava.com/' },
        ];

        return (
            <div className="w-full flex justify-start items-center text-white text-xs py-1 border-b border-gray-900 pl-2">
                {bookmarks.map((bookmark, index) => (
                    <div key={index} onClick={() => this.handleBookmarkClick(bookmark.url, bookmark.display)} className="cursor-pointer hover:bg-ub-grey px-2 py-1 rounded mr-1">
                        {bookmark.name}
                    </div>
                ))}
            </div>
        );
    }

    render() {
        return (
            <div className="h-full w-full flex flex-col bg-ub-cool-grey">
                {this.displayUrlBar()}
                {this.displayBookmarks()}
                <iframe src={this.state.url} className="flex-grow" id="firefox-screen" frameBorder="0" title="Ubuntu Firefox Url"></iframe>
            </div>
        )
    }
}

export default Firefox

export const displayFirefox = (openApp) => {
    return <Firefox> </Firefox>;
}
