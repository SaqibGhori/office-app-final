// import React from "react";
import { motion } from "framer-motion";
import bgImage from "../../assets/herosection-image.jpg"

type HeroSectionProps = {
    onGetStarted: () => void;
};

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
    return (
        <section
            className="relative w-full h-screen flex justify-center items-center"
            style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >

            {/* Overlay for dark effect */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Centered Content */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="relative text-center px-6 sm:px-12"
            >
                <h1 className="text-4xl sm:text-6xl font-bold text-white drop-shadow-lg">
                    Welcome to Watt Matrix
                </h1>
                <p className="mt-4 text-lg sm:text-2xl text-gray-200 max-w-2xl mx-auto">
                    We provide the best services to help you grow your business.
                </p>
                <motion.button
                    onClick={onGetStarted}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 px-6 py-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary/80 transition"
                >
                    Get Started
                </motion.button>
            </motion.div>
        </section>
    );
}
export default HeroSection;