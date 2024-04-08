import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../constants/Api";

const PostStats = ({ postId, initialLikes, initialDislikes, initialCommentsCount }) => {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [dislikes, setDislikes] = useState(initialDislikes || 0);
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount || 0);
  const [userLiked, setUserLiked] = useState(false); // Track if the user has liked the post
  const URL = `${API_URL}`;

  useEffect(() => {
    // Fetch initial comments count
    const fetchCommentsCount = async () => {
      try {
        const response = await axios.get(`${URL}/comment/get-comments/${postId}`);
        console.log("Comment count", response);
        setCommentsCount(response.data.length);
      } catch (error) {
        console.error("Error fetching comments count:", error);
      }
    };
    fetchCommentsCount();
  }, [postId, URL]);

  useEffect(() => {
    // Check if the user has liked the post when the component mounts
    const checkUserLiked = () => {
      const liked = localStorage.getItem(`liked_${postId}`) === "true";
      setUserLiked(liked);
    };
    checkUserLiked();
  }, [postId]);

  const likePostHandler = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User is not authenticated.");
        return;
      }

      if (!userLiked) {
        // Check if the user has already liked the post
        const response = await axios.put(`${URL}/posts/likes/${postId}`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Liked response", response);
        if (response.status === 200) {
          setLikes(likes + 1);
          setUserLiked(true);
          localStorage.setItem(`liked_${postId}`, "true");
        }
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const dislikePostHandler = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User is not authenticated.");
        return;
      }
  
      const response = await axios.put(`${URL}/posts/dislikes/${postId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setDislikes(dislikes + 1);
      }
    } catch (error) {
      console.error("Error disliking post:", error);
    }
  };
  

  return (

    <div className="flex flex-wrap items-center justify-center gap-2 p-2 md:justify-start">
      <button className="flex items-center gap-1 m-2 text-2xl text-gray-400">
        {/* Like icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5" stroke="currentColor"
          className="w-6 h-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
          >
          </path>
        </svg>0
      </button>
      <button className="flex items-center gap-1 m-2 text-2xl text-gray-400">
        {/* Dislike icon */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384"></path>
        </svg>0
      </button>
      
      <div
        className="flex items-center gap-1 m-2 text-2xl text-gray-400">
          {/* Comment icon */}
          <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6"
      >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
          >

          </path>
        </svg>
        {commentsCount}
      </div>
      <div className="flex items-center gap-1 m-2 text-2xl text-gray-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z">

          </path>
        </svg>
        1 min read
      </div>
    </div>
   
  );
};

export default PostStats;
