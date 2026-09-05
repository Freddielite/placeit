import { useState } from "react";

const usePaginator = (postPerPage: number, posts = []) => {
  const [currentPage, setCurrentPage] = useState(1);

  const safePosts = Array.isArray(posts) ? posts : [];

  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const applications = safePosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNum: number) => {
    setCurrentPage(pageNum);
  };

  return { applications, setCurrentPage, postPerPage, currentPage, paginate };
};

export default usePaginator;
