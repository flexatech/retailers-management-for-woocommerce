import RetailerForm from './RetailerForm';
import RetailerList from './RetailerList';

export default function Retailers() {
  return (
    <div className="mx-auto mt-[84px] max-w-7xl space-y-6 px-6">
      <RetailerList />
      <RetailerForm />
    </div>
  );
}
