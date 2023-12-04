import React, { useEffect, useState, useContext } from "react";
import tw from "tailwind-styled-components";
import { useRouter } from "next/router";
import Link from "next/link";
import { point, distance } from "@turf/turf";

import Map from "./components/Map";
import RideSelector from "./components/RideSelector";
import UberContext from "../context/UberContext";

const Confirm = () => {
  const router = useRouter();
  const { pickup, dropoff } = router.query;
  const {
    pickupCoordinates,
    setPickupCoordinates,
    dropoffCoordinates,
    setDropoffCoordinates,
    totalDistance,
    setTotalDistance,
    getPickupCoordinates,
    getDropoffCoordinates,
    point1,
    setPoint1,
    point2,
    setPoint2,
  } = useContext(UberContext);

  useEffect(() => {
    getPickupCoordinates(pickup);
    getDropoffCoordinates(dropoff);
  }, [pickup, dropoff]);

  useEffect(() => {
    const dist = distance(point1, point2);
    setTotalDistance(dist.toFixed(2));
  }, [point1, point2]);

  return (
    <Wrapper>
      <ButtonContainer>
        <Link href='/search'>
          <BackButton src='https://img.icons8.com/ios-filled/50/000000/left.png' />
        </Link>
      </ButtonContainer>
      <div className='w-fit absolute px-[20px] py-[15px] top-[80px] rounded-[15px] left-4 z-10 bg-white shadow-md font-medium text-[16px]'>
        {totalDistance ? `${totalDistance} mi` : "..."}
      </div>

      <Map
        pickupCoordinates={pickupCoordinates}
        dropoffCoordinates={dropoffCoordinates}
      />

      <RideContainer>
        <RideSelector
          pickupCoordinates={pickupCoordinates}
          dropoffCoordinates={dropoffCoordinates}
        />

        <ConfirmButtonContainer>
          <ConfirmButton onClick={() => router.push("/payment")}>
            Confirm
          </ConfirmButton>
        </ConfirmButtonContainer>
      </RideContainer>
    </Wrapper>
  );
};

export default Confirm;

const Wrapper = tw.div`
  h-screen flex flex-col
`;

const RideContainer = tw.div`
flex-1 flex flex-col h-1/2
`;

const ConfirmButtonContainer = tw.div`
  border-t-2
`;

const ConfirmButton = tw.div`
  bg-black text-white my-4 mx-4 py-4 text-center text-xl rounded-lg cursor-pointer
`;

const ButtonContainer = tw.div`
  rounded-full absolute top-4 left-4 z-10 bg-white shadow-md cursor-pointer transform hover:scale-90 transition-all
`;

const BackButton = tw.img`
  object-cover h-10 p-1 
`;
