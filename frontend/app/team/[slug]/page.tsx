import PageHeader from "@/components/page-header";
import { teamMembers } from "@/data/team";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

interface TeamPageProps {
  params: {
    slug: string;
  };
}

export default function TeamPage({ params }: TeamPageProps) {
  const member = teamMembers.find((m) => m.slug === params.slug);

  if (!member) return <div className="text-white text-center p-10">Member not found.</div>;

  return (
    <>
      <PageHeader title="Team" imageUrl="/images/team_header.png" />

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center gap-10">
        {/* Left: Image */}
        <div className="w-full md:w-1/2">
          <div className="relative w-full h-[600px] rounded-xl overflow-hidden shadow-2xl">
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-1/2 text-white">
          <p className="text-green-400 font-semibold text-3xl mb-10">{member.tag.toUpperCase()}</p>
          <h1 className="text-6xl font-bold">{member.name}</h1>
          <p className="text-neutral-300 mb-8 mt-10 text-lg">{member.bio}</p>

          <div className="border-t border-neutral-700 pt-8 space-y-2">
            <div>
              <span className="font-bold text-neutral-100">Email: </span>
              <span className="text-neutral-300">{member.email}</span>
            </div>

            <div className="flex gap-4 mt-8 text-xl text-green-400">
              {member.socials.facebook && (
                <a href={member.socials.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 bg-green-800/20 rounded-full flex items-center justify-center hover:bg-green-600/30 transition">
                  <FaFacebook />
                </a>
              )}
              {member.socials.instagram && (
                <a href={member.socials.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 bg-green-800/20 rounded-full flex items-center justify-center hover:bg-green-600/30 transition">
                  <FaInstagram />
                </a>
              )}
              {member.socials.twitter && (
                <a href={member.socials.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 bg-green-800/20 rounded-full flex items-center justify-center hover:bg-green-600/30 transition">
                  <FaTwitter />
                </a>
              )}
              {member.socials.linkedin && (
                <a href={member.socials.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 bg-green-800/20 rounded-full flex items-center justify-center hover:bg-green-600/30 transition">
                  <FaLinkedin />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
