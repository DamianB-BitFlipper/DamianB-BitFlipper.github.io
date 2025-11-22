import React, { Component } from 'react';
import $ from 'jquery';

export class Settings extends Component {
    constructor() {
        super();
        this.state = {
            active_tab: "background",
            navbar: false,
        }
    }

    changeTab = (tab) => {
        this.setState({ active_tab: tab });
    }

    render() {
        return (
            <div className="w-full flex-grow z-20 max-h-full overflow-hidden flex bg-ub-cool-grey text-white select-none relative">
                <div className="md:flex hidden flex-col w-1/4 md:w-1/5 text-sm overflow-y-auto windowMainScreen border-r border-black">
                    <div onClick={() => this.changeTab("background")} className={(this.state.active_tab === "background" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-full rounded-none cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                        <span className="ml-1 md:ml-2 text-gray-50">Background</span>
                    </div>
                    <div onClick={() => this.changeTab("about")} className={(this.state.active_tab === "about" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-full rounded-none cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                        <span className="ml-1 md:ml-2 text-gray-50">About OS</span>
                    </div>
                </div>
                <div onClick={() => this.setState({ navbar: !this.state.navbar })} className="md:hidden flex flex-col items-center justify-center absolute bg-ub-cool-grey rounded w-6 h-6 top-1 left-1">
                    <div className=" w-3.5 border-t border-white"></div>
                    <div className=" w-3.5 border-t border-white" style={{ marginTop: "2pt", marginBottom: "2pt" }}></div>
                    <div className=" w-3.5 border-t border-white"></div>
                    <div className={(this.state.navbar ? " visible animateShow z-30 " : " invisible ") + " md:hidden text-xs absolute bg-ub-cool-grey py-0.5 px-1 rounded-sm top-full mt-1 left-0 shadow border-black border border-opacity-20"}>
                        <div onClick={() => this.changeTab("background")} className={(this.state.active_tab === "background" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-full rounded-none cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                            <span className="ml-1 md:ml-2 text-gray-50">Background</span>
                        </div>
                        <div onClick={() => this.changeTab("about")} className={(this.state.active_tab === "about" ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-full rounded-none cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                            <span className="ml-1 md:ml-2 text-gray-50">About OS</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-3/4 md:w-4/5 justify-start items-center flex-grow bg-ub-grey overflow-y-auto windowMainScreen">
                    {this.state.active_tab === "background" ? <Background changeBackgroundImage={this.props.changeBackgroundImage} currBgImgName={this.props.currBgImgName} /> : <AboutOS />}
                </div>
            </div>
        );
    }
}

function Background(props) {
    const wallpapers = {
        "wall-1": "./themes/wallpapers/wall-1.webp",
        "wall-2": "./themes/wallpapers/wall-2.webp",
        "wall-3": "./themes/wallpapers/wall-3.webp",
        "wall-4": "./themes/wallpapers/wall-4.webp",
        "wall-5": "./themes/wallpapers/wall-5.webp",
        "wall-6": "./themes/wallpapers/wall-6.webp",
        "wall-7": "./themes/wallpapers/wall-7.webp",
        "wall-8": "./themes/wallpapers/wall-8.webp",
    };

    let changeBackgroundImage = (e) => {
        props.changeBackgroundImage($(e.target).data("path"));
    }

    return (
        <div className="w-full h-full flex flex-col">
            <div className="md:w-2/5 w-2/3 h-1/3 m-auto my-4" style={{ backgroundImage: `url(${wallpapers[props.currBgImgName]})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center center" }}>
            </div>
            <div className="flex flex-wrap justify-center items-center border-t border-gray-900 w-full pb-10">
                {
                    Object.keys(wallpapers).map((name, index) => {
                        return (
                            <div key={index} tabIndex="1" onFocus={changeBackgroundImage} data-path={name} className={((name === props.currBgImgName) ? " border-yellow-700 " : " border-transparent ") + " md:px-28 md:py-20 md:m-4 m-2 px-14 py-10 outline-none border-4 border-opacity-80"} style={{ backgroundImage: `url(${wallpapers[name]})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center center" }}></div>
                        );
                    })
                }
            </div>
        </div>
    )
}

function AboutOS() {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center text-center p-4 bg-ub-cool-grey">
             <img src="./themes/system_icons/about.svg" alt="Ubuntu Logo" className="w-24 h-24 mb-4" />
             <div className="text-2xl font-bold mb-2 text-white">Ubuntu 20.04 LTS</div>
             <div className="text-lg mb-6 text-gray-300">Web Simulation</div>
             
             <div className="bg-white bg-opacity-10 rounded-lg p-6 shadow-lg border border-white border-opacity-10 w-3/4 md:w-1/2">
                 <div className="text-base text-gray-200 mb-4">
                    This project is a personal portfolio styled as Ubuntu.
                 </div>
                 <div className="text-base text-gray-200 font-bold">
                    Ubuntu UI Theme by
                 </div>
                 <a href="https://github.com/vivek9patel/vivek9patel.github.io" target="_blank" rel="noreferrer" className="text-xl text-ub-orange hover:underline mt-2 block font-bold">
                    Vivek Patel
                 </a>
             </div>
        </div>
    )
}

export default Settings;

export const displaySettings = (openApp) => {
    return <Settings> </Settings>;
}
