"use client";
import PageHeader from "@/components/page-header";
import RotatingCircle from "@/components/rotator";
import TimelineProgress from "@/components/scroller";
import ScrollFloat from "@/components/ScrollFloat";

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About us"
        imageUrl="/images/team_header.png"
      />

      <section className="relative bg-black text-white py-24 px-8 flex flex-col md:flex-row items-center justify-center overflow-hidden">
        
        {/* Background Image behind the right side text */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block z-0">
          <img
            src="/images/about_background.png"
            alt="Background"
            className="object-cover w-full h-full opacity-100"
          />
        </div>

        <div className="md:w-1/2 flex justify-center z-10 relative">
          <img
            src="/images/teamworking.png"
            alt="Team Working"
            className="rounded-lg shadow-lg w-full max-w-lg"
          />

          <RotatingCircle />
        </div>

        <div className="md:w-1/2 mt-12 md:mt-0 md:pl-16 relative z-10">
          <h2 className="text-5xl font-extrabold mb-6 leading-snug">
            We bring together top experts{" "}
            <span className="text-green-400">& talented</span>
          </h2>
          <p className="text-gray-300 mb-8 text-lg leading-relaxed mt-6">
            Glitch, the vibrant hub for gaming and game development at the Indian Institute of Technology, connects passionate gamers and aspiring developers through exciting tournaments, insightful workshops, and collaborative coding experiences.  
          </p>

          <ul className="space-y-4 text-lg">
            <li className="font-bold">Esports Excellence</li>
            <li className="font-bold">Game Development Innovation</li>  
          </ul>

        </div>
      </section>





      <section className="relative bg-gray-950 text-white py-24 px-8">
        <div className="max-w-6xl mx-auto mt-12">
          <ScrollFloat
            animationDuration={2}
            ease="power2.out"
            scrollStart="top center"
          >
            <h2 className="text-5xl font-extrabold mb-16 text-center">
              Events by <span className="text-green-400">Glitch</span>
            </h2>
          </ScrollFloat>




          <div className="relative mt-14">
            {/* Vertical Scroll Line */}
            
            <TimelineProgress />

            {/* Timeline Item 1 */}
            <div className="flex flex-col md:flex-row items-center mb-16">
              <div className="md:w-1/2 md:pr-12">
                <img
                  src="/images/about-timeline/timeline1.png"
                  alt="Journey Start"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              <div className="md:w-1/2 md:pl-12 mt-8 md:mt-0">
                <p className="text-green-400 text-sm uppercase mb-2">Valorant Asus Competition</p>
                <h3 className="text-4xl font-bold mb-4">Sept 2025</h3>
                <p className="text-gray-300 leading-relaxed">
                  Glitch kicked off with an electrifying Valorant tournament, uniting gamers and setting the stage for our vibrant community.
                </p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center mb-16">
              <div className="md:w-1/2 md:pl-12">
                <img
                  src="/images/about-timeline/timeline2.png"
                  alt="Next Milestone"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              <div className="md:w-1/2 md:pr-12 mt-8 md:mt-0">
                <p className="text-green-400 text-sm uppercase mb-2">Milan Glitch Competition</p>
                <h3 className="text-4xl font-bold mb-4">Oct 2025</h3>
                <p className="text-gray-300 leading-relaxed">
                  Glitch hosted a thrilling gaming competition, fostering creativity and collaboration among aspiring developers and esports enthusiasts.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* <section className="bg-black text-white py-24 px-8"> */}
      {/* <div className="max-w-6xl mx-auto mt-12 mb-14">
        <ScrollFloat
            animationDuration={2}
            ease="power2.out"
            scrollStart="top center"
          >
        <h2 className="text-5xl font-extrabold mb-16 text-center">
          Affiliations with other <span className="text-green-400">clubs</span>
        </h2>
        </ScrollFloat>
      </div> */}

      {/* <div className="grid md:grid-cols-3 gap-12 mb-25"> */}
        {/* Card 1 */}
        {/* <div className="relative rounded-lg overflow-hidden shadow-lg group">
          <img
            src="/images/about-timeline/aff1.png"
            alt="Affiliation 1"
            className="w-full h-80 object-cover transform group-hover:scale-110 transition duration-500"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/30 p-4">
            <div className="flex space-x-4 text-sm text-green-400 mb-1">
              <span>Club</span>
              <span>|</span>
              <span>Partnership</span>
            </div>
            <h3 className="text-lg font-bold">
              IIT Hyderabad Cultural Council
            </h3>
          </div>
        </div> */}

        {/* Card 2 */}
        {/* <div className="relative rounded-lg overflow-hidden shadow-lg group">
          <img
            src="/images/about-timeline/aff2.png"
            alt="Affiliation 2"
            className="w-full h-80 object-cover transform group-hover:scale-110 transition duration-500"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/30 p-4">
            <div className="flex space-x-4 text-sm text-green-400 mb-1">
              <span>Department</span>
              <span>|</span>
              <span>Workshop</span>
            </div>
            <h3 className="text-lg font-bold">
              AI Department Collaboration
            </h3>
          </div>
        </div> */}

        {/* Card 3 */}
        {/* <div className="relative rounded-lg overflow-hidden shadow-lg group">
          <img
            src="/images/about-timeline/aff3.png"
            alt="Affiliation 3"
            className="w-full h-80 object-cover transform group-hover:scale-110 transition duration-500"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/30 p-4">
            <div className="flex space-x-4 text-sm text-green-400 mb-1">
              <span>Community</span>
              <span>|</span>
              <span>Event</span>
            </div>
            <h3 className="text-lg font-bold">
              Indie Game Dev Network
            </h3>
          </div>
        </div> */}
      {/* </div> */}
    {/* </section> */}

    </>
  );
}
