
import { displaySpotify } from './components/apps/spotify';
import { displayVsCode } from './components/apps/vscode';
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
        icon: './themes/apps/firefox.png',
        favourite: true,
        desktop_shortcut: true,
        screen: displayFirefox, // reusing the component for now, will rename later if requested
        height: 85, width: 60,
        is_default_open: false,
    },

    {
        id: "calc",
        title: "Calc",
        icon: './themes/apps/calc.png',
        favourite: true,
        desktop_shortcut: false,
        screen: displayTerminalCalc,
        height: 85, width: 60,
        is_default_open: false,
    },
    {
        id: "about-damian",
        title: "About Damian",
        icon: './images/dbtux.png',
        favourite: true,
        desktop_shortcut: true,
        screen: displayAboutDamian,
        height: 85, width: 60,
        is_default_open: true,
    },
    {
        id: "vscode",
        title: "Visual Studio Code",
        icon: './themes/apps/vscode.png',
        favourite: true,
        desktop_shortcut: false,
        screen: displayVsCode,
        height: 85, width: 60,
        is_default_open: false,
    },
    {
        id: "terminal",
        title: "Terminal",
        icon: './themes/apps/bash.png',
        favourite: true,
        desktop_shortcut: false,
        screen: displayTerminal,
        height: 85, width: 60,
        is_default_open: false,
    },
    {
        id: "spotify",
        title: "Spotify",
        icon: './themes/apps/spotify.png',
        favourite: true,
        desktop_shortcut: false,
        screen: displaySpotify,
        height: 85, width: 60,
        is_default_open: false,
    },
    {
        id: "cheese",
        title: "Cheese",
        icon: './themes/apps/cheese.png',
        favourite: true,
        desktop_shortcut: false,
        screen: displayCheese,
        height: 85, width: 60,
        is_default_open: false,
    },
    {
        id: "chess",
        title: "Chess",
        icon: './themes/apps/chess.png',
        favourite: true,
        desktop_shortcut: false,
        screen: displayChess,
        height: 80, width: 40,
        is_default_open: false,
    },
    {
        id: "settings",
        title: "Settings",
        icon: './themes/apps/gnome-control-center.png',
        favourite: true,
        desktop_shortcut: false,
        screen: displaySettings,
        height: 85, width: 60,
        is_default_open: false,
    },
    {
        id: "gedit",
        title: "Contact Me",
        icon: './themes/apps/gedit.png',
        favourite: false,
        desktop_shortcut: true,
        screen: displayGedit,
        height: 85, width: 60,
        is_default_open: false,
    },
    {
        id: "github",
        title: "GitHub",
        icon: './themes/apps/github.png',
        favourite: false,
        desktop_shortcut: true,
        isExternalApp: true,
        url: "https://github.com/DamianB-BitFlipper",
        screen: () => {},
        height: 85, width: 60,
        is_default_open: false,
    },
    {
        id: "x-profile",
        title: "X",
        icon: './themes/apps/x-logo.png',
        favourite: false,
        desktop_shortcut: true,
        isExternalApp: true,
        url: "https://x.com/TheBitFlipper",
        screen: () => {},
        height: 85, width: 60,
        is_default_open: false,
    },
    {
        id: "trash",
        title: "Trash",
        icon: './themes/status/user-trash-full.png',
        favourite: false,
        desktop_shortcut: true,
        screen: displayTrash,
        height: 85, width: 60,
        is_default_open: false,
    },
    {
        id: "do-not-click",
        title: "Do Not Open",
        icon: './themes/apps/gedit.png',
        favourite: false,
        desktop_shortcut: true,
        screen: displayDoNotClick,
        height: 85, width: 60,
        is_default_open: false,
    },
]

export default apps;
