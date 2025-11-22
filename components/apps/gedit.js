
import React, { Component } from 'react';

export class Gedit extends Component {

    constructor() {
        super();
        this.state = {
            sending: false,
        }
    }

    render() {
        return (
            <div className="w-full h-full relative flex flex-col bg-ub-cool-grey text-white select-none">
                <div className="flex items-center justify-between w-full bg-ub-gedit-light bg-opacity-60 border-b border-t border-blue-400 text-sm">
                    <span className="font-bold ml-2">{this.props.title || "Contact Information"}</span>
                    <div className="flex">
                    </div>
                </div>
                <div className="relative flex-grow flex flex-col bg-ub-gedit-dark font-normal windowMainScreen">
                    <div className="absolute left-0 top-0 h-full px-2 bg-ub-gedit-darker"></div>
                    <div className="relative flex flex-col pl-12 pt-4 text-sm font-mono space-y-4 text-gray-200">
                        {
                            this.props.content ? 
                            (
                                <div className="whitespace-pre-wrap">
                                    {this.props.content}
                                </div>
                            ) :
                            (
                                <>
                                    <div>
                                        <div className="text-ubt-gedit-blue font-bold"># Contact Information</div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-1">
                                        <span className="text-ubt-gedit-orange font-bold">Email:</span>
                                        <a href="mailto:damianb@alum.mit.edu" className="hover:underline hover:text-white">damianb@alum.mit.edu</a>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <span className="text-ubt-gedit-orange font-bold">GitHub:</span>
                                        <a href="https://github.com/DamianB-BitFlipper" target="_blank" rel="noreferrer" className="hover:underline hover:text-white">DamianB-BitFlipper</a>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <span className="text-ubt-gedit-orange font-bold">X:</span>
                                        <a href="https://x.com/TheBitFlipper" target="_blank" rel="noreferrer" className="hover:underline hover:text-white">@TheBitFlipper</a>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <span className="text-ubt-gedit-orange font-bold">LinkedIn:</span>
                                        <a href="https://www.linkedin.com/in/damian-barabonkov-5286a2290" target="_blank" rel="noreferrer" className="hover:underline hover:text-white">Damian Barabonkov</a>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <span className="text-ubt-gedit-orange font-bold">Location:</span>
                                        <span>Berlin, Germany</span>
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Gedit;

export const displayGedit = (openApp) => {
    return <Gedit> </Gedit>;
}

export const displayDoNotClick = (openApp) => {
    return <Gedit title="Do Not Click" content="I told you not to open me!"> </Gedit>;
}
