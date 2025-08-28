import { useRef } from "react";
import HeroSection from "../Components/HeroSection";
import PricingCards from "../Components/PricingCards";

const ShowHome = () => {
  const pricingRef = useRef<HTMLDivElement>(null);

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <HeroSection onGetStarted={scrollToPricing} />
      <div ref={pricingRef}>
        <PricingCards />
      </div>
    </div>
  );
};

export default ShowHome;
