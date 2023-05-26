'use client'

import { useState, useEffect } from 'react'

import PromptCard from './PromptCard'

const PromptCardList = ({ data, handleTagClick}) => {
  return(
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <PromptCard 
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  )
}

const Feed = () => {
  const [allPost, setAllPost] = useState([]);

  // Search state
  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [posts, setPosts] = useState([])

  const fetchPosts = async () => {
    const response = await fetch('/api/prompt');
    const data = await response.json();

    setAllPost(data);
  };

  useEffect (() => {
    fetchPosts();
  }, []);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return allPost.filter(
      (item) => 
      regex.test(item.creator.username) ||
      regex.test(item.tag) ||
      regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);
    
    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setPosts(searchResult);
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setPosts(searchResult);
  };

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input 
          type='text'
          placeholder='Search for tag or username'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        />
      </form>

      <PromptCardList 
        data= {posts}
        handleTagClick={handleTagClick}
      />
    </section>
  )
}

export default Feed