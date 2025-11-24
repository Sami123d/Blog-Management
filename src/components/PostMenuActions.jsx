import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PostMenuActions = ({ post }) => {
  console.log(post,"posttt")
  // Auth user
    // Auth user from localStorage
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isAdmin = user?.role === "admin";

  // DELETE POST
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("accessToken");
      return axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      toast.success("Post deleted successfully!");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  // SAVE POST (simple version - no savedPosts tracking)
  const saveMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("accessToken");
      return axios.patch(
        `${import.meta.env.VITE_API_URL}/users/save`,
        { postId: post._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      toast.success("Post saved!");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  // FEATURE POST
  const featureMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("accessToken");
      return axios.patch(
        `${import.meta.env.VITE_API_URL}/posts/feature`,
        { postId: post._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      toast.success("Post updated!");
      queryClient.invalidateQueries({ queryKey: ["post", post.slug] });
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const handleDelete = () => deleteMutation.mutate();
  const handleFeature = () => featureMutation.mutate();

  const handleSave = () => {
    if (!user) return navigate("/login");
    saveMutation.mutate();
  };

  return (
    <div>
      <h1 className="mt-8 mb-4 text-sm font-medium">Actions</h1>

      {/* SAVE */}
      <div
        className="flex items-center gap-2 py-2 text-sm cursor-pointer"
        onClick={handleSave}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="20px"
          height="20px"
        >
          <path
            d="M12 4C10.3 4 9 5.3 9 7v34l15-9 15 9V7c0-1.7-1.3-3-3-3H12z"
            stroke="black"
            strokeWidth="2"
            fill={saveMutation.isPending ? "black" : "none"}
          />
        </svg>
        <span>Save this Post</span>
        {saveMutation.isPending && (
          <span className="text-xs">(saving...)</span>
        )}
      </div>

      {/* FEATURE (Admin Only) */}
      {isAdmin && (
        <div
          className="flex items-center gap-2 py-2 text-sm cursor-pointer"
          onClick={handleFeature}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="20px"
            height="20px"
          >
            <path
              d="M24 2L29.39 16.26L44 18.18L33 29.24L35.82 44L24 37L12.18 44L15 29.24L4 18.18L18.61 16.26L24 2Z"
              stroke="black"
              strokeWidth="2"
              fill={post.isFeatured ? "black" : "none"}
            />
          </svg>
          <span>Feature</span>
          {featureMutation.isPending && (
            <span className="text-xs">(updating...)</span>
          )}
        </div>
      )}

      {/* DELETE (author or admin) */}
      {console.log(user, "ppp")}
      {user && (post.author._id === user.id || isAdmin) && (
        <div
          className="flex items-center gap-2 py-2 text-sm cursor-pointer"
          onClick={handleDelete}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 50"
            fill="red"
            width="20px"
            height="20px"
          >
            <path d="M21 2C19.3 2 18 3.3 18 5v2H8a1 1 0 0 0 0 2h1v36c0 1.6 1.3 3 3 3h26c1.7 0 3-1.4 3-3V9h1a1 1 0 0 0 0-2H32V5c0-1.7-1.3-3-3-3H21z" />
          </svg>
          <span>Delete this Post</span>
          {deleteMutation.isPending && (
            <span className="text-xs">(deleting...)</span>
          )}
        </div>
      )}
    </div>
  );
};

export default PostMenuActions;
