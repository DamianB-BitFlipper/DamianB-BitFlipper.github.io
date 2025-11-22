import React, { useEffect, useRef, useState, Component } from 'react';
import { EVENTS, subscribe } from './events';

const InputLine = React.forwardRef(({ 
    value, 
    onChange, 
    cursorPos, 
    onCursorPosChange, 
    onKeyDown, 
    isFocused, // Prop to force focus programmatically
    id,
    ...rest
}, ref) => {
    const internalInputRef = useRef(null);
    const inputRef = ref || internalInputRef;
    
    const [internalValue, setInternalValue] = useState('');
    const [internalCursorPos, setInternalCursorPos] = useState(0);
    const [internalFocused, setInternalFocused] = useState(false);

    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const currentCursorPos = isControlled ? (cursorPos || 0) : internalCursorPos;

    // Sync internal focus state if isFocused prop changes to true
    useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
            setInternalFocused(true);
        }
    }, [isFocused, inputRef]);

    const handleInputChange = (e) => {
        const val = e.target.value;
        const pos = e.target.selectionStart;
        
        if (!isControlled) {
            setInternalValue(val);
            setInternalCursorPos(pos);
        }

        if (onChange) onChange(val);
        if (onCursorPosChange) onCursorPosChange(pos);
    };

    const handleSelect = (e) => {
        const pos = e.target.selectionStart;
        if (!isControlled) {
            setInternalCursorPos(pos);
        }
        if (onCursorPosChange) onCursorPosChange(pos);
    };
    
    const handleFocus = (e) => {
        setInternalFocused(true);
        if (rest.onFocus) rest.onFocus(e);
    };

    const handleBlur = (e) => {
        setInternalFocused(false);
        if (rest.onBlur) rest.onBlur(e);
    };

    const displayValue = currentValue && currentValue.length > 0 ? currentValue : '\u00a0';
    const cursorStyle = {
        '--cursor-pos': currentCursorPos,
        '--cursor-animation': (internalFocused || isFocused) ? 'blinkCursor 1s steps(1) infinite' : 'none',
    };

    return (
        <div className="relative flex-1 overflow-hidden" onClick={() => inputRef.current && inputRef.current.focus()}>
            <div
                className="terminal-input-line"
                style={cursorStyle}
            >
                <span className="whitespace-pre pb-1 opacity-100 font-normal block">
                    {displayValue}
                </span>
            </div>
            <input
                ref={inputRef}
                id={id}
                className="absolute top-0 left-0 w-full h-full opacity-0 outline-none bg-transparent cursor-default"
                spellCheck={false}
                autoFocus={isFocused}
                autoComplete="off"
                type="text"
                value={currentValue}
                onChange={handleInputChange}
                onSelect={handleSelect}
                onKeyDown={onKeyDown}
                onKeyUp={handleSelect}
                onFocus={handleFocus}
                onBlur={handleBlur}
                {...rest}
            />
        </div>
    );
});

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
            this.setState({ isFocused: true });
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
