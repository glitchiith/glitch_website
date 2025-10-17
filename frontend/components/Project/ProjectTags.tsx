// components/ProjectTags.tsx
import React from "react";

interface ProjectTagsProps {
  tags: string[];
}

const ProjectTags: React.FC<ProjectTagsProps> = ({ tags }) => (
  <div className="flex flex-wrap gap-2 mt-4">
    {tags.map((tag) => (
      <span
        key={tag}
        className="px-3 py-1 rounded-full bg-gray-700 text-green-400 text-xs font-semibold"
      >
        {tag}
      </span>
    ))}
  </div>
);

export default ProjectTags;
