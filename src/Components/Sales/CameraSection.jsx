import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { CameraIcon } from "@heroicons/react/24/solid";
import { ArrowPathRoundedSquareIcon } from "@heroicons/react/16/solid";

const CameraSection = ({
  index,
  poInputs,
  setPoInputs,
  showCapturedImages,
  setShowCapturedImages,
}) => {
  const webcamRef = useRef(null);
  const [facingMode, setFacingMode] = useState("user");

  const videoConstraints = {
    facingMode: facingMode,
    width: 640,
    height: 480,
  };

  const handleCaptureImage = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setPoInputs((prev) => {
      const newItems = [...prev.items];
      if (!newItems[index].images) newItems[index].images = [];
      newItems[index].images.push(imageSrc);
      return { ...prev, items: newItems };
    });

    setShowCapturedImages((prev) => ({
      ...prev,
      [index]: true,
    }));
  }, [webcamRef, index, setPoInputs, setShowCapturedImages]);

  const handleSwitchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };


  return (
    <div className="flex flex-col gap-4 p-4">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/png"
        videoConstraints={videoConstraints}
        className="w-64 h-48 rounded border border-gray-300"
      />

      <div className="flex gap-2 mt-2 justify-center">
        <button
          type="button"
          onClick={handleCaptureImage}
          className="bg-[#134b90] text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <CameraIcon className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={handleSwitchCamera}
          className="bg-[#134b90] text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <ArrowPathRoundedSquareIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CameraSection;
