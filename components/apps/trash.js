import React, { Component } from 'react';
import $ from 'jquery';

export class Trash extends Component {
    constructor() {
        super();
        this.trashItems = [
            {
                name: "php",
                icon: "./themes/system_icons/php.png"
            },
            {
                name: "Angular.js",
                icon: "./themes/system_icons/js.png"
            },
            {
                name: "Code.java",
                icon: "./themes/system_icons/java.png"
            },
            {
                name: "Windows.exe",
                icon: "./themes/system_icons/windows.png"
            },
            {
                name: "node_modules",
                icon: "./themes/system_icons/folder.png"
            },

            {
                name: "abandoned project",
                icon: "./themes/system_icons/folder.png"
            },
            {
                name: "Old Assignment.zip",
                icon: "./themes/system_icons/zip.png"
            },
            {
                name: "project final",
                icon: "./themes/system_icons/folder.png"
            },
            {
                name: "project ultra-final",
                icon: "./themes/system_icons/folder.png"
            },

        ];
        this.state = {
            empty: false,
        }
    }

    componentDidMount() {
        // get user preference from local-storage
        let wasEmpty = localStorage.getItem("trash-empty");
        if (wasEmpty !== null && wasEmpty !== undefined) {
            if (wasEmpty === "true") this.setState({ empty: true });
        }
    }

    focusFile = (e) => {
        // icon
        $(e.target).children().get(0).classList.toggle("opacity-60");
        // file name
        $(e.target).children().get(1).classList.toggle("bg-ub-orange");
    }

    emptyTrash = () => {
        this.setState({ empty: true });
        localStorage.setItem("trash-empty", true);
    };

    restoreTrash = () => {
        this.setState({ empty: false });
        localStorage.setItem("trash-empty", false);
    };

    emptyScreen = () => {
        return (
            <div className="flex-grow flex flex-col justify-center items-center">
                <img className=" w-24" src="./themes/system_icons/user-trash-symbolic.svg" alt="Ubuntu Trash" />
                <span className="font-bold mt-4 text-xl px-1 text-gray-400">Trash is Empty</span>
            </div>
        );
    }

    showTrashItems = () => {
        return (
            <div className="flex-grow ml-4 flex flex-wrap items-start content-start justify-start overflow-y-auto windowMainScreen">
                {
                    this.trashItems.map((item, index) => {
                        return (
                            <div key={index} tabIndex="1" onFocus={this.focusFile} onBlur={this.focusFile} className="flex flex-col items-center text-sm outline-none w-16 my-2 mx-4">
                                <div className="w-16 h-16 flex items-center justify-center">
                                    <img src={item.icon} alt="Ubuntu File Icons" />
                                </div>
                                <span className="text-center rounded px-0.5">{item.name}</span>
                            </div>
                        )
                    })
                }
            </div>
        );
    }

    render() {
        return (
            <div className="w-full h-full flex flex-col bg-ub-cool-grey text-white select-none">
                <div className="flex items-center justify-between w-full bg-ub-warm-grey bg-opacity-40 text-sm">
                    <span className="font-bold ml-2">Trash</span>
                    <div className="flex">
                        <div onClick={this.restoreTrash} className="border border-black bg-black bg-opacity-50 px-3 py-1 my-1 mx-1 rounded hover:bg-opacity-80">Restore</div>
                        <div onClick={this.emptyTrash} className="border border-black bg-black bg-opacity-50 px-3 py-1 my-1 mx-1 rounded hover:bg-opacity-80">Empty</div>
                    </div>
                </div>
                {
                    (this.state.empty
                        ? this.emptyScreen()
                        : this.showTrashItems()
                    )
                }
            </div>
        )
    }
}

export default Trash;

export const displayTrash = (openApp) => {
    return <Trash> </Trash>;
}
