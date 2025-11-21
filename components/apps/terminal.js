import React, { Component } from 'react'
import $ from 'jquery';
import ReactGA from 'react-ga4';
import bashEmulator from 'bash-emulator';
import { projects, skills, languages, interests } from '../ubuntu_data';

export class Terminal extends Component {
    constructor() {
        super();
        this.cursor = "";
        this.terminal_rows = 1;
        this.current_directory = "~";
        this.state = {
            terminal: [],
        }

        this.virtualDirectories = {
            projects: [],
        };

        this.projectTextFiles = projects.map(({ slug, title, description }) => {
            const fileName = `${slug}.txt`;
            const displayTitle = title || slug;
            const content = description && description.trim().length > 0
                ? description
                : `No description available for ${displayTitle}.`;
            return { fileName, content };
        });

        this.virtualTextFiles = {
            'skills.txt': skills,
            'languages.txt': languages,
            'interests.txt': interests,
        };

        this.homeDirectory = '/home/damian';
        this.virtualFileSystem = {};
        this.lastCommandInfo = null;

        this.appLaunchCommands = {
            code: "vscode",
            spotify: "spotify",
            chrome: "chrome",
            trash: "trash",
            "about-damian": "about-damian",
            terminal: "terminal",
            settings: "settings",
            sendmsg: "gedit",
        };

        this.emulator = null;
        this.skipNextRender = false;
    }

    componentDidMount() {
        this.initializeEmulator();
        this.reStartTerminal();
    }

    componentDidUpdate() {
        clearInterval(this.cursor);
        this.startCursor(this.terminal_rows - 2);
    }

    componentWillUnmount() {
        clearInterval(this.cursor);
    }

    initializeEmulator = () => {
        if (this.emulator) return;

        const emulatorState = {
            user: 'damian',
            workingDirectory: this.homeDirectory,
            fileSystem: this.createVirtualFileSystem(),
        };

        this.emulator = bashEmulator(emulatorState);
        this.registerCustomCommands();
        this.updateCurrentDirectory();
    }

    createVirtualFileSystem = () => {
        const now = Date.now();
        const fileSystem = {};
        const ensureDir = (path) => {
            if (!fileSystem[path]) {
                fileSystem[path] = { type: 'dir', modified: now };
            }
        };
        const ensureFile = (path, content = '') => {
            fileSystem[path] = { type: 'file', modified: now, content };
        };
        const formatListContent = (items) => {
            if (!Array.isArray(items) || items.length === 0) {
                return 'No data available.';
            }
            return items.map(item => `- ${item}`).join('\n');
        };

        const homePath = this.homeDirectory;

        ensureDir('/');
        ensureDir('/home');
        ensureDir(homePath);

        Object.entries(this.virtualDirectories).forEach(([directory, entries]) => {
            const parentPath = `${homePath}/${directory}`;
            ensureDir(parentPath);
            entries.forEach(entry => {
                ensureDir(`${parentPath}/${entry}`);
            });
        });

        const textFiles = this.virtualTextFiles || {};
        Object.entries(textFiles).forEach(([fileName, entries]) => {
            ensureFile(`${homePath}/${fileName}`, formatListContent(entries));
        });

        const projectFiles = this.projectTextFiles || [];
        ensureDir(`${homePath}/projects`);
        projectFiles.forEach(({ fileName, content }) => {
            ensureFile(`${homePath}/projects/${fileName}`, content);
        });

        ensureFile(`${homePath}/README.txt`, "Welcome to Damian's workspace. Explore projects, skills, languages, and interests.");

        this.virtualFileSystem = fileSystem;

        return fileSystem;
    }

    getAbsoluteCurrentDirectory = () => {
        if (this.current_directory.startsWith('~')) {
            return this.current_directory.replace('~', this.homeDirectory);
        }
        return this.current_directory || this.homeDirectory;
    }

    normalizePath = (path) => {
        if (!path) return this.homeDirectory;
        const segments = path.split('/');
        const stack = [];
        segments.forEach(segment => {
            if (!segment || segment === '.') return;
            if (segment === '..') {
                if (stack.length > 0) {
                    stack.pop();
                }
            } else {
                stack.push(segment);
            }
        });
        return `/${stack.join('/')}` || '/';
    }

    resolvePath = (inputPath = '.') => {
        const trimmed = (inputPath || '.').trim();
        const home = this.homeDirectory;
        if (!trimmed || trimmed === '.') {
            return this.getAbsoluteCurrentDirectory();
        }
        if (trimmed === '~') {
            return home;
        }
        if (trimmed.startsWith('~/')) {
            return this.normalizePath(trimmed.replace('~', home));
        }
        if (trimmed.startsWith('/')) {
            return this.normalizePath(trimmed);
        }
        const base = this.getAbsoluteCurrentDirectory();
        return this.normalizePath(`${base}/${trimmed}`);
    }

    parseCommandInfo = (command) => {
        if (!command) return null;
        const parts = command.trim().split(/\s+/);
        if (parts.length === 0) return null;
        const name = parts[0];
        const meta = { name };
        if (name === 'ls') {
            const args = parts.slice(1);
            const targetArg = [...args].reverse().find(arg => !arg.startsWith('-')) || '.';
            meta.path = this.resolvePath(targetArg);
        }
        return meta;
    }

    formatLsOutput = (output) => {
        const path = this.lastCommandInfo?.path || this.getAbsoluteCurrentDirectory();
        const lines = output.split('\n');
        const formattedLines = lines.map(line => this.colorizeLsLine(line, path));
        const html = formattedLines.join('\n');
        return `<pre class="text-white whitespace-pre-wrap">${html}</pre>`;
    }

    colorizeLsLine = (line, basePath) => {
        if (!line) return '';
        const tokens = line.split(/(\s+)/);
        return tokens.map(token => {
            if (!token) return '';
            if (/^\s+$/.test(token)) {
                return token;
            }
            return this.colorizeLsEntry(token, basePath);
        }).join('');
    }

    colorizeLsEntry = (entry, basePath) => {
        const sanitized = this.xss(entry);
        const targetPath = this.normalizePath(`${basePath}/${entry}`);
        const node = this.virtualFileSystem ? this.virtualFileSystem[targetPath] : null;
        if (node && node.type === 'dir') {
            return `<span class="text-ubt-blue">${sanitized}</span>`;
        }
        return sanitized;
    }

    getDirectoryEntries = (directoryPath) => {
        if (!this.virtualFileSystem) return [];
        const normalized = this.normalizePath(directoryPath || this.homeDirectory);
        const dirNode = this.virtualFileSystem[normalized];
        if (!dirNode || dirNode.type !== 'dir') return [];
        const baseWithSlash = normalized.endsWith('/') ? normalized : `${normalized}/`;
        const entries = new Set();
        Object.entries(this.virtualFileSystem).forEach(([path]) => {
            if (!path.startsWith(baseWithSlash)) return;
            const remainder = path.slice(baseWithSlash.length);
            if (!remainder || remainder.includes('/')) return;
            entries.add(remainder);
        });
        return Array.from(entries);
    }

    getCommonPrefix = (values = []) => {
        if (!values.length) return '';
        let prefix = values[0];
        for (let i = 1; i < values.length; i++) {
            const current = values[i];
            let j = 0;
            while (j < prefix.length && j < current.length && prefix[j] === current[j]) {
                j++;
            }
            prefix = prefix.slice(0, j);
            if (!prefix) break;
        }
        return prefix;
    }

    completePath = (partial) => {
        if (!partial) return null;
        const trimmed = partial.trim();
        if (!trimmed) return null;
        const lastSlash = trimmed.lastIndexOf('/');
        const dirPart = lastSlash >= 0 ? trimmed.slice(0, lastSlash + 1) : '';
        const partialName = lastSlash >= 0 ? trimmed.slice(lastSlash + 1) : trimmed;
        const baseDir = this.resolvePath(dirPart || '.');
        const entries = this.getDirectoryEntries(baseDir);
        const matches = entries.filter(name => name.startsWith(partialName));
        if (matches.length === 0) {
            return null;
        }
        const candidate = matches.length === 1 ? matches[0] : this.getCommonPrefix(matches);
        if (!candidate) return null;
        if (candidate.length === partialName.length && matches.length > 1) {
            return null;
        }
        return dirPart + candidate;
    }

    getCompletionForToken = (token) => {
        return this.completePath(token);
    }

    handleTabCompletion = (inputEl, rowId) => {
        if (!inputEl) return;
        const value = inputEl.value || '';
        const cursor = typeof inputEl.selectionStart === 'number' ? inputEl.selectionStart : value.length;
        const before = value.slice(0, cursor);
        const after = value.slice(cursor);
        const completedBefore = this.applyTabCompletion(before);
        if (!completedBefore) return;
        const newValue = completedBefore + after;
        inputEl.value = newValue;
        if (typeof inputEl.setSelectionRange === 'function') {
            const newCursor = completedBefore.length;
            inputEl.setSelectionRange(newCursor, newCursor);
        }
        $(`#show-${rowId}`).text(newValue);
    }

    applyTabCompletion = (beforeCursor) => {
        if (beforeCursor == null) return null;
        let start = beforeCursor.length;
        while (start > 0 && !/\s/.test(beforeCursor[start - 1])) {
            start--;
        }
        const prefix = beforeCursor.slice(0, start);
        const token = beforeCursor.slice(start);
        if (!token) return null;
        const completedToken = this.getCompletionForToken(token);
        if (!completedToken) return null;
        return prefix + completedToken;
    }

    registerCustomCommands = () => {
        if (!this.emulator) return;
        const { commands } = this.emulator;

        commands.echo = (env, args = []) => {
            env.output(args.join(' '));
            env.exit(0);
        };

        commands.clear = (env) => {
            this.skipNextRender = true;
            this.reStartTerminal();
            env.output('');
            env.exit(0);
        };

        commands.exit = (env) => {
            this.skipNextRender = true;
            this.closeTerminal();
            env.output('');
            env.exit(0);
        };

        commands.help = (env) => {
            env.output(this.getAvailableCommandsString());
            env.exit(0);
        };

        commands.cowsay = (env, args = []) => {
            const text = args.join(' ') || 'Moo!';
            env.output(this.getCowsay(text));
            env.exit(0);
        };

        commands.sudo = (env) => {
            ReactGA.event({
                category: "Sudo Access",
                action: "lol",
            });
            env.output("__HTML__<img class=' w-2/5' src='./images/memes/used-sudo-command.webp' />");
            env.exit(0);
        };

        Object.entries(this.appLaunchCommands).forEach(([commandName, appName]) => {
            commands[commandName] = (env, args = []) => {
                const isValidArgument = args.length === 0 || (args.length === 1 && args[0] === '.');
                if (!isValidArgument) {
                    env.error(`Usage: ${commandName} .`);
                    env.exit(1);
                    return;
                }

                if (typeof this.props.openApp === 'function') {
                    this.props.openApp(appName);
                    env.output(`Opening ${appName}...`);
                    env.exit(0);
                } else {
                    env.error('App launcher unavailable.');
                    env.exit(1);
                }
            };
        });
    }

    async updateCurrentDirectory() {
        if (!this.emulator) return;
        try {
            const dir = await this.emulator.getDir();
            this.current_directory = dir.replace(this.homeDirectory, '~');
        } catch (error) {
            console.error('Unable to read emulator directory', error);
            this.current_directory = '~';
        }
    }

    getCowsay = (text) => {
        let dashes = "-".repeat(text.length + 2);
        return ` ${dashes}
< ${text} >
 ${dashes}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;
    }

    getAvailableCommandsString = () => {
        if (!this.emulator || !this.emulator.commands) {
            return "Initializing terminal...";
        }
        const commandList = Object.keys(this.emulator.commands).sort();
        return `Available Commands: [ ${commandList.join(", ")} ]`;
    }

    reStartTerminal = () => {
        clearInterval(this.cursor);
        this.setState({ terminal: [] }, () => {
            this.terminal_rows = 1;

            const welcomeText = "Welcome to Ubuntu! Type 'help' to see available commands.";
            const cowsay = (
                <div className="text-white whitespace-pre font-normal" key="welcome-cowsay">
                    {this.getCowsay(welcomeText)}
                </div>
            );

            this.setState({ terminal: [cowsay] }, () => {
                this.appendTerminalRow();
            });
        });
    }

    appendTerminalRow = () => {
        let terminal = [...this.state.terminal];
        terminal.push(this.terminalRow(this.terminal_rows));
        this.setState({ terminal });
        this.terminal_rows += 2;
    }

    terminalRow = (id) => {
        return (
            <React.Fragment key={id}>
                <div className="flex w-full h-5">
                    <div className="flex">
                        <div className=" text-ubt-green">damian@ubuntu</div>
                        <div className="text-white mx-px font-medium">:</div>
                        <div className=" text-ubt-blue">{this.current_directory}</div>
                        <div className="text-white mx-px font-medium mr-1">$</div>
                    </div>
                    <div id="cmd" onClick={this.focusCursor} className=" bg-transperent relative flex-1 overflow-hidden">
                        <span id={`show-${id}`} className=" float-left whitespace-pre pb-1 opacity-100 font-normal tracking-wider"></span>
                        <div id={`cursor-${id}`} className=" float-left mt-1 w-1.5 h-3.5 bg-white"></div>
                        <input id={`terminal-input-${id}`} data-row-id={id} onKeyDown={this.checkKey} onBlur={this.unFocusCursor} className=" absolute top-0 left-0 w-full opacity-0 outline-none bg-transparent" spellCheck={false} autoFocus={true} autoComplete="off" type="text" />
                    </div>
                </div>
                <div id={`row-result-${id}`} className={"my-2 font-normal"}></div>
            </React.Fragment>
        );
    }

    focusCursor = (e) => {
        clearInterval(this.cursor);
        this.startCursor($(e.target).data("row-id"));
    }

    unFocusCursor = (e) => {
        this.stopCursor($(e.target).data("row-id"));
    }

    startCursor = (id) => {
        clearInterval(this.cursor);
        $(`input#terminal-input-${id}`).trigger("focus");
        $(`input#terminal-input-${id}`).on("input", function () {
            $(`#cmd span#show-${id}`).text($(this).val());
        });
        this.cursor = window.setInterval(function () {
            if ($(`#cursor-${id}`).css('visibility') === 'visible') {
                $(`#cursor-${id}`).css({ visibility: 'hidden' });
            } else {
                $(`#cursor-${id}`).css({ visibility: 'visible' });
            }
        }, 500);
    }

    stopCursor = (id) => {
        clearInterval(this.cursor);
        $(`#cursor-${id}`).css({ visibility: 'visible' });
    }

    removeCursor = (id) => {
        this.stopCursor(id);
        $(`#cursor-${id}`).css({ display: 'none' });
    }

    clearInput = (id) => {
        $(`input#terminal-input-${id}`).trigger("blur");
    }

    checkKey = async (e) => {
        const terminal_row_id = $(e.target).data("row-id");
        if (e.key === "Enter") {
            let command = $(`input#terminal-input-${terminal_row_id}`).val().trim();
            if (command.length === 0) return;
            this.removeCursor(terminal_row_id);
            await this.handleCommands(command, terminal_row_id);
            this.clearInput(terminal_row_id);
        }
        else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (!this.emulator) return;
            const prev_command = await this.emulator.completeUp($(`input#terminal-input-${terminal_row_id}`).val());
            if (typeof prev_command === 'string') {
                $(`input#terminal-input-${terminal_row_id}`).val(prev_command);
                $(`#show-${terminal_row_id}`).text(prev_command);
            }
        }
        else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (!this.emulator) return;
            const next_command = await this.emulator.completeDown($(`input#terminal-input-${terminal_row_id}`).val());
            const value = typeof next_command === 'string' ? next_command : '';
            $(`input#terminal-input-${terminal_row_id}`).val(value);
            $(`#show-${terminal_row_id}`).text(value);
        }
        else if (e.key === "Tab") {
            e.preventDefault();
            this.handleTabCompletion(e.target, terminal_row_id);
        }
    }

    closeTerminal = () => {
        $("#close-terminal").trigger('click');
    }

    handleCommands = async (command, rowId) => {
        if (!this.emulator) {
            const resultEl = document.getElementById(`row-result-${rowId}`);
            if (resultEl) {
                resultEl.innerHTML = "Initializing terminal...";
            }
            this.appendTerminalRow();
            return;
        }

        this.lastCommandInfo = this.parseCommandInfo(command);

        let output = "";
        try {
            output = await this.emulator.run(command);
        } catch (error) {
            output = error?.message || 'Unknown error';
        }

        if (this.skipNextRender) {
            this.skipNextRender = false;
            return;
        }

        this.renderCommandResult(rowId, output);
        await this.updateCurrentDirectory();
        this.appendTerminalRow();
    }

    renderCommandResult = (rowId, output) => {
        const resultEl = document.getElementById(`row-result-${rowId}`);
        if (!resultEl) return;
        resultEl.innerHTML = this.formatCommandOutput(output);
    }

    formatCommandOutput = (output) => {
        if (!output) return "";
        const value = typeof output === 'string' ? output : String(output);
        if (value.startsWith('__HTML__')) {
            return value.replace('__HTML__', '');
        }
        if (this.lastCommandInfo?.name === 'ls') {
            return this.formatLsOutput(value);
        }
        return `<pre class="text-white whitespace-pre-wrap">${this.xss(value)}</pre>`;
    }

    xss(str) {
        if (!str) return;
        return str.split('').map(char => {
            switch (char) {
                case '&':
                    return '&amp';
                case '<':
                    return '&lt';
                case '>':
                    return '&gt';
                case '"':
                    return '&quot';
                case "'":
                    return '&#x27';
                case '/':
                    return '&#x2F';
                default:
                    return char;
            }
        }).join('');
    }

    render() {
        return (
            <div className="h-full w-full bg-ub-drk-abrgn text-white text-sm font-bold font-mono" id="terminal-body">
                {
                    this.state.terminal
                }
            </div>
        )
    }
}

export default Terminal

export const displayTerminal = (addFolder, openApp) => {
    return <Terminal addFolder={addFolder} openApp={openApp}> </Terminal>;
}
