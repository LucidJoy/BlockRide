import React, { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { point, distance } from "@turf/turf";
import Web3Modal from "web3modal";
import { Framework } from "@superfluid-finance/sdk-core";

// NOTE
// Haversine formula

import journeyABI from "./Journey.json";

const UberContext = createContext({});

export const UberProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState("");
  const [google, setGoogle] = useState(false);
  const [pickupCoordinates, setPickupCoordinates] = useState([0, 0]);
  const [dropoffCoordinates, setDropoffCoordinates] = useState([0, 0]);
  const [rideDuration, setRideDuration] = useState(0);
  const [totalDistance, setTotalDistance] = useState();
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [anywherePrice, setAnywherePrice] = useState(0);
  const [point1, setPoint1] = useState([0, 0]);
  const [point2, setPoint2] = useState([0, 0]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [currentLocation, setCurrentLocation] = useState("");
  const [code, setCode] = useState("");
  const [qrComponent, setQrComponent] = useState(false);
  const [intervalActive, setIntervalActive] = useState(false);
  const [selectedRidePrice, setSelectedRidePrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const journeyContractAddr = "0x169bBdD96bC529424a775AFb946Cf6DB407c3D4b";

  const router = useRouter();

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    google && router.push("/");
  }, [currentUser]);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) return alert("Please install MetaMask.");

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentUser(accounts[0]);
      } else {
        console.log("No accounts found.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask.");

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setCurrentUser(accounts[0]);
    console.log(currentUser);
    return accounts[0];
  };

  useEffect(() => {
    try {
      checkIfWalletIsConnected();
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    try {
      window.ethereum.on("accountsChanged", function (accounts) {
        setCurrentUser(accounts[0]);

        console.log(accounts[0]);

        console.log("Account changed");
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const createStream = async () => {
    try {
      if (window.ethereum) {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);

        setIsLoading(true);

        const sf = await Framework.create({
          chainId: 80001, //your chainId here
          provider: provider,
        });

        // Super fDAI Fake Token (fDAIx) in polygon mumbai
        const daix = await sf.loadSuperToken(
          "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f"
        );

        //FIXME - private key
        const signer = sf.createSigner({
          privateKey:
            "48d4c52904f693fbe4923c98f6756763481e90dbc53d98f6a260dfe2cabfc9fd",
          provider,
        });
        const createFlowOperation = daix.createFlow({
          sender: currentUser, // passenger
          receiver: "0x7F3d177A4af3895d23c69d228a17a9c1FB14F7fB", // driver
          flowRate: "1000000000", //wei/sec
        });

        const txnResponse = await createFlowOperation.exec(signer);
        const txnReceipt = await txnResponse.wait();

        setIsLoading(false);

        console.log("create flow -> ", txnReceipt); // for loading
      }
    } catch (error) {
      console.log("create stream -> ", error);
    }
  };

  const getStream = async () => {
    try {
      if (window.ethereum) {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);

        const sf = await Framework.create({
          chainId: 80001, //your chainId here
          provider: provider,
        });

        // Super fDAI Fake Token (fDAIx) in polygon mumbai
        const daix = await sf.loadSuperToken(
          "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f"
        );

        //FIXME - private key
        let flowInfo = await daix.getNetFlow({
          account: currentUser,
          providerOrSigner: provider,
        });

        console.log("flowInfo -> ", flowInfo);
      }
    } catch (error) {
      console.log(" flowinfo -> ", error);
    }
  };

  const deleteStream = async () => {
    try {
      if (window.ethereum) {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);

        setIsLoading(true);

        const sf = await Framework.create({
          chainId: 80001, //your chainId here
          provider: provider,
        });

        const daix = await sf.loadSuperToken(
          "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f"
        );

        //FIXME - private key
        const signer = sf.createSigner({
          privateKey:
            "48d4c52904f693fbe4923c98f6756763481e90dbc53d98f6a260dfe2cabfc9fd",
          provider,
        });

        const createFlowOperation = daix.deleteFlow({
          sender: currentUser, // passenger
          receiver: "0x7F3d177A4af3895d23c69d228a17a9c1FB14F7fB", // uber driver
        });

        const txnResponse = await createFlowOperation.exec(signer);
        const txnReceipt = await txnResponse.wait();

        setIsLoading(false);

        console.log("delete flow -> ", txnReceipt);
      }
    } catch (error) {
      console.log("delete stream -> ", error);
    }
  };

  const acceptPayment = async () => {
    try {
      if (window.ethereum) {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          journeyContractAddr,
          journeyABI,
          signer
        );

        // console.log("contract -> ", contract);

        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        // console.log("account: ", accounts[0]);
        const txRes = await contract.acceptPayment({
          value: ethers.utils.parseEther(String(anywherePrice)),
          gasLimit: 50000,
        });

        await txRes.wait();

        console.log(txRes);
      }
    } catch (error) {
      console.log("acceptPayment -> ", error);
    }
  };

  const getPickupCoordinates = (pickup) => {
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${pickup}.json?` +
        new URLSearchParams({
          access_token:
            "pk.eyJ1IjoibHVjaWRqb3kiLCJhIjoiY2xvbW1ubDBoMWN0bTJpbzVmZnQ1bmRyMyJ9.4bUROR20LVUTZJc3gj5sgA",
          limit: 1,
        })
    )
      .then((res) => res.json())
      .then((data) => {
        // PICKUP COORDINATES
        setPickupCoordinates(data.features[0].center);
        setPoint1(point(data.features[0].center)); // for distance calc
      });
  };

  const getDropoffCoordinates = (dropoff) => {
    // const dropoff = "Los Angeles";

    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${dropoff}.json?` +
        new URLSearchParams({
          access_token:
            "pk.eyJ1IjoibHVjaWRqb3kiLCJhIjoiY2xvbW1ubDBoMWN0bTJpbzVmZnQ1bmRyMyJ9.4bUROR20LVUTZJc3gj5sgA",
          limit: 1,
        })
    )
      .then((res) => res.json())
      .then((data) => {
        // DROPOFF COORDINATES
        setDropoffCoordinates(data.features[0].center);
        setPoint2(point(data.features[0].center));
      });
  };

  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not available in this browser.");
    }
  };

  return (
    <UberContext.Provider
      value={{
        connectWallet,
        setCurrentUser,
        google,
        setGoogle,
        currentUser,
        pickupCoordinates,
        setPickupCoordinates,
        dropoffCoordinates,
        setDropoffCoordinates,
        rideDuration,
        setRideDuration,
        totalDistance,
        setTotalDistance,
        pickup,
        setPickup,
        dropoff,
        setDropoff,
        anywherePrice,
        setAnywherePrice,
        getPickupCoordinates,
        getDropoffCoordinates,
        point1,
        setPoint1,
        point2,
        setPoint2,
        fetchCurrentLocation,
        latitude,
        setLatitude,
        longitude,
        setLongitude,
        currentLocation,
        setCurrentLocation,
        code,
        setCode,
        acceptPayment,
        qrComponent,
        setQrComponent,
        intervalActive,
        setIntervalActive,
        mapboxToken,
        selectedRidePrice,
        setSelectedRidePrice,
        createStream,
        deleteStream,
        isLoading,
        setIsLoading,
        getStream,
        paymentSuccess,
        setPaymentSuccess,
      }}
    >
      {children}
    </UberContext.Provider>
  );
};

export default UberContext;
