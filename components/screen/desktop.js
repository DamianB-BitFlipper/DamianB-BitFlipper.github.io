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
        this.app_stack = [];
        this.initFavourite = {};
        this.allWindowClosed = false;
        this.cursorControllers = {};
        this.cursorEventsBound = false;
        this.bindCursorControllerEvents();
        this.state = {
            focused_windows: new Map(),
            closed_windows: {},
            allAppsView: false,
            overlapped_windows: {},
            disabled_apps: {},
            favourite_apps: {},
            hideSideBar: false,
            minimized_windows: {},
            desktop_apps: [],
            window_positions: {},
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
        const prevFocused = this.getFirstFocusedWindowId(prevState.focused_windows);
        const currentFocused = this.getCurrentFocusedWindowId();
        if (prevFocused !== currentFocused) {
            this.applyCursorFocus(currentFocused);
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

    getFocusedMapFromState = (source = this.state.focused_windows) => {
        if (source instanceof Map) {
            return source;
        }
        if (Array.isArray(source)) {
            const map = new Map();
            source.forEach((appId) => {
                const config = this.getAppConfigById(appId);
                if (config) {
                    map.set(appId, config);
                }
            });
            return map;
        }
        return new Map();
    }

    getOrderedFocusedEntries = (source = this.state.focused_windows) => {
        const focusedMap = this.getFocusedMapFromState(source);
        return Array.from(focusedMap.entries());
    }

    getFirstFocusedWindowId = (source = this.state.focused_windows) => {
        const focusedMap = this.getFocusedMapFromState(source);
        const iterator = focusedMap.keys().next();
        return iterator.done ? null : iterator.value;
    }

    getCurrentFocusedWindowId = () => {
        return this.getFirstFocusedWindowId(this.state.focused_windows);
    }

    applyCursorFocus = (focusedId = this.getCurrentFocusedWindowId()) => {
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
        const focused_windows = new Map();
        let closed_windows = {}, disabled_apps = {}, favourite_apps = {}, overlapped_windows = {}, minimized_windows = {}, window_positions = {};
        let desktop_apps = [];
        apps.forEach((app) => {
            const isDefaultOpen = (app.id === "about-damian");
            if (isDefaultOpen) {
                focused_windows.set(app.id, app);
                this.app_stack.push(app.id);
                window_positions[app.id] = { x: 60, y: 10 };
            }
            closed_windows = {
                ...closed_windows,
                [app.id]: !isDefaultOpen,
            };
            disabled_apps = {
                ...disabled_apps,
                [app.id]: app.disabled,
            };
            favourite_apps = {
                ...favourite_apps,
                [app.id]: app.favourite,
            };
            overlapped_windows = {
                ...overlapped_windows,
                [app.id]: false,
            };
            minimized_windows = {
                ...minimized_windows,
                [app.id]: false,
            }
            if (app.desktop_shortcut) desktop_apps.push(app.id);
        });
        this.setState({
            focused_windows,
            closed_windows,
            disabled_apps,
            favourite_apps,
            overlapped_windows,
            minimized_windows,
            desktop_apps,
            window_positions
        });
        this.initFavourite = { ...favourite_apps };
    }

    updateAppsData = () => {
        let closed_windows = {}, favourite_apps = {}, minimized_windows = {}, disabled_apps = {}, window_positions = { ...this.state.window_positions };
        let desktop_apps = [];
        apps.forEach((app) => {
            minimized_windows = {
                ...minimized_windows,
                [app.id]: ((this.state.minimized_windows[app.id] !== undefined || this.state.minimized_windows[app.id] !== null) ? this.state.minimized_windows[app.id] : false)
            };
            disabled_apps = {
                ...disabled_apps,
                [app.id]: app.disabled
            };
            closed_windows = {
                ...closed_windows,
                [app.id]: ((this.state.closed_windows[app.id] !== undefined || this.state.closed_windows[app.id] !== null) ? this.state.closed_windows[app.id] : true)
            };
            favourite_apps = {
                ...favourite_apps,
                [app.id]: app.favourite
            }
            if (!window_positions[app.id] && !closed_windows[app.id]) {
                window_positions[app.id] = { x: 60, y: 10 };
            }
            if (app.desktop_shortcut) desktop_apps.push(app.id);
        });
        const previousFocused = this.getFocusedMapFromState(this.state.focused_windows);
        const focused_windows = new Map();
        previousFocused.forEach((appConfig, appId) => {
            if (closed_windows[appId] === false) {
                focused_windows.set(appId, appConfig);
            }
        });
        apps.forEach((app) => {
            if (!focused_windows.has(app.id) && closed_windows[app.id] === false) {
                focused_windows.set(app.id, app);
            }
        });
        this.setState({
            focused_windows,
            closed_windows,
            disabled_apps,
            minimized_windows,
            favourite_apps,
            desktop_apps,
            window_positions
        });
        this.initFavourite = { ...favourite_apps };
    }

    renderDesktopApps = () => {
        if (Object.keys(this.state.closed_windows).length === 0) return;
        let appsJsx = [];
        apps.forEach((app, index) => {
            if (this.state.desktop_apps.includes(app.id)) {

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

    getWindowRenderOrder = () => {
        if (!this.state.closed_windows) return [];
        const focusedEntries = this.getOrderedFocusedEntries();
        const orderedOpenIds = [];
        const openIdSet = new Set();
        focusedEntries.forEach(([appId]) => {
            if (this.state.closed_windows[appId] === false && !openIdSet.has(appId)) {
                orderedOpenIds.push(appId);
                openIdSet.add(appId);
            }
        });
        apps.forEach(app => {
            if (!openIdSet.has(app.id) && this.state.closed_windows[app.id] === false) {
                orderedOpenIds.push(app.id);
                openIdSet.add(app.id);
            }
        });
        return orderedOpenIds;
    }

    getWindowRenderEntries = () => {
        const orderedIds = this.getWindowRenderOrder();
        const focusedMap = this.getFocusedMapFromState(this.state.focused_windows);
        return orderedIds
            .map((appId) => {
                const appConfig = focusedMap.get(appId) || this.getAppConfigById(appId);
                return [appId, appConfig];
            })
            .filter(([, appConfig]) => Boolean(appConfig));
    }

    renderWindows = () => {
        const orderedEntries = this.getWindowRenderEntries();
        let windowsJsx = [];
        const total = orderedEntries.length;
        orderedEntries.forEach(([appId, app], index) => {
            if (!app) return;
            const zIndex = (total - index) + 20; // ensure focused order always stacked correctly

            const props = {
                title: app.title,
                id: app.id,
                screen: app.screen,
                closed: this.closeApp,
                openApp: this.openApp,
                focus: this.focus,
                isFocused: this.isWindowFocused(app.id),
                hideSideBar: this.hideSideBar,
                hasMinimised: this.hasMinimised,
                minimized: this.state.minimized_windows[app.id],
                changeBackgroundImage: this.props.changeBackgroundImage,
                bg_image_name: this.props.bg_image_name,
                initHeight: app.height,
                initWidth: app.width,
                initialPosition: this.state.window_positions[app.id],
                stackIndex: zIndex
            }

            windowsJsx.push(
                <Window key={app.id} {...props} />
            )
        });
        return windowsJsx;
    }

    isWindowFocused = (appId) => {
        return this.getCurrentFocusedWindowId() === appId;
    }

    getFocusedWindowsMap = () => {
        const map = {};
        const focusedId = this.getCurrentFocusedWindowId();
        apps.forEach((app) => {
            map[app.id] = focusedId === app.id;
        });
        return map;
    }

    hideSideBar = (objId, hide) => {
        if (hide === this.state.hideSideBar) return;

        if (objId === null) {
            if (hide === false) {
                this.setState({ hideSideBar: false });
            }
            else {
                for (const key in this.state.overlapped_windows) {
                    if (this.state.overlapped_windows[key]) {
                        this.setState({ hideSideBar: true });
                        return;
                    }  // if any window is overlapped then hide the SideBar
                }
            }
            return;
        }

        if (hide === false) {
            for (const key in this.state.overlapped_windows) {
                if (this.state.overlapped_windows[key] && key !== objId) return; // if any window is overlapped then don't show the SideBar
            }
        }

        let overlapped_windows = this.state.overlapped_windows;
        overlapped_windows[objId] = hide;
        this.setState({ hideSideBar: hide, overlapped_windows });
    }

    hasMinimised = (objId) => {
        this.setState((prevState) => {
            const minimized_windows = { ...prevState.minimized_windows, [objId]: true };
            const prevFocusedMap = this.getFocusedMapFromState(prevState.focused_windows);
            const focused_windows = new Map(prevFocusedMap);
            focused_windows.delete(objId);
            return { minimized_windows, focused_windows };
        }, () => {
            this.hideSideBar(null, false);
            this.giveFocusToLastApp();
        });
    }

    giveFocusToLastApp = () => {
        // if there is atleast one app opened, give focus to the most recently active one
        if (!this.checkAllMinimised()) {
            for (let i = this.app_stack.length - 1; i >= 0; i -= 1) {
                const appId = this.app_stack[i];
                if (!this.state.minimized_windows[appId]) {
                    this.focus(appId);
                    break;
                }
            }
        }
    }

    checkAllMinimised = () => {
        let result = true;
        for (const key in this.state.minimized_windows) {
            if (!this.state.closed_windows[key]) { // if app is opened
                result = result & this.state.minimized_windows[key];
            }
        }
        return result;
    }

    openApp = (objId) => {

        // google analytics
        ReactGA.event({
            category: `Open App`,
            action: `Opened ${objId} window`
        });

        // if the app is disabled
        if (this.state.disabled_apps[objId]) return;

        if (this.state.minimized_windows[objId]) {
            // focus this app's window
            this.focus(objId);

            // set window's last position
            var r = document.querySelector("#" + objId);
            if (r) {
                r.style.transform = `translate(${r.style.getPropertyValue("--window-transform-x")},${r.style.getPropertyValue("--window-transform-y")}) scale(1)`;
            }

            // tell childs that his app has been not minimised
            let minimized_windows = { ...this.state.minimized_windows };
            minimized_windows[objId] = false;
            this.setState({ minimized_windows: minimized_windows });
            return;
        }

        //if app is already opened
        if (this.app_stack.includes(objId)) {
            this.focus(objId);
            return;
        }
        
        let closed_windows = { ...this.state.closed_windows };
        let favourite_apps = { ...this.state.favourite_apps };
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
                const favourite_apps = { ...prevState.favourite_apps, [objId]: true };
                const closed_windows = { ...prevState.closed_windows, [objId]: false };
                const window_positions = { ...prevState.window_positions, [objId]: this.getNextWindowPosition(prevState) };
                return { closed_windows, favourite_apps, window_positions, allAppsView: false };
            }, () => {
                this.focus(objId);
            });
            if (!this.app_stack.includes(objId)) {
                this.app_stack.push(objId);
            }
        }, 200);
    }

    closeApp = (objId) => {

        // remove app from the app stack
        this.app_stack = this.app_stack.filter(id => id !== objId);

        this.hideSideBar(null, false);

        this.setState((prevState) => {
            let closed_windows = { ...prevState.closed_windows, [objId]: true };
            let favourite_apps = { ...prevState.favourite_apps };
            if (this.initFavourite[objId] === false) favourite_apps[objId] = false; // if user default app is not favourite, remove from sidebar
            const window_positions = { ...prevState.window_positions };
            delete window_positions[objId];
            const prevFocusedMap = this.getFocusedMapFromState(prevState.focused_windows);
            const focused_windows = new Map(prevFocusedMap);
            focused_windows.delete(objId);
            return { closed_windows, favourite_apps, window_positions, focused_windows };
        }, () => {
            this.giveFocusToLastApp();
        });
    }

    reorderFocusedWindows = (objId, prevState) => {
        const prevFocusedMap = this.getFocusedMapFromState(prevState.focused_windows);
        const reordered = new Map();
        const appConfig = prevFocusedMap.get(objId) || this.getAppConfigById(objId);
        if (appConfig) {
            reordered.set(objId, appConfig);
        }
        prevFocusedMap.forEach((value, key) => {
            if (key === objId) return;
            if (prevState.closed_windows[key] === false) {
                reordered.set(key, value);
            }
        });
        return reordered;
    }

    focus = (objId) => {
        this.setState((prevState) => ({
            focused_windows: this.reorderFocusedWindows(objId, prevState)
        }));
    }

    getNextWindowPosition = (state = this.state) => {
        const baseX = 60;
        const baseY = 10;
        const offset = 30;
        const positions = Object.entries(state.window_positions || {})
            .filter(([key]) => !state.closed_windows[key])
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
                    favourite_apps={this.state.favourite_apps}
                    showAllApps={this.showAllApps}
                    allAppsView={this.state.allAppsView}
                    closed_windows={this.state.closed_windows}
                    focused_windows={this.getFocusedWindowsMap()}
                    isMinimized={this.state.minimized_windows}
                    openAppByAppId={this.openApp} />

                {/* Desktop Apps */}
                {this.renderDesktopApps()}

                {/* Context Menus */}
                <DesktopMenu active={this.state.context_menus.desktop} openApp={this.openApp} />
                <DefaultMenu active={this.state.context_menus.default} />

                <div className={`absolute z-20 w-full h-full top-0 left-0 transition-all duration-200 ease-in-out ${this.state.allAppsView ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                    <AllApplications apps={apps}
                        recentApps={this.app_stack}
                        openApp={this.openApp} />
                </div>

            </div>
        )
    }
}

export default Desktop