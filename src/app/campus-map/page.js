import CampusMap from '@/components/CampusMap';
export const metadata = {
  title: 'Explore the campus in 3D',
  description:
    'An interactive three-dimensional LNMIIT campus built from satellite imagery and open map data. Explore the academic blocks, hostels, messes, sports facilities and AI construction site.',
};
export default function MapPage() {
  return <CampusMap />;
}
