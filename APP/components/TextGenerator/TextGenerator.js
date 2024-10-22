import React, { useEffect, useRef, useState } from "react";
import { MoonLoader } from "react-spinners";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { Scan } from "lucide-react";
import Toast from "./toast";

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

const Page = () => {
  const videoRef = useRef(null);
  const [photoData, setPhotoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setaiLoading] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [demo, setDemo] = useState(null);
  const [cameraStarted, setCameraStarted] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        setLoading(false);
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      Toast.ErrorShowToast("Error accessing camera");
      console.error("Error accessing camera:", err);
      alert("No video feed detected. Please ensure your camera is connected and allowed in browser settings.");
      location.reload();
    }
  };

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
      setaiLoading(true);
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro", safetySettings: safetySettings });
      const prompt = "Does this look like a recyclable or non recyclable waste to you? Send the % of probability, only with two decimals. Don't send 'yes' or 'no' text, only %. Send both the % of how much it's recyclable and how much it's non-recyclable. Also, tell the type of waste like dry waste, wet waste etc., and detect the type of material used in the waste, give a relevant name to the waste and total count of waste too. Send response in a json type without ``` or extra anything – pure keys and values in json.";
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
      const parsedJson = JSON.parse(jsonString);
      setDemo(result.response.text());
      console.log(parsedJson);
      setaiLoading(false);
      setAiData(parsedJson);
    } catch (err) {
      console.error("Error scanning image:", err);
      alert("Error scanning image" + err);
    } finally {
      setaiLoading(false);
    }
  };

  useEffect(() => {
    if (photoData) {
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
          padding: 40px;
          overflow: hidden;
        }
        .button-container {
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }
        .content {
          text-align: center;
        }
        .video-border {
          border: 7px solid #4c63cd;
          border-radius: 16px;
        }
      `}</style>

      <div className="centered-container">
        {!cameraStarted && (
          <div className="content">
            <h1 className="text-3xl font-bold mb-2">Scan Waste</h1>
            <p className="text-lg mb-4">To start scanning, click the button below to open the camera.</p>
          </div>
        )}
        <div className="button-container">
          {!cameraStarted ? (
            <button
              onClick={() => {
                setCameraStarted(true);
                startCamera();
              }}
              className="btn-default btn-small round"
            >
              Open Camera
            </button>
          ) : (
            <>
              <div>
                {loading ? (
                  <div
                    className="w-full rounded-lg relative animate-pulse bg-black/80"
                    style={{ height: "400px", borderRadius: "50px" }}
                  />
                ) : (
                  <video ref={videoRef} autoPlay muted className="w-full rounded-lg relative h-96 video-border" />
                )}
                <button
                  onClick={capturePhoto}
                  className="bg-green-600 w-16 h-16 m-auto rounded-full flex gap-3 items-center text-center justify-center text-3xl font-bold text-white mt-4 p-4"
                >
                  <div className="flex flex-col gap-3">
                    <Scan size={40} />
                  </div>
                </button>
              </div>
              {aiLoading ? (
                <div className="bg-black/80 w-full min-h-screen fixed left-0 right-0 top-0">
                  <div className="flex justify-center items-center min-h-screen">
                    <MoonLoader color="#fff" size={90} />
                  </div>
                </div>
              ) : (
                <>
                  {aiData && (
                    <div className="bg-black/5 shadow-lg w-full mt-8 mb-20 rounded-2xl border-2 border-black/10">
                      <div className="flex flex-col gap-4 p-4">
                        <h1 className="text-2xl uppercase font-bold">Waste Type</h1>
                        <h1 className="text-lg font-bold capitalize">Waste Name: {aiData.name || "unknown"}</h1>
                        <h1 className="text-lg font-bold capitalize">Waste Type: {aiData.type || "unknown"}</h1>
                        <h1 className="text-lg font-bold">Recyclable: {aiData.recyclable || "unknown"}</h1>
                        <h1 className="text-lg font-bold">Non Recyclable: {aiData.non_recyclable || "unknown"}</h1>
                        <h1 className="text-lg font-bold">Dry Waste: {aiData.dry_waste || "unknown"}</h1>
                        <h1 className="text-lg font-bold">Total Waste: {aiData.total_count || "0"}</h1>
                        <h1 className="text-lg font-bold">Wet Waste: {aiData.wet_waste || 0}</h1>
                        {aiData.material && <h1 className="text-lg font-bold capitalize">Material: {aiData.material.replace(/_/g, " ")}</h1>}
                        {demo}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
