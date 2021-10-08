import React, { useState } from 'react'

function useGenerateThumbnaill() {
    const [thumbs, setThumbs] = useState([])
    const generateThumbnails = async ({ videoURL, time }: { videoURL: string; time: number }) => {
        if (videoURL) {
            const canvas = document.createElement('canvas');
            const video = document.createElement('video');
            video.src = videoURL
            video.muted = true
            video.play().then(() => {
                video.currentTime = time
                video.pause()
            })


            let thumb: string;
            video.addEventListener("loadeddata", function () {
                video.currentTime = 5
                const ratio = video.videoWidth / video.videoHeight;
                const w = video.videoWidth - 100;
                const h = parseInt(String(w / ratio), 10);
                canvas.width = w;
                canvas.height = h;

                const canvasContext = canvas.getContext("2d")
                canvasContext.fillRect(0, 0, w, h);
                canvasContext.drawImage(video, 0, 0, w, h)

                const url = canvas.toDataURL("image/png")
                console.log({ url })
                setThumbs([url])
                thumb = url
                video.remove()
                canvas.remove()
            }, false);


            return thumb
        }
    }

    return { thumbs, generateThumbnails }
}

export default useGenerateThumbnaill
