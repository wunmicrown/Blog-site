import React, { useState, useEffect, useRef } from "react";
import JoditEditor from "jodit-react";
import { toast } from "react-toastify";
import { Card, CardBody, Form, Container, Button, Input } from 'reactstrap';
import axios from 'axios';
import { API_URL } from "../constants/Api";
import { MdFileUpload, MdCancel } from "react-icons/md";
import PostPreview from "./PostPreview";
import { useNavigate } from "react-router-dom";

const CreatePosts = () => {
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState('');
  const [tags, setTags] = useState('');
  const [post, setPost] = useState({
    title: '',
    content: '',
    category: null,
    tags: [],
    status: 'draft',
  });
  const [showPreview, setShowPreview] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [selectFocused, setSelectFocused] = useState(false);
  const [isSubmittingDraft, setIsSubmittingDraft] = useState(false);
  const [isSubmittingPublish, setIsSubmittingPublish] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const saveDraft = (event) => createOrSavePost(event, 'draft');
  const publishPost = (event) => createOrSavePost(event, 'published');

  const createOrSavePost = async (event, status) => {
    event.preventDefault();

    if ((status === 'draft' && isSubmittingDraft) || (status === 'published' && isSubmittingPublish)) return;
    if (status === 'draft') {
      setIsSubmittingDraft(true);
    } else if (status === 'published') {
      setIsSubmittingPublish(true);
    }

    if (post.title.trim() === '') {
      toast.error("Title can't be blank !!");
      resetSubmitState(status);
      return;
    }

    if (post.content.trim() === '') {
      toast.error("Post content is required !!");
      resetSubmitState(status);
      return;
    }

    if (!post.category) {
      toast.error("Select some category !!");
      resetSubmitState(status);
      return;
    }

    if (!image && status === 'published') {
      toast.error("Cover image is required to publish the post !!");
      resetSubmitState(status);
      return;
    }

    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('content', post.content);
    formData.append('category', post.category);
    formData.append('userId', user._id);
    if (image) {
      formData.append('image', image);
    }
    formData.append('tags', post.tags.join(','));
    formData.append('status', status);

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${API_URL}/api/v1/posts/create`, formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      });
      toast.success(status === 'draft' ? "Draft saved !!" : "Post Created !!");
      setPost({ title: '', content: '', category: null, tags: [], status: 'draft' });
      setImage(null);
      setImagePreview('');
      setDraftSaved(true);
      if (status === 'published') {
        setIsPublished(true);
      }
      if (status === 'draft') return navigate(`/${user._id}/drafts`);

    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error(status === 'draft' ? "Draft not saved due to some error !!" : "Post not created due to some error !!");
    } finally {
      resetSubmitState(status);
    }
  };

  const resetSubmitState = (status) => {
    if (status === 'draft') {
      setIsSubmittingDraft(false);
    } else if (status === 'published') {
      setIsSubmittingPublish(false);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!draftSaved && (post.title.trim() !== '' || post.content.trim() !== '' || post.tags.length > 0)) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [draftSaved, post]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data: user } = await axios.get(`${API_URL}/api/v1/users/getUser`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchData();
    loadAllCategoriesFromBackend();
  }, []);

  const loadAllCategoriesFromBackend = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fieldChanged = (event) => {
    if (event.target.name === 'category') {
      setPost({ ...post, category: event.target.value });
    } else {
      setPost({ ...post, [event.target.name]: event.target.value });
    }
  };

  const contentFieldChanged = (newContent) => {
    setPost({ ...post, content: newContent });
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setImage(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleTagChange = (event) => {
    setTags(event.target.value);
  };

  const addTag = () => {
    if (tags.trim() !== '' && post.tags.length < 5) {
      setPost({ ...post, tags: [...post.tags, tags] });
      setTags('');
    } else {
      toast.error("Only 5 selections allowed");
    }
  };

  const removeTag = (index) => {
    const updatedTags = post.tags.filter((tag, i) => i !== index);
    setPost({ ...post, tags: updatedTags });
  };

  const handleEditClick = () => {
    setShowPreview(false);
  };

  const handlePreviewClick = () => {
    setShowPreview(true);
  };

  const handlePreviewClose = () => {
    setShowPreview(false);
  };

  const handleSelectFocus = () => {
    setSelectFocused(true);
  };

  const handleSelectBlur = () => {
    setSelectFocused(false);
  };

  return (
    <>
      <div className="bg-green-50 overflow-x-hidden">
        <div className="wrapper min-h-screen">
          <Card className="p-4 shadow-sm border-0 bg-[#2a3240] w-full lg:w-[90%] xl:w-[80%] mx-auto">
            <CardBody>
              {showPreview ? (
                <PostPreview
                  post={post}
                  imagePreview={imagePreview}
                  onClose={handlePreviewClose}
                  handlePublish={publishPost}
                  handleSaveDraft={saveDraft}
                />
              ) : (
                <>
                  <div className="text-white mt-20 gap-4 flex justify-end mr-16">
                    <button onClick={handleEditClick} className="p-4 rounded-sm hover:text-green-400 font-semibold hover:cursor-pointer">
                      Edit
                    </button>
                    <button onClick={handlePreviewClick} className="p-4 rounded-sm hover:text-green-400 font-semibold hover:cursor-pointer">
                      Preview
                    </button>
                  </div>
                  <Form>
                    <div className="lg:pt-10 sm:pt-10 md:pt-10 flex justify-evenly 16">
                      <div className="border-2 lg:w-3/6 lg:h-60 xl:w-3/6 md:h-60 md:w-3/6  xl:h-60 rounded-md flex items-center justify-center">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Selected Image" className="rounded-md w-full h-full object-cover" />
                        ) : (
                          <p className="text-gray-400">Click the button to upload cover image</p>
                        )}
                      </div>
                      <div className="mt-16 mb-16">
                        <label htmlFor="image" className="flex p-2 relative cursor-pointer border-4 border-[#959494] text-[#959494] bg-[#171717] rounded-md">
                          <input id="image" type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                          <MdFileUpload size={24} className="mr-2" />
                          <span className="font-bold">{imagePreview ? <div className="!h-[10px]">Change</div> : 'Add a cover image'}</span>
                        </label>
                        {imagePreview && (
                          <button onClick={() => { setImage(null); setImagePreview(''); }} className="flex p-2 mt-4  ml-2 relative cursor-pointer border-4 border-[#959494] text-[#959494] bg-[#171717] rounded-md
">
                            <MdCancel className="mr-2 text-xl" /> Remove
                          </button>
                        )}
                      </div>

                    </div>
                    <div className="my-3 mt-8 ml-4 lg:ml-16 p-4 lg:p-8">
                      <label htmlFor="title" className="text-gray-200 font-bold text-lg mb-2">Post title</label>
                      <input
                        type="text"
                        id="title"
                        placeholder="Write a title..."
                        className="bg-transparent font-medium placeholder-gray-200 hover:placeholder-green-500 focus:border-green-500 appearance-none border-2 w-full py-3 px-3 rounded text-gray-200 leading-tight focus:outline-none"
                        name="title"
                        onChange={fieldChanged}
                        value={post.title}
                        style={{ wordBreak: 'break-all' }}
                      />
                    </div>
                    <div className="my-3 ml-4 lg:ml-16 p-4">
                      <label htmlFor="tags" className="text-gray-200 font-xl text-lg mb-4">Tags</label>
                      <div className="flex">
                        <input
                          type="text"
                          id="tags"
                          placeholder="Add up to 5 tags..."
                          className="bg-transparent font-medium placeholder-gray-200 hover:placeholder-green-500 focus:border-green-500 appearance-none border-2 w-full py-3 px-3 rounded text-gray-200 leading-tight focus:outline-none"
                          name="tags"
                          onChange={handleTagChange}
                          value={tags}
                        />
                        <button type="button" onClick={addTag} className="flex items-center bg-green-500 text-[#0a4429] px-2 py-1 mt-2 rounded-md ml-2">
                          <svg className="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M19 10a1 1 0 01-1 1h-7v7a1 1 0 11-2 0v-7H2a1 1 0 110-2h7V2a1 1 0 112 0v7h7a1 1 0 011 1z" clipRule="evenodd" />
                          </svg>
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                    {post.tags.length > 0 && (
                      <div className="ml-4 lg:ml-16 px-4 lg:px-8">
                        <div className="flex flex-wrap">
                          {post.tags.map((tag, index) => (
                            <button key={index} className="bg-[#2a2929] mb-5 p-4 shadow-lg text-gray-200 px-2 py-1 mt-2 rounded-md mr-2 flex items-center">
                              #{tag}
                              <MdCancel size={24} className="ml-1 hover:text-red-600" onClick={() => removeTag(index)} />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="ml-4 lg:ml-16 px-4 lg:px-8">
                      <Input
                        type="select"
                        placeholder="Enter here"
                        className="rounded border-4 border-[#959494] text-[#959494] focus:outline-none cursor-pointer w-56 lg:w-56 bg-[#171717] p-2"
                        name="category"
                        onChange={fieldChanged}
                        onFocus={handleSelectFocus}
                        onBlur={handleSelectBlur}
                        value={post.category || 'default'}
                        style={{ appearance: 'none' }}
                      >
                        <option value="default" className="cursor-pointer" hidden>Select category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id} className="cursor-pointer">
                            {category.categoryName}
                          </option>
                        ))}
                      </Input>
                    </div>
                    <div className={`mt-4 px-12 transition-all duration-300 ${selectFocused ? 'mt-24' : ''}`}>
                      <h2 htmlFor="content" className="text-gray-200 font-bold flex justify-start ml-8 py-4">Content</h2>
                      <JoditEditor
                        ref={editor}
                        value={post.content}
                        config={{ readonly: false, height: 350 }}
                        onBlur={contentFieldChanged}
                      />

                    </div>
                    <Container className="text-start text-[#0a4429] pb-8 xl:ml-12 md:ml-12 lg:ml-12 ml-10 mb-10 mt-3">
                      <Button onClick={publishPost} className="rounded-lg bg-green-500 font-medium text-lg hover:bg-green-300 p-2" >
                        {isSubmittingPublish ? "Publishing..." : isPublished ? "Publish" : "Publish"}
                      </Button>
                      <Button
                        type="submit"
                        onClick={saveDraft}
                        className="rounded-sm ms-2 text-gray-200 p-2 font-medium hover:rounded-lg hover:bg-green-400 hover:text-[#0a4429]"
                        disabled={isSubmittingDraft}
                      >
                        {isSubmittingDraft ? 'Saving...' : 'Save Draft'}
                      </Button>
                    </Container>
                  </Form>
                </>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CreatePosts;
