import { Link } from "react-router-dom";
import { MapPin, Mail, Phone } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-navy dark:bg-gray-950 text-white mt-auto">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-brand p-1.5 rounded-lg">
                                <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-serif text-xl">
                                Travel<span className="text-accent">Tales</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Every trip tells a story. Discover India's most beautiful
                            destinations with personalized itineraries and handpicked hotels.
                        </p>
                        {/* Social Icons */}
                        {/* Social Icons */}
                        <div className="flex gap-3 pt-1">
                            <a
                                href="#"
                                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-brand transition-colors duration-200 flex items-center justify-center text-xs font-bold"
                            >
                                In
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-brand transition-colors duration-200 flex items-center justify-center text-xs font-bold"
                            >
                                Tw
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-brand transition-colors duration-200 flex items-center justify-center text-xs font-bold"
                            >
                                Fb
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-white text-sm uppercase tracking-wider">
                            Explore
                        </h4>
                        <ul className="space-y-2">
                            {[
                                { label: "All Packages", path: "/explore" },
                                { label: "Trip Planner", path: "/planner" },
                                { label: "Hotel Search", path: "/hotels" },
                                { label: "Cost Calculator", path: "/calculator" },
                            ].map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 text-sm hover:text-accent transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Popular Destinations */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-white text-sm uppercase tracking-wider">
                            Popular Destinations
                        </h4>
                        <ul className="space-y-2">
                            {[
                                "Magical Rajasthan",
                                "Heavenly Kashmir",
                                "Serene Himachal",
                                "Mumbai & Goa",
                                "Delhi & Agra",
                            ].map((dest) => (
                                <li key={dest}>
                                    <Link
                                        to="/explore"
                                        className="text-gray-400 text-sm hover:text-accent transition-colors duration-200"
                                    >
                                        {dest}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-white text-sm uppercase tracking-wider">
                            Contact Us
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-gray-400 text-sm">
                                <Phone className="w-4 h-4 text-accent shrink-0" />
                                <span>+91 9876543210</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 text-sm">
                                <Mail className="w-4 h-4 text-accent shrink-0" />
                                <span>support@traveltales.in</span>
                            </li>
                            <li className="text-gray-500 text-xs mt-1">
                                Mon – Sat, 10 AM – 8 PM IST
                            </li>
                        </ul>

                        {/* Newsletter */}
                        <div className="pt-2">
                            <p className="text-gray-400 text-xs mb-2">
                                Get travel deals in your inbox
                            </p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="flex-1 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand"
                                />
                                <button className="px-3 py-2 bg-brand hover:bg-blue-600 text-white text-sm rounded-lg transition-colors duration-200">
                                    Go
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-gray-500 text-xs">
                        © 2025 TravelTales — Every trip tells a story. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <Link
                            to="#"
                            className="text-gray-500 text-xs hover:text-gray-300 transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            to="#"
                            className="text-gray-500 text-xs hover:text-gray-300 transition-colors"
                        >
                            Terms of Use
                        </Link>
                        <Link
                            to="#"
                            className="text-gray-500 text-xs hover:text-gray-300 transition-colors"
                        >
                            FAQs
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
