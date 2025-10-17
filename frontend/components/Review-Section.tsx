import React from "react";
import { FaArrowRight } from "react-icons/fa";

const reviews = [
  {
    name: "ALHASAN",
    date: "December 31, 2024",
    avatar: "/images/avatar1.png", // Replace with your avatar image path
    content:
      "Variations in the floor plan, window location, and interstitial outdoor spaces enhance this material homogeneity. The goal was to produce a unified whole using a modern design language, where attention to materiality and detail is evident. All flats have two sides and are in close proximity to the outside world.",
  },
  // Add more reviews as needed
];

export default function ReviewSection() {
  return (
<section className=" rounded-2xl mt-16 px-0 py-0 shadow-lg overflow-hidden">
  
    {/* User Feedbacks */}
  <div className="px-8 py-8 ">
    <h3 className="text-xl font-bold text-white mb-6">
      User Feedbacks <span className="text-green-400">(03)</span>
    </h3>
    <div className="flex flex-col gap-8">
      {/* Example Review */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-green-400 flex items-center justify-center font-bold text-black text-lg">
          A
        </div>
        <div>
          <div className="flex items-center gap-4 mb-1">
            <span className="font-bold text-white uppercase text-sm tracking-wide">ALHASAN</span>
            <span className="text-green-400 text-xs font-bold">December 31, 2024</span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Variations in the floor plan, window location, and interstitial outdoor spaces enhance this material homogeneity. The goal was to produce a unified whole using a modern design language, where attention to materiality and detail is evident. All flats have two sides and are in close proximity to the outside world.
          </p>
        </div>
      </div>
      {/* Add more reviews as needed */}
    </div>
  </div>
  
  
  
  
  
  
  
  
  
  
  
  
  {/* Header */}
  <div className="bg-gradient-to-r from-green-400/20 via-transparent to-transparent px-8 py-6 border-b border-gray-800">
    <h2 className="text-2xl font-bold text-white tracking-tight">Add Feedback & Reviews</h2>
  </div>

  {/* Form */}
  <form className="flex flex-col md:flex-row gap-0 md:gap-8 px-8 py-8">
    {/* Left: Inputs */}
    <div className="flex-1 flex flex-col gap-4">
      <textarea
        rows={4}
        placeholder="Share your thoughts about this blog..."
        className="bg-gray-900 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none resize-none border border-gray-800"
      />
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Name"
          className="bg-gray-900 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none border border-gray-800 flex-1"
        />
        <input
          type="email"
          placeholder="Email"
          className="bg-gray-900 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none border border-gray-800 flex-1"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="save-info"
          className="accent-green-500"
        />
        <label htmlFor="save-info" className="text-gray-400 text-sm">
          Save my info for next time
        </label>
      </div>
    </div>
    {/* Right: Action */}
    <div className="flex flex-col items-center md:items-end justify-between mt-6 md:mt-0">
      <a
        href="mailto:glitch@iith.ac.in"
        className="inline-flex items-center px-8 py-3 rounded bg-green-400 hover:bg-green-500 text-black font-bold shadow transition"
      >
        GET IN TOUCH
        <svg className="ml-3 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
    </div>
  </form>

  {/* Divider */}
  <div className="border-t border-gray-800" />


</section>
  );
}
