import React from 'react';

const CubeLoader = () => {
  return (
    <div className="w-full mx-auto h-screen flex justify-center items-center bg-[radial-gradient(rgb(5,221,245), rgb(6,150,253))]">
      <div className="font-sans h-[200px] w-[200px] relative [perspective:1000px] [transform-style:preserve-3d] animate-roll">
        <div className="text-center border-2 border-white py-[80px] px-0 text-white bg-blue-500 text-3xl box-border absolute [transition:all_1s] [transform:translateZ(100px)] h-[200px] w-[200px]">XMOPS</div>
        <div className="text-center border-2 border-white py-[80px] px-0 text-white bg-blue-500 text-3xl box-border absolute [transition:all_1s] [transform:translateZ(-100px)] h-[200px] w-[200px]">XMOPS</div>
        <div className="text-center border-2 border-white py-[80px] px-0 text-white bg-blue-500 text-3xl box-border absolute [transition:all_1s] right-[100px] [transform:rotateY(-90deg)] h-[200px] w-[200px]">XMOPS</div>
        <div className="text-center border-2 border-white py-[80px] px-0 text-white bg-blue-500 text-3xl box-border absolute [transition:all_1s] left-[100px] [transform:rotateY(90deg)] h-[200px] w-[200px]">XMOPS</div>
        <div className="text-center border-2 border-white py-[80px] px-0 text-white bg-blue-500 text-3xl box-border absolute [transition:all_1s] bottom-[100px] [transform:rotateX(90deg)] h-[200px] w-[200px]">XMOPS</div>
        <div className="text-center border-2 border-white py-[80px] px-0 text-white bg-blue-500 text-3xl box-border absolute [transition:all_1s] top-[100px] [transform:rotateX(-90deg)] h-[200px] w-[200px]">XMOPS</div>
      </div>
    </div>
  );
};

export default CubeLoader;
