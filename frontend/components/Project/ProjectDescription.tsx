// components/ProjectDescription.tsx
import React from "react";
import ReactMarkdown from "react-markdown";

interface ProjectDescriptionProps {
  markdown: string;
}

const ProjectDescription: React.FC<ProjectDescriptionProps> = ({ markdown }) => (
  <div className="prose prose-invert max-w-none">
    <ReactMarkdown>{markdown}</ReactMarkdown>
  </div>
);

export default ProjectDescription;
