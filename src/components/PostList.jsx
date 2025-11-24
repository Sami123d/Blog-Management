import PostListItem from "./PostListItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

const fetchPosts = async (pageParam, searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { page: pageParam, limit: 5, ...searchParamsObj },
  });
  return res.data; // must include posts + pagination
};

const PostList = () => {
  const [searchParams] = useSearchParams();
  const [isDelaying, setIsDelaying] = useState(false); // show loader for 5s

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["posts", searchParams.toString()],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, searchParams),
    getNextPageParam: (lastPage, pages) =>
      lastPage.pagination.hasNext ? pages.length + 1 : undefined,
  });

  if (isFetching && !data) return "Loading...";
  if (error) return "Something went wrong!";

  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

  // Delay next fetch by 5s
  const handleNext = () => {
    if (isDelaying) return;
    setIsDelaying(true);

    setTimeout(() => {
      fetchNextPage();
      setIsDelaying(false);
    }, 1000);
  };

  return (
    <InfiniteScroll
      dataLength={allPosts.length}
      next={handleNext}
      hasMore={hasNextPage || isDelaying} // keep loader visible during delay
      loader={<h4 className=" bg-white rounded-lg p-2 text-center mb-2 mx-2">Loading more posts...</h4>} // always show loader while fetching
      scrollThreshold={1.0} // only fetch at bottom
      endMessage={!hasNextPage && !isDelaying ? (
        <p className="bg-white rounded-lg p-2 text-center mb-2 mx-2"><b>All posts loaded!</b></p>
      ) : null}
    >
      {allPosts.map((post) => (
        <PostListItem key={post._id} post={post} />
      ))}
    </InfiniteScroll>
  );
};

export default PostList;
