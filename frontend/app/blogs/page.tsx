// "use client";

// import PageHeader from "@/components/page-header";
// import React, { useState } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import Link from 'next/link';
// import { Blog} from '@/types';
// import {blogs} from '@/data/blogs';

// import { FaArrowRight } from "react-icons/fa";
// // Blog type definition




// const BlogCard: React.FC<{ blog: Blog }> = ({ blog }) => {
//   // Extract date parts
//   const [day, month] = blog.publishDate.split(" ");

//   return (
//     <Link href={`/blogs/${blog.slug}`} className="block group">
//       <div className="cursor-pointer shadow-none  max-h-max">
//         {/* Date Badge - Protruding Top Left */}
//         <div className="relative">
//           <div
//             className="absolute -top-5 -left-7 z-20 bg-green-400 text-black px-4 py-2  shadow-lg flex flex-col items-center h-20 justify-center"
//             style={{
//               boxShadow: "0 4px 16px rgba(34,197,94,0.15)",
//               minWidth: "54px",
//             }}
//           >
//             <span className="text-3xl font-extrabold leading-none py-1">{day}</span>
//             <span className="text-xs font-semibold uppercase tracking-wider">{month}</span>
//           </div>

//           {/* Thumbnail with hover zoom effect */}
//           <div className="aspect-video overflow-hidden">
//             <img
//               src={blog.thumbnail}
//               alt={blog.title}
//               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//             />
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-6">
//           {/* Categories */}
//           <div className="flex gap-2 mb-3">
//             {blog.categories.map((category, index) => (
//               <span
//                 key={index}
//                 className="text-green-400 text-xs font-medium uppercase tracking-wide"
//               >
//                 {category}
//               </span>
//             ))}
//           </div>

//           {/* Title with underline on hover only */}
//           <h3 className="text-white text-3xl font-bold mb-3 leading-tight relative py-5">
//             <span className="relative hover:text-green-400 transition-colors duration-300">
//               <span
//                 className="cursor-pointer"
//                 style={{ WebkitTapHighlightColor: "transparent" }}
//               >
//                 <span className="hover-underline-animation">{blog.title}</span>
//               </span>
//             </span>
//             <style jsx>{`
//               .hover-underline-animation {
//                 position: relative;
//                 display: inline-block;
//               }
//               .hover-underline-animation:after {
//                 content: "";
//                 position: absolute;
//                 width: 0;
//                 left: 0;
//                 bottom: -2px;
//                 height: 3px;
//                 background: #22c55e;
//                 transition: width 0.4s cubic-bezier(0.4,0,0.2,1);
//               }
//               .hover-underline-animation:hover:after {
//                 width: 100%;
//               }
//             `}</style>
//           </h3>

//           {/* Description */}
//           <p className="text-gray-400 text-base mb-4 leading-relaxed py-3">
//             {blog.description}
//           </p>

//           {/* Read More Link with Arrow, underline only on hover */}
//           <div className="flex items-center justify-between">
//             <span className="relative">
//               <span className="flex items-center gap-1 text-green-400 text-base font-medium cursor-pointer hover:text-green-300 transition-colors duration-300 readmore-underline">
//                 READ MORE
//                 <FaArrowRight className="inline-block ml-1 text-xs" />
//               </span>
//               <style jsx>{`
//                 .readmore-underline:after {
//                   content: "";
//                   position: absolute;
//                   width: 0;
//                   left: 0;
//                   bottom: -2px;
//                   height: 2px;
//                   background: #22c55e;
//                   transition: width 0.4s cubic-bezier(0.4,0,0.2,1);
//                 }
//                 .readmore-underline:hover:after {
//                   width: 100%;
//                 }
//               `}</style>
//             </span>
//             <span className="text-gray-500 text-base">{blog.readTime}</span>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

// const Pagination: React.FC<{ currentPage: number; totalPages: number; onPageChange: (page: number) => void }> = ({
//   currentPage,
//   totalPages,
//   onPageChange
// }) => {
//   const getPageNumbers = () => {
//     const pages = [];
//     const maxVisiblePages = 5;
    
//     let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//     let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
//     if (endPage - startPage + 1 < maxVisiblePages) {
//       startPage = Math.max(1, endPage - maxVisiblePages + 1);
//     }
    
//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(i);
//     }
    
//     return pages;
//   };

//   return (
//     <div className="flex items-center justify-center space-x-2 mt-12">
//       {/* Previous Button */}
//       <button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//       >
//         <ChevronLeft size={18} />
//       </button>

//       {/* Page Numbers */}
//       {getPageNumbers().map(page => (
//         <button
//           key={page}
//           onClick={() => onPageChange(page)}
//           className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors duration-200 ${
//             page === currentPage
//               ? 'bg-green-400 text-black'
//               : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
//           }`}
//         >
//           {page}
//         </button>
//       ))}

//       {/* Next Button */}
//       <button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//         className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//       >
//         <ChevronRight size={18} />
//       </button>
//     </div>
//   );
// };

// const BlogListingPage: React.FC = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const blogsPerPage = 6;
  
//   const totalPages = Math.ceil(blogs.length / blogsPerPage);
//   const startIndex = (currentPage - 1) * blogsPerPage;
//   const currentBlogs = blogs.slice(startIndex, startIndex + blogsPerPage);

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   return (

//     <div className="min-h-screen  ">
      
//       <PageHeader title={"Blogs"} imageUrl="/images/cannon.png" />

//       <div className="container mx-auto px-4 py-12  ">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4">Latest Blogs</h1>
//           <p className="text-gray-400 text-lg">Stay updated with the latest insights from the gaming world</p>
//         </div>

//         {/* Blog Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 items-stretch">
//           {currentBlogs.map(blog => (
//              <div key={blog.id} className="flex flex-col h-full">
//             <BlogCard key={blog.id} blog={blog} />
//             </div>
//           ))}
//         </div>

//         {/* Pagination */}
//         <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={handlePageChange}
//         />
//       </div>
//     </div>
//   );
// };

// export default BlogListingPage;

"use client";

import PageHeader from "@/components/page-header";

export default function InsightsPage() {
  return (
    <>
      <PageHeader title="Insights" imageUrl="/images/cannon.png" />

      <div className="flex flex-col items-center justify-center py-40 text-center">
        <h2 className="text-5xl font-bold text-green-400 mb-6 animate-pulse">
          🧠 Under Construction 🧠
        </h2>
        <p className="text-gray-400 text-lg max-w-xl">
          Our insights section is leveling up.  
          Soon you’ll find event recaps, tips, and community stories here!
        </p>
      </div>
    </>
  );
}
