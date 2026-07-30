"use client";
import Image from "next/image";
import Link from "next/link";
import { type StaticImageData } from "next/image";
import babies_img from "../../public/image/categories/babies.svg";
import beauty_img from "../../public/image/categories/beautiful.svg";
import furniture_img from "../../public/image/categories/furniture.svg";
import home_img from "../../public/image/categories/home.svg";
import jewelry_img from "../../public/image/categories/jewelry.svg";
import kids_img from "../../public/image/categories/kids.svg";
import men_img from "../../public/image/categories/men.svg";
import mobile_img from "../../public/image/categories/phone.svg";
import shoes_img from "../../public/image/categories/shoes.svg";
import watch_img from "../../public/image/categories/watch.svg";
import women_img from "../../public/image/categories/women.svg";
import laptop_img from "../../public/image/categories/laptop.svg";


const categories = [
  { id: "men", label: "Men Fashion", img: men_img },
  { id: "women", label: "Women Fashion", img: women_img },
  { id: "kids", label: "Kids Fashion", img: kids_img },
  { id: "baby", label: "Baby Fashion", img: babies_img },
  { id: "mobile", label: "Mobile Device", img: mobile_img },
  { id: "laptop", label: "laptop Device", img: laptop_img },
  { id: "beauty", label: "Beauty Products", img: beauty_img },
  { id: "furniture", label: "Furniture", img: furniture_img },
  { id: "watch", label: "Smart Watch", img: watch_img },
  { id: "shoes", label: "Modern Shoes", img: shoes_img },
  { id: "jewelry", label: "Beautiful Jewelry", img: jewelry_img },
  { id: "home", label: "Home Products", img: home_img },
];

function CategoryCard({ id, label, img }: { id: string; label: string, img: StaticImageData }) {
  return (
    <Link
      href={`/category/${id}`}
      id={`category-${id}`}
      className="category-card flex flex-col items-center gap-3 rounded text-center pb-3"
      style={{ textDecoration: "none" }}
    >
      {/* Fixed-size image box */}
      <div className="w-full h-[228px] bg-[#f5e6c8] rounded flex items-center justify-center overflow-hidden relative">
        <Image
          src={img}
          alt={label}
          fill
          style={{ objectFit: "contain", padding: "12px" }}
        />
      </div>
      <p className="text-dark font-bold text-[14px]">
        {label}
      </p>
    </Link>
  );
}


export default function CategorySection() {
  return (
    <section id="categories" className="py-16 bg-white">
      <div className="site-container">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-1">
          Explore, find exactly
        </h2>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-10">
          what you need
        </h2>

        <div className="grid grid-cols-4 gap-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              id={cat.id}
              label={cat.label}
              img={cat.img}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
