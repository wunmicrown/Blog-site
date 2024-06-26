import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import PostStats from './PostStats';
import AddComment from '../comments/AddComment';
import Loading from '../loading/Loading';
import { API_URL } from '../constants/Api';
import calculateReadingtime from '../../utils/calculateReadingtime';

const PostsDetails = () => {
    const URL = `${API_URL}/api/v1/posts`;
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const readingTime = calculateReadingtime(post?.post?.content);

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                setLoading(true);
                if (!postId) {
                    throw new Error('postId is undefined');
                }
                const token = localStorage.getItem('token');
                const response = await axios.get(`${URL}/${postId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                setPost(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching post details:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchPostDetails();
    }, [postId, URL]);

    if (loading) {
        return <div><Loading /></div>;
    }

    if (error || !post) {
        return <div>Error: Unable to fetch post details</div>;
    }

    return (
        <>
            {error ? (
                <ErrorMsg message={error?.message} />
            ) : (
                <section className="py-16 bg-white md:py-24">
                    <div className="container px-4 mx-auto">
                        <div className="mx-auto mb-12 text-center md:max-w-2xl">
                            <Link to={`/cover/${encodeURIComponent(post?.post?.coverImgUrl)}`}>
                                <img
                                    className="w-full h-60 mx-auto mb-4 object-cover"
                                    src={post?.post?.coverImgUrl}
                                    alt="post image"
                                />
                            </Link>

                            <div className="px-2 flex justify-between w-full ">
                                <Link to={''}
                                    className='flex items-center justify-start mx-2 text-left'
                                >
                                    <div className="bg-rd-500 rounded-full flex items-center justify-center">
                                        <img
                                            className=" w-16 h-16 rounded-full object-cover"
                                            alt="author image"
                                            src={
                                                post?.post?.author?.profilePic ||
                                                "https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375_1280.png"
                                            }
                                            width="40"
                                            height="40"
                                            sizes="(max-width: 600px) 40px, 40px"
                                        />
                                    </div>

                                    <div className='flex justify-between w-full'>
                                        <div className="w-auto px-2">
                                            <h4 className="text-base font-bold md:text-lg text-coolGray-800">
                                                {post?.post?.author?.username}
                                            </h4>
                                            <span className="mx-1 text-green-500">•</span>
                                            <p className="inline-block font-medium text-green-500 hover:text-green-600">
                                                posted on {new Date(post?.post?.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                                <div>
                                    <p className="text-1g text-gray-500 font-bold"><span className='text-1xl text-'>{readingTime}</span> min read</p>
                                </div>
                            </div>
                            <div className="inline-block px-3 py-1 mb-6 text-xs font-medium leading-5 text-green-500 uppercase bg-green-100 rounded-full shadow-sm">
                                {post?.post?.category?.name}
                            </div>
                            <div className="flex items-center justify-center"></div>
                            <h2 className="mb-4 text-3xl font-bold leading-tight tracking-tighter md:text-5xl text-darkCoolGray-900">
                                {post?.post?.title}
                            </h2>
                            <div className=' ml-6 flex items-center mb-6 gap-8 text-sm md:text-base font-small text-coolGray-500 mt-2'>
                                <div className='hover:bg-[#3e5b50] hover:border-1 pl-4 pr-4 rounded-sm py-1 hover:border-[#019b65] hover:text-white hover:cursor-pointer'><span className='text-green-300'>#</span>{post?.post?.tags}</div>
                            </div>
                        </div>
                    </div>

                    <div></div>

                    <div className="container px-4 mx-auto">
                        <div className="mx-auto md:max-w-3xl">
                            <div className="text-lg font-medium md:text-xl text-coolGray-500 border-coolGray-100">
                                <div dangerouslySetInnerHTML={{ __html: (post?.post?.content) }}></div>
                            </div>
                            <PostStats
                                postId={postId}
                                initialLikes={post?.post?.likes.length}
                                initialDislikes={post?.post?.dislikes.length}
                                initialCommentsCount={post?.post?.comments.length}
                            />

                            <div className='mt-8 mb-16'>
                                <hr />
                            </div>
                            <h3 className="mb-4 text-2xl font-semibold md:text-3xl text-coolGray-800">
                                Add a comment
                            </h3>
                            <AddComment postId={postId} comments={post?.post?.comments} />
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};

export default PostsDetails;
