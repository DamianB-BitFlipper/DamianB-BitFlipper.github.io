
import displaySpotify from './components/apps/spotify';
import displayVsCode from './components/apps/vscode';
import { displayTerminal } from './components/apps/terminal';
import { displaySettings } from './components/apps/settings';
import { displayFirefox } from './components/apps/firefox';
import { displayTrash } from './components/apps/trash';
import { displayGedit, displayDoNotClick } from './components/apps/gedit';
import { displayAboutDamian } from './components/apps/damian';
import { displayTerminalCalc } from './components/apps/calc';
import { displayCheese } from './components/apps/cheese';
import { displayChess } from './components/apps/chess';

const apps = [
    {
        id: "firefox",
        title: "Mozilla Firefox",
        icon: './themes/Yaru/apps/firefox.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: true,
        screen: displayFirefox, // reusing the component for now, will rename later if requested
    },
    {
        id: "calc",
        title: "Calc",
        icon: './themes/Yaru/apps/calc.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: false,
        screen: displayTerminalCalc,
    },
    {
        id: "about-damian",
        title: "About Damian",
        icon: './images/dbtux.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: true,
        screen: displayAboutDamian,
    },
    {
        id: "vscode",
        title: "Visual Studio Code",
        icon: './themes/Yaru/apps/vscode.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: false,
        screen: displayVsCode,
    },
    {
        id: "terminal",
        title: "Terminal",
        icon: './themes/Yaru/apps/bash.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: false,
        screen: displayTerminal,
    },
    {
        id: "spotify",
        title: "Spotify",
        icon: './themes/Yaru/apps/spotify.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: false,
        screen: displaySpotify,
    },
    {
        id: "cheese",
        title: "Cheese",
        icon: './themes/Yaru/apps/cheese.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: false,
        screen: displayCheese,
    },
    {
        id: "chess",
        title: "Chess",
        icon: './themes/Yaru/apps/gedit.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: false,
        screen: displayChess,
    },
    {
        id: "settings",
        title: "Settings",
        icon: './themes/Yaru/apps/gnome-control-center.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: false,
        screen: displaySettings,
    },
    {
        id: "gedit",
        title: "Contact Me",
        icon: './themes/Yaru/apps/gedit.png',
        disabled: false,
        favourite: false,
        desktop_shortcut: true,
        screen: displayGedit,
    },
    {
        id: "github",
        title: "GitHub",
        icon: './themes/Yaru/apps/github.png',
        disabled: false,
        favourite: false,
        desktop_shortcut: true,
        isExternalApp: true,
        url: "https://github.com/DamianB-BitFlipper",
        screen: () => {},
    },
    {
        id: "trash",
        title: "Trash",
        icon: './themes/Yaru/system/user-trash-full.png',
        disabled: false,
        favourite: false,
        desktop_shortcut: true,
        screen: displayTrash,
    },
    {
        id: "do-not-click",
        title: "Do Not Open",
        icon: './themes/Yaru/apps/gedit.png',
        disabled: false,
        favourite: false,
        desktop_shortcut: true,
        screen: displayDoNotClick,
    },
]

export default apps;
