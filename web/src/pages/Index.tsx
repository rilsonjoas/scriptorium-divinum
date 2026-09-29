import { Layout } from '@/components/Layout';
import { HeroSection } from '@/components/HeroSection';
import { FaithDoorsSection } from '@/components/home/FaithDoorsSection';
import { FaithCollectionSection } from '@/components/home/FaithCollectionSection';
import { FaithShelvesSection } from '@/components/home/FaithShelvesSection';
import { CorpusMetricsSection } from '@/components/home/CorpusMetricsSection';
import { VersiculoDoDia } from '@/components/VersiculoDoDia';
import { CitacaoDoDia } from '@/components/CitacaoDoDia';
import { ContinueReading } from '@/components/ContinueReading';
import { PinturaDoDia } from '@/components/PinturaDoDia';
import { AdSlot } from '@/components/ads/AdSlot';
import { usePageTitle } from '@/hooks/usePageTitle';

const Index = () => {
  usePageTitle('O Grande Hall da Tradição Cristã');

  return (
    <Layout>
      <HeroSection />
      <FaithDoorsSection />
      <FaithCollectionSection />
      <FaithShelvesSection />
      <CorpusMetricsSection />
      <ContinueReading />
      <PinturaDoDia />
      <VersiculoDoDia />
      <CitacaoDoDia />
      <div className="py-8">
        <AdSlot slotId="2896974659" />
      </div>
    </Layout>
  );
};

export default Index;
