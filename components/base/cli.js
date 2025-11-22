import React, { Component } from 'react';
import InputLine from './InputLine';
import { EVENTS, subscribe } from './events';

export default class CLI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            outputList: [], // Visual history (rendered components)
            commandHistory: [], // String history for up/down arrows
            historyIndex: -1,
            userInput: '',
            cursorPos: 0,
            isFocused: false,
        };
        this.inputRef = React.createRef();
        this.containerRef = React.createRef();
        this.appId = null; // Subclasses should set this
        this.unsubscribeWindowFocused = null;
        this.unsubscribeWindowDraggingStop = null;
    }

    componentDidMount() {
        this.unsubscribeWindowFocused = subscribe(EVENTS.WINDOW_FOCUSED, this.handleWindowFocusedEvent);
        this.unsubscribeWindowDraggingStop = subscribe(EVENTS.WINDOW_DRAGGING_STOP, this.handleWindowDraggingStop);
    }

    componentWillUnmount() {
        if (this.unsubscribeWindowFocused) this.unsubscribeWindowFocused();
        if (this.unsubscribeWindowDraggingStop) this.unsubscribeWindowDraggingStop();
    }

    handleWindowFocusedEvent = (payload) => {
        if (!this.appId) return;
        const focusedAppId = payload?.app_id;

        if (focusedAppId === this.appId) {
            this.focusCursor();
            return;
        }

        // Unfocus the cursor if the event was sent to any other app
        this.setState({ isFocused: false });
    }

    handleWindowDraggingStop = (payload) => {
        if (!this.appId) return;
        if (payload?.app_id === this.appId) {
            this.focusCursor();
        }
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom = () => {
        if (this.containerRef.current) {
            this.containerRef.current.scrollTop = this.containerRef.current.scrollHeight;
        }
    }

    focusCursor = () => {
        if (this.inputRef.current) {
            // The InputLine component forwards focus to the real input
            // We also set state to update visual cursor
            this.setState({ isFocused: true });
            // We don't need to manually calculate cursor pos here usually, 
            // as the input retains it, but we can sync if needed.
            // If the component just mounted/focused, it might be 0 or end.
            // Let's let the input handle the DOM focus, we just track "isFocused" state for CSS.
            // Actually, to ensure the DOM input is focused:
            // The ref on InputLine exposes the underlying input or a method?
            // In InputLine.js: "const inputRef = ref || internalInputRef;" and it renders <input ref={inputRef} ... />
            // So this.inputRef.current will be the HTMLInputElement.
            this.inputRef.current.focus();
        }
    }

    handleInputChange = (val) => {
        this.setState({ userInput: val });
    }


    handleInputChange = (val) => {
        this.setState({ userInput: val });
    }

    handleCursorPosChange = (pos) => {
        this.setState({ cursorPos: pos });
    }

    handleKeyDown = async (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const command = this.state.userInput;
            if (!command.trim()) return; // Ignore empty
            
            await this.executeCommand(command);
            
            // Add to history (unless subclass handles it differently, but standard is here)
            this.setState(prevState => ({
                commandHistory: [...prevState.commandHistory, command],
                historyIndex: -1,
                userInput: '',
                cursorPos: 0
            }));
        }
        else if (e.key === "ArrowUp") {
            e.preventDefault();
            this.navigateHistory(1);
        }
        else if (e.key === "ArrowDown") {
            e.preventDefault();
            this.navigateHistory(-1);
        }
    }

    navigateHistory = (direction) => {
        const { commandHistory, historyIndex, userInput } = this.state;
        if (commandHistory.length === 0) return;

        let newIndex = historyIndex;
        // direction 1 = Up (older), -1 = Down (newer)
        // Wait, standard logic:
        // Up Arrow => index goes 0 -> 1 -> 2 (backwards in time usually means deeper into array if array is pushed? No, array push means last item is newest).
        // So: 
        // Start: index -1 (current input)
        // Up: index 0 (last item), index 1 (second to last)... ? 
        // Or usually: index points to the array index.
        // last item = length - 1.
        
        // Let's match standard array indexing.
        // history: [cmd1, cmd2, cmd3]
        // Up from empty: shows cmd3. Index becomes 2.
        // Up again: shows cmd2. Index becomes 1.
        // Down: shows cmd3. Index 2.
        // Down: shows empty. Index -1.

        let currentIdx = historyIndex === -1 ? commandHistory.length : historyIndex;
        
        if (direction === 1) { // Up
            currentIdx--;
        } else { // Down
            currentIdx++;
        }

        if (currentIdx < 0) currentIdx = 0;
        if (currentIdx > commandHistory.length) currentIdx = commandHistory.length;

        if (currentIdx === commandHistory.length) {
            this.setState({ userInput: '', historyIndex: -1, cursorPos: 0 });
        } else {
            const cmd = commandHistory[currentIdx];
            this.setState({ userInput: cmd, historyIndex: currentIdx, cursorPos: cmd.length });
        }
    }

    // Abstract method - to be implemented by subclass
    executeCommand = async (command) => {
        console.warn("executeCommand not implemented");
    }

    renderInputLine = (promptUser = "user", promptPath = "~") => {
        const { userInput, cursorPos, isFocused } = this.state;
        return (
            <div className="flex w-full h-5">
                <div className="flex">
                    <div className=" text-ubt-green">{promptUser}</div>
                    {promptUser && <div className="text-white mx-px font-medium">:</div>}
                    <div className=" text-ubt-blue">{promptPath}</div>
                    {promptPath && <div className="text-white mx-px font-medium mr-1">$</div>}
                    {(!promptUser && !promptPath) && <div className=" flex text-ubt-green h-1 mr-2"> {';'} </div>}
                </div>
                <InputLine
                    ref={this.inputRef}
                    value={userInput}
                    cursorPos={cursorPos}
                    isFocused={isFocused}
                    onChange={this.handleInputChange}
                    onCursorPosChange={this.handleCursorPosChange}
                    onKeyDown={this.handleKeyDown}
                />
            </div>
        );
    }

    render() {
        // Default render, can be overridden or used by subclass
        return (
            <div 
                ref={this.containerRef}
                className="h-full w-full bg-ub-drk-abrgn text-white text-sm font-bold font-mono overflow-y-auto" 
                onClick={this.focusCursor}
            >
                {this.state.outputList}
                {this.renderInputLine()}
            </div>
        );
    }
}
