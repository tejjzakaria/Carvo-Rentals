import FactsInNumbers from "@/components/FactsInNumbers";
import FeaturedCars from "@/components/FeaturedCars";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowToBook from "@/components/HowToBook";
import Testimonials from "@/components/Testimonials";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <Features />
      <HowToBook />
      <FeaturedCars />
      <FactsInNumbers />
      <Testimonials />
      <Footer />
    </div>
  );
}
