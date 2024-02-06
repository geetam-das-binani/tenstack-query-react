import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { addPost, fetchPosts, fetchTags } from "../api/api";

const PostLists = () => {
  const [page, setPage] = useState(1);
  const {
    data: postData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts", { page }],
    queryFn: () => fetchPosts(page),

    staleTime: 1000 * 60*5,
  });

  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
    staleTime: Infinity,
  });
  const queryClient = useQueryClient();
  const {
    mutate,
    isError: isPostError,
    isPending,
    error: postError,
    reset,
  } = useMutation({
    mutationFn: (data) => addPost(data),
    onMutate: () => {
      return { id: 1 };
    },
    onSuccess: (data, variable, context) => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        exact: true,
        // predicate: (query) =>
        //   query.queryKey[0] === "posts" && query.queryKey[1].page >= 2,
      });
    },
    // onError: (error, variable, context) => {
    //   console.log(error);
    // },
    // onSettled: (data,error, variable, context) => {

    // },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title");

    const tags = [...formData.keys()].filter(
      (key) => formData.get(key) === "on"
    );
    if (!title || !tags.length) {
      alert("Please fill all the fields");
      return;
    }
    mutate({ id: postData?.data?.length + 1, title, tags });
    e.target.reset();
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your post.."
          className="postBox"
          name="title"
        />
        <div className="tags">
          {tagsData &&
            tagsData?.map((tag) => (
              <div key={tag}>
                <input type="checkbox" id={tag} name={tag} />
                <label htmlFor={tag}>{tag}</label>
              </div>
            ))}
        </div>
        <button type="submit">Post</button>
      </form>
      {isLoading || (isPending && <div>Loading...</div>)}
      {isError && <div>Error: {error?.message}</div>}
      {isPostError && (
        <div onClick={() => reset()}>Error: {postError?.message}</div>
      )}
      <div className="pages">
        <button
          onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
          disabled={!postData?.prev}
        >
          Prev
        </button>
        <span>Current Page:{page}</span>
        <button
          onClick={() => setPage((prevPage) =>prevPage+1 )}
          disabled={!postData?.next}
        >Next</button>
      </div>
      {postData &&
        postData?.data
          ?.sort((a, b) => b.id - a.id)
          .map((post) => (
            <div className="post" key={post.id}>
              <h1>{post.title}</h1>
              {post.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          ))}
    </div>
  );
};

export default PostLists;
