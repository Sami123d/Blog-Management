import { Link } from "react-router-dom";
import Image from "./Image";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { format } from "timeago.js";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

const fetchPosts = async (pageParam, searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { page: pageParam, limit: 4, ...searchParamsObj },
  });
  return res.data; // should return { posts: [], pagination: { hasNext } }
};

const FeaturedPosts = () => {
  const [searchParams] = useSearchParams();
  const [isDelaying, setIsDelaying] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    error,
  } = useInfiniteQuery({
    queryKey: ["featuredPosts", searchParams.toString()],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, searchParams),
    getNextPageParam: (lastPage, pages) =>
      lastPage.pagination.hasNext ? pages.length + 1 : undefined,
  });

  if (isFetching && !data) return "Loading...";
  if (error) return "Something went wrong!";

  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

  // Fetch next page manually with a small delay
  const handleNext = () => {
    if (isDelaying || !hasNextPage) return;
    setIsDelaying(true);
    setTimeout(() => {
      fetchNextPage();
      setIsDelaying(false);
    }, 1000);
  };

  // only take 4 posts at a time for layout
  const posts = allPosts.slice(0, 4);

  if (!posts || posts.length === 0) return null;

  return (
    <div className="mt-8 flex flex-col lg:flex-row gap-8">
      {/* First post */}
      {posts[0] && (
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="max-h-95">
            {posts[0].img && (
            <Image
              src={posts[0].img}
              className="rounded-3xl object-cover w-full h-full"
              w="895"
            />
          )}
          </div>
          
          <div className="flex items-center gap-4">
            <h1 className="font-semibold lg:text-lg">01.</h1>
            <Link className="text-blue-800 lg:text-lg">
              {posts[0].category}
            </Link>
            <span className="text-gray-500">{format(posts[0].createdAt)}</span>
          </div>
          <Link
            to={posts[0].slug}
            className="text-xl lg:text-3xl font-semibold lg:font-bold"
          >
            {posts[0].title}
          </Link>
        </div>
      )}

      {/* Other three posts */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        {posts.slice(1, 4).map((post, index) => (
          <div key={post._id} className="lg:h-1/3 flex justify-between gap-4">
            {post.img ? (
              <div className="w-1/3 aspect-video">
                <Image
                  src={post.img}
                  className="rounded-3xl object-cover w-full h-full"
                  w="298"
                />
              </div>
            ) : (
              <div className="w-1/3 aspect-video bg-gray-200 rounded-3xl" />
            )}

            <div className="w-2/3">
              <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
                <h1 className="font-semibold">{`0${index + 2}.`}</h1>
                <Link className="text-blue-800">{post.category}</Link>
                <span className="text-gray-500 text-sm">
                  {format(post.createdAt)}
                </span>
              </div>
              <Link
                to={post.slug}
                className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium"
              >
                {post.title}
              </Link>
            </div>
          </div>
        ))}
      </div>

     
    </div>
  );
};

export default FeaturedPosts;
