import React, { Component } from 'react'
import $ from 'jquery';
import ReactGA from 'react-ga4';
import bashEmulator from 'bash-emulator';
import { skills, languages, interests } from '../../content/user_data.json';
import projectsData from '../../content/projects.json';
import { EVENTS, subscribe } from '../base/events';
import CLI from '../base/cli';

export class Terminal extends CLI {
    constructor(props) {
        super(props);
        this.appId = 'terminal';
        this.current_directory = "~";
        // Merge state
        this.state = {
            ...this.state,
            rowId: 1,
        }

        this.virtualDirectories = {
            projects: [],
        };

        this.projectTextFiles = [];

        this.virtualTextFiles = {
            'skills.txt': skills,
            'languages.txt': languages,
            'interests.txt': interests,
        };

        this.homeDirectory = '/home/damian';
        this.virtualFileSystem = {};
        this.lastCommandInfo = null;
        this.unsubscribeWindowFocused = null;
        this.unsubscribeWindowDraggingStart = null;
        this.unsubscribeWindowDraggingStop = null;

        this.appLaunchCommands = {
            code: "vscode",
            spotify: "spotify",
            firefox: "firefox",
            trash: "trash",
            "about-damian": "about-damian",
            settings: "settings",
            sendmsg: "gedit",
            chess: "chess",
            cheese: "cheese",
        };

        this.emulator = null;
        // this.terminalRootRef = React.createRef(); // Handled by CLI base (containerRef)
        // this.inputRef = React.createRef(); // Handled by CLI base
    }

    componentDidMount() {
        super.componentDidMount();
        this.initializeEmulator();
        this.reStartTerminal();
        this.loadProjectsFromData();
        this.unsubscribeWindowDraggingStart = subscribe(EVENTS.WINDOW_DRAGGING_START, this.handleWindowDraggingStart);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (typeof this.unsubscribeWindowDraggingStart === 'function') {
            this.unsubscribeWindowDraggingStart();
            this.unsubscribeWindowDraggingStart = null;
        }
    }


    loadProjectsFromData = () => {
        const repos = this.extractRepositoriesFromData(projectsData);
        this.projectTextFiles = repos.map(repo => this.mapRepoToFile(repo));
        this.refreshVirtualFileSystem();
    }

    // handleWindowFocusedEvent handled by CLI
    // handleWindowDraggingStop handled by CLI

    extractRepositoriesFromData = (data) => {
        const nodes = data?.data?.user?.repositories?.nodes || [];
        return nodes.map(node => ({
            name: node?.name || 'project',
            description: node?.description || '',
            stargazers_count: typeof node?.stargazerCount === 'number' ? node.stargazerCount : 0,
            language: node?.primaryLanguage?.name,
        }));
    }

    mapRepoToFile = (repo) => {

        const safeName = (repo.name || 'project').toLowerCase().replace(/[^a-z0-9-_]/gi, '-');
        return {
            fileName: `${safeName}.txt`,
            content: this.formatProjectFileContent(repo),
        };
    }

    formatProjectFileContent = (repo) => {
        const lines = [];
        if (repo.language) {
            lines.push(`Language: ${repo.language}`);
        }
        if (repo.stargazers_count && repo.stargazers_count > 0) {
            lines.push(`Stars: ${repo.stargazers_count}`);
        }
        const description = repo.description && repo.description.trim().length > 0
            ? repo.description.trim()
            : 'No description provided.';
        if (lines.length > 0) {
            lines.push('');
        }
        lines.push(description);
        return lines.join('\n');
    }

    refreshVirtualFileSystem = () => {
        const fileSystem = this.createVirtualFileSystem();
        if (this.emulator) {
            this.emulator.state.fileSystem = fileSystem;
        }
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
        const args = parts.slice(1);
        const meta = { name, args };
        if (name === 'ls') {
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

    appendCommandToHistory = (command) => {
        if (this.emulator?.state?.history) {
            this.emulator.state.history.push(command);
        }
    }

    outputError = (message) => {
        const finalMessage = message || 'Unknown error';
        const target = document.querySelector(`#row-result-${this.terminal_rows - 1}`);
        if (target) {
            target.innerHTML = `<pre class="text-white whitespace-pre-wrap">${this.xss(finalMessage)}</pre>`;
        }
    }

    executeAppLaunchCommand = (commandName, args = []) => {
        const appId = this.appLaunchCommands[commandName];
        if (!appId) {
            throw new Error(`${commandName}: command not available`);
        }
        const isValidArgument = args.length === 0 || (args.length === 1 && args[0] === '.');
        if (!isValidArgument) {
            throw new Error(`Usage: ${commandName} .`);
        }
        if (typeof this.props.openApp !== 'function') {
            throw new Error('App launcher unavailable.');
        }
        try {
            const openResult = this.props.openApp(appId);
            if (openResult instanceof Promise) {
                return openResult.then(() => `Opening ${appId}...`).catch((err) => {
                    throw new Error(err?.message || 'App launcher unavailable.');
                });
            }
        } catch (err) {
            throw new Error(err?.message || 'App launcher unavailable.');
        }
        return `Opening ${appId}...`;
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

    getCommandNames = () => {
        if (!this.emulator || !this.emulator.commands) return [];
        return Object.keys(this.emulator.commands);
    }

    completeCommand = (partial) => {
        if (!partial) return null;
        const commands = this.getCommandNames();
        const matches = commands.filter(cmd => cmd.startsWith(partial));
        if (matches.length === 0) {
            return null;
        }
        const candidate = matches.length === 1 ? matches[0] : this.getCommonPrefix(matches);
        if (!candidate) return null;
        if (candidate.length === partial.length && matches.length > 1) {
            return null;
        }
        return candidate;
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

    getCompletionForToken = (token, { isFirstToken } = {}) => {
        if (isFirstToken) {
            return this.completeCommand(token);
        }
        return this.completePath(token);
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
        const isFirstToken = prefix.trim().length === 0;
        const completedToken = this.getCompletionForToken(token, { isFirstToken });
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
            env.output("__HTML__<img class=' w-2/5' src='./themes/memes/used-sudo-command.webp' />");
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
        const welcomeText = "Welcome to Ubuntu! Type 'help' to see available commands.";
        const cowsay = (
            <div className="text-white whitespace-pre font-normal" key="welcome-cowsay">
                {this.getCowsay(welcomeText)}
            </div>
        );

        this.setState({
            outputList: [cowsay],
            userInput: '',
            cursorPos: 0,
            rowId: 1,
        });
    }

    // handleInputChange handled by CLI
    // handleSelectionChange handled by CLI
    // focusCursor handled by CLI (but needs ensuring container ref is used)
    // unFocusCursor handled by CLI state update (or override)
    // checkKey handled by CLI (wraps handleKeyDown)

    // We need to override executeCommand to use handleCommands logic
    executeCommand = async (command) => {
        await this.handleCommands(command);
    }



    focusCursor = () => {
        const input = this.inputRef.current;
        if (input) {
            input.focus();
            const position = typeof input.selectionStart === 'number' ? input.selectionStart : this.state.userInput.length;
            this.setState({ isFocused: true, cursorPos: position });
            return;
        }
        this.setState({ isFocused: true });
    }

    unFocusCursor = () => {
        this.setState({ isFocused: false });
        if (this.inputRef.current) {
            this.inputRef.current.blur();
        }
    }

    checkKey = async (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (this.state.userInput.trim().length === 0) return;
            await this.handleCommands(this.state.userInput.trim());
        }
        else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (!this.emulator) return;
            const prev_command = await this.emulator.completeUp(this.state.userInput);
            if (typeof prev_command === 'string') {
                this.setState({ userInput: prev_command, cursorPos: prev_command.length });
            }
        }
        else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (!this.emulator) return;
            const next_command = await this.emulator.completeDown(this.state.userInput);
            const value = typeof next_command === 'string' ? next_command : '';
            this.setState({ userInput: value, cursorPos: value.length });
        }
        else if (e.key === "Tab") {
            e.preventDefault();
            // Handle tab completion logic manually or adapt existing
            // For simplicity, reusing a modified version of handleTabCompletion logic inline
            // or just ignoring it if too complex to refactor in one go.
            // Let's use the existing helper but adapted.
            const completed = this.applyTabCompletion(this.state.userInput);
            if (completed) {
                this.setState({ userInput: completed, cursorPos: completed.length });
            }
        }
    }

    handleKeyDown = async (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const completed = this.applyTabCompletion(this.state.userInput);
            if (completed) {
                this.setState({ userInput: completed, cursorPos: completed.length });
            }
            return;
        }
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            // Terminal uses emulator for history, not local state history?
            // Original code: emulator.completeUp / completeDown.
            // This seems to use bash-emulator's history.
            // We should probably stick to that if possible, OR use CLI's history.
            // CLI history is simpler array. Emulator might be smarter.
            // Let's use emulator if available, else fallback to super (or override super completely).
            if (this.emulator) {
                const method = e.key === "ArrowUp" ? 'completeUp' : 'completeDown';
                const cmd = await this.emulator[method](this.state.userInput);
                const value = typeof cmd === 'string' ? cmd : '';
                this.setState({ userInput: value, cursorPos: value.length });
            }
            return;
        }
        // For Enter, we let CLI handle it, which calls executeCommand.
        // But wait, original checkKey handled "Enter" by calling handleCommands directly AND 
        // preventing default. CLI's handleKeyDown does:
        // executeCommand, then adds to CLI history.
        // Terminal app adds to history inside handleCommands via `appendCommandToHistory`.
        // If we use CLI's history management, we might double up or conflict.
        // Let's Override handleKeyDown completely to maintain specific behavior 
        // OR adapt handleCommands.
        
        // Original handleCommands:
        // 1. Render history row (processing)
        // 2. Run command
        // 3. Render history row (completed)
        // 4. setState(rowId + 1)
        
        // If I rely on CLI's handleKeyDown, it calls executeCommand then clears input.
        // It does NOT render the "Processing..." state.
        // And it adds to `commandHistory`.
        
        // It seems safer to Override handleKeyDown to keep exact logic, 
        // OR modify executeCommand to do everything and return a promise.
        
        // If I use super.handleKeyDown(e), it will:
        // 1. executeCommand(val)
        // 2. setState({ userInput: '', ... })
        
        // Terminal wants to show "Processing..." *before* finishing.
        // So I should probably just implement handleKeyDown here similar to original checkKey.
        
        if (e.key === "Enter") {
            e.preventDefault();
            if (this.state.userInput.trim().length === 0) return;
            await this.handleCommands(this.state.userInput.trim());
        }
    }

    handleCommands = async (command) => {
        // 1. Commit current row to history
        const currentRow = this.renderHistoryRow(this.state.rowId, this.current_directory, command, "Processing...", false);
        
        // We append this immediately to show "Processing..."
        this.setState(prevState => ({
            outputList: [...prevState.outputList, currentRow],
            userInput: '' // Clear input immediately
        }));

        this.lastCommandInfo = this.parseCommandInfo(command);
        let output = "";
        try {
            const commandName = this.lastCommandInfo?.name;
            const isAppCommand = Boolean(commandName && this.appLaunchCommands[commandName]);
            if (isAppCommand) {
                const result = this.executeAppLaunchCommand(commandName, this.lastCommandInfo?.args || []);
                output = result instanceof Promise ? await result : result;
                this.appendCommandToHistory(command);
            } else {
                output = await this.emulator.run(command);
            }
        } catch (error) {
            output = typeof error === 'string' ? error : error?.message || 'Unknown error';
        }

        const formattedOutput = this.formatCommandOutput(output);
        
        // Commit to history with result
        const completedRow = this.renderHistoryRow(this.state.rowId, this.current_directory, command, formattedOutput, true);
        
        this.setState(prevState => ({
            // Replace the "Processing" row (last item) with completedRow
            outputList: [...prevState.outputList.slice(0, -1), completedRow], 
            cursorPos: 0,
            rowId: prevState.rowId + 1,
        }));

        await this.updateCurrentDirectory();
    }

    renderHistoryRow = (id, dir, command, output, hasOutput) => {
        return (
            <React.Fragment key={id}>
                <div className="flex w-full h-5">
                    <div className="flex">
                        <div className=" text-ubt-green">damian@ubuntu</div>
                        <div className="text-white mx-px font-medium">:</div>
                        <div className=" text-ubt-blue">{dir}</div>
                        <div className="text-white mx-px font-medium mr-1">$</div>
                    </div>
                    <div className="text-white whitespace-pre font-normal">{command}</div>
                </div>
                {hasOutput && (
                    <div className="my-2 font-normal" dangerouslySetInnerHTML={{ __html: output }}></div>
                )}
            </React.Fragment>
        );
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

    closeTerminal = () => {
        $("#close-terminal").trigger('click');
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    // Override render to include the CLI inputs with specific props if needed
    // But CLI.render() is generic.
    // Terminal needs to render `this.current_directory` in the prompt.
    // CLI.renderInputLine accepts arguments for prompt.
    // So we override render().
    render() {
        return (
            <div 
                ref={this.containerRef}
                className="h-full w-full bg-ub-drk-abrgn text-white text-sm font-bold font-mono overflow-y-auto" 
                id="terminal-body"
                onClick={this.focusCursor}
            >
                {this.state.outputList}
                {this.renderInputLine('damian@ubuntu', this.current_directory)}
            </div>
        )
    }
}

export default Terminal

export const displayTerminal = (openApp) => {
    return <Terminal openApp={openApp}> </Terminal>;
}
