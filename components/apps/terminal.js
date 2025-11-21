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
            workingDirectory: '/home/damian',
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

        ensureDir('/');
        ensureDir('/home');
        ensureDir('/home/damian');

        Object.entries(this.virtualDirectories).forEach(([directory, entries]) => {
            const parentPath = `/home/damian/${directory}`;
            ensureDir(parentPath);
            entries.forEach(entry => {
                ensureDir(`${parentPath}/${entry}`);
            });
        });

        const textFiles = this.virtualTextFiles || {};
        Object.entries(textFiles).forEach(([fileName, entries]) => {
            ensureFile(`/home/damian/${fileName}`, formatListContent(entries));
        });

        const projectFiles = this.projectTextFiles || [];
        projectFiles.forEach(({ fileName, content }) => {
            ensureFile(`/home/damian/projects/${fileName}`, content);
        });

        ensureFile('/home/damian/README.txt', "Welcome to Damian's workspace. Explore projects, skills, languages, and interests.");

        return fileSystem;
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
            this.current_directory = dir.replace('/home/damian', '~');
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
