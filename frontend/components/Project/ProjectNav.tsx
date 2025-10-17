// components/ProjectNav.tsx
import React from "react";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface ProjectNavProps {
  prev?: { slug: string; title: string; image: string };git 
  next?: { slug: string; title: string; image: string };
}

const ProjectNav: React.FC<ProjectNavProps> = ({ prev, next }) => (
  <div className="flex justify-between items-center border-t border-green-500 mt-12 pt-8 py-8">
    {prev ? (
      <Link href={`/projects/${prev.slug}`  } className="flex items-center gap-3 group">
         
          <img src={prev.image} alt={prev.title} className="w-12 h-12 rounded-full object-cover" />
          <span className="text-green-400 group-hover:underline flex items-center">
            <FaArrowLeft className="mr-2" /> {prev.title}
          </span>
    
      </Link>
    ) : <div />}





    {next ? (
      <Link href={`/projects/${next.slug}`}     className="flex items-center gap-3 group">
     
          <span className="text-green-400 group-hover:underline flex items-center">
            {next.title} <FaArrowRight className="ml-2" />
          </span>
          <img src={next.image} alt={next.title} className="w-12 h-12 rounded-full object-cover" />
        
      </Link>
    ) : <div />}
  </div>
);

export default ProjectNav;
