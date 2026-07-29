import {

  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const footerLinks = {
  Company: ["About Us", "Our Team", "Careers", "Blog", "Press"],
  "Customer Service": [
    "Help Center",
    "Returns",
    "Order Status",
    "Shipping Info",
    "Contact Us",
  ],
  Shop: [
    "All Products",
    "Men Fashion",
    "Women Fashion",
    "Electronics",
    "Home & Living",
  ],
};

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#083d3d" }} className="text-white">
      <div className="site-container py-16">
        <div className="grid grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="col-span-2">
            <span className="text-2xl font-bold block mb-4">Pursuit</span>
            <p className="text-sm text-gray-300 leading-relaxed mb-6 max-w-xs">
              Your one-stop destination for modern fashion, electronics, and
              lifestyle products. Shop the best brands at unbeatable prices.
            </p>
            <div className="flex flex-col gap-3 mb-6">
              <a
                href="mailto:hello@pursuit.com"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <Mail size={14} /> hello@pursuit.com
              </a>
              <a
                href="tel:+1800123456"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <Phone size={14} /> +1 800 123 456
              </a>
              <span className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin size={14} /> 123 Fashion St, New York, NY 10001
              </span>
            </div>
            <div className="flex gap-3">
              {/* {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <Icon size={16} />
                </a>
              ))} */}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold text-sm uppercase tracking-widest mb-5 text-gray-200">
                {title}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        className="py-5"
      >
        <div className="site-container flex items-center justify-between">
          <p className="text-sm text-gray-400">
            © 2024 Pursuit. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-gray-400 hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
