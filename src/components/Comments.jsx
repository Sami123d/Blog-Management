import axios from "axios";
import Comment from "./Comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useState } from "react";

const fetchComments = async (postId) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/posts/${postId}/comments`
  );
  return res.data;
};

const Comments = ({ postId }) => {
  // Auth user from localStorage
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const token = localStorage.getItem("accessToken");

  const { isPending, error, data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
  });
console.log(data, "ll")
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newComment) => {
      const token = localStorage.getItem("accessToken");

      return axios.post(
        `${import.meta.env.VITE_API_URL}/posts/${postId}/comments`,
        newComment, // RAW JSON
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (error) => {
      toast.error(error.response.data || "Comment failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const desc = e.target.desc.value.trim();

    if (!desc) {
      return toast.error("Comment cannot be empty!");
    }

    const rawJson = {
      content: desc,
    };

    mutation.mutate(rawJson);

    e.target.reset();
  };

  return (
    <div className="flex flex-col gap-8 lg:w-3/5 mb-12">
      <h1 className="text-xl text-gray-500 underline">Comments</h1>

      {/* Comment Form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between gap-8 w-full"
      >
        <textarea
          name="desc"
          placeholder="Write a comment..."
          className="w-full p-4 rounded-xl"
        />
        <button className="bg-blue-800 px-4 py-3 text-white font-medium rounded-xl">
          Send
        </button>
      </form>

      {/* Render Comments */}
      {isPending ? (
        "Loading..."
      ) : error ? (
        "Error loading comments!"
      ) : (
        <>
          {/* Optimistic Rendering */}
          {mutation.isPending && (
            <Comment
              comment={{
                content: `Sending...`,
                createdAt: new Date(),
                user: {
                  name: user?.name,
                },
              }}
            />
          )}

          {data.map((comment) => (
            
            <Comment key={comment._id} comment={comment} postId={postId} />
          ))}
        </>
      )}
    </div>
  );
};

export default Comments;
