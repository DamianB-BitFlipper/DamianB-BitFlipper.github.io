const handlerWrappers = new Map();

export const EVENTS = Object.freeze({
    WINDOW_FOCUSED: "window-focused",
    WINDOW_DRAGGING_START: "dragging-start",
    WINDOW_DRAGGING_STOP: "dragging-stop",
    WINDOW_MINIMIZED: "window-minimized",
    WINDOW_RESTORED: "window-restored",
    WINDOW_CLOSED: "window-closed",
});

const createCustomEvent = (eventName, detail) => {
    if (typeof window !== 'undefined' && typeof window.CustomEvent === 'function') {
        return new window.CustomEvent(eventName, { detail });
    }

    if (typeof CustomEvent === 'function') {
        return new CustomEvent(eventName, { detail });
    }

    if (typeof Event === 'function') {
        const event = new Event(eventName);
        event.detail = detail;
        return event;
    }

    return { type: eventName, detail };
};

export const subscribe = (eventName, handler) => {
    if (typeof window === 'undefined' || typeof window.addEventListener !== 'function' || typeof handler !== 'function') {
        return () => { };
    }

    const eventHandler = (event) => {
        handler(event?.detail);
    };

    handlerWrappers.set(handler, eventHandler);
    window.addEventListener(eventName, eventHandler);

    return () => {
        window.removeEventListener(eventName, eventHandler);
        handlerWrappers.delete(handler);
    };
};

export const unsubscribe = (eventName, handler) => {
    if (typeof window === 'undefined' || typeof window.removeEventListener !== 'function' || typeof handler !== 'function') {
        return;
    }

    const eventHandler = handlerWrappers.get(handler) || handler;
    window.removeEventListener(eventName, eventHandler);
    handlerWrappers.delete(handler);
};

export const publishEvent = (eventName, payload) => {
    if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') {
        return;
    }

    const event = createCustomEvent(eventName, payload);
    if (event) {
        window.dispatchEvent(event);
    }
};
