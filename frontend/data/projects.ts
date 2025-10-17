// data/projects.ts
import { Project } from "@/types";

export const projects : Project[]= [
  {
    slug: "assassins-creed",
    title: "Assassin’s Creed ",
    year: "2012",
    genre: "Action - Adventure",
          borderColor: "#4F46E5",
    image: "/images/projects/ac3.png", // Save in public/images/projects
    gradient: "linear-gradient(145deg,#4F46E5,#000)",
  
  },
  {
    slug: "xcom-2",
    title: "XCOM 2",
    year: "2016",
    genre: "Strategy",
    image: "/images/projects/xcom2.png",
          borderColor: "#10B981",
          gradient: "linear-gradient(210deg,#10B981,#000)",
  },
  {
    slug: "nfs-mw-2012",
    title: "NFS MW 2012",
    year: "2012",
    genre: "Sports - Racing",
    image: "/images/projects/nfs.png",
    borderColor: "#F59E0B",
    gradient: "linear-gradient(165deg,#F59E0B,#000)",
  },
  {
  slug: "hollow-knight",
  title: "Hollow Knight",
  year: "2017",
  genre: "Action - Platformer",
  image: "https://wp.framerpeak.com/alvido/wp-content/uploads/2024/12/project-page01.png",
           borderColor: "#EF4444", 
  gradient: "linear-gradient(195deg,#EF4444,#000)",

},
{
  slug: "celeste",
  title: "Celeste",
  year: "2018",
  genre: "Puzzle - Platformer",
  image: "https://wp.framerpeak.com/alvido/wp-content/uploads/2024/12/project-page02.png",
            borderColor: "#8B5CF6",
  gradient: "linear-gradient(225deg,#8B5CF6,#000)",
},
{
  slug: "doom-eternal",
  title: "Doom Eternal",
  year: "2020",
  genre: "Action - Shooter",
  image: "https://wp.framerpeak.com/alvido/wp-content/uploads/2024/12/project-page05.png",
      
      borderColor: "#06B6D4",
  gradient: "linear-gradient(135deg,#06B6D4,#000)",

},


];


