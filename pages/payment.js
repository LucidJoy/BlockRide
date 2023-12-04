import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import axios from "axios";

import Map from "./components/Map";
import UberContext from "../context/UberContext";
import QrScanner from "./components/QrScanner";

const Payment = () => {
  const {
    pickupCoordinates,
    setPickupCoordinates,
    dropoffCoordinates,
    setDropoffCoordinates,
    totalDistance,
    setTotalDistance,
    pickup,
    dropoff,
    selectedRidePrice,
  } = useContext(UberContext);

  const [qrcode, setQrcode] = useState("");
  const [qrClick, setQrClick] = useState(false);
  const [usdAmount, setUsdAmount] = useState(300); // Replace with your desired USD amount
  const [ethPrice, setEthPrice] = useState(0);
  const [ethAmount, setEthAmount] = useState(0);

  // const ethAddress = "0xb53A165f344827da29f7d489F549a197F18528d1"; // Replace with your Ethereum address

  useEffect(() => {
    async function fetchEthPrice() {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=polygon&vs_currencies=usd"
        );
        setEthPrice(response.data.ethereum.usd);
      } catch (error) {
        console.error("Error fetching MATIC price:", error);
      }
    }

    fetchEthPrice();
  }, []);

  useEffect(() => {
    setEthAmount(usdAmount / ethPrice);
  }, [usdAmount, ethPrice]);

  const firstCap = (place) => {
    return ` ${place.slice(0, 1).toUpperCase()}${place.slice(1)}`;
  };

  const generateQrCode = () => {
    QRCode.toDataURL(
      `https://metamask.app.link/send/0xb53A165f344827da29f7d489F549a197F18528d1`,
      {
        width: 800,
        margin: 2,
        color: {
          light: "#ffffff",
          dark: "#161616",
        },
      },
      (err, url) => {
        if (err) return console.log(err);

        setQrcode(url);
      }
    );
  };

  useEffect(() => setQrClick(false), []);

  return (
    <div className='relative'>
      <div className='glass z-20 h-[100vh] w-[100vw] absolute'>
        <div className='flex items-center justify-center h-full'>
          <div className='bg-white h-[600px] w-[400px] rounded-[15px] px-[15px]'>
            <h1 className='uppercase text-center py-[15px] font-semibold text-[22px]'>
              details
            </h1>

            <div className='flex flex-col mt-[10px] gap-[20px] items-center'>
              <p className='bg-gray-200 h-fit text-[16px] p-4 rounded-[10px] w-full'>
                From:{" "}
                <span className='font-semibold'>
                  {pickup ? firstCap(pickup) : " Not selected"}
                </span>
              </p>
              <p className='bg-gray-200 h-fit text-[16px] p-4 rounded-[10px] w-full'>
                To:{" "}
                <span className='font-semibold'>
                  {dropoff ? firstCap(dropoff) : " Not selected"}
                </span>
              </p>

              <div className=' h-fit rounded-[10px] w-full bg-gray-200 relative'>
                <div className='items-start justify-start p-4 w-full h-full text-[17px] flex flex-col gap-[5px]'>
                  <p>
                    Distance:
                    <span className='font-medium'> {totalDistance} mi</span>
                  </p>
                  <p>
                    Amount:
                    <span className='font-medium'>
                      {" "}
                      {`$${selectedRidePrice}`}
                    </span>
                  </p>
                </div>
              </div>

              {qrClick ? (
                <div className='mt-[40px]'>
                  {/* <Image
                    src={qrcode}
                    alt='url'
                    width={200}
                    height={200}
                    className='rounded-[10px]'
                  /> */}
                  <QrScanner />
                </div>
              ) : (
                <div
                  className='bg-black text-white my-4 mx-4 py-4 text-center text-[18px] rounded-[10px] cursor-pointer w-full mt-[195px]'
                  onClick={() => {
                    setQrClick(true);
                    generateQrCode();
                  }}
                >
                  Click to scan
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Map
        pickupCoordinates={pickupCoordinates}
        dropoffCoordinates={dropoffCoordinates}
        payment={true}
      />
    </div>
  );
};

export default Payment;
