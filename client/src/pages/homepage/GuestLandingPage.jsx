import React, { useState, useEffect } from "react";

const Icon = ({ name, className }) => {
  const icons = {
    logo: (
      <path d="M15.59,2.25L15.59,2.25c-1.9-1.9-5.06-1.9-6.96,0l-4.04,4.04c-1.9,1.9-1.9,5.06,0,6.96l0,0c1.9,1.9,5.06,1.9,6.96,0l4.04-4.04C17.5,7.31,17.5,4.15,15.59,2.25z M8.41,11.59c-0.78,0.78-2.05,0.78-2.83,0l0,0c-0.78-0.78-0.78-2.05,0-2.83l4.04-4.04c0.78-0.78,2.05-0.78,2.83,0l0,0c0.78,0.78,0.78,2.05,0,2.83L8.41,11.59z" />
    ),
    check: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    ),
    collab: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.375 3.375 0 015.908 0M9 11.25v2.25"
      />
    ),
    layout: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
      />
    ),
    rocket: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
      />
    ),
    star: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    ),
    shield: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    ),
    users: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    ),
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      {icons[name]}
    </svg>
  );
};

const FloatingCard = ({ delay = 0, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transform transition-all duration-1000 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      {children}
    </div>
  );
};

const TypewriterText = ({ text, speed = 100 }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return <span>{displayText}</span>;
};

const GuestLandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: "layout",
      title: "Kanban Board Visual",
      desc: "Visualisasikan workflow Anda dengan sistem drag-and-drop yang intuitif. Kelola tugas dengan mudah dari To-Do hingga Done.",
      color: "from-blue-400 to-cyan-400",
    },
    {
      icon: "collab",
      title: "Real-time Collaboration",
      desc: "Berkolaborasi dengan tim secara real-time. Lihat perubahan langsung, berikan komentar, dan sinkronisasi otomatis di semua perangkat.",
      color: "from-purple-400 to-pink-400",
    },
    {
      icon: "rocket",
      title: "Boost Productivity",
      desc: "Tingkatkan produktivitas dengan fitur time tracking, deadline alerts, dan analytics yang membantu mengoptimalkan performa tim.",
      color: "from-green-400 to-emerald-400",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "50K+", label: "Projects Created" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" },
  ];

  const testimonials = [
    {
      text: "Boardly mengubah cara tim kami bekerja. Produktivitas meningkat 40% dalam 3 bulan pertama!",
      author: "Sarah Chen",
      role: "Project Manager",
    },
    {
      text: "Interface yang clean dan fitur collaboration yang powerful. Exactly what we needed!",
      author: "Michael Rodriguez",
      role: "Tech Lead",
    },
    {
      text: "Migrasi dari tools lama ke Boardly adalah keputusan terbaik untuk startup kami.",
      author: "Amanda Kumar",
      role: "CEO, TechStart",
    },
  ];

  return (
    <div className="flex-grow flex flex-col items-center w-full bg-gray-900 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="w-full min-h-screen flex items-center justify-center relative px-6">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <FloatingCard delay={200}>
            <div className="mb-8">
              <Icon
                name="logo"
                className="mx-auto h-24 w-24 text-white mb-6 animate-bounce"
                fill="currentColor"
              />
            </div>
          </FloatingCard>

          <FloatingCard delay={400}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              Organize Your World with{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                Boardly
              </span>
            </h1>
          </FloatingCard>

          <FloatingCard delay={600}>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Platform manajemen proyek visual yang memungkinkan tim Anda
              berkolaborasi secara efisien, melacak progress real-time, dan
              mencapai goals dengan lebih cepat.
            </p>
          </FloatingCard>

          <FloatingCard delay={800}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={() => (window.location.href = "/register")}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  Get Started — It's Free
                  <Icon
                    name="rocket"
                    className="h-5 w-5 group-hover:animate-bounce"
                  />
                </span>
              </button>
              <button className="px-8 py-4 border-2 border-gray-600 text-gray-300 rounded-xl font-semibold hover:border-gray-400 hover:text-white transition-all duration-300">
                Watch Demo
              </button>
            </div>
          </FloatingCard>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-20 bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <FloatingCard key={stat.label} delay={index * 100}>
                <div className="group cursor-pointer">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm sm:text-base">
                    {stat.label}
                  </div>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <FloatingCard delay={200}>
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Everything You Need to{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Move Forward
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Fitur-fitur powerful yang dirancang untuk meningkatkan
                produktivitas dan kolaborasi tim Anda
              </p>
            </div>
          </FloatingCard>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FloatingCard key={feature.title} delay={400 + index * 200}>
                <div className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 hover:bg-gray-700/50 transition-all duration-500 hover:scale-105 border border-gray-700 hover:border-gray-600">
                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}
                  ></div>

                  <div className="relative z-10">
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon
                        name={feature.icon}
                        className="h-8 w-8 text-white"
                      />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-20 bg-gray-800/30">
        <div className="max-w-6xl mx-auto px-6">
          <FloatingCard delay={200}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">What Our Users Say</h2>
              <p className="text-xl text-gray-400">
                Dipercaya oleh ribuan tim di seluruh dunia
              </p>
            </div>
          </FloatingCard>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <FloatingCard key={index} delay={400 + index * 200}>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        name="star"
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <div className="font-semibold text-white">
                      {testimonial.author}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <FloatingCard delay={200}>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan tim yang sudah merasakan peningkatan
              produktivitas dengan Boardly
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => (window.location.href = "/register")}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105"
              >
                Start Free Trial
              </button>
              <button className="px-8 py-4 border-2 border-gray-600 text-gray-300 rounded-xl font-semibold hover:border-gray-400 hover:text-white transition-all duration-300">
                Contact Sales
              </button>
            </div>
          </FloatingCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Icon
                name="logo"
                className="h-8 w-8 text-blue-400 mr-3"
                fill="currentColor"
              />
              <span className="text-xl font-bold">Boardly</span>
            </div>
            <div className="flex space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} Boardly. All rights reserved.
              Made with ❤️ for productive teams.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuestLandingPage;
