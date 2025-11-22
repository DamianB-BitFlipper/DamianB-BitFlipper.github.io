import React from 'react';

export default function Chess() {
    return (
        <iframe 
            src="https://lichess.org/tv/frame?theme=brown&bg=dark" 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            title="Chess"
            className="h-full w-full bg-ub-cool-grey"
        ></iframe>
    )
}

export const displayChess = (openApp) => {
    return <Chess />;
}
