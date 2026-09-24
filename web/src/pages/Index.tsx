import { Layout } from '@/components/Layout';
import { HeroSection } from '@/components/HeroSection';
import { VersiculoDoDia } from '@/components/VersiculoDoDia';
import { CitacaoDoDia } from '@/components/CitacaoDoDia';
import { FeaturedSection } from '@/components/FeaturedSection';
import { ContinueReading } from '@/components/ContinueReading';
import { PinturaDoDia } from '@/components/PinturaDoDia';
import { AdSlot } from '@/components/ads/AdSlot';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <VersiculoDoDia />
      <FeaturedSection />
      <ContinueReading />
      <PinturaDoDia />
      <CitacaoDoDia />
      <div className="py-8">
        <AdSlot slotId="2896974659" />
      </div>
    </Layout>
  );
};

export default Index;
