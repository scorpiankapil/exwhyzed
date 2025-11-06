import { DesktopProvider } from '@/contexts/DesktopContext';
import { Desktop } from '@/components/Desktop';

const Index = () => {
  return (
    <DesktopProvider>
      <Desktop />
    </DesktopProvider>
  );
};

export default Index;
