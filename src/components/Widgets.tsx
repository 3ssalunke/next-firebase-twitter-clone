import { Article, RandomUser } from "@/types/widgets";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { FC, useState } from "react";

const Widgets: FC<{
  newsResults: Article[];
  randomUsersResults: RandomUser[];
}> = ({ newsResults, randomUsersResults }) => {
  const [randomUserNum, setRandomUserNum] = useState(3);
  const [articleNum, setArticleNum] = useState(3);

  return (
    <div className="xl:w-[600px] hidden lg:inline ml-8 space-y-5">
      <div className="w-[90%] xl:w-[75%] sticky top-0 bg-white py-1.5 z-50">
        <div className="flex items-center p-3 rounded-full relative">
          <MagnifyingGlassCircleIcon className="h-5 z-50 text-gray-500" />
          <input
            type="text"
            placeholder="Search Twitter"
            className="absolute inset-0 rounded-full pl-11 border-gray-500 text-gray-700 focus:shadow-lg focus:bg-white bg-gray-100"
          />
        </div>
      </div>

      <div className="text-gray-700 space-y-3 bg-gray-100 rounded-xl pt-2 w-[90%] xl:w-[75%]">
        <h4 className="font-bold text-xl px-4">Whats happening</h4>
        <AnimatePresence>
          {newsResults.length > 0 &&
            newsResults.slice(0, articleNum).map((article) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <a href={article.url} rel="noreferrer" target="_blank">
                  <div className="flex items-center justify-between px-4 py-2 space-x-1 hover:bg-gray-200 transition duration-500 ease-out">
                    <div className="space-y-0.5">
                      <h6 className="text-sm font-bold">{article.title}</h6>
                      <p className="text-xs font-medium text-gray-500">
                        {article.source.name}
                      </p>
                    </div>
                    <img
                      className="rounded-xl"
                      src={article.urlToImage}
                      alt=""
                      width={70}
                    />
                  </div>
                </a>
              </motion.div>
            ))}
        </AnimatePresence>
        <button
          className="text-blue-300 pl-4 pb-4 hover:text-blue-400"
          onClick={() => setArticleNum(articleNum + 3)}
        >
          Show More
        </button>
      </div>

      <div className="stickey top-16 text-gray-700 space-y-3 bg-gray-100 pt-2 rounded-xl w-[90%] xl:w-[75%]">
        <h4 className="font-bold text-xl px-4">Who to follow</h4>
        <AnimatePresence>
          {randomUsersResults.length > 0 &&
            randomUsersResults.slice(0, randomUserNum).map((randomUser) => (
              <motion.div
                key={randomUser.login.username}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <div className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-200 transition duration-500 ease-out">
                  <img
                    className="rounded-full"
                    src={randomUser.picture.thumbnail}
                    alt=""
                  />

                  <div className="truncate ml-4 leading-5">
                    <h4 className="font-bold hover:underline text-[14px] truncate">
                      {randomUser.login.username}
                    </h4>
                    <h5 className="text-[13px] text-gray-500 truncate">
                      {randomUser.name.first + " " + randomUser.name.last}
                    </h5>
                  </div>

                  <button className="ml-auto bg-black text-white rounded-full text-sm px-3.5 py-1.5 font-bold">
                    Follow
                  </button>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
        <button
          onClick={() => setRandomUserNum(randomUserNum + 3)}
          className="text-blue-300 pl-4 pb-3 hover:text-blue-400"
        >
          Show More
        </button>
      </div>
    </div>
  );
};

export default Widgets;
