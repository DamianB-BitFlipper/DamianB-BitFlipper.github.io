import React, { Component } from 'react';
import BackgroundImage from '../util components/background-image';
import SideBar from './side_bar';
import apps from '../../apps.config';
import Window from '../base/window';
import UbuntuApp from '../base/ubuntu_app';
import AllApplications from '../screen/all-applications'
import DesktopMenu from '../context menus/desktop-menu';
import DefaultMenu from '../context menus/default';
import $ from 'jquery';
import ReactGA from 'react-ga4';
import { CURSOR_CONTROLLER_REGISTER_EVENT, CURSOR_CONTROLLER_UNREGISTER_EVENT } from '../cursorControllerEvents';

export class Desktop extends Component {
    constructor() {
        super();
        this.favorite_apps = [];
        this.desktop_apps = [];
        this.cursorControllers = {};

        this.cursorEventsBound = false;
        this.bindCursorControllerEvents();
        this.state = {
            visible_windows: [],
            active_windows: [],
            window_positions: {},
            allAppsView: false,
            windows_over_sidebar: {},
            hideSideBar: false,
            // Right click sub-menus to show
            context_menus: {
                desktop: false,
                default: false,
            },
        }
    }

    componentDidMount() {
        // google analytics
        ReactGA.send({ hitType: "pageview", page: "/desktop", title: "Custom Title" });

        this.fetchAppsData();
        this.setContextListeners();
        this.setEventListeners();
        this.bindCursorControllerEvents();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.visible_windows[0] !== this.state.visible_windows[0]) {
            this.applyCursorFocus(this.state.visible_windows[0]);
        }
    }

    componentWillUnmount() {
        this.removeContextListeners();
        this.unbindCursorControllerEvents();
    }

    bindCursorControllerEvents = () => {
        if (this.cursorEventsBound || typeof window === 'undefined') return;
        window.addEventListener(CURSOR_CONTROLLER_REGISTER_EVENT, this.handleCursorControllerRegister);
        window.addEventListener(CURSOR_CONTROLLER_UNREGISTER_EVENT, this.handleCursorControllerUnregister);
        this.cursorEventsBound = true;
    }

    unbindCursorControllerEvents = () => {
        if (!this.cursorEventsBound || typeof window === 'undefined') return;
        window.removeEventListener(CURSOR_CONTROLLER_REGISTER_EVENT, this.handleCursorControllerRegister);
        window.removeEventListener(CURSOR_CONTROLLER_UNREGISTER_EVENT, this.handleCursorControllerUnregister);
        this.cursorEventsBound = false;
    }

    handleCursorControllerRegister = (event) => {
        const detail = event?.detail;
        if (!detail || !detail.appId) return;
        const focusCursor = typeof detail.focusCursor === 'function' ? detail.focusCursor : null;
        const unfocusCursor = typeof detail.unfocusCursor === 'function' ? detail.unfocusCursor : null;
        this.cursorControllers[detail.appId] = { focusCursor, unfocusCursor };
        this.applyCursorFocus();
    }

    handleCursorControllerUnregister = (event) => {
        const appId = event?.detail?.appId;
        if (!appId) return;
        delete this.cursorControllers[appId];
        this.applyCursorFocus();
    }

    getAppConfigById = (appId) => {
        return apps.find(app => app.id === appId) || null;
    }

    renderWindows = () => {
        return this.state.visible_windows.map((appId, index) => {
            const app = this.getAppConfigById(appId);
            if (!app) return null;
            
            // The first item in visible_windows is top-most.
            // To achieve this with z-index, we assign the highest value to index 0.
            // We use a base z-index (e.g., 20) + (total - index).
            const zIndex = 20 + (this.state.visible_windows.length - index);

            const props = {
                title: app.title,
                id: app.id,
                screen: app.screen,
                closed: this.closeApp,
                openApp: this.openApp,
                focus: this.focus,
                isFocused: index === 0,
                hideSideBar: this.hideSideBar,
                hasMinimised: this.hasMinimised,
                minimized: this.state.active_windows.includes(appId) && !this.state.visible_windows.includes(appId),
                changeBackgroundImage: this.props.changeBackgroundImage,
                bg_image_name: this.props.bg_image_name,
                initHeight: app.height,
                initWidth: app.width,
                initialPosition: this.state.window_positions[appId],
                persistWindowPosition: this.persistWindowPosition,
                stackIndex: zIndex
            }

            return <Window key={appId} {...props} />
        });
    }

    giveFocusToLastApp = () => {
        if (!this.checkAllMinimised() && this.state.visible_windows.length > 0) {
            this.focus(this.state.visible_windows[0]);
        }
    }

    checkAllMinimised = () => {
        // If visible_windows is empty, it means all open windows are minimized or closed
        // (since we remove minimized windows from visible_windows)
        return this.state.visible_windows.length === 0;
    }

    applyCursorFocus = (focusedId = this.state.visible_windows[0]) => {
        Object.entries(this.cursorControllers || {}).forEach(([appId, handlers]) => {
            if (!handlers) return;
            const { focusCursor, unfocusCursor } = handlers;
            if (appId === focusedId) {
                if (typeof focusCursor === 'function') {
                    focusCursor();
                }
            } else if (typeof unfocusCursor === 'function') {
                unfocusCursor();
            }
        });
    }

    setEventListeners = () => {
        document.getElementById("open-settings").addEventListener("click", () => {
            this.openApp("settings");
        });
    }

    setContextListeners = () => {
        document.addEventListener('contextmenu', this.checkContextMenu);
        // on click, anywhere, hide all menus
        document.addEventListener('click', this.hideAllContextMenu);
    }

    removeContextListeners = () => {
        document.removeEventListener("contextmenu", this.checkContextMenu);
        document.removeEventListener("click", this.hideAllContextMenu);
    }

    checkContextMenu = (e) => {
        e.preventDefault();
        this.hideAllContextMenu();
        switch (e.target.dataset.context) {
            case "desktop-area":
                ReactGA.event({
                    category: `Context Menu`,
                    action: `Opened Desktop Context Menu`
                });
                this.showContextMenu(e, "desktop");
                break;
            default:
                ReactGA.event({
                    category: `Context Menu`,
                    action: `Opened Default Context Menu`
                });
                this.showContextMenu(e, "default");
        }
    }

    showContextMenu = (e, menuName /* context menu name */) => {
        let { posx, posy } = this.getMenuPosition(e);
        let contextMenu = document.getElementById(`${menuName}-menu`);

        if (posx + $(contextMenu).width() > window.innerWidth) posx -= $(contextMenu).width();
        if (posy + $(contextMenu).height() > window.innerHeight) posy -= $(contextMenu).height();

        posx = posx.toString() + "px";
        posy = posy.toString() + "px";

        contextMenu.style.left = posx;
        contextMenu.style.top = posy;

        this.setState({ context_menus: { ...this.state.context_menus, [menuName]: true } });
    }

    hideAllContextMenu = () => {
        let menus = this.state.context_menus;
        Object.keys(menus).forEach(key => {
            menus[key] = false;
        });
        this.setState({ context_menus: menus });
    }

    getMenuPosition = (e) => {
        var posx = 0;
        var posy = 0;

        if (!e) e = window.event;

        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft +
                document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop +
                document.documentElement.scrollTop;
        }
        return {
            posx, posy
        }
    }

    fetchAppsData = () => {
        const visible_windows = [];
        const active_windows = [];
        let favourite_apps = [], windows_over_sidebar = {}, window_positions = {};
        let desktop_apps = [];
        apps.forEach((app) => {
            const isDefaultOpen = (app.id === "about-damian");
            if (isDefaultOpen) {
                visible_windows.push(app.id);
                active_windows.push(app.id);
                window_positions[app.id] = { x: 60, y: 10 };
            }
            if (app.favourite) favourite_apps.push(app.id);
            windows_over_sidebar = {
                ...windows_over_sidebar,
                [app.id]: false,
            };
            if (app.desktop_shortcut) desktop_apps.push(app.id);
        });
        this.setState({
            visible_windows: visible_windows,
            active_windows: active_windows,
            windows_over_sidebar: windows_over_sidebar,
            window_positions: window_positions
        });
        this.favorite_apps = [...favourite_apps];
        this.desktop_apps = [...desktop_apps];
    }

    renderDesktopApps = () => {
        let appsJsx = [];
        apps.forEach((app, index) => {
            if (this.desktop_apps.includes(app.id)) {

                const props = {
                    name: app.title,
                    id: app.id,
                    icon: app.icon,
                    openApp: this.openApp,
                    isExternalApp: app.isExternalApp,
                    url: app.url
                }

                appsJsx.push(
                    <UbuntuApp key={index} {...props} />
                );
            }
        });
        return appsJsx;
    }

    hideSideBar = (objId, hide) => {
        if (hide === this.state.hideSideBar) return;

        if (objId === null) {
            if (hide === false) {
                this.setState({ hideSideBar: false });
            }
            else {
                for (const key in this.state.windows_over_sidebar) {
                    if (this.state.windows_over_sidebar[key]) {
                        this.setState({ hideSideBar: true });
                        return;
                    }
                }
            }
            return;
        }

        if (hide === false) {
            for (const key in this.state.windows_over_sidebar) {
                if (this.state.windows_over_sidebar[key] && key !== objId) return;
            }
        }

        let windows_over_sidebar = this.state.windows_over_sidebar;
        windows_over_sidebar[objId] = hide;
        this.setState({ hideSideBar: hide, windows_over_sidebar: windows_over_sidebar });
    }

    hasMinimised = (objId) => {
        this.setState((prevState) => {
            const visible_windows = prevState.visible_windows.filter(id => id !== objId);
            return { visible_windows: visible_windows };
        }, () => {
            this.hideSideBar(null, false);
            this.giveFocusToLastApp();
        });
    }

    persistWindowPosition = (objId, position) => {
        if (!objId || !position) return;
        const hasX = typeof position.x === 'number';
        const hasY = typeof position.y === 'number';
        if (!hasX && !hasY) return;
        this.setState((prevState) => {
            const previousPosition = prevState.window_positions[objId] || {};
            const nextPosition = {
                x: hasX ? position.x : previousPosition.x,
                y: hasY ? position.y : previousPosition.y
            };
            const window_positions = {
                ...prevState.window_positions,
                [objId]: nextPosition
            };
            return { window_positions: window_positions };
        });
    }


    openApp = (objId) => {

        // google analytics
        ReactGA.event({
            category: `Open App`,
            action: `Opened ${objId} window`
        });

        const isActive = this.state.active_windows.includes(objId);
        const isVisible = this.state.visible_windows.includes(objId);

        // If the window is minimized (`isActive` but is not `isVisible`)
        if (isActive) {
            this.focus(objId);
            if (!isVisible) {
                const windowElement = document.querySelector("#" + objId);
                if (windowElement) {
                    const storedPosition = this.state.window_positions[objId];
                    const translateX = typeof storedPosition?.x === 'number' ? storedPosition.x : 60;
                    const translateY = typeof storedPosition?.y === 'number' ? storedPosition.y : 10;
                    windowElement.style.transform = `translate(${translateX}px,${translateY}px) scale(1)`;
                }
                return;
            }

            return;
        }

        var frequentApps = localStorage.getItem('frequentApps') ? JSON.parse(localStorage.getItem('frequentApps')) : [];
        var currentApp = frequentApps.find(app => app.id === objId);
        if (currentApp) {
            frequentApps.forEach((app) => {
                if (app.id === currentApp.id) {
                    app.frequency += 1; // increase the frequency if app is found 
                }
            });
        } else {
            frequentApps.push({ id: objId, frequency: 1 }); // new app opened
        }

        frequentApps.sort((a, b) => {
            if (a.frequency < b.frequency) {
                return 1;
            }
            if (a.frequency > b.frequency) {
                return -1;
            }
            return 0; // sort according to decreasing frequencies
        });

        localStorage.setItem("frequentApps", JSON.stringify(frequentApps));

        setTimeout(() => {
            this.setState((prevState) => {
                const active_windows = [...prevState.active_windows, objId];
                const window_positions = { ...prevState.window_positions, [objId]: this.getNextWindowPosition(prevState) };
                return {
                    active_windows: active_windows,
                    window_positions: window_positions,
                    allAppsView: false
                };
            }, () => {
                this.focus(objId);
            });
        }, 200);
    }

    closeApp = (objId) => {
        this.hideSideBar(null, false);

        this.setState((prevState) => {
            let active_windows = prevState.active_windows.filter(id => id !== objId);
            const window_positions = { ...prevState.window_positions };
            delete window_positions[objId];
            const visible_windows = prevState.visible_windows.filter(id => id !== objId);
            return {
                active_windows: active_windows,
                window_positions: window_positions,
                visible_windows: visible_windows
            };
        }, () => {
            this.giveFocusToLastApp();
        });
    }

    focus = (objId) => {
        this.setState((prevState) => {
            let visible_windows = [...prevState.visible_windows];
            const idx = visible_windows.indexOf(objId);
            if (idx !== -1) {
                visible_windows.splice(idx, 1);
            }
            visible_windows.unshift(objId);
            return { visible_windows: visible_windows };
        });
    }

    getNextWindowPosition = (state = this.state) => {
        const baseX = 60;
        const baseY = 10;
        const offset = 30;
        const activeWindowIds = new Set(state.active_windows || []);
        const positions = Object.entries(state.window_positions || {})
            .filter(([key]) => activeWindowIds.has(key))
            .map(([, value]) => value);
        let x = baseX;
        let y = baseY;
        const clampX = window.innerWidth ? window.innerWidth - 320 : 640;
        const clampY = window.innerHeight ? window.innerHeight - 240 : 480;
        const occupied = new Set(positions.map(pos => `${pos?.x}|${pos?.y}`));
        let attempts = 0;
        while (occupied.has(`${x}|${y}`) && attempts < 15) {
            x = Math.max(0, Math.min(x + offset, clampX));
            y = Math.max(0, Math.min(y + offset, clampY));
            attempts += 1;
        }
        return { x, y };
    }

    showAllApps = () => { this.setState({ allAppsView: !this.state.allAppsView }) }

    render() {
        return (
            <div className={" h-full w-full flex flex-col items-end justify-start content-start flex-wrap-reverse pt-8 bg-transparent relative overflow-hidden overscroll-none window-parent"}>

                {/* Window Area */}
                <div className={`absolute h-full w-full bg-transparent ${this.state.allAppsView ? 'opacity-0 transition-opacity duration-200' : 'opacity-100 transition-opacity duration-200'}`} data-context="desktop-area">
                    {this.renderWindows()}
                </div>

                {/* Background Image */}
                <BackgroundImage img={this.props.bg_image_name} />

                {/* Ubuntu Side Menu Bar */}
                <SideBar apps={apps}
                    hide={this.state.hideSideBar}
                    hideSideBar={this.hideSideBar}
                    favourite_apps={this.favorite_apps}
                    showAllApps={this.showAllApps}
                    allAppsView={this.state.allAppsView}
                    visible_windows={this.state.visible_windows}
                    active_windows={this.state.active_windows}
                    openAppByAppId={this.openApp} />

                {/* Desktop Apps */}
                {this.renderDesktopApps()}

                {/* Context Menus */}
                <DesktopMenu active={this.state.context_menus.desktop} openApp={this.openApp} />
                <DefaultMenu active={this.state.context_menus.default} />

                <div className={`absolute z-20 w-full h-full top-0 left-0 transition-all duration-200 ease-in-out ${this.state.allAppsView ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                    <AllApplications apps={apps}
                        recentApps={this.state.active_windows}
                        openApp={this.openApp} />
                </div>


            </div>
        )
    }
}

export default Desktop
