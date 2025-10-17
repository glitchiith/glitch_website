// "use client";

// import PageHeader from "@/components/page-header";
// import TeamCard from "@/components/team-card";
// import { teamMembers } from "../../data/team";
// import CurvedLoop from "@/components/curvedloop";

// export default function TeamPage() {
//   return (
//     <>
//       <PageHeader
//         title="Team"
//         imageUrl="/images/team_header.png"
//       />

//       <CurvedLoop
//         marqueeText="Meet Our Amazing Team ✦"
//         speed={2}
//         curveAmount={150} // Default curve for larger screens
//         direction="left"
//         interactive={true}
//         className="text-md fill-green-400 relative z-10 sm:curveAmount-100" // Reduced curve and margin on small screens
//       />

//       <div className="max-w-7xl mx-auto px-4 pt-0 pb-8 sm:px-6 sm:pt-12 sm:pb-12">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
//           {teamMembers.map((member) => (
//             <TeamCard key={member.slug} {...member} />
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }



"use client";

import PageHeader from "@/components/page-header";

export default function TeamPage() {
  return (
    <>
      <PageHeader title="Team" imageUrl="/images/team_header.png" />

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