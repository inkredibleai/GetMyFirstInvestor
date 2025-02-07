import {
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Sparkles,
  Briefcase,
  Wrench,
  Users,
  Building2,
  ChevronRight,
  ChevronDown,
  Mail,
  Star,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md fixed w-full z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary cursor-pointer flex items-center gap-2" onClick={() => navigate('/')}>
          GetMyFirstInvestor
        </div>
        <div className="hidden md:flex gap-4">
          <Button variant="link">Learn More</Button>
          <Button variant="link">Pricing</Button>
          <Button variant="link">Contact</Button>
          <Button 
            variant="default" 
            className="bg-primary text-white px-4 py-2 rounded-md"
            onClick={() => navigate('/auth')}
          >
            Get Started
          </Button>
        </div>
        <div className="md:hidden">
          <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="flex flex-col gap-4 p-4">
            <Button variant="link" onClick={() => navigate('/auth')}>Get Started</Button>
            <Button variant="link">Learn More</Button>
            <Button variant="link">Pricing</Button>
            <Button variant="link">Contact</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

const PricingTier = ({
  name,
  price,
  features,
  isPopular,
}: {
  name: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}) => (
  <Card 
    className={`p-6 flex flex-col h-full transform transition-all duration-300 hover:scale-105 ${
      isPopular ? "border-accent border-2" : ""
    }`}
  >
    <div className="mb-4">
      {isPopular && (
        <span className="bg-accent text-xs font-semibold px-2 py-1 rounded-full mb-2 inline-block">
          Most Popular
        </span>
      )}
      <h3 className="text-2xl font-bold">{name}</h3>
      <div className="mt-2">
        <span className="text-3xl font-bold">{price}</span>
        {price !== "Free" && <span className="text-gray-600">/month</span>}
      </div>
    </div>
    <ul className="space-y-3 flex-grow">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-accent" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <Button className="mt-6 w-full bg-primary hover:bg-accent hover:text-primary transition-all duration-300">
      Get Started <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  </Card>
);

const StatCard = ({ icon: Icon, title, value }: { icon: any; title: string; value: string }) => (
  <Card className="p-6 text-center animate-float">
    <Icon className="w-12 h-12 mx-auto mb-4 text-accent" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-3xl font-bold text-primary">{value}</p>
  </Card>
);

const TestimonialCard = ({ author, role, content, rating }: { author: string; role: string; content: string; rating: number }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="p-6 bg-white rounded-xl shadow-lg"
  >
    <div className="flex gap-1 mb-4">
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
      ))}
    </div>
    <p className="text-gray-700 mb-4">{content}</p>
    <div>
      <h4 className="font-semibold">{author}</h4>
      <p className="text-sm text-gray-500">{role}</p>
    </div>
  </motion.div>
);

const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full py-4 flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold">{question}</span>
        <ChevronDown className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          className="pb-4 text-gray-600"
        >
          {answer}
        </motion.div>
      )}
    </div>
  );
};

const InterconnectedSection = () => (
  <section className="container mx-auto px-4 py-16">
    <h2 className="text-3xl font-bold text-center mb-12">How We Help Startups and Investors</h2>
    <div className="grid md:grid-cols-3 gap-8">
      <Card className="p-6 text-center animate-fade-up hover:shadow-lg transition-all cursor-pointer">
        <Users className="w-12 h-12 mx-auto mb-4 text-accent" />
        <h3 className="text-xl font-semibold mb-2">For Startups</h3>
        <p className="text-gray-600">
          Access a network of verified investors, essential tools, and resources to grow your startup.
        </p>
      </Card>
      <Card className="p-6 text-center animate-fade-up hover:shadow-lg transition-all cursor-pointer" style={{ animationDelay: "0.2s" }}>
        <Wrench className="w-12 h-12 mx-auto mb-4 text-accent" />
        <h3 className="text-xl font-semibold mb-2">For Investors</h3>
        <p className="text-gray-600">
          Discover promising startups, gain insights, and make informed investment decisions.
        </p>
      </Card>
      <Card className="p-6 text-center animate-fade-up hover:shadow-lg transition-all cursor-pointer" style={{ animationDelay: "0.4s" }}>
        <Briefcase className="w-12 h-12 mx-auto mb-4 text-accent" />
        <h3 className="text-xl font-semibold mb-2">Tools & Resources</h3>
        <p className="text-gray-600">
          Utilize our comprehensive toolkit to streamline operations and enhance your startup's growth.
        </p>
      </Card>
    </div>
  </section>
);

const Index = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const pricingTiers = [
    {
      name: "Starter",
      price: "Free",
      features: [
        "Basic investor directory access",
        "Limited startup tools",
        "Community access",
      ],
    },
    {
      name: "Pro",
      price: "₹999",
      features: [
        "Full investor directory access",
        "Complete startup toolkit",
        "Priority support",
        "Detailed investor insights",
      ],
      isPopular: true,
    },
    {
      name: "Pro+",
      price: "₹2999",
      features: [
        "Everything in Pro",
        "Direct investor introductions",
        "Premium startup toolkit",
        "Dedicated account manager",
        "Advanced analytics",
      ],
    },
  ];

  const testimonials = [
    {
      author: "Sarah Johnson",
      role: "Founder, TechStart",
      content: "Found my first angel investor within weeks of joining the platform.",
      rating: 5,
    },
    // Add more testimonials...
  ];

  const faqItems = [
    {
      question: "How do you verify investors?",
      answer: "We have a rigorous verification process that includes background checks and portfolio verification.",
    },
    // Add more FAQ items...
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-white">
      <Navbar />
      {/* Enhanced Hero Section with Animation */}
      <section className="container mx-auto px-4 pt-20 pb-16 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Your First Step Towards Startup Success
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get connected with your first angel investor. We make fundraising simple, 
            transparent, and accessible for early-stage startups.
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-primary text-primary hover:text-white transition-all transform hover:scale-105" 
              onClick={() => navigate('/auth')}
            >
              Get Started <ArrowRight className="ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="transform hover:scale-105"
            >
              Learn More
            </Button>
          </div>
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute right-10 top-20 hidden lg:block"
        >
          {/* Add hero graphic/illustration here */}
        </motion.div>
      </section>

      {/* How it Works Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Your Journey to First Investment</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: 1, title: "Create Profile", icon: Users },
            { step: 2, title: "Complete Verification", icon: CheckCircle2 },
            { step: 3, title: "Connect with Investors", icon: ArrowUpRight },
            { step: 4, title: "Secure Funding", icon: DollarSign },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="relative">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-accent" />
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">Step {item.step}</h3>
              <p>{item.title}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Interconnected Section */}
      <InterconnectedSection />

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <StatCard icon={Users} title="Active Investors" value="500+" />
          <StatCard icon={Building2} title="Funded Startups" value="200+" />
          <StatCard icon={DollarSign} title="Total Funding" value="$50M+" />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 text-center animate-fade-up hover:shadow-lg transition-all cursor-pointer">
            <Users className="w-12 h-12 mx-auto mb-4 text-accent" />
            <h3 className="text-xl font-semibold mb-2">Verified Investors</h3>
            <p className="text-gray-600">
              Connect with pre-verified angel investors interested in your domain
            </p>
            <Button variant="ghost" className="mt-4">
              Learn More <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>
          <Card className="p-6 text-center animate-fade-up hover:shadow-lg transition-all cursor-pointer" style={{ animationDelay: "0.2s" }}>
            <Wrench className="w-12 h-12 mx-auto mb-4 text-accent" />
            <h3 className="text-xl font-semibold mb-2">Startup Tools</h3>
            <p className="text-gray-600">
              Access essential tools to streamline your startup operations
            </p>
            <Button variant="ghost" className="mt-4">
              Explore Tools <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>
          <Card className="p-6 text-center animate-fade-up hover:shadow-lg transition-all cursor-pointer" style={{ animationDelay: "0.4s" }}>
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-accent" />
            <h3 className="text-xl font-semibold mb-2">Startup Showcase</h3>
            <p className="text-gray-600">
              List your startup and get noticed by potential investors
            </p>
            <Button variant="ghost" className="mt-4">
              Get Featured <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16 bg-secondary rounded-3xl my-16">
        <h2 className="text-3xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
        <p className="text-center text-gray-600 mb-12">Choose the plan that best fits your needs</p>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <PricingTier key={index} {...tier} />
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <FaqItem key={index} {...item} />
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto px-4 py-16 bg-secondary rounded-3xl">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-8 text-gray-600">
            Get the latest updates on startup funding opportunities and investor insights.
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Button className="bg-accent hover:bg-primary">
              Subscribe <Mail className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="p-12 bg-primary text-white transform hover:scale-105 transition-all">
          <Sparkles className="w-16 h-16 mx-auto mb-6 text-accent" />
          <h2 className="text-3xl font-bold mb-4">Ready to Get Your First Investor?</h2>
          <p className="mb-8 text-gray-300 max-w-2xl mx-auto">
            Join thousands of founders who found their first investors through our platform. 
            Your startup journey begins here.
          </p>
          <Button 
            size="lg" 
            className="bg-accent hover:bg-white text-primary transition-all"
            onClick={() => navigate('/auth')}
          >
            Start Your Journey <ArrowRight className="ml-2" />
          </Button>
        </Card>
      </section>

      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <div className="flex justify-center gap-4">
          <Button 
            variant="link" 
            className="text-sm"
            onClick={() => navigate('/admin/login')}
          >
            Admin Access
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Index;
