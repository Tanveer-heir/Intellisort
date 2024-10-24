import React, { useEffect, useRef, useState } from "react";
import { MoonLoader } from "react-spinners";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import Toast from "./toast";

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

const formatAiResponse = (data) => {
  try {
    const parsedData = JSON.parse(data);

    // Directly extract values from parsedData
    const wasteName = parsedData.waste_name || parsedData.name || "UNKNOWN WASTE";
    const recyclableProbability = parseFloat(parsedData.recyclable_probability) || 0; // Convert to float
    const nonRecyclableProbability = parseFloat(parsedData.non_recyclable_probability) || 0; // Convert to float
    const wasteType = parsedData.waste_type || parsedData.type_of_waste || "UNKNOWN TYPE";
    const material = parsedData.material || parsedData.material_type || "UNKNOWN MATERIAL";
    const count = parseInt(parsedData.count) || 0; // Convert to integer

    // Handle recycling_steps: check if it's a string and split if necessary
    let recyclingSteps = [];
    if (typeof parsedData.recycling_steps === 'string') {
      // Check if the string contains numbered steps
      if (/^\d+\.\s/.test(parsedData.recycling_steps)) {
        recyclingSteps = parsedData.recycling_steps.split(/\d+\.\s+/).slice(1).map(step => step.trim()).filter(step => step);
      } else {
        recyclingSteps = [parsedData.recycling_steps.trim()]; // Treat as a single step if not numbered
      }
    } else {
      recyclingSteps = parsedData.recycling_steps || []; // Fallback to empty array if not found
    }

    return (
      <div className="ai-response">
        <h2 className="waste-name">{wasteName.toUpperCase()} ♻️</h2>
        <div className="probabilities">
          <p><strong>Recyclable Probability:</strong> {recyclableProbability.toFixed(2)} % 🌱</p>
          <p><strong>Non-Recyclable Probability:</strong> {nonRecyclableProbability.toFixed(2)} % 🚫</p>
        </div>
        <div className="waste-type-material">
          <p><strong>Type of Waste:</strong> {wasteType} | <strong>Material Used:</strong> {material} 🏷️</p>
        </div>
        <p><strong>Total Count of Waste:</strong> {count} 🗑️</p>
        <p><strong>Steps to Recycle:</strong></p>
        <ul>
          {recyclingSteps.map((step, index) => (
            <li key={index}>🔄 {step}</li>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return <p>Error displaying AI response.</p>;
  }
};

const Page = () => {
  const videoRef = useRef(null);
  const [photoData, setPhotoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: '100%', height: '400px' });
  const [mediaStream, setMediaStream] = useState(null);

  const updateDimensions = () => {
    if (window.innerWidth <= 768) {
      setDimensions({ width: '100%', height: '300px' });
    } else if (window.innerWidth <= 1024) {
      setDimensions({ width: '100%', height: '400px' });
    } else {
      setDimensions({ width: '100%', height: '500px' });
    }
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        setLoading(false);
        videoRef.current.srcObject = stream;
        setMediaStream(stream);
      }
    } catch (err) {
      Toast.ErrorShowToast("Error accessing camera");
      console.error("Error accessing camera:", err);
      alert("No video feed detected. Please ensure your camera is connected and allowed in browser settings.");
      location.reload();
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL("image/jpeg");
        setPhotoData(dataURL);
      }
    }
  };

  const scanImage = async () => {
    try {
      setAiLoading(true);
      const genAI = new GoogleGenerativeAI("AIzaSyCn8viC6Dieiq9i0YNO-lzEF-V5YzaSOks");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro", safetySettings: safetySettings });
      const prompt = "Does this look like a recyclable or non recyclable waste to you? Send the % of probability, only with two decimals. Don't send 'yes' or 'no' text, only %. Send both the % of how much it's recyclable and how much it's non-recyclable. Also, tell the type of waste like dry waste , wet waste etc., and detect the type of material used in the waste, give a relevant name to the waste and total count of waste and steps to recycle it too. Send response in a json type without ``` or extra anything – pure keys and values in json and use only these values for the description waste_name, recyclable_probability, non_recyclable_probability, waste_type, material, count, recycling_steps"
      const formatMatch = photoData.match(/^data:(image\/(\w+));base64,/);
      if (!formatMatch) {
        console.error("Unsupported image format");
        alert("Unsupported image format");
        return;
      }
      const image = {
        inlineData: {
          data: photoData.replace(formatMatch[0], ""),
          mimeType: "image/jpeg",
        },
      };
      const result = await model.generateContent([prompt, image]);
      const jsonString = result.response.text().replace(/```json([\s\S]*?)```/, "$1");
      setAiData(jsonString);
    } catch (err) {
      console.error("Error scanning image:", err);
      alert("Error scanning image" + err);
    } finally {
      setAiLoading(false);
      stopCamera();
    }
  };

  useEffect(() => {
    if (photoData && !aiData) {
      scanImage();
    }
  }, [photoData]);

  return (
    <>
      <style jsx>{`
        .centered-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 40vh;
          box-sizing: border-box;
          padding: 20px;
          overflow: hidden;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }
        .content {
          text-align: center;
          width: 100%;
          margin-bottom: 2rem;
        }
        .video-container {
          width: 100%;
          max-width: ${dimensions.width};
          margin: 0 auto;
        }
        .video-border {
          border: 7px solid #4c63cd;
          border-radius: 16px;
          width: 100%;
          height: ${dimensions.height};
          object-fit: cover;
        }
        .button-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .loading-overlay {
          position: fixed;
          top:  0;
          left: 0;
          width: 100%;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .ai-response {
          background-color: #34 C759;
          padding: 20px;
          border-radius: 16px;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }
        .waste-name {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .probabilities {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .waste-type-material {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .button {
          margin: 10px auto;
          display: block;
        }
        @media (max-width: 768px) {
          .centered-container {
            padding: 10px;
          }
        }
      `}</style>

      <div className="centered-container">
        {!cameraStarted && (
          <div className="content">
            <h1 className="text-3xl font-bold mb-4">Scan Waste</h1>
            <p className="text-lg mb-4">
              To start scanning, click the button below to open the camera.
            </p>
          </div>
        )}
        {aiData ? (
          <div>
            {formatAiResponse(aiData)}
            <button
              onClick={() => location.reload()}
              className="btn-default btn-small round button"
            >
              Scan More 📸
            </button>
          </div>
        ) : (
          <div className="button-container">
            {!cameraStarted ? (
              <button
                onClick={() => {
                  setCameraStarted(true);
                  startCamera();
                }}
                className="btn-default btn-small round button"
              >
                Open Camera
              </button>
            ) : (
              <>
                <h2>Aim The Camera At The Waste</h2>
                <div className="video-container">
                  {loading ? (
                    <div
                      className="w-full rounded-lg relative animate-pulse bg-black/80"
                      style={{ height: dimensions.height, borderRadius: "16px" }}
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="video-border"
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: dimensions.height
                      }}
                    />
                  )}
                </div>
                <button
                  onClick={() => {
                    capturePhoto();
                  }}
                  className="btn-default btn-small round button"
                >
                  Submit
                </button>
                {aiLoading && (
                  <div className="loading-overlay">
                    <MoonLoader color="#fff" size={90} />
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Page;