import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({ feedType, username, userId }) => {
  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts", feedType, username, userId],
    queryFn: async () => {
      const getPostEndpoint = () => {
        switch (feedType) {
          case "forYou":
            return "/api/posts/all";
          case "following":
            return "/api/posts/following";
          case "posts":
            return `/api/posts/user/${username}`;
          case "likes":
            return `/api/posts/likes/${userId}`;
          default:
            return "/api/posts/all";
        }
      };

      try {
        const res = await fetch(getPostEndpoint());
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        if (Array.isArray(data)) return data;
        if (data.posts) return data.posts;
        if (data.likedPosts) return data.likedPosts;
        if (data.feedPosts) return data.feedPosts;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType, username, userId, refetch]);

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
