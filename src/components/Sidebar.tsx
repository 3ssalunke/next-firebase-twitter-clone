import Image from "next/image";
import { HomeIcon } from "@heroicons/react/24/solid";
import {
  BellIcon,
  BookmarkIcon,
  ClipboardIcon,
  HashtagIcon,
  UserIcon,
  EllipsisHorizontalCircleIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { useRecoilState } from "recoil";

import SidebarMenuItem from "./SidebarMenuItem";
import { UserDocumentData, userState } from "@/atom/userAtom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect } from "react";
import { doc, DocumentReference, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/router";

const Sidebar = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  //   console.log(currentUser);
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        (async () => {
          const docRef = doc(
            db,
            "users",
            auth.currentUser!.providerData[0].uid
          ) as DocumentReference<UserDocumentData>;
          const docSnap = await getDoc<UserDocumentData>(docRef);
          if (docSnap.exists()) {
            setCurrentUser(docSnap.data());
          }
        })();
      }
    });
  }, []);

  const onSignOut = () => {
    signOut(auth);
    setCurrentUser(null);
  };

  return (
    <div className="hidden sm:flex flex-col p-2 xl:items-start fixed h-full xl:ml-24">
      <div className="hoverEffect p-0 hover:bg-blue-100 xl:px-1">
        <Image
          width="50"
          height="50"
          src="https://help.twitter.com/content/dam/help-twitter/brand/logo.png"
          alt="main-logo"
        ></Image>
      </div>

      <div className="mt-4 mb-2.5 xl:items-start">
        <SidebarMenuItem text="Home" Icon={HomeIcon} active />
        <SidebarMenuItem text="Explore" Icon={HashtagIcon} />
        <SidebarMenuItem text="Notifications" Icon={BellIcon} />
        <SidebarMenuItem text="Bookmarks" Icon={BookmarkIcon} />
        <SidebarMenuItem text="Lists" Icon={ClipboardIcon} />
        <SidebarMenuItem text="Profile" Icon={UserIcon} />
        <SidebarMenuItem text="More" Icon={EllipsisHorizontalCircleIcon} />
      </div>

      {currentUser ? (
        <>
          <button className="bg-blue-400 text-white rounded-full w-56 h-12 font-bold shadow-md hover:brightness-95 text-lg hidden xl:inline">
            Tweet
          </button>

          <div className="hoverEffect text-gray-700 flex items-center justify-center xl:justify-start mt-auto">
            <img
              onClick={onSignOut}
              src={currentUser.userImg}
              alt="user-img"
              className="h-10 w-10 rounded-full xl:mr-2"
            />
            <div className="leading-5 hidden xl:inline">
              <h4 className="font-bold">{currentUser.name}</h4>
              <p className="text-gray-500">@{currentUser.username}</p>
            </div>
            <EllipsisHorizontalIcon className="h-5 xl:ml-8 hidden xl:inline" />
          </div>
        </>
      ) : (
        <button
          onClick={() => router.push("/auth/signin")}
          className="bg-blue-400 text-white rounded-full w-36 h-12 font-bold shadow-md hover:brightness-95 text-lg hidden xl:inline"
        >
          Sign In
        </button>
      )}
    </div>
  );
};

export default Sidebar;
