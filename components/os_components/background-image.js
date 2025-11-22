import React from 'react'

export default function BackgroundImage(props) {
    const bg_images = {
        "wall-1": "./themes/wallpapers/wall-1.webp",
        "wall-2": "./themes/wallpapers/wall-2.webp",
        "wall-3": "./themes/wallpapers/wall-3.webp",
        "wall-4": "./themes/wallpapers/wall-4.webp",
        "wall-5": "./themes/wallpapers/wall-5.webp",
        "wall-6": "./themes/wallpapers/wall-6.webp",
        "wall-7": "./themes/wallpapers/wall-7.webp",
        "wall-8": "./themes/wallpapers/wall-8.webp",
    };
    return (
        <div style={{ backgroundImage: `url(${bg_images[props.img]})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPositionX: "center" }} className="bg-ubuntu-img absolute -z-10 top-0 right-0 overflow-hidden h-full w-full">
        </div>
    )
}
