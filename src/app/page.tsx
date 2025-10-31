import SmoothAuroraButton from '../SmoothAuroraButton';
import ButtonGallery from './components/ButtonGallery';
import { loadButtonContributions } from '@/utils/buttonLoader';

export default async function Home() {
  // Load all button contributions at build time
  const contributions = await loadButtonContributions();

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Aurora Button Section */}
      <div className="flex items-center justify-center my-12">
        <SmoothAuroraButton onClick={() => alert('Aurora Button Clicked!')}>
          Click Me
        </SmoothAuroraButton>
      </div>

      {/* Button Gallery Section */}
      <ButtonGallery contributions={contributions} />
    </div>
  );
}
