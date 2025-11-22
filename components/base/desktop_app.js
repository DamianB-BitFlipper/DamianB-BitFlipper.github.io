import React, { Component } from 'react'
import Draggable from 'react-draggable';

export class DesktopApp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isTouchDevice: this.detectTouchDevice()
        };
    }

    componentDidMount() {
        const detected = this.detectTouchDevice();
        if (detected !== this.state.isTouchDevice) {
            this.setState({ isTouchDevice: detected });
        }
    }

    detectTouchDevice = () => {
        if (typeof window === 'undefined') return false;
        const hasTouchEvents = 'ontouchstart' in window;
        const nav = typeof navigator !== 'undefined' ? navigator : null;
        const hasTouchPoints = nav ? ((nav.maxTouchPoints || 0) > 0 || (nav.msMaxTouchPoints || 0) > 0) : false;
        const prefersCoarsePointer = typeof window.matchMedia === 'function' ? window.matchMedia('(pointer: coarse)').matches : false;
        return hasTouchEvents || hasTouchPoints || prefersCoarsePointer;
    }

    isTouchEnvironment = () => {
        if (this.state.isTouchDevice) return true;
        const detected = this.detectTouchDevice();
        if (detected && !this.state.isTouchDevice) {
            this.setState({ isTouchDevice: true });
        }
        return detected;
    }

    handleClick = (event) => {
        if (!this.isTouchEnvironment()) return;
        this.openApp();
    }

    openApp = () => {
        if (this.props.isExternalApp && this.props.url) {
            window.open(this.props.url, "_blank");
        } else {
            this.props.openApp(this.props.id);
        }
    }

    render() {
        const { isTouchDevice } = this.state;
        return (
            <Draggable axis="both" grid={[25, 25]} bounds="parent" disabled={isTouchDevice}>
                <div
                    className="p-1 m-px z-10 bg-white bg-opacity-0 hover:bg-opacity-20 focus:bg-ub-orange focus:bg-opacity-50 focus:border-yellow-700 focus:border-opacity-100 border border-transparent outline-none rounded select-none w-24 h-20 flex flex-col justify-start items-center text-center text-xs font-normal text-white relative"
                    id={"app-" + this.props.id}
                    onDoubleClick={!isTouchDevice ? this.openApp : undefined}
                    onClick={this.handleClick}
                    tabIndex={0}
                >
                    <div className="relative">
                        <img width="40px" height="40px" className="mb-1 w-10" src={this.props.icon} alt={"Ubuntu " + this.props.name} />
                        {this.props.isExternalApp && (
                            <img 
                                src="./themes/system_icons/arrow-up-right.svg" 
                                alt="External Link" 
                                className="w-2.5 h-2.5 absolute -bottom-0.5 -right-0.5"
                            />
                        )}
                    </div>
                    {this.props.name}
                </div>
            </Draggable>
        )
    }
}

export default DesktopApp
