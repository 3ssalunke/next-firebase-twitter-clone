import { useRecoilState } from "recoil";
import { userState } from "@/atom/userAtom";
import { ChangeEvent, useRef, useState } from "react";
import {
  FaceSmileIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "@/firebase";
import { PostDocumentData } from "@/types/documentData";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

const Input = () => {
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const [selectedFile, setSelectedFile] = useState<
    string | ArrayBuffer | undefined | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const filePickerRef = useRef<HTMLInputElement>(null);

  const sendPost = async () => {
    if (loading) return;
    setLoading(true);

    const docRef = await addDoc(
      collection(db, "posts") as CollectionReference<PostDocumentData>,
      {
        id: currentUser!.uid,
        text: input,
        userImg: currentUser!.userImg,
        timeStamp: serverTimestamp(),
        name: currentUser!.name,
        username: currentUser!.username,
      }
    );

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    if (selectedFile) {
      await uploadString(imageRef, selectedFile as string, "data_url");
      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(
        doc(db, "posts", docRef.id) as DocumentReference<PostDocumentData>,
        {
          image: downloadURL,
        }
      );
    }

    setInput("");
    setSelectedFile(null);
    setLoading(false);
  };

  const addImageToPost = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files?.[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target?.result);
    };
  };

  return (
    <>
      {currentUser && (
        <div className="flex border-b border-gray-200 p-3 space-x-3">
          <img
            src={currentUser.userImg}
            alt="user-img"
            className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95"
          />
          <div className="w-full divide-y divide-gray-200">
            <div>
              <textarea
                className="w-full border-none focus:ring-0 text-lg placeholder-gray-700 tracking-wide min-h-[50px] text-gray-700"
                rows={2}
                placeholder="What's happening?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              ></textarea>
            </div>
            {selectedFile && (
              <div className="relative">
                <XMarkIcon
                  onClick={() => setSelectedFile(null)}
                  className="border h-7 text-black absolute cursor-pointer shadow-xd border-white m-1 rounded-full"
                />
                <img
                  src={selectedFile as string}
                  className={`${loading && "animate-pulse"}`}
                />
              </div>
            )}
            <div className="flex items-center justify-between pt-2.5">
              {!loading && (
                <>
                  <div className="flex">
                    <div onClick={() => filePickerRef.current?.click()}>
                      <PhotoIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                      <input
                        type="file"
                        hidden
                        ref={filePickerRef}
                        onChange={addImageToPost}
                      />
                    </div>
                    <FaceSmileIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                  </div>
                  <button
                    onClick={sendPost}
                    disabled={!input.trim()}
                    className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                  >
                    Tweet
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Input;
