'use client'

import { useState, useEffect } from "react"

import PromptCard from "./PromptCard"

const PromptCardList = ({ data, handleTagClick }) => (
  <div className="mt-16 prompt_layout">
    {data?.map((post) => (
      <PromptCard
        key={post._id}
        post={post}
        handleTagClick={handleTagClick}
      />
    ))}
  </div>
)

const Feed = () => {

  const [searchText, setSearchText] = useState('')
  const [posts, setPosts] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [searchTimeout, setsearchTimeout] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/prompt')
      const data = await response.json();
      setPosts(data)
    }
    fetchPosts()
  }, [])

  const filterPrompts = (searchText) => {
    const regex = new RegExp(searchText, "i")
    return posts.filter(
      (item) => 
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    )
  }

  const handleSearchChange = async (e) => {
    clearTimeout(searchTimeout)
    setSearchText(e.target.value)

    // debounce method
    setsearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value)
        setSearchResults(searchResult)
      }, 500)
    )
  }

  const handleTagClick = (tag) => {
    setSearchText(tag)

    const searchResult = filterPrompts(tag)
    setSearchResults(searchResult)
  }

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input 
          type="/" 
          placeholder="Search for a tag or username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"  
        />
      </form>
      
      {/* All Prompts */}
      {
        searchText ? (
          <PromptCardList 
            data={searchResults}
            handleTagClick={handleTagClick}
          />
        ) : (
          <PromptCardList
            data={posts}
            handleTagClick={handleTagClick}
          />
        )
      }
      
    </section>
  )
}

export default Feed