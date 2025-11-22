import React, { Component } from 'react';
import Draggable from 'react-draggable';
import Settings from '../apps/settings';
import ReactGA from 'react-ga4';
import { EVENTS, publishEvent } from './events';

export class Window extends Component {
    constructor(props) {
        super(props);
        this.id = null;
        this.startX = (props.initialPosition && typeof props.initialPosition.x === 'number') ? props.initialPosition.x : 60;
        this.startY = (props.initialPosition && typeof props.initialPosition.y === 'number') ? props.initialPosition.y : 10;
        this.state = {
            cursorType: "cursor-default",
            width: 60,
            height: 85,
            closed: false,
            maximized: false,
            parentSize: {
                height: 100,
                width: 100
            }
        }

    }

    componentDidMount() {
        this.id = this.props.id;
        this.setDefaultWindowDimenstion();

        // google analytics
        ReactGA.send({ hitType: "pageview", page: `/${this.id}`, title: "Custom Title" });

        // on window resize, resize boundary
        window.addEventListener('resize', this.resizeBoundries);
    }

    componentWillUnmount() {
        ReactGA.send({ hitType: "pageview", page: "/desktop", title: "Custom Title" });

        window.removeEventListener('resize', this.resizeBoundries);
    }

    setDefaultWindowDimenstion = () => {

        this.setState({ height: this.props.initHeight, width: this.props.initWidth }, this.resizeBoundries);
    }

    resizeBoundries = () => {
        this.setState({
            parentSize: {
                height: window.innerHeight //parent height
                    - (window.innerHeight * (this.state.height / 100.0))  // this window's height
                    - 28 // some padding
                ,
                width: window.innerWidth // parent width
                    - (window.innerWidth * (this.state.width / 100.0)) //this window's width
            }
        });
    }





    // Change the user's mouse cursor to the drag cursor when the user is dragging a window
    changeCursorToMove = () => {
        this.focusWindow();
        if (this.state.maximized) {
            this.restoreWindow();
        }
        this.setState({ cursorType: "cursor-move" });
        publishEvent(EVENTS.WINDOW_DRAGGING_START, { app_id: this.id });
    }

    // Revert the user's cursor back to the default
    changeCursorToDefault = () => {
        this.setState({ cursorType: "cursor-default" });
        publishEvent(EVENTS.WINDOW_DRAGGING_STOP, { app_id: this.id });

        // Dragging ended, so persist the window position
        this.setWindowPosition();
    }

    resizeStart = (e, direction) => {
        e.preventDefault();
        e.stopPropagation();
        this.startResizeX = e.clientX;
        this.startResizeY = e.clientY;
        this.startWidth = this.state.width;
        this.startHeight = this.state.height;
        this.resizeDirection = direction;
        this.resizing = true;
        this.focusWindow();
        if (this.state.maximized) {
            this.setState({ maximized: false });
        }
        document.body.style.cursor = direction === 'x' ? 'ew-resize' : direction === 'y' ? 'ns-resize' : 'nwse-resize';
        window.addEventListener('mousemove', this.resize);
        window.addEventListener('mouseup', this.resizeEnd);
    }

    resize = (e) => {
        if (!this.resizing) return;
        const deltaX = e.clientX - this.startResizeX;
        const deltaY = e.clientY - this.startResizeY;
        const parentWidth = window.innerWidth;
        const parentHeight = window.innerHeight;
        const deltaWidthPercent = (deltaX / parentWidth) * 100;
        const deltaHeightPercent = (deltaY / parentHeight) * 100;

        let newWidth = this.startWidth;
        let newHeight = this.startHeight;

        if (this.resizeDirection === 'x' || this.resizeDirection === 'xy') newWidth += deltaWidthPercent;
        if (this.resizeDirection === 'y' || this.resizeDirection === 'xy') newHeight += deltaHeightPercent;

        if (newWidth < 15) newWidth = 15;
        if (newHeight < 15) newHeight = 15;

        this.setState({ width: newWidth, height: newHeight }, this.resizeBoundries);
    }

    resizeEnd = () => {
        this.resizing = false;
        document.body.style.cursor = 'default';
        window.removeEventListener('mousemove', this.resize);
        window.removeEventListener('mouseup', this.resizeEnd);
    }

    setWindowPosition = () => {
        const element = document.querySelector("#" + this.id);
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const x = parseFloat(rect.x.toFixed(1));
        const y = parseFloat(rect.y.toFixed(1)) - 32;
        element.style.setProperty('--window-transform-x', x.toString() + "px");
        element.style.setProperty('--window-transform-y', y.toString() + "px");
        if (typeof this.props.persistWindowPosition === 'function') {
            this.props.persistWindowPosition(this.id, { x, y });
        }
    }

    checkOverlap = () => {
        var r = document.querySelector("#" + this.id);
        var rect = r.getBoundingClientRect();
        if (rect.x.toFixed(1) < 50) { // if this window overlapps with SideBar
            this.props.hideSideBar(this.id, true);
        }
        else {
            this.props.hideSideBar(this.id, false);
        }
    }

    focusWindow = () => {
        this.props.focus(this.id);
    }

    minimizeWindow = () => {
        let posx = -310;
        if (this.state.maximized) {
            posx = -510;
        }
        this.setWindowPosition();
        // get corrosponding sidebar app's position
        var r = document.querySelector("#sidebar-" + this.id);
        var sidebBarApp = r.getBoundingClientRect();

        r = document.querySelector("#" + this.id);
        // translate window to that position
        r.style.transform = `translate(${posx}px,${sidebBarApp.y.toFixed(1) - 240}px) scale(0.2)`;
        this.props.minimize(this.id);
    }

    restoreWindow = () => {
        var r = document.querySelector("#" + this.id);
        this.setDefaultWindowDimenstion();
        // get previous position
        let posx = r.style.getPropertyValue("--window-transform-x");
        let posy = r.style.getPropertyValue("--window-transform-y");

        r.style.transform = `translate(${posx},${posy})`;
        setTimeout(() => {
            this.setState({ maximized: false });
            this.checkOverlap();
        }, 300);
    }

    maximizeWindow = () => {
        if (this.state.maximized) {
            this.restoreWindow();
        }
        else {
            this.focusWindow();
            var r = document.querySelector("#" + this.id);
            this.setWindowPosition();
            // translate window to maximize position
            r.style.transform = `translate(-1pt,-2pt)`;
            this.setState({ maximized: true, height: 96.3, width: 100.2 });
            this.props.hideSideBar(this.id, true);
        }
    }

    closeWindow = () => {
        this.setWindowPosition();
        this.setState({ closed: true }, () => {
            this.props.hideSideBar(this.id, false);
            setTimeout(() => {
                this.props.closed(this.id)
            }, 300) // after 300ms this window will be unmounted from parent (Desktop)
        });
    }

    render() {
        return (
            <Draggable
                axis="both"
                handle=".bg-ub-window-title"
                grid={[1, 1]}
                scale={1}
                onStart={this.changeCursorToMove}
                onStop={this.changeCursorToDefault}
                onDrag={this.checkOverlap}
                allowAnyClick={false}
                defaultPosition={{ x: this.startX, y: this.startY }}
                bounds={{ left: 0, top: 0, right: this.state.parentSize.width, bottom: this.state.parentSize.height }}
            >
                <div style={{ width: `${this.state.width}%`, height: `${this.state.height}%`, zIndex: (this.props.stackIndex || (this.props.isFocused ? 60 : 40)) }}
                    className={this.state.cursorType + " " + (this.state.closed ? " closed-window " : "") + (this.state.maximized ? " duration-300 rounded-none" : " rounded-lg rounded-b-none") + (this.props.isMinimized ? " opacity-0 invisible duration-200 " : "") + (this.props.isFocused ? "" : " notFocused") + " opened-window overflow-hidden min-w-1/4 min-h-1/4 main-window absolute window-shadow border-black border-opacity-40 border border-t-0 flex flex-col"}
                    id={this.id}
                    onMouseDownCapture={this.focusWindow}
                >
                    <div className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize z-50" onMouseDown={(e) => this.resizeStart(e, 'x')}></div>
                    <div className="absolute left-0 bottom-0 right-0 h-1 cursor-ns-resize z-50" onMouseDown={(e) => this.resizeStart(e, 'y')}></div>
                    <div className="absolute right-0 bottom-0 w-4 h-4 cursor-nwse-resize z-50" onMouseDown={(e) => this.resizeStart(e, 'xy')}></div>
                    <WindowTopBar title={this.props.title} />
                    <WindowEditButtons minimize={this.minimizeWindow} maximize={this.maximizeWindow} isMaximised={this.state.maximized} close={this.closeWindow} id={this.id} />
                    {(this.id === "settings"
                        ? <Settings changeBackgroundImage={this.props.changeBackgroundImage} currBgImgName={this.props.bg_image_name} />
                        : <WindowMainScreen screen={this.props.screen} title={this.props.title}
                            openApp={this.props.openApp} />)}
                </div>
            </Draggable >
        )
    }
}

export default Window

// Window's title bar
export function WindowTopBar(props) {
    return (
        <div className={" relative bg-ub-window-title border-t-2 border-white border-opacity-5 py-1.5 px-3 text-white w-full select-none rounded-b-none"}>
            <div className="flex justify-center text-sm font-bold">{props.title}</div>
        </div>
    )
}

// Window's Edit Buttons
export function WindowEditButtons(props) {
    return (
        <div className="absolute select-none right-0 top-0 mt-1 mr-1 flex justify-center items-center">
            <span className="mx-1.5 bg-white bg-opacity-0 hover:bg-opacity-10 rounded-full flex justify-center mt-1 h-5 w-5 items-center" onClick={props.minimize}>
                <img
                    src="./themes/system_icons/window-minimize-symbolic.svg"
                    alt="ubuntu window minimize"
                    className="h-5 w-5 inline"
                />
            </span>
            {
                (props.isMaximised
                    ?
                    <span className="mx-2 bg-white bg-opacity-0 hover:bg-opacity-10 rounded-full flex justify-center mt-1 h-5 w-5 items-center" onClick={props.maximize}>
                        <img
                            src="./themes/system_icons/window-restore-symbolic.svg"
                            alt="ubuntu window restore"
                            className="h-5 w-5 inline"
                        />
                    </span>
                    :
                    <span className="mx-2 bg-white bg-opacity-0 hover:bg-opacity-10 rounded-full flex justify-center mt-1 h-5 w-5 items-center" onClick={props.maximize}>
                        <img
                            src="./themes/system_icons/window-maximize-symbolic.svg"
                            alt="ubuntu window maximize"
                            className="h-5 w-5 inline"
                        />
                    </span>
                )
            }
            <button tabIndex="-1" id={`close-${props.id}`} className="mx-1.5 focus:outline-none cursor-default bg-ub-orange bg-opacity-90 hover:bg-opacity-100 rounded-full flex justify-center mt-1 h-5 w-5 items-center" onClick={props.close}>
                <img
                    src="./themes/system_icons/window-close-symbolic.svg"
                    alt="ubuntu window close"
                    className="h-5 w-5 inline"
                />
            </button>
        </div>
    )
}

// Window's Main Screen
export class WindowMainScreen extends Component {
    constructor() {
        super();
        this.state = {
            setDarkBg: false,
        }
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({ setDarkBg: true });
        }, 3000);
    }
    render() {
        const content = typeof this.props.screen === 'function'
            ? this.props.screen(this.props.openApp)
            : null;
        return (
            <div className={"w-full flex-grow z-20 max-h-full overflow-y-auto windowMainScreen" + (this.state.setDarkBg ? " bg-ub-drk-abrgn " : " bg-ub-cool-grey")}>
                {content}
            </div>
        )
    }
}
