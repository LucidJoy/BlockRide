import React, { useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { Puff } from "react-loader-spinner";
import Image from "next/image";

import UberContext from "../context/UberContext";
import Map from "./components/Map";
import { shortenAddress } from "../utils/shortenAddr";
import QrScanner from "./components/QrScanner";

const Anywhere = () => {
  const {
    anywherePrice,
    setAnywherePrice,
    pickup,
    currentUser,
    currentLocation,
    acceptPayment,
    qrComponent,
    setQrComponent,
    setIntervalActive,
    intervalActive,
    deleteStream,
    isLoading,
    paymentSuccess,
    setPaymentSuccess,
  } = useContext(UberContext);

  const [stream, setStream] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const router = useRouter();
  const { ride } = router.query;

  useEffect(() => {
    if (ride === "true") {
      setIntervalActive(true);
    }
  }, [ride]);

  // useEffect(() => setQrComponent(false), []);

  useEffect(() => {
    if (intervalActive) {
      const newIntervalId = setInterval(() => {
        setAnywherePrice((prevPrice) => prevPrice + 1);
      }, 10000);

      setIntervalId(newIntervalId);
    }
  }, [intervalActive]);

  const stopCount = async () => {
    setIsFinished(true); // Set isFinished to true when Finish Ride is clicked
    setIsCameraOpen(false); // Close camera
    clearInterval(intervalId); // Clear interval
    setIntervalId(null); // Reset intervalId
    setIntervalActive(false);
    await deleteStream();
    setPaymentSuccess(true);
  };

  const videoRef = useRef(null);

  useEffect(() => {
    const constraints = { video: true };

    const openCamera = async () => {
      try {
        const cameraStream = await navigator.mediaDevices.getUserMedia(
          constraints
        );
        videoRef.current.srcObject = cameraStream;
        setStream(cameraStream);
      } catch (error) {
        console.error("Error opening camera:", error);
      }
    };

    if (isCameraOpen) {
      openCamera();
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOpen]);

  const toggleCamera = () => {
    setIsCameraOpen((prevState) => !prevState);
  };

  return (
    <div className='h-screen flex flex-col'>
      {isLoading && (
        <div className='glass h-full w-full absolute z-50 flex flex-col items-center justify-center text-white gap-3'>
          <Puff
            height='80'
            width='80'
            radius={1}
            color='#fff'
            ariaLabel='puff-loading'
            wrapperStyle={{}}
            wrapperClass=''
            visible={true}
          />
          <p className='font-medium'>Transaction in progress</p>
        </div>
      )}

      <Map pickupCoordinates={pickup} dropoffCoordinates={null} />

      <div className='flex-1 flex flex-col h-1/2'>
        <div className='flex justify-between items-center'>
          <img
            src='https://i.ibb.co/84stgjq/uber-technologies-new-20218114.jpg'
            className='h-28'
          />

          {anywherePrice ? (
            <div className='w-fit px-[20px] py-[10px] top-[80px] rounded-[15px] left-4 z-10 bg-white shadow-md font-normal text-[16px] border hover:bg-slate-50 transition-all duration-200 ease-in-out'>
              Amount: <span className='font-medium'>{anywherePrice} HBAR</span>
            </div>
          ) : (
            ""
          )}

          <p className='mr-[25px] font-semibold'>
            {shortenAddress(currentUser)}
          </p>
        </div>

        <p className='pl-[20px] -mt-[10px] mb-[5px]'>
          Current location:{" "}
          <span className='font-medium'>{currentLocation}</span>
        </p>

        <div className='flex items-center justify-center h-full transition-all duration-300 ease-in-out'>
          {ride && !isFinished && (
            <div className='border-t-[1px] h-full w-full flex items-center justify-center flex-col gap-[20px]'>
              <h1 className='font-semibold'>Price (HBAR)</h1>
              <div className='rounded-full h-[80px] w-[80px] bg-gray-200 -mt-[15px] relative'>
                <p className='flex items-center justify-center w-full h-full font-medium text-[20px]'>
                  {anywherePrice}
                </p>
              </div>

              <button
                onClick={() => {
                  stopCount();
                  // toggleCamera();
                }}
                className='w-fit px-[20px] py-[15px] top-[80px] rounded-[15px] left-4 z-10 bg-white shadow-md font-medium text-[16px] border hover:bg-slate-50 transition-all duration-200 ease-in-out'
              >
                Finish Ride
              </button>
            </div>
          )}

          {paymentSuccess && (
            <div className='flex flex-col items-center -mt-[50px]'>
              <img
                src='/paymentSuccess.gif'
                alt='success'
                className='w-[50px]'
                // width={50}
                // height={50}
              />
              <p className='mt-[5px] font-medium'>Payment Successful!</p>
              <button
                onClick={() => {
                  router.push("http://localhost:3000/search");
                  setIsCameraOpen(false);
                }}
                className='absolute bottom-[20px] px-[10px] py-[7px] rounded-[10px] bg-white shadow-md text-[14px] border hover:bg-slate-50 transition-all duration-200 ease-in-out'
              >
                Take another ride
              </button>
            </div>
          )}

          {/* 
          {ride && isFinished && (
            <div className='flex items-center justify-center'>
              <QrScanner />
            </div>
          )} */}

          {!ride && (
            <>
              {isCameraOpen ? (
                <div className='flex items-center justify-center gap-[50px]'>
                  <QrScanner isRide={true} />
                  <button
                    onClick={() => {
                      toggleCamera();
                      setQrComponent(false);
                    }}
                    className='w-fit px-[20px] py-[15px] top-[80px] rounded-[15px] left-4 z-10 bg-white shadow-md font-medium text-[16px] border hover:bg-slate-50 transition-all duration-200 ease-in-out'
                  >
                    Close Camera
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    toggleCamera();
                    setQrComponent(true);
                  }}
                  className='w-fit px-[20px] py-[15px] top-[80px] rounded-[15px] left-4 z-10 bg-white shadow-md font-medium text-[16px] border hover:bg-slate-50 transition-all duration-200 ease-in-out'
                >
                  Open Camera
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Anywhere;
