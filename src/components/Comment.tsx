import { modalState, postIdState } from "@/atom/modalAtom";
import { userState } from "@/atom/userAtom";
import { db } from "@/firebase";
import { CommentDocumentData, LikeDocumentData } from "@/types/documentData";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  EllipsisHorizontalCircleIcon,
  TrashIcon,
  HeartIcon,
  ShareIcon,
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
  onSnapshot,
  QueryDocumentSnapshot,
  setDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import Moment from "react-moment";
import { useRecoilState } from "recoil";

const Comment: FC<{
  comment: CommentDocumentData;
  commentId: string;
  originalPostId: string;
}> = ({ comment, commentId, originalPostId }) => {
  const router = useRouter();
  const [currentUser] = useRecoilState(userState);
  const [hasLiked, setHasLiked] = useState(false);
  const [likes, setLikes] = useState<QueryDocumentSnapshot<LikeDocumentData>[]>(
    []
  );
  const [, setPostId] = useRecoilState(postIdState);
  const [open, setOpen] = useRecoilState(modalState);

  useEffect(() => {
    onSnapshot(
      collection(
        db,
        "posts",
        originalPostId,
        "comments",
        commentId,
        "likes"
      ) as CollectionReference<LikeDocumentData>,
      (snapshot) => {
        setLikes(snapshot.docs);
      }
    );
  }, [db, originalPostId, commentId, hasLiked]);

  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === currentUser?.uid) !== -1);
  }, [likes]);

  async function likeComment() {
    if (currentUser) {
      if (hasLiked) {
        await deleteDoc(
          doc(
            db,
            "posts",
            originalPostId,
            "comments",
            commentId,
            "likes",
            currentUser.uid
          )
        );
        setHasLiked(false);
      } else {
        await setDoc(
          doc(
            db,
            "posts",
            originalPostId,
            "comments",
            commentId,
            "likes",
            currentUser.uid
          ),
          {
            username: currentUser.username,
          }
        );
        setHasLiked(true);
      }
    } else {
      router.push("/auth/signin");
    }
  }

  async function deleteComment() {
    if (window.confirm("Are you sure want to delete this comment?")) {
      deleteDoc(doc(db, "posts", originalPostId, "comments", commentId));
    }
  }

  return (
    <div className="flex p-3 cursor-pointer border-b border-gray-200 pl-20">
      <img
        className="h-11 w-11 rounded-full mr-4"
        src={comment.userImg}
        alt="user-img"
      />

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
              {comment.name}
            </h4>
            <span className="text-sm sm:text-[15px]">
              @{comment.username} -{" "}
            </span>
            <span className="text-sm sm:text-[15px] hover:underline">
              <Moment fromNow>{(comment.timeStamp as any)?.toDate()}</Moment>
            </span>
          </div>
          <EllipsisHorizontalCircleIcon className="h-10 hoverEffect w-10 hove:bg-sky-100 hover:text-sky-500 p-2" />
        </div>

        <p className="text-gray-800 text-[15px] sm:text-[16px] mb-2">
          {comment.comment}
        </p>

        <div className="flex justify-between text-gray-500 p-2">
          <div className="flex items-center select-none">
            <ChatBubbleOvalLeftEllipsisIcon
              onClick={() => {
                if (!currentUser) router.push("/auth/signin");
                else {
                  setPostId(originalPostId);
                  setOpen(!open);
                }
              }}
              className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100"
            />
          </div>
          {currentUser?.uid === comment.userId && (
            <TrashIcon
              onClick={deleteComment}
              className="h-9 w-9 hoverEffect p-2 hover:text-red-600"
            />
          )}
          <div className="flex items-center">
            {hasLiked ? (
              <HeartIconFilled
                onClick={likeComment}
                className="h-9 w-9 hoverEffect p-2 text-red-600"
              />
            ) : (
              <HeartIcon
                onClick={likeComment}
                className="h-9 w-9 hoverEffect p-2 hover:text-red-600"
              />
            )}
            {likes.length > 0 && <span> {likes.length}</span>}
          </div>
          <ShareIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100" />
          <ChartBarIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100" />
        </div>
      </div>
    </div>
  );
};

export default Comment;
