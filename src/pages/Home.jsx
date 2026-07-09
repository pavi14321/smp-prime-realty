import Hero from '../components/home/Hero';
import Categories from '../components/home/Categories';
import FeaturedProperties from '../components/home/FeaturedProperties';
import WhyChooseUs from '../components/home/WhyChooseUs';

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProperties />
      <WhyChooseUs />
    </>
  );
}