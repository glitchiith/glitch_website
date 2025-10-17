"use client";

import React from "react";
import PageHeader from "@/components/page-header";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import ProjectDescription from "@/components/Project/ProjectDescription";
import ProjectLinks from "@/components/Project/ProjectLinks";
import ProjectTags from "@/components/Project/ProjectTags";
import ProjectNav from "@/components/Project/ProjectNav";

// Example project data (replace with your actual data fetching logic)
const images = [
  "/images/project_images/project-details-img-01.png",
  "/images/project_images/project-details-img-02.png",
  "/images/project_images/project-details-img-03.png",
  "/images/project_images/project-details-img-01.png",
  "/images/project_images/project-details-img-02.png",
  "/images/project_images/project-details-img-03.png",
];

const markdown = `
## Intro of Project

Pure website is the practice of designing and planning buildings and other physical structures. It is both an art and a science, as it requires both creative and technical skills to create functional, aesthetically pleasing spaces that meet the needs of their users. Architects are responsible for designing buildings and structures that are safe, efficient, and environmentally sustainable. They work closely with clients to understand their needs and preferences, and to create designs that meet their requirements.

### Some of the Key Aspects of Gamingag Include:

- **Design:** Architects use their creativity and design skills to create buildings and structures that are functional, aesthetically pleasing, and fit in with their surroundings. They use a variety of tools and techniques to create detailed plans and drawings of their designs.
- **Engineering:** Architects must also have a strong understanding of engineering principles, including structural engineering, mechanical systems, and electrical systems. This knowledge helps them to create designs that are safe, efficient, and sustainable.
- **Building Codes & Regulation:** Architects must be familiar with local building codes & regulations, and ensure that their designs meet these requirements. They must also consider issues such as accessibility, fire safety, and environmental sustainability.
`;

const links = {
  liveDemo: "https://your-live-demo-link.com",
  driveLink: "https://your-drive-link.com",
  github: "https://github.com/your-repo",
};

const tags = ["Game", "Tool", "Experiment"];

const prevProject = { slug: "previous-project", title: "Previous Project", image: "/images/projects/xcom2.png" };
const nextProject = { slug: "next-project", title: "Next Project", image: "/images/projects/ac3.png" };

interface ProjectPageProps {
  params: Usable<{
    slug: string;
  }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  // Replace with your actual slug usage if needed
  const { slug } = React.use(params);

  return (
    <div>
      <PageHeader title={slug} imageUrl="/images/cannon.png" />

      {/* Image Carousel  */}
      <div className="w-full  mx-auto flex justify-center items-center min-h-[400px] py-20">
        <Swiper
          // modules={[Pagination, EffectCoverflow]}
          modules={[Pagination, Autoplay]}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}

          // effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView={3} // Show 3 images at a time on desktop
          spaceBetween={150}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          loop={true}
          // coverflowEffect={{
          //   rotate: 0,
          //   stretch: 0,
          //   depth: 120,
          //   modifier: 2.5,
          //   slideShadows: true,
          // }}
          pagination={{
            el: ".custom-swiper-pagination",
            clickable: true,
            renderBullet: (index, className) =>
              `<span class="${className}"></span>`,
          }}
          className="w-full"
        >
          {images.map((src, idx) => (
            <SwiperSlide key={idx} className="bg-background">
              <div className="flex justify-center items-center ">
                <img
                  src={src}
                  alt={`Project ${idx + 1}`}
                  className="  w-auto max-w-full  object-contain  bg-background  "
                  style={{ maxHeight: "500px", backgroundColor: "#18181b" }}
                />
              </div>
            </SwiperSlide>
          ))}
          {/* Custom Pagination Bar */}
          <div className="custom-swiper-pagination flex justify-center gap-2 mt-6"></div>
        </Swiper>
      </div>


      {/* Main content area: description left, info right */}

    


      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Description (left, spans 2 columns on desktop) */}

        <div className="md:col-span-2 flex flex-col gap-6">
          <h1 className="text-3xl font-bold mb-2">Project: {slug.toUpperCase()}</h1>
          <ProjectDescription markdown={markdown} />
          <ProjectTags tags={tags} />
          <ProjectLinks {...links} />


          {/* Green separator and navigation, aligned with description */}
          <div className="mt-12">
            <div className="py-5" />
              <ProjectNav prev={prevProject} next={nextProject} />
          </div>


        </div>

        {/* Project Info (right, 1 column) */}
        <div className="md:col-span-1 bg-[#18181b] rounded-2xl shadow-lg p-6 flex flex-col gap-4 h-fit">
          <h2 className="text-xl font-bold mb-2 text-green-400">Project Info:</h2>
          <div>
            <div className="text-gray-400">
              <span className="font-semibold text-white">Category:</span> Design, Game, UIX
            </div>
            <div className="text-gray-400">
              <span className="font-semibold text-white">Date:</span> Dec 10, 2024
            </div>
            <div className="text-gray-400">
              <span className="font-semibold text-white">Services:</span> Game Development
            </div>
            <div className="text-gray-400">
              <span className="font-semibold text-white">Budget:</span> $100M
            </div>
          </div>
          <a
            href={links.liveDemo}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 px-6 py-3 rounded bg-green-500 hover:bg-green-600 text-white font-bold text-center transition"
          >
            TRY THIS GAME
          </a>
        </div>
      </div>




    </div>
  );
}
