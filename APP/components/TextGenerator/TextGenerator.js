import React, { useEffect, useRef, useState } from "react";
import sal from "sal.js";
import Image from "next/image";
import { MoonLoader } from "react-spinners";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import Toast from "./toast.ts";
import TextGeneratorData from "../../data/dashboard.json";
import Reaction from "../Common/Reaction";

const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

const TextGenerator = () => {
    const videoRef = useRef(null);
    const [photoData, setPhotoData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [aiLoading, setaiLoading] = useState(false);
    const [aiData, setAiData] = useState(null);

    useEffect(() => {
        sal();
        const cards = document.querySelectorAll(".bg-flashlight");
        cards.forEach((bgflashlight) => {
            bgflashlight.onmousemove = function (e) {
                let x = e.pageX - bgflashlight.offsetLeft;
                let y = e.pageY - bgflashlight.offsetTop;
                bgflashlight.style.setProperty("--x", x + "px");
                bgflashlight.style.setProperty("--y", y + "px");
            };
        });
    }, []);

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
            const prompt = "Does this look like a dustbin to you respond with yes or no";
            const formatMatch = photoData.match(/^data:(image\/(\w+));base64,/);
            if (!formatMatch) {
                console.error("Unsupported image format");
                Toast.ErrorShowToast("Unsupported image format");
                return;
            }
            const image = {
                inlineData: {
                    data: photoData.replace(formatMatch[0], ""),
                    mimeType: "image/jpeg",
                },
            };
            const result = await model.generateContent([prompt, image]);
            setaiLoading(false);
            setAiData(result.response.text());
        } catch (err) {
            console.error("Error scanning image:", err);
            Toast.ErrorShowToast("Error scanning image");
            setaiLoading(false);
        }
    };

    useEffect(() => {
        if (photoData) {
            scanImage();
        }
    }, [photoData]);

    useEffect(() => {
        startCamera();
    }, []);

    return (
        <div className="flex relative flex-col mt-4 w-full mb-40">
            <h1 className="flex items-start justify-start mb-7 text-3xl font-bold text-start">Text Generator</h1>
            {TextGeneratorData && TextGeneratorData.textGenerator.map((data, index) => (
                <div className="chat-box-list pt--30" id="chatContainer" data-sal="slide-up" data-sal-duration="700" data-sal-delay="100" key={index}>
                    <div className="chat-box author-speech bg-flashlight">
                        <div className="inner">
                            <div className="chat-section">
                                <div className="author">
                                    <Image className="w-100" width={40} height={40} src={data.author} alt="Author" />
                                </div>
                                <div className="chat-content">
                                    <h6 className="title">{data.title}</h6>
                                    <p>{data.desc}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="chat-box ai-speech bg-flashlight">
                        {data.content.map((innerData, innerIndex) => (
                            <div className="inner top-flashlight leftside light-xl" key={innerIndex}>
                                <div className="chat-section generate-section">
                                    <div className="author">
                                        <Image src={innerData.img} width={40} height={40} alt="Loader Images" />
                                    </div>
                                    <div className="chat-content">
                                        <h6 className="title color-text-off mb--0">{innerData.text}</h6>
                                    </div>
                                </div>
                                <div className="chat-section">
                                    <div className="author">
                                        <Image className="w-100" src={innerData.aiImg} width={40} height={40} alt="ChatenAI" />
                                    </div>
                                    <div className="chat-content">
                                        <h6 className="title">{innerData.title}<span className="rainbow-badge-card">{innerData?.badge}</span></h6>
                                        {innerData.desc2 ? (<p className="">{innerData.desc2}</p>) : ("")}
                                        <p className="mb--20">{innerData.desc}</p>
                                        <Reaction />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            {loading ? (
                <div className="w-full rounded-lg relative animate-pulse bg-black/80" style={{ height: "400px", borderRadius: "50px" }} />
            ) : (
                <video ref={videoRef} autoPlay muted className="w-full rounded-lg relative h-96" />
            )}
            <button onClick={capturePhoto} className="bg-green-600 w-16 h-16 m-auto rounded-full flex gap-3 items-center text-center justify-center text-3xl font-bold text-white mt-7 p-4">
                Capture
            </button>
            {aiLoading && (
                <div className="bg-black/80 w-full min-h-screen fixed left-0 right-0 top-0">
                    <div className="flex justify-center items-center min-h-screen">
                        <MoonLoader color="#fff" size={90} />
                    </div>
                </div>
            )}
            {aiData && (
                <div className="bg-black/5 shadow-lg w-full mt-12 mb-28 rounded-2xl border-2 border-black/10">
                    <div className="flex flex-col gap-4 p-4">
                        <h1 className="text-2xl font-bold">Is Dustbin ? {aiData}</h1>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TextGenerator;
