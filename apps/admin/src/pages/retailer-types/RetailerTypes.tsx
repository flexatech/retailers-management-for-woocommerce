import RetailerTypesForm from './RetailerTypesForm';
import RetailerTypesList from './RetailerTypesList';

export default function RetailerTypes() {
  return (
    <div className="mx-auto mt-[84px] max-w-7xl space-y-6 px-6">
      <RetailerTypesList />
      <RetailerTypesForm />
    </div>
  );
}
