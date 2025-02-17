"use client";
import { useRouter } from 'next/navigation';
import React from 'react'
import { useState } from 'react';
import { Search } from 'lucide-react';

const SearchInput = () => {
    const router = useRouter();
    const [searchQuery , setSearchQuery]= useState("")
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault();
      if(searchQuery.trim() ) {
        router.push(`/search/${encodeURIComponent(searchQuery.trim())}`)
      };
    }

  return (
    <form className='relative w-full flex-1 max-w-[300px]'onSubmit={handleSubmit}>
        <input type="text"
         placeholder="Search for courses"
         value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}
         className="w-full rounded-full bg-secondary/80 py-2 px-4 pl-10 text-sm foxus:outline-none focus:ring-2 focus:ring-primary"
         />
        <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground'/>
      
    </form>
  )
}

export default SearchInput
