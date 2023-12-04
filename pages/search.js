import React, { useState, useContext } from "react";
import tw from "tailwind-styled-components";
import Link from "next/link";
import { Puff } from "react-loader-spinner";

import UberContext from "../context/UberContext";

const Search = () => {
  const {
    pickup,
    setPickup,
    dropoff,
    setDropoff,
    createStream,
    deleteStream,
    isLoading,
    getStream,
  } = useContext(UberContext);

  return (
    <Wrapper>
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
          <p className='font-medium'>Setting up Superfluid</p>
        </div>
      )}

      <ButtonContainer>
        <Link href='/'>
          <BackButton src='https://img.icons8.com/ios-filled/50/000000/left.png' />
        </Link>
      </ButtonContainer>

      <InputContainer>
        <FromtoIcons>
          <Circle src='https://img.icons8.com/ios-filled/50/9CA3AF/filled-circle.png' />
          <Line src='https://img.icons8.com/ios/50/9CA3AF/vertical-line.png' />
          <Square src='https://img.icons8.com/windows/50/000000/square-full.png' />
        </FromtoIcons>

        <InputBoxes>
          <Input
            placeholder='Enter pickup location'
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
          />
          <Input
            placeholder='Where to?'
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
          />
        </InputBoxes>

        <PlusIcon src='https://img.icons8.com/ios/50/000000/plus-math.png' />
      </InputContainer>

      <SavedPlaces>
        <StarIcon src='https://img.icons8.com/ios-filled/50/ffffff/star--v1.png' />
        Saved Places
      </SavedPlaces>

      <Link
        href={{
          pathname: "/confirm",
          query: {
            pickup: pickup,
            dropoff: dropoff,
          },
        }}
      >
        <ConfirmButtonContainer>Confirm Location</ConfirmButtonContainer>
      </Link>
      <Link
        href={{
          pathname: "/anywhere",
        }}
      >
        <ConfirmButtonContainer>Anywhere</ConfirmButtonContainer>
      </Link>

      {/* <button
        onClick={() => {
          console.log("createStream");
          createStream();
        }}
      >
        Create
      </button>
      <button
        className='ml-[50px]'
        onClick={() => {
          console.log("deleteStream");
          deleteStream();
        }}
      >
        Stop
      </button>
      <button
        className='ml-[50px]'
        onClick={() => {
          console.log("getStream");
          getStream();
        }}
      >
        get
      </button> */}
    </Wrapper>
  );
};

export default Search;

const Wrapper = tw.div`
  bg-gray-200 h-screen
`;

const ButtonContainer = tw.div`
  bg-white px-4 pt-2
`;

const BackButton = tw.img`
  h-10 p-1 bg-gray-200 rounded-full cursor-pointer transform hover:scale-90 transition-all
`;

const InputContainer = tw.div`
  bg-white flex items-center justify-center px-4 gap-4 mb-2
`;

const FromtoIcons = tw.div`
  w-10 flex flex-col items-center
`;

const Circle = tw.img`
  h-2.5 
`;

const Line = tw.img`
  h-10
`;

const Square = tw.img`
  h-3
`;

const InputBoxes = tw.div`
  flex flex-col flex-1
`;

const Input = tw.input`
  h-10 bg-gray-200 my-2 rounded-md p-2 outline-none border-none
`;

const PlusIcon = tw.img`
  w-10 h-10 bg-gray-200 rounded-full p-2 cursor-pointer hover:rotate-90 transition-all
`;

const SavedPlaces = tw.div`
  flex items-center bg-white px-4 py-2
`;

const StarIcon = tw.img`
  bg-gray-400 w-10 h-10 p-2 rounded-full mr-2
`;

const ConfirmButtonContainer = tw.div`
  bg-black text-white cursor-pointer mx-20 mt-4 px-4 py-3 text-2xl text-center rounded-full  hover:shadow-lg transform transition-all
`;
