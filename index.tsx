import React, { useState, useEffect, useRef } from "react";
import "./Scroll.css";


interface IImageUrl {
    padStart?: number;
    urlStart:string,
    urlEnd:string,
}

interface IImageCanvas {
  scrollHeight: number;
  numFrames: number;
  width: number;
  height: number;
  imageUrl:IImageUrl;
  startPosition?:number;
  
}

const getCurrentFrame = (index: number, imageUrl: IImageUrl) => {
  return `${imageUrl.urlStart}${index
    .toString()
    .padStart(imageUrl.padStart || 3, "0")}${imageUrl.urlEnd}`;
};

const ScrollAnimation = ({
  scrollHeight,
  numFrames,
  width,
  height,
  imageUrl,
}: IImageCanvas) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [frameIndex, setFrameIndex] = useState<number>(0);

  useEffect(() => {
    preloadImages();
    renderCanvas();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  useEffect(() => {
    if (!canvasRef.current || images.length < 1) {
      return;

    }

    const context = canvasRef.current.getContext("2d");
    let requestId: number;

    const render = () => {
      const src = images[frameIndex] as HTMLImageElement;
      context?.drawImage(src, 0, 0);
      requestId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(requestId);
  }, [frameIndex, images]);

  const preloadImages = () => {
    Array.from(Array(numFrames).keys()).forEach((_, i) => {
      const img = new Image();
      const imgSrc = getCurrentFrame(i + 1, imageUrl);
      img.src = imgSrc;
      setImages((prevImages: HTMLImageElement[]) => [...prevImages, img]);
    });
  };

  const handleScroll = () => {
    let offsetTop =ref.current?.offsetTop || 0;
    const scrollFraction = (window.scrollY - offsetTop) / (scrollHeight - window.innerHeight );

    console.log(window.scrollY)
    const index = Math.min(
      numFrames - 1,
      Math.ceil(scrollFraction * numFrames)
    );

    if (index <= 0 || index > numFrames) {
      return;
    }

    setFrameIndex(index);
  };

  const renderCanvas = () => {
    const context = canvasRef.current?.getContext("2d");
    if (context) {
      context.canvas.width = width;
      context.canvas.height = height;
    }
    return
  };

  return (
    <div style={{ height: scrollHeight  }} ref={ref} >
      <canvas
        ref={canvasRef}
        style={{
          position: "sticky",
          top:0,
          left:0,
          width: "100vw",
          height: "100vh",
          margin: "auto",
          display: "block",
        }}
      />
    </div>
  );
};

export default ScrollAnimation;
