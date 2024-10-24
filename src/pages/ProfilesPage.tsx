import { Outlet } from 'react-router-dom';

export default function ProfilesPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Profiles Page</h1>
      <Outlet />
    </div>
  );
}
