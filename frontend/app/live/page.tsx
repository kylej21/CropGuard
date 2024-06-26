'use client'
import React, { useEffect, useRef, useState } from 'react';
import * as tmImage from '@teachablemachine/image';
import ProgressBar from '../components/ProgressBar';
export default function Nikan() {
    
    // put kids unique model link HERE 
    const URL = "https://teachablemachine.withgoogle.com/models/SlUGQacyh/";

    
    const webcamRef = useRef<tmImage.Webcam | null>(null);
    let model: tmImage.CustomMobileNet | null = null;
    let maxPredictions = 0;
    const [classes, setClasses] = useState<string[]>([]);
    const [progressData, setProgressData] = useState([
        { className: "class1", percentage: 0 },
        { className: "class2", percentage: 0 },
        { className: "class3", percentage: 0 },
    ]);

    useEffect(() => {
        async function init() {
            const modelURL = URL + "model.json";
            const metadataURL = URL + "metadata.json";

            try {
                // Load the model and metadata
                model = await tmImage.load(modelURL, metadataURL);
                maxPredictions = model.getTotalClasses();

                // Setup webcam
                const flip = true; // whether to flip the webcam
                webcamRef.current = new tmImage.Webcam(500, 500, flip); // width, height, flip
                await webcamRef.current.setup(); // request access to the webcam
                webcamRef.current.play(); // Start playing the webcam stream

                // Append webcam's video element to the DOM
                const webcamContainer = document.getElementById("webcam-container");
                if (webcamContainer) {
                    webcamContainer.appendChild(webcamRef.current.canvas);
                }
                setClasses(model.getClassLabels());
                // Start prediction loop
                window.requestAnimationFrame(loop);
            } catch (error) {
                console.error('Error loading model or initializing webcam:', error);
            }
        }

        async function loop() {
            if (webcamRef.current && webcamRef.current.canvas) {
                webcamRef.current.update(); // Update webcam frame
                await predict(); // Make predictions
                window.requestAnimationFrame(loop); // Request next animation frame
            }
        }

        async function predict() {
            if (webcamRef.current && webcamRef.current.canvas && model) {
                const prediction = await model.predict(webcamRef.current.canvas); // Perform prediction
                const newData = prediction.map((pred, index) => ({
                    className: model!.getClassLabels()[index] || "", // Use model.getClassLabels() directly
                    percentage: parseFloat(pred.probability.toFixed(2)) * 100,
                }));
                setProgressData(newData);
            }
        }

        init(); // Initialize model and webcam

        // Cleanup function
        return () => {
            if (webcamRef.current) {
                webcamRef.current.stop(); // Stop webcam when component unmounts
            }
        };
    }, []); // Empty dependency array ensures effect runs only on mount

    return (
        <main className="flex-col w-full min-h-screen items-center bg-green-600 text-white text-7xl">
            <p className="text-center">
                Design still under construction 
            </p>
            <div id="webcam-container" className="pt-4 w-full flex justify-center border-stone-700 border-3 rounded-xl pb-8 "></div>
            <div className="flex space-y-4 justify-center items-center w-full">
                <ProgressBar progressData={progressData} />
            </div>
        </main>
    );
}