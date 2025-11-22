import React, { Component } from 'react';
import { EVENTS, publishEvent } from '../base/events';
import { detectTouchDevice, isTouchEnvironment } from '../base/mobile';
import BackgroundImage from '../os_components/background-image';
import SideBar from './side_bar';
import apps from '../../apps.config';
import Window from '../base/window';
import DesktopApp from '../base/desktop_app';
import AllApplications from '../os_screens/all-applications'
import DesktopSecondaryMenu from '../os_components/desktop-secondary-menu';
import DefaultSecondaryMenu from '../os_components/default-secondary-menu';
import $ from 'jquery';
import ReactGA from 'react-ga4';

export class Desktop extends Component {
    constructor() {
        super();
        this.favorite_apps = [];
        this.desktop_apps = [];

        this.state = {
            visible_windows: [],
            active_windows: new Set(),
            window_positions: {},
            allAppsView: false,
            windows_over_sidebar: new Set(),
            hideSideBar: false,
            // Right click sub-menus to show
            context_menus: {
                desktop: false,
                default: false,
            },
            isTouchDevice: detectTouchDevice(),
        }
    }

    componentDidMount() {
        // google analytics
        ReactGA.send({ hitType: "pageview", page: "/desktop", title: "Custom Title" });

        this.fetchAppsData();
        this.setContextListeners();
        this.setEventListeners();
        this.setTouchDevice(detectTouchDevice());
    }

    componentWillUnmount() {
        this.removeContextListeners();
    }

    setTouchDevice = (value) => {
        this.setState((prevState) => (
            prevState.isTouchDevice === value ? null : { isTouchDevice: value }
        ));
    }

    ensureTouchEnvironment = () => {
        return isTouchEnvironment(this.state.isTouchDevice, this.setTouchDevice);
    }


    getAppConfigById = (appId) => {
        return apps.find(app => app.id === appId) || null;
    }

    renderWindows = () => {
        const isTouchDevice = this.ensureTouchEnvironment();
        const defaultHeight = isTouchDevice ? 90 : 85;
        const defaultWidth = isTouchDevice ? 80 : 60;

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
                minimize: this.minimize,
                isMinimized: this.state.active_windows.has(appId) && !this.state.visible_windows.includes(appId),
                changeBackgroundImage: this.props.changeBackgroundImage,
                bg_image_name: this.props.bg_image_name,
                initHeight: app.height ?? defaultHeight,
                initWidth: app.width ?? defaultWidth,
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
        const active_windows = new Set();
        let favourite_apps = [], window_positions = {};
        let desktop_apps = [];
        const windows_over_sidebar = new Set();
        apps.forEach((app) => {
            const isDefaultOpen = app.is_default_open;
            if (isDefaultOpen) {
                // Always add new apps from the front
                visible_windows.unshift(app.id);
                active_windows.add(app.id);
                window_positions[app.id] = this.getNextWindowPosition({
                    active_windows,
                    window_positions,
                });
                this.focus(app.id);
            }
            if (app.favourite) favourite_apps.push(app.id);
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
                    <DesktopApp key={index} {...props} />
                );
            }
        });
        return appsJsx;
    }

    hideSideBar = (app_id, hide) => {
        if (app_id === null && hide === this.state.hideSideBar) return;

        this.setState((prevState) => {
            const windows_over_sidebar = new Set(prevState.windows_over_sidebar || []);

            if (app_id === null) {
                if (hide === false) {
                    return prevState.hideSideBar ? { hideSideBar: false } : null;
                }

                if (windows_over_sidebar.size > 0) {
                    return prevState.hideSideBar ? null : { hideSideBar: true };
                }

                return null;
            }

            if (hide) {
                windows_over_sidebar.add(app_id);
                if (prevState.hideSideBar) {
                    return { windows_over_sidebar };
                }
                return { hideSideBar: true, windows_over_sidebar };
            }

            windows_over_sidebar.delete(app_id);
            if (windows_over_sidebar.size > 0) {
                return { windows_over_sidebar };
            }

            if (!prevState.hideSideBar) {
                return { windows_over_sidebar };
            }

            return { hideSideBar: false, windows_over_sidebar };
        });
    }

    minimize = (app_id) => {
        // Send the signal before updating the state so that the signal reaches the component
        publishEvent(EVENTS.WINDOW_MINIMIZED, { app_id });
        this.setState((prevState) => {
            const visible_windows = prevState.visible_windows.filter(id => id !== app_id);
            return { visible_windows: visible_windows };
        }, () => {
            this.hideSideBar(null, false);
            this.giveFocusToLastApp();
        });
    }

    persistWindowPosition = (app_id, position) => {
        if (!app_id || !position) return;
        const hasX = typeof position.x === 'number';
        const hasY = typeof position.y === 'number';
        if (!hasX && !hasY) return;
        this.setState((prevState) => {
            const previousPosition = prevState.window_positions[app_id] || {};
            const nextPosition = {
                x: hasX ? position.x : previousPosition.x,
                y: hasY ? position.y : previousPosition.y
            };
            const window_positions = {
                ...prevState.window_positions,
                [app_id]: nextPosition
            };
            return { window_positions: window_positions };
        });
    }


    openApp = (app_id) => {

        // google analytics
        ReactGA.event({
            category: `Open App`,
            action: `Opened ${app_id} window`
        });

        const isActive = this.state.active_windows.has(app_id);
        const isVisible = this.state.visible_windows.includes(app_id);

        // If the window is minimized (`isActive` but is not `isVisible`)
        if (isActive) {
            this.focus(app_id);
            if (!isVisible) {
                const windowElement = document.querySelector("#" + app_id);
                if (windowElement) {
                    const storedPosition = this.state.window_positions[app_id];
                    const translateX = typeof storedPosition?.x === 'number' ? storedPosition.x : 60;
                    const translateY = typeof storedPosition?.y === 'number' ? storedPosition.y : 10;
                    windowElement.style.transform = `translate(${translateX}px,${translateY}px) scale(1)`;
                }
                publishEvent(EVENTS.WINDOW_RESTORED, { app_id });
                return;
            }

            return;
        }

        var frequentApps = localStorage.getItem('frequentApps') ? JSON.parse(localStorage.getItem('frequentApps')) : [];
        var currentApp = frequentApps.find(app => app.id === app_id);
        if (currentApp) {
            frequentApps.forEach((app) => {
                if (app.id === currentApp.id) {
                    app.frequency += 1; // increase the frequency if app is found 
                }
            });
        } else {
            frequentApps.push({ id: app_id, frequency: 1 }); // new app opened
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
                const active_windows = new Set(prevState.active_windows || []);
                active_windows.add(app_id);
                const window_positions = { ...prevState.window_positions, [app_id]: this.getNextWindowPosition(prevState) };
                return {
                    active_windows: active_windows,
                    window_positions: window_positions,
                    allAppsView: false
                };
            }, () => {
                this.focus(app_id);
            });
        }, 200);
    }

    closeApp = (app_id) => {
        // Send the signal before updating the state so that the signal reaches the component
        publishEvent(EVENTS.WINDOW_CLOSED, { app_id });
        this.hideSideBar(null, false);

        this.setState((prevState) => {
            const active_windows = new Set(prevState.active_windows || []);
            active_windows.delete(app_id);
            const window_positions = { ...prevState.window_positions };
            delete window_positions[app_id];
            const visible_windows = prevState.visible_windows.filter(id => id !== app_id);
            return {
                active_windows: active_windows,
                window_positions: window_positions,
                visible_windows: visible_windows
            };
        }, () => {
            this.giveFocusToLastApp();
        });
    }

    focus = (app_id) => {
        this.setState((prevState) => {
            const visible_windows = [...prevState.visible_windows];
            const idx = visible_windows.indexOf(app_id);
            if (idx !== -1) {
                visible_windows.splice(idx, 1);
            }
            visible_windows.unshift(app_id);
            return { visible_windows };
        }, () => {
            publishEvent(EVENTS.WINDOW_FOCUSED, { app_id });
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
                <DesktopSecondaryMenu active={this.state.context_menus.desktop} openApp={this.openApp} />
                <DefaultSecondaryMenu active={this.state.context_menus.default} />

                <div className={`absolute z-20 w-full h-full top-0 left-0 transition-all duration-200 ease-in-out ${this.state.allAppsView ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                    <AllApplications apps={apps}
                        openApp={this.openApp} />
                </div>


            </div>
        )
    }
}

export default Desktop
