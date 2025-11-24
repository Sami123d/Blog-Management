import { format } from "timeago.js";
import Image from "./Image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";

const Comment = ({ comment, postId }) => {
  // Auth user
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
const getToken = localStorage.getItem("accessToken");
  const role = user?.role;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
const token = localStorage.getItem("accessToken");
      return axios.delete(
        `${import.meta.env.VITE_API_URL}/comments/${comment._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  return (
    <div className="p-4 bg-slate-50 rounded-xl mb-8">
      <div className="flex items-center gap-4">
        {comment.user?.img || (
          <Image
            src="featured1.jpeg"
            className="w-10 h-10 rounded-full object-cover"
            w="40"
          />
        )}
        <span className="font-medium">{comment?.author?.name}</span>
        <span className="text-sm text-gray-500">
          {format(comment.createdAt)}
        </span>
        {user &&
          (comment.author?._id === user?.id || role === "admin") && (
            <span
              className="text-xs text-red-300 hover:text-red-500 cursor-pointer"
              onClick={() => mutation.mutate()}
            >
              delete
              {mutation.isPending && <span>(in progress)</span>}
            </span>
          )}
      </div>
      <div className="mt-4">
        <p>{comment.content}</p>
      </div>
    </div>
  );
};

export default Comment;
