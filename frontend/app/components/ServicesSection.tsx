import car from "../../public/image/service/car.svg"
import delivery from "../../public/image/service/delivery.svg"
import store from "../../public/image/service/store.svg"

const services = [
  {
    id: "same-day",
    title: "Same Day Delivery",
    desc: "We are providing same day delivery with a minimum cost at anytime anywhere.",
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
      >
        <rect width="48" height="48" rx="8" fill="white" />
        <path
          d="M6 30H34V18H6V30Z"
          stroke="#0d5c5c"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M34 22H40L44 28V30H34V22Z"
          stroke="#f5c518"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="33" r="3" stroke="#0d5c5c" strokeWidth="2" />
        <circle cx="38" cy="33" r="3" stroke="#0d5c5c" strokeWidth="2" />
        <path d="M14 24H26" stroke="#0d5c5c" strokeWidth="2" strokeLinecap="round" />
        <path d="M14 27H22" stroke="#0d5c5c" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "next-day",
    title: "Next Day Delivery",
    desc: "We are providing next day delivery without any minimum cost at anytime anywhere.",
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
      >
        <rect width="48" height="48" rx="8" fill="white" />
        <path
          d="M8 28H36V14H8V28Z"
          stroke="#0d5c5c"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M36 20H44L48 26V28H36V20Z"
          stroke="#f5c518"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="14" cy="31" r="3" stroke="#0d5c5c" strokeWidth="2" />
        <circle cx="40" cy="31" r="3" stroke="#0d5c5c" strokeWidth="2" />
        <path d="M22 10L26 14L22 18" stroke="#0d5c5c" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "multiple-store",
    title: "Multiple Store",
    desc: "We have multiple store across the country and soon we will launch more stores.",
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
      >
        <rect width="48" height="48" rx="8" fill="white" />
        <rect x="8" y="22" width="32" height="18" rx="2" stroke="#0d5c5c" strokeWidth="2" />
        <path d="M8 22L16 10H32L40 22" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 40V30H28V40" stroke="#0d5c5c" strokeWidth="2" />
        <path d="M14 26H18V32H14V26Z" stroke="#0d5c5c" strokeWidth="2" />
        <path d="M30 26H34V32H30V26Z" stroke="#0d5c5c" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "trusted",
    title: "Trusted Platform",
    desc: "Our clients loves us so much. We are providing the best and bringing the best to the clients.",
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
      >
        <rect width="48" height="48" rx="8" fill="white" />
        <rect x="6" y="12" width="36" height="24" rx="3" stroke="#0d5c5c" strokeWidth="2" />
        <path d="M18 24L22 28L30 20" stroke="#f5c518" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 18H42" stroke="#0d5c5c" strokeWidth="1.5" />
        <circle cx="12" cy="15" r="2" fill="#f5c518" />
        <circle cx="18" cy="15" r="2" fill="#0d5c5c" />
      </svg>
    ),
  },
];

export default function ServicesSection() {
  return (
    <section
      id="services"
      style={{ backgroundColor: "#f5c518" }}
      className="py-16"
    >
      <div className="site-container">
        <div className="grid grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              id={`service-${service.id}`}
              className="bg-white rounded-lg p-6 flex flex-col items-center text-center gap-4"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
            >
              {service.icon}
              <h3 className="text-[20px] font-bold leading-[30px] text-center text-[#131717]">
                {service.title}
              </h3>
              <p className="text-[14px] font-normal leading-[24px] text-center text-[#566363]">
                {service.desc}
              </p>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
