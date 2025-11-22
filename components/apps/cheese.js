import React, { Component } from 'react';
import { EVENTS, subscribe } from '../base/events';

export class Cheese extends Component {
    constructor() {
        super();
        this.state = {
            stream: null,
            error: null,
        }
        this.videoRef = React.createRef();
        this.appId = "cheese";
        this.unsubscribeWindowMinimized = null;
        this.unsubscribeWindowRestored = null;
        this.unsubscribeWindowClosed = null;
        this.pendingStreamRequest = null;
    }

    componentDidMount() {
        this.unsubscribeWindowMinimized = subscribe(EVENTS.WINDOW_MINIMIZED, this.handleWindowMinimized);
        this.unsubscribeWindowRestored = subscribe(EVENTS.WINDOW_RESTORED, this.handleWindowRestored);
        this.unsubscribeWindowClosed = subscribe(EVENTS.WINDOW_CLOSED, this.handleWindowClosed);
        this.startCamera();
    }
 
    componentWillUnmount() {
        if (this.unsubscribeWindowMinimized) this.unsubscribeWindowMinimized();
        if (this.unsubscribeWindowRestored) this.unsubscribeWindowRestored();
        if (this.unsubscribeWindowClosed) this.unsubscribeWindowClosed();
    }

    handleWindowMinimized = (payload) => {
        if (payload?.app_id === this.appId) {
            this.stopCamera();
        }
    }

    handleWindowClosed = (payload) => {
        if (payload?.app_id === this.appId) {
            this.stopCamera();
        }
    }

    handleWindowRestored = (payload) => {
        if (payload?.app_id === this.appId) {
            this.startCamera();
        }
    }
 
    startCamera = async () => {

        if (this.state.stream || this.pendingStreamRequest) {
            return;
        }

        this.pendingStreamRequest = navigator.mediaDevices.getUserMedia({ video: true });

        try {
            const stream = await this.pendingStreamRequest;
            this.pendingStreamRequest = null;

            this.setState({ stream, error: null }, () => {
                if (this.videoRef.current) {
                    this.videoRef.current.srcObject = stream;
                }
            });
        } catch (err) {
            this.pendingStreamRequest = null;
            this.setState({ error: "Could not access the camera. Please ensure you have given permission." });
        }
    }
 
    stopCamera = () => {

        const stream = this.state.stream;

        if (!stream) {
            return;
        }

        stream.getTracks().forEach(track => track.stop());

        if (this.videoRef.current) {
            this.videoRef.current.srcObject = null;
        }

        this.setState({ stream: null });
    }

    render() {

        return (
            <div className="w-full h-full bg-ub-cool-grey flex flex-col justify-center items-center text-white relative">
                {this.state.error ? (
                    <div className="text-center p-4">
                        <p className="text-lg">{this.state.error}</p>
                    </div>
                ) : (
                    <div className="relative w-full h-full flex flex-col">
                        <video 
                            ref={this.videoRef} 
                            autoPlay 
                            playsInline 
                            className="w-full h-full object-cover"
                            style={{ transform: "scaleX(-1)" }} // Mirror effect like Cheese
                        />
                        <div className="absolute bottom-8 left-0 right-0 flex justify-center pb-4">
                             <div className="bg-black bg-opacity-50 rounded-full p-4 cursor-pointer hover:bg-opacity-70 transition-all active:scale-95" onClick={() => {
                                 // Simple flash effect or "snap" logic could go here
                                 const flash = document.createElement("div");
                                 flash.className = "absolute top-0 left-0 w-full h-full bg-white opacity-0 transition-opacity duration-100";
                                 flash.style.zIndex = 100;
                                 this.videoRef.current.parentNode.appendChild(flash);
                                 
                                 // Trigger flash
                                 requestAnimationFrame(() => {
                                     flash.classList.remove("opacity-0");
                                     flash.classList.add("opacity-75");
                                     setTimeout(() => {
                                         flash.classList.remove("opacity-75");
                                         flash.classList.add("opacity-0");
                                         setTimeout(() => flash.remove(), 150);
                                     }, 100);
                                 });
                             }}>
                                <div className="w-10 h-10 rounded-full border-4 border-white bg-transparent flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full bg-white hover:bg-gray-200 transition-colors"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export const displayCheese = (openApp) => {
    return <Cheese />;
}

export default Cheese;
