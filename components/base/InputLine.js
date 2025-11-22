import React, { useEffect, useRef, useState } from 'react';

const CLI = React.forwardRef(({ 
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

export default CLI;
