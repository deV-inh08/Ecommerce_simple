import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import blog1 from "../../public/image/blogReview/blog_1.svg";
import blog2 from "../../public/image/blogReview/blog_2.svg";
import blog3 from "../../public/image/blogReview/blog_3.svg";

const BLOG_CARDS = [
  {
    id: "b1",
    title: "How to start an online store",
    img: blog1,
    href: "/blog/how-to-start-an-online-store",
  },
  {
    id: "b2",
    title: "7 examples of the best eCommerce websites to take notes from",
    img: blog2,
    href: "/blog/best-ecommerce-websites",
  },
  {
    id: "b3",
    title: "How to start a t-shirt business: ultimate step-by-step guide",
    img: blog3,
    href: "/blog/how-to-start-tshirt-business",
  },
];

export default function BlogPreviewSection() {
  return (
    <section id="blog" className="py-16 bg-white">
      <div className="site-container">
        {/* Left: Heading block */}
        <h2 className="text-[28px] font-extrabold leading-[1.25] text-[#131717] mb-3">
          Learn how to build and grow your online store
        </h2>
        <p className="text-[14px] font-normal leading-[24px] text-[#566363] mb-0">
          Get insider tips and step-by-step guidance from eCommerce experts and successful Wix Merchants.
        </p>

        <div className="grid grid-cols-3 gap-5 mt-20">
          {BLOG_CARDS.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              id={`blog-${card.id}`}
              className="group flex flex-col w-[370px]"
            >
              {/* Image */}
              <div className="overflow-hidden" style={{ width: "370px", height: "227px", position: "relative", flexShrink: 0 }}>
                <Image
                  src={card.img}
                  alt={card.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Title */}
              <p className="mt-3 text-[14px] font-normal leading-[22px] text-[#131717] line-clamp-2 flex-1">
                {card.title}
              </p>

              {/* CTA */}
              <div className="flex items-center gap-1 text-[13px] font-bold text-[#131717] underline py-5">
                Read the blog
                <ChevronRight size={14} strokeWidth={2.5} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section >
  );
}
