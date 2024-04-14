import React from 'react';

const CubeLoader = () => {
  return (
    <div className="w-full mx-auto h-screen flex justify-center items-center bg-[radial-gradient(rgb(5,221,245), rgb(6,150,253))]">
      <div className="font-sans h-[125px] w-[125px] relative [perspective:500px] [transform-style:preserve-3d] animate-roll">
        <div className="text-center border-2 border-white py-[50px] px-0 text-white bg-blue-500 text-2xl box-border absolute [transition:all_1s] [transform:translateZ(62.5px)] h-[125px] w-[125px]">XMOPS</div>
        <div className="text-center border-2 border-white py-[50px] px-0 text-white bg-blue-500 text-2xl box-border absolute [transition:all_1s] [transform:translateZ(-62.5px)] h-[125px] w-[125px]">XMOPS</div>
        <div className="text-center border-2 border-white py-[50px] px-0 text-white bg-blue-500 text-2xl box-border absolute [transition:all_1s] right-[62.5px] [transform:rotateY(-90deg)] h-[125px] w-[125px]">XMOPS</div>
        <div className="text-center border-2 border-white py-[50px] px-0 text-white bg-blue-500 text-2xl box-border absolute [transition:all_1s] left-[62.5px] [transform:rotateY(90deg)] h-[125px] w-[125px]">XMOPS</div>
        <div className="text-center border-2 border-white py-[50px] px-0 text-white bg-blue-500 text-2xl box-border absolute [transition:all_1s] bottom-[62.5px] [transform:rotateX(90deg)] h-[125px] w-[125px]">XMOPS</div>
        <div className="text-center border-2 border-white py-[50px] px-0 text-white bg-blue-500 text-2xl box-border absolute [transition:all_1s] top-[62.5px] [transform:rotateX(-90deg)] h-[125px] w-[125px]">XMOPS</div>
      </div>
    </div>
  );
};

export default CubeLoader;
