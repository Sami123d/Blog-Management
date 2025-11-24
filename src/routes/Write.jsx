import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload";
import { AuthContext } from "../context/AuthContext";

const Write = () => {
  // Auth user
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
const getToken = localStorage.getItem("accessToken");
  const [value, setValue] = useState("");
  const [cover, setCover] = useState("");
  const [img, setImg] = useState("");
  const [video, setVideo] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    img && setValue((prev) => prev + `<p><image src="${img.url}"/></p>`);
  }, [img]);

  useEffect(() => {
    video &&
      setValue(
        (prev) => prev + `<p><iframe class="ql-video" src="${video.url}"/></p>`
      );
  }, [video]);

  const navigate = useNavigate();


 const mutation = useMutation({
  mutationFn: async (newPost) => {
    return axios.post(
      `${import.meta.env.VITE_API_URL}/posts`,
      newPost,
      {
        headers: {
          Authorization: `Bearer ${getToken}`,
          "Content-Type": "application/json",
        },
      }
    );
  },
  onSuccess: (res) => {
    toast.success("Post has been created");
    navigate(`/${res.data.slug}`);
  },
});


  // if (!isLoaded) {
  //   return <div className="">Loading...</div>;
  // }

  // if (isLoaded && !isSignedIn) {
  //   return <div className="">You should login!</div>;
  // }

const handleSubmit = (e) => {
  e.preventDefault();

  const title = e.target.title.value.trim();
  const category = e.target.category.value;

  // Validations
  if (!title) {
    toast.error("Title is required");
    return;
  }

  if (!value || value.trim() === "" || value === "<p><br></p>") {
    toast.error("Content cannot be empty");
    return;
  }

  if (!cover || !cover.filePath) {
    toast.error("Cover image is required");
    return;
  }



  if (!category) {
    toast.error("Category is required");
    return;
  }

  const data = {
    title,
    content: value,
    img: cover.filePath,
    tags: ["mern", "blog"],
    status: "published",
    category,
  };

  console.log("RAW JSON sending:", data);

  mutation.mutate(data);
};


  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
      <h1 className="text-cl font-light">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 mb-6">
        <Upload type="image" setProgress={setProgress} setData={setCover}>
          <button className="w-max p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white">
            Add a cover image
          </button>
        </Upload>
        <input
          className="text-4xl font-semibold bg-transparent outline-none"
          type="text"
          placeholder="My Awesome Story"
          name="title"
        />
        <div className="flex items-center gap-4">
          <label htmlFor="" className="text-sm">
            Choose a category:
          </label>
          <select
            name="category"
            id=""
            className="p-2 rounded-xl bg-white shadow-md"
          >
            <option value="general">General</option>
            <option value="web-design">Web Design</option>
            <option value="development">Development</option>
            <option value="databases">Databases</option>
            <option value="seo">Search Engines</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>
        {/* <textarea
          className="p-4 rounded-xl bg-white shadow-md"
          name="desc"
          placeholder="A Short Description"
        /> */}
        <div className="flex flex-1 ">
          <div className="flex flex-col gap-2 mr-2">
            {/* <Upload type="image" setProgress={setProgress} setData={setImg}>
              🌆
            </Upload>
            <Upload type="video" setProgress={setProgress} setData={setVideo}>
              ▶️
            </Upload> */}
          </div>
          <ReactQuill
            theme="snow"
            className="flex-1 rounded-xl bg-white shadow-md"
            value={value}
            onChange={setValue}
            readOnly={0 < progress && progress < 100}
          />
        </div>
        <button
          disabled={mutation.isPending || (0 < progress && progress < 100)}
          className="bg-blue-800 text-white font-medium rounded-xl mt-4 p-2 w-36 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Loading..." : "Send"}
        </button>
        {"Progress:" + progress}
        {/* {mutation.isError && <span>{mutation.error.message}</span>} */}
      </form>
    </div>
  );
};

export default Write;
