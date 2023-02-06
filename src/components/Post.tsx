import { modalState, postIdState } from "@/atom/modalAtom";
import { userState } from "@/atom/userAtom";
import { db, storage } from "@/firebase";
import {
  CommentDocumentData,
  LikeDocumentData,
  PostDocumentData,
} from "@/types/documentData";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  EllipsisHorizontalCircleIcon,
  HeartIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  ChartBarIcon,
  HeartIcon as HeartIconFilled,
} from "@heroicons/react/24/solid";
import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentReference,
  DocumentSnapshot,
  onSnapshot,
  QueryDocumentSnapshot,
  setDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import Moment from "react-moment";
import { useRecoilState } from "recoil";

const Post: FC<{
  post:
    | QueryDocumentSnapshot<PostDocumentData>
    | DocumentSnapshot<PostDocumentData>;
  id: string;
}> = ({ post, id }) => {
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const [comments, setComments] = useState<
    QueryDocumentSnapshot<CommentDocumentData>[]
  >([]);
  const [likes, setLikes] = useState<QueryDocumentSnapshot<LikeDocumentData>[]>(
    []
  );
  const [hasLiked, setHasLiked] = useState(false);
  const [, setPostId] = useRecoilState(postIdState);
  const [open, setOpen] = useRecoilState(modalState);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(
        db,
        "posts",
        id,
        "likes"
      ) as CollectionReference<LikeDocumentData>,
      (snapshot) => {
        setLikes(snapshot.docs);
      }
    );
    return unsubscribe;
  }, [db, hasLiked]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(
        db,
        "posts",
        id,
        "comments"
      ) as CollectionReference<CommentDocumentData>,
      (snapshot) => setComments(snapshot.docs)
    );

    return unsubscribe;
  }, [db]);

  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === currentUser?.uid) !== -1);
  }, [likes]);

  const deletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteDoc(doc(db, "posts", id));
      if (post.data()?.image) {
        deleteObject(ref(storage, `posts/${id}/image`));
      }
      router.push("/");
    }
  };

  const likePost = async () => {
    if (!currentUser) {
      router.push("/auth/signin");
      return;
    }
    if (hasLiked) {
      await deleteDoc(doc(db, "posts", id, "likes", currentUser.uid));
      setHasLiked(false);
    } else {
      setDoc(
        doc(
          db,
          "posts",
          id,
          "likes",
          currentUser.uid
        ) as DocumentReference<LikeDocumentData>,
        {
          username: currentUser.username,
        }
      );
      setHasLiked(true);
    }
  };

  return (
    <div className="flex p-3 cursor-pointer border-b border-gray-200">
      <img
        className="h-11 w-11 rounded-full mr-4"
        src={post.data()?.userImg}
        alt="user-img"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
              {post.data()?.name}
            </h4>
            <span className="text-sm sm:text-[15px]">
              @{post.data()?.username} -{" "}
            </span>
            <span className="text-sm sm:text-[15px] hover:underline">
              <Moment fromNow>
                {(post.data()?.timeStamp as any)?.toDate()}
              </Moment>
            </span>
          </div>
          <EllipsisHorizontalCircleIcon className="h-10 hoverEffect w-10 hover:bg-sky-100 hover:text-sky-500 p-2" />
        </div>
        <p
          className="text-gray-800 text-[15px] sm:text-[16px] mb-2"
          onClick={() => router.push(`/posts/${id}`)}
        >
          {post.data()?.text}
        </p>
        <img src={post.data()?.image} alt="" className="rounded-2xl mb-2" />
        <div className="flex justify-between text-gray-500 p-2">
          <div className="flex items-center select-none">
            <ChatBubbleOvalLeftEllipsisIcon
              className="h-9 w-9 hoverEffect p-2 hover:text-sky-500"
              onClick={() => {
                if (!currentUser) {
                  router.push("/auth/signin");
                } else {
                  setPostId(id);
                  setOpen(!open);
                }
              }}
            />
            {comments.length && (
              <span className="text-sm">{comments.length}</span>
            )}
          </div>
          {currentUser?.uid === post.data()?.id && (
            <TrashIcon
              className="h-9 w-9 hoverEffect p-2 hover:text-red-600"
              onClick={deletePost}
            />
          )}
          <div className="flex items-center">
            {hasLiked ? (
              <HeartIconFilled
                className="h-9 w-9 hoverEffect p-2 text-red-600 hover:bg-red-100"
                onClick={likePost}
              />
            ) : (
              <HeartIcon
                className="h-9 w-9 hoverEffect p-2 text-red-600 hover:bg-red-100"
                onClick={likePost}
              />
            )}
            {likes.length && (
              <span
                className={`${hasLiked && "text-red-600"} text-sm select-none`}
              >
                {" "}
                {likes.length}
              </span>
            )}
          </div>
          <ShareIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100" />
          <ChartBarIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100" />
        </div>
      </div>
    </div>
  );
};

export default Post;
