import React, { useEffect, useRef, useState } from "react";

const Canvas = ({ data }: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimension, setDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  /**
   *! Function take out stream from Canvas Tag
   */

  const getStreamFromCanvas = () => {
    console.log("Inside the stream function");
    const canvasElement: HTMLCanvasElement = canvasRef!.current!;
    let stream = (canvasElement as HTMLCanvasElement).captureStream(25);
    console.log(stream);
  };

  let video = document.createElement("video");
  video.src = "http://techslides.com/demos/sample-videos/small.mp4";
  video.autoplay = true;
  video.loop = true;
  video.autoplay = true;
  video.muted = true;

  const handleVideo = () => {
    video.play();
    update();
  };

  const update = () => {
    const ctx = canvasRef.current!.getContext("2d");
    ctx!.font = "30px Arial";
    ctx!.fillText("Agora Video Call Conference", dimension.width / 3, 50);
    for (let i = 0; i < data.length; i++) {
      ctx!.drawImage(data[i], (i + 1) * 230, 150, 200, 200);
    }
    requestAnimationFrame(update);
  };

  useEffect(() => {
    handleVideo();
    getStreamFromCanvas();
  }, [data]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={dimension.width}
        height={dimension.height}
      ></canvas>
    </div>
  );
};

export default Canvas;

declare global {
  interface HTMLCanvasElement {
    captureStream(frameRate?: number): MediaStream;
  }
}
