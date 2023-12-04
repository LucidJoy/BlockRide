import React, { useEffect, useContext } from "react";
import tw from "tailwind-styled-components";
import { useRouter } from "next/router";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";

import { auth, provider } from "../firebase";
import UberContext from "../context/UberContext";

const Login = () => {
  const router = useRouter();
  const { setGoogle } = useContext(UberContext);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setGoogle(true);
        router.push("/metamask");
      }
    });
  }, []);

  return (
    <Wrapper>
      <UberLogo src='https://i.ibb.co/n6LWQM4/Post.png' />

      <Title>Log In to access your account.</Title>

      <HeadImageContainer>
        <HeadImage src='https://i.ibb.co/CsV9RYZ/login-image.png' />
      </HeadImageContainer>

      <SignInButton onClick={() => signInWithPopup(auth, provider)}>
        Sign In with Google
      </SignInButton>
    </Wrapper>
  );
};

export default Login;

const Wrapper = tw.div`
  flex flex-col h-screen w-screen bg-gray-200 p-4
`;

const SignInButton = tw.button`
  bg-black text-white text-center py-4 mt-8 self-center w-full rounded-lg
  transform transition-all hover:shadow-lg duration-300
`;

const UberLogo = tw.img`
  h-7 w-auto mb-4 mt-4 object-contain self-start 
`;

const Title = tw.div`
  text-5xl pt-4 text-gray-500
`;

const HeadImageContainer = tw.div`
  max-h-80 max-w-3xl self-center
`;

const HeadImage = tw.img`
  h-full w-full
`;
