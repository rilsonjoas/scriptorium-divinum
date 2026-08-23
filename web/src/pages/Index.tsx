import { Layout } from '@/components/Layout';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedSection } from '@/components/FeaturedSection';
import { AdSlot } from '@/components/ads/AdSlot';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedSection />
      <div className="py-8">
        <AdSlot slotId="2896974659" />
      </div>
    </Layout>
  );
};

export default Index;
