import Comment from "@/components/Comment";
import CommentModal from "@/components/CommentModal";
import Post from "@/components/Post";
import Sidebar from "@/components/Sidebar";
import Widgets from "@/components/Widgets";
import { db } from "@/firebase";
import { CommentDocumentData, PostDocumentData } from "@/types/documentData";
import { Article, RandomUser } from "@/types/widgets";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  DocumentSnapshot,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";

const PostPage: FC<{
  newsResults: Article[];
  randomUsersResults: RandomUser[];
}> = ({ newsResults, randomUsersResults }) => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [post, setPost] = useState<DocumentSnapshot<PostDocumentData> | null>(
    null
  );
  const [comments, setComments] = useState<
    QueryDocumentSnapshot<CommentDocumentData>[]
  >([]);

  useEffect(() => {
    onSnapshot(
      doc(db, "posts", id) as DocumentReference<PostDocumentData>,
      (snapshot) => setPost(snapshot)
    );
  }, [db, id]);

  useEffect(() => {
    onSnapshot(
      query(
        collection(
          db,
          "posts",
          id,
          "comments"
        ) as CollectionReference<CommentDocumentData>,
        orderBy("timeStamp", "desc")
      ),
      (snapshot) => setComments(snapshot.docs)
    );
  }, [db, id]);

  return (
    <div>
      <Head>
        <title>Post Page</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen mx-auto">
        <Sidebar />

        <div className="xl:ml-[370px] border-l border-r border-gray-200 xl:min-w-[576px] sm:ml-[73px] flex-grow max-w-xl">
          <div className="flex items-center space-x-2 py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="hoverEffect" onClick={() => router.push("/")}>
              <ArrowLeftIcon className="h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold cursor-pointer">
              Tweet
            </h2>
          </div>

          {post && <Post id={id} post={post} />}
          {comments.length > 0 && (
            <div>
              <AnimatePresence>
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  >
                    <Comment
                      commentId={comment.id}
                      comment={comment.data()}
                      originalPostId={id}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <Widgets
          newsResults={newsResults}
          randomUsersResults={randomUsersResults}
        />
        <CommentModal />
      </main>
    </div>
  );
};

export default PostPage;

export async function getServerSideProps() {
  let newsResults: Article[] = [];
  let randomUsersResults: RandomUser[] = [];

  try {
    let response = await fetch(
      "https://saurav.tech/NewsAPI/top-headlines/category/business/us.json"
    );
    let data = await response.json();
    newsResults = data?.articles || [];
  } catch (error) {
    newsResults = [];
  }

  try {
    let response = await fetch(
      "https://randomuser.me/api/?results=30&inc=name,login,picture"
    );
    let data = await response.json();
    randomUsersResults = data?.results || [];
  } catch (error) {
    randomUsersResults = [];
  }

  return {
    props: {
      newsResults,
      randomUsersResults,
    },
  };
}