// components/ProjectLinks.tsx
import React from "react";
import { FaExternalLinkAlt, FaGithub, FaDownload } from "react-icons/fa";

interface ProjectLinksProps {
  liveDemo?: string;
  driveLink?: string;
  github?: string;
}

const ProjectLinks: React.FC<ProjectLinksProps> = ({ liveDemo, driveLink, github }) => (
  <div className="flex flex-wrap gap-4 mt-8">
    {liveDemo && (
      <a
        href={liveDemo}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold transition"
      >
        <FaExternalLinkAlt /> Live Demo
      </a>
    )}
    {driveLink && (
      <a
        href={driveLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
      >
        <FaDownload /> Download
      </a>
    )}
    {github && (
      <a
        href={github}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded bg-gray-800 hover:bg-gray-900 text-white font-semibold transition"
      >
        <FaGithub /> GitHub
      </a>
    )}
  </div>
);

export default ProjectLinks;
