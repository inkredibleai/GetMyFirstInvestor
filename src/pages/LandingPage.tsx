import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ChevronRight, Users, BarChart, Rocket, Shield, Mail, 
  Globe, Zap, Target, TrendingUp, MessageSquare, Award, Building2, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const LandingPage = () => {
  const navigate = useNavigate();

  const pricingTiers = [
    {
      name: "Ideation",
      price: "Free",
      features: [
        "Basic mentor matching",
        "Idea validation tools",
        "Access to startup templates",
        "Community access",
      ],
    },
    {
      name: "MVP Builder",
      price: "₹999",
      features: [
        "Everything in Ideation",
        "1:1 Mentor sessions",
        "Technical consultation",
        "MVP development guidance",
        "Investor pitch preparation",
      ],
    },
    {
      name: "Growth",
      price: "₹2999",
      features: [
        "Everything in MVP Builder",
        "Priority investor matching",
        "Technical co-founder matching",
        "Due diligence support",
        "Funding readiness toolkit",
      ],
    },
  ];

  const stats = [
    { number: "200+", label: "Expert Mentors" },
    { number: "₹10Cr+", label: "Funding Facilitated" },
    { number: "500+", label: "Idea-Stage Startups" },
    { number: "100+", label: "Successful MVPs" },
  ];

  const features = [
    {
      icon: Users,
      title: "Expert Mentorship",
      description: "Connect with industry veterans who guide you from idea to execution.",
    },
    {
      icon: BarChart,
      title: "Seed Funding",
      description: "Access funding from ₹50K to ₹10 LPA for your early-stage startup.",
    },
    {
      icon: Rocket,
      title: "MVP Development",
      description: "Get technical support and resources to build your first product.",
    },
  ];

  const advancedFeatures = [
    {
      icon: Globe,
      title: "Global Investor Network",
      description: "Access to international angel investors and venture capitalists.",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: Zap,
      title: "Smart Matching",
      description: "AI-powered matching system to find the perfect investor for your startup.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Target,
      title: "Due Diligence Tools",
      description: "Comprehensive tools for investor verification and startup assessment.",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: TrendingUp,
      title: "Market Analytics",
      description: "Real-time market trends and investment patterns analysis.",
      gradient: "from-orange-500 to-rose-500"
    },
    {
      icon: MessageSquare,
      title: "Secure  Deals",
      description: "End-to-end dear are secure for confidential discussions.",
      gradient: "from-pink-500 to-purple-500"
    },
    {
      icon: Award,
      title: "Verified Credentials",
      description: "Verified investor credentials and startup metrics.",
      gradient: "from-violet-500 to-fuchsia-500"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Updated Hero Section with more futuristic elements */}
      <section className="relative min-h-screen bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 text-white flex items-center overflow-hidden">
        {/* Add animated background particles */}
        <div className="absolute inset-0">
          <div id="particles-js"></div>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto text-center px-4 relative z-10 pt-16"
        >
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            Turn Your Idea Into<br />
            A Successful Startup
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            From ideation to MVP, we connect early-stage founders with expert mentors
            and seed funding (₹50K - ₹10 LPA). Get the guidance and resources you
            need to build your dream startup.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              Get Started
              <ArrowRight className="ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Watch Demo
            </Button>
          </div>

          {/* Add scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1 h-1 bg-white rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced abstract shapes background */}
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }} 
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 opacity-10"
        >
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full"></div>
        </motion.div>

        {/* Add floating 3D elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotateZ: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute right-20 top-40 w-32 h-32 glass-morphism rounded-2xl"
        />
        {/* Add more floating elements... */}
      </section>

      {/* Stats Section - Add hover effect */}
      <section className="py-16 bg-white" id="features">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-lg hover:shadow-lg cursor-pointer"
              >
                <h3 className="text-4xl font-bold text-purple-600 mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

<section className="py-20 bg-white">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold mb-4">Complete Startup Support System</h2>
      <p className="text-xl text-gray-600">Everything you need to go from idea to funded startup</p>
    </div>
    
    <div className="grid md:grid-cols-3 gap-8">
      {/* Mentors Section */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-white p-8 rounded-xl shadow-lg"
      >
        <Users className="w-12 h-12 text-purple-600 mb-4" />
        <h3 className="text-2xl font-bold mb-4">1:1 Mentorship</h3>
        <p className="text-gray-600 mb-4">
          Get personalized guidance from experienced founders and industry experts
        </p>
        <Button variant="outline">Meet Mentors</Button>
      </motion.div>

      {/* Investors Section */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-white p-8 rounded-xl shadow-lg"
      >
        <Building2 className="w-12 h-12 text-purple-600 mb-4" />
        <h3 className="text-2xl font-bold mb-4">Seed Funding</h3>
        <p className="text-gray-600 mb-4">
          Access early-stage funding from ₹50K to ₹10 LPA to kickstart your journey
        </p>
        <Button variant="outline">View Opportunities</Button>
      </motion.div>

      {/* Incubators Section */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-white p-8 rounded-xl shadow-lg"
      >
        <Rocket className="w-12 h-12 text-purple-600 mb-4" />
        <h3 className="text-2xl font-bold mb-4">MVP Development</h3>
        <p className="text-gray-600 mb-4">
          Technical guidance and resources to build your first product
        </p>
        <Button variant="outline">Start Building</Button>
      </motion.div>
    </div>
  </div>
</section>

      {/* Add id attributes to sections for navigation */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: 1, title: "Create Profile", desc: "Sign up and create your startup profile" },
              { step: 2, title: "Get Verified", desc: "Complete verification process" },
              { step: 3, title: "Connect", desc: "Start connecting with investors" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-white p-8 rounded-lg shadow-lg relative z-10">
                  <div className="text-3xl font-bold text-purple-600 mb-4">Step {item.step}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
                {index < 2 && (
                  <ChevronRight className="hidden md:block absolute top-1/2 -right-8 text-purple-600 w-8 h-8 transform -translate-y-1/2" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
  {/* New Feature Showcase Section */}
  <section id="features" className="py-24 bg-gradient-to-b from-gray-900 to-gray-800 text-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6" id="future-fundraising">
            Future of Startup Fundraising
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the next generation of fundraising tools and investor networking
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {advancedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ delay: index * 0.1 }}
                className="glass-morphism p-8 rounded-2xl relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                <feature.icon className="w-12 h-12 mb-6 text-purple-400" />
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Add geometric background elements */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 50,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-3xl"
          />
          {/* Add more geometric shapes... */}
        </div>
      </section>

      <section id="success-stories" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: "Sarah Johnson",
                company: "TechStart Inc.",
                quote: "Found our seed investor within 2 weeks of joining the platform.",
                image: "https://randomuser.me/api/portraits/women/1.jpg",
              },
              {
                name: "Mike Chen",
                company: "GrowthAI",
                quote: "The tools and investor connections were invaluable for our Series A.",
                image: "https://randomuser.me/api/portraits/men/1.jpg",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Pricing Plans</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className="bg-white p-6 rounded-lg shadow-lg border"
              >
                <h3 className="text-2xl font-bold mb-4">{tier.name}</h3>
                <p className="text-3xl font-bold mb-6">
                  {tier.price}
                  {tier.price !== "Free" && <span className="text-sm">/mo</span>}
                </p>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="text-green-500 mr-2" size={20} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={tier.name === "Pro" ? "default" : "outline"}
                  onClick={() => navigate("/auth")}
                >
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Startups Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8">Featured Startups</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Example Startup Card */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-2">Startup Name</h3>
              <p className="text-gray-600 mb-4">Brief description of the startup.</p>
              <Button onClick={() => navigate("/startup-details")} className="w-full">View Details</Button>
            </div>
            {/* Add more startup cards as needed */}
          </div>
        </div>
      </section>

      {/* Featured Startups Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8">Featured Startups</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Example Startup Card */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-2">Startup Name</h3>
              <p className="text-gray-600 mb-4">Brief description of the startup.</p>
              <Button onClick={() => navigate("/startup-details")} className="w-full">View Details</Button>
            </div>
            {/* Add more startup cards as needed */}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
          <h2 className="text-4xl font-bold mb-8">Ready to Build Your Startup?</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Join hundreds of founders who've gone from idea to funded startup with
            our mentorship and support system.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="glass-morphism hover:neon-glow transition-all duration-300"
            >
              Get Started Now
              <ArrowRight className="ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Schedule Demo
            </Button>
          </div>
          </motion.div>
        
        {/* Add animated background elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 opacity-20"
        >
          {/* Add geometric patterns */}
        </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4">GemFi</h3>
              <p className="text-gray-400">Connecting startups with the right investors.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>How It Works</li>
                <li>Pricing</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Blog</li>
                <li>Success Stories</li>
                <li>FAQs</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <div className="flex items-center text-gray-400">
                <Mail className="w-4 h-4 mr-2" />
                <span>support@gemfi.com</span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 GemFi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
