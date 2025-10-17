// "use client";


// import PageHeader from "@/components/page-header";
// import { projects } from "@/data/projects";
// import ChromaGrid, { ChromaItem } from "@/components/ui/chroma-grid"; // or wherever it lives
// export default function ProjectsPage() {


// const chromaItems: ChromaItem[] = projects.map((project) => ({
//     image: project.image,
//     title: project.title,
//     subtitle: project.genre,
//     url: `/projects/${project.slug}`,
//     // gradient: "linear-gradient(145deg, #00ff88, #000)", // optional: vary per project
//     // borderColor: "#00ff88", // optional: green border (like your image)

//     gradient : project.gradient || "linear-gradient(145deg, #00ff88, #000)",
//     borderColor: project.borderColor || "#00ff88",
//     year: project.year,
//   }));



//     return (
//         <>
//             <PageHeader
//                 title="Projects"
//                 imageUrl="/images/cannon.png"
//             />
//             <div >
//                  <ChromaGrid items={chromaItems} className="py-20"  />
                    
//             </div>
//         </>
//     );
// }

"use client";

import PageHeader from "@/components/page-header";

export default function ProjectsPage() {
  return (
    <>
      <PageHeader title="Projects" imageUrl="/images/cannon.png" />

      <div className="flex flex-col items-center justify-center py-40 text-center">
        <h2 className="text-5xl font-bold text-green-400 mb-6 animate-pulse">
          🚧 Under Construction 🚧
        </h2>
        <p className="text-gray-400 text-lg max-w-xl">
          We’re working on something exciting!  
          Check back soon to explore our upcoming projects and innovations.
        </p>
      </div>
    </>
  );
}
