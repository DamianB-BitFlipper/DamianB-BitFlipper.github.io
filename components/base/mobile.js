export const detectTouchDevice = () => {
    if (typeof window === 'undefined') return false;
    const hasTouchEvents = 'ontouchstart' in window;
    const nav = typeof navigator !== 'undefined' ? navigator : null;
    const hasTouchPoints = nav ? ((nav.maxTouchPoints || 0) > 0 || (nav.msMaxTouchPoints || 0) > 0) : false;
    const prefersCoarsePointer = typeof window.matchMedia === 'function'
        ? window.matchMedia('(pointer: coarse)').matches
        : false;

    return hasTouchEvents || hasTouchPoints || prefersCoarsePointer;
};

export const isTouchEnvironment = (isTouchDevice, setTouchDevice) => {
    if (isTouchDevice) return true;

    const detected = detectTouchDevice();
    if (detected && typeof setTouchDevice === 'function') {
        setTouchDevice(true);
    }

    return detected;
};
