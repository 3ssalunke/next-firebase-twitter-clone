import { db } from "@/firebase";
import { PostDocumentData } from "@/types/documentData";
import { SparklesIcon } from "@heroicons/react/24/outline";
import {
  collection,
  onSnapshot,
  orderBy,
  Query,
  query,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Input from "./Input";
import Post from "./Post";

const Feed = () => {
  const [posts, setPosts] = useState<QueryDocumentSnapshot<PostDocumentData>[]>(
    []
  );

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "posts") as Query<PostDocumentData>,
        orderBy("timeStamp", "desc")
      ),
      (snapshot) => {
        setPosts(snapshot.docs);
      }
    );
  }, []);

  return (
    <div className="xl:ml-[370px] border-l border-r border-gray-200 xl:min-w-[576px] sm:ml-[73px] flex-grow max-w-xl">
      <div className="flex py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold cursor-pointer">Home</h2>
        <div className="hoverEffect flex items-center justify-center px-0 ml-auto w-9 h-9">
          <SparklesIcon className="h-5" />
        </div>
      </div>
      <Input />
      <AnimatePresence>
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Post post={post} id={post.id} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Feed;
