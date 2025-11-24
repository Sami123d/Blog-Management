import { Link } from "react-router-dom";
import Image from "./Image";
import { format } from "timeago.js";
import { useState } from "react";

const PostListItem = ({ post }) => {
  // Get logged-in user from localStorage
  // Auth user
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const isOwner = user && post.author._id === user.id;

  return (
    <div className="flex flex-col xl:flex-row gap-8 mb-12 relative">
      {/* Owner badge */}
      {isOwner && (
        <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 text-xs rounded-bl-lg">
          Owner
        </div>
      )}

      {/* image */}
      {console.log(post, "postimg")}
      {post.img && (
        <div className="md:hidden xl:block xl:w-1/3 max-h-60">
          <Image src={post.img} className="rounded-2xl object-cover w-full h-full" w="735" />
        </div>
      )}

      {/* details */}
      <div className="flex flex-col gap-4 xl:w-2/3">
        <Link to={`/${post.slug}`} className="text-4xl font-semibold">
          {post.title}
        </Link>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span>Written by</span>
          <Link className="text-blue-800" to={`/posts?author=${post.author._id}`}>
            {post.author.name}
          </Link>
          <span>on</span>
          <Link className="text-blue-800">{post.category}</Link>
          <span>{format(post.createdAt)}</span>
        </div>
 <p className="text-gray-500 font-medium"
              dangerouslySetInnerHTML={{ __html: post.content }}
/>        <Link to={`/${post.slug}`} className="underline text-blue-800 text-sm">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostListItem;
