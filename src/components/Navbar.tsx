import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center"
          >
            <span className={`text-2xl font-bold ${
              isScrolled ? "text-purple-600" : "text-white"
            }`}>
              GetMyFirstInvestor
            </span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {["How It Works", "Features", "Pricing", "Success Stories"].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`${
                  isScrolled ? "text-gray-600" : "text-white"
                } hover:text-purple-500 transition-colors cursor-pointer`}
              >
                {item}
              </motion.a>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {/* <Button
              variant="ghost"
              onClick={() => navigate("/auth")}
              className={`${
                isScrolled ? "text-purple-600" : "text-white"
              } hover:bg-purple-50`}
            >
              Sign In
            </Button> */}
            <Button
              onClick={() => navigate("/auth")}
              className={`${
                isScrolled
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-white text-purple-600 hover:bg-gray-100"
              }`}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
