import { useEffect, useState, useContext } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import tw from "tailwind-styled-components";
import Link from "next/link";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import UberContext from "../context/UberContext";

import Map from "./components/Map";

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { currentUser, setGoogle, connectWallet } = useContext(UberContext);

  useEffect(() => {
    if (!currentUser) {
      connectWallet();
    }
  }, []);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          name: user.displayName,
          photo: user.photoURL,
        });
      } else {
        setUser(null);
        router.push("/login");
      }
    });
  }, []);

  return (
    <Wrapper>
      <Map index={true} />

      <ActionItem>
        <Header>
          <UberLogo src='https://i.ibb.co/84stgjq/uber-technologies-new-20218114.jpg' />

          <Profile>
            <Name>{user?.name}</Name>
            <UserImage
              src={user?.photo}
              onClick={() => {
                setGoogle(false);
                signOut(auth);
              }}
            />
          </Profile>
        </Header>

        <ActionButtons>
          <Link href='/search'>
            <ActionButton>
              <ActionButtonImage src='https://i.ibb.co/cyvcpfF/uberx.png' />
              Ride
            </ActionButton>
          </Link>
          <ActionButton>
            <ActionButtonImage src='https://i.ibb.co/n776JLm/bike.png' />
            Wheels
          </ActionButton>
          <ActionButton>
            <ActionButtonImage src='https://i.ibb.co/5RjchBg/uberschedule.png' />
            Reserve
          </ActionButton>
        </ActionButtons>

        <InputButton>{currentUser}</InputButton>
      </ActionItem>
    </Wrapper>
  );
}

const Wrapper = tw.div`
  flex flex-col h-screen 
`;

const ActionItem = tw.div`
   flex-1 p-4
`;

const Header = tw.div`
flex justify-between items-center
`;

const UberLogo = tw.img`
  h-28
`;

const Profile = tw.div`
  flex items-center

`;

const Name = tw.div`
mr-4 w-auto text-sm font-semibold
`;

const UserImage = tw.img`
  h-12 w-12 rounded-full border border-gray-300 p-px cursor-pointer
`;

const ActionButtons = tw.div`
  flex 
`;

const ActionButton = tw.div`
  bg-gray-200 flex-1 h-32 m-2 flex flex-col items-center justify-center rounded-lg transform hover:scale-105 transition text-lg
`;

const ActionButtonImage = tw.img`
  h-3/5
`;

const InputButton = tw.div`
  bg-gray-200 h-20 text-[17px] p-4 flex items-center mt-8 rounded-lg justify-center
`;
