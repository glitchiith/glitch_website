// app/blog/[slug]/page.tsx

import React from "react";
import { getMarkdownContent } from "@/lib/markdown";
import Link from "next/link";
import ReviewSection from "@/components/Review-Section";
import PageHeader from "@/components/page-header";



// --- Main Blog Page ---
export default async function BlogPage({ params }: { params: { slug: string | Promise<string> } }) {
  // Next.js may provide params values as promises in some environments — await them before use
  const slug = await params.slug;
  const blog = await getMarkdownContent(slug);

  if (!blog) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center text-gray-400">
        Blog not found.
      </div>
    );
  }

  return (

    <>
    <PageHeader title={blog.title} showImage={false} />


    <div className=" w-[80vw] mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-10">
        <div className="aspect-video w-full rounded-2xl overflow-hidden mb-6">
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <div className="flex items-center gap-3">
            <span className="bg-green-400 text-black px-3 py-1 rounded text-base font-bold">
              {blog.publishDate}
            </span>
            <span className="text-gray-400 text-base">{blog.readTime}</span>
          </div>
          <Link
            href="/blogs"
            className="text-green-400 hover:underline text-base font-medium"
          >
            ← Back to Blogs
          </Link>
        </div>
        <h1 className="text-5xl font-extrabold text-white leading-tight mb-2">
          {blog.title}
        </h1>
        <div className="flex gap-2 mb-2">
          {blog.categories.map((cat: string, idx: number) => (
            <span
              key={idx}
              className="text-green-400 text-xs font-medium uppercase tracking-wide"
            >
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* Blog Content */}
      <article
        className="prose prose-invert max-w-none mb-16"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />


      {/* Review Section */}
      <ReviewSection />
    </div>
    </>
  );
}