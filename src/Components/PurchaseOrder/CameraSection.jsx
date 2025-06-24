// import React, { useEffect, useState } from "react";
// import { CameraIcon, XMarkIcon } from "@heroicons/react/24/solid";
// import { ArrowPathRoundedSquareIcon } from "@heroicons/react/16/solid";

// const CameraSection = ({
//   index,
//   poInputs,
//   setPoInputs,
//   showCapturedImages,
//   setShowCapturedImages,
//   setCameraStream,
// }) => {
//   const [facingMode, setFacingMode] = useState("user");
//   const [stream, setStream] = useState(null);

//   useEffect(() => {
//     const loadCamera = async () => {
//       if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//         alert("Camera not supported");
//         return;
//       }

//       try {

//         const newStream = await navigator.mediaDevices.getUserMedia({
//           video: { facingMode },
//           audio: false,
//         });

//         const video = document.getElementById(`video-preview-${index}`);
//         if (video) {
//           video.srcObject = newStream;
//           video.play();
//         }

//         // Stop previous stream
//         if (stream) {
//           stream.getTracks().forEach((track) => track.stop());
//         }

//         setStream(newStream);
//         if (setCameraStream) setCameraStream(newStream);
//       } catch (err) {
//         console.error("Error accessing camera", err);
//         alert("Camera access failed.");
//       }
//     };

//     loadCamera();

//     return () => {
//      if (stream) {
//         stream.getTracks().forEach((track) => track.stop());
//       }
//       if (setCameraStream) setCameraStream(null);
//     };
//   }, [facingMode, index]);

//   const handleSwitchCamera = () => {
//     setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
//   };

//   const handleCaptureImage = (idx) => {
//     const video = document.getElementById(`video-preview-${idx}`);
//     if (!video) return;

//     const canvas = document.createElement("canvas");
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//     const imgData = canvas.toDataURL("image/png");

//     setPoInputs((prev) => {
//       const newItems = [...prev.items];
//       if (!newItems[idx].images) newItems[idx].images = [];
//       newItems[idx].images.push(imgData);
//       return { ...prev, items: newItems };
//     });

//     setShowCapturedImages((prev) => ({
//       ...prev,
//       [idx]: true,
//     }));
//   };

//   const handleRemoveImage = (idx, imgIndex) => {
//     setPoInputs((prev) => {
//       const newItems = [...prev.items];
//       newItems[idx].images.splice(imgIndex, 1);
//       return { ...prev, items: newItems };
//     });
//   };

//   return (
//     <div className="flex flex-col gap-4 p-4">
//       <div>
//         <video
//           id={`video-preview-${index}`}
//           className="w-64 h-48 rounded border border-gray-300"
//           autoPlay
//           playsInline
//           muted
//         ></video>

//         <div className="flex gap-2 mt-2 justify-center">
//           <button
//             type="button"
//             onClick={() => handleCaptureImage(index)}
//             className="bg-[#134b90] text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             <CameraIcon className="h-5 w-5" />
//           </button>

//           <button
//             type="button"
//             onClick={handleSwitchCamera}
//             className="bg-[#134b90] text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             <ArrowPathRoundedSquareIcon className="h-5 w-5" />
//           </button>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default CameraSection;

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

  const handleRemoveImage = (imgIndex) => {
    setPoInputs((prev) => {
      const newItems = [...prev.items];
      newItems[index].images.splice(imgIndex, 1);
      return { ...prev, items: newItems };
    });
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
