import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-sky-200 p-4">
        <nav>
          <ul className="flex gap-4">
            <li>
              <Link to="/" className="text-blue-600 hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/profiles" className="text-blue-600 hover:underline">
                Profiles
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="flex-grow p-4">
        <Outlet />
      </main>
      <footer className="bg-sky-200 p-4 text-center">
        <p>&copy; 2024 Your App Name</p>
      </footer>
    </div>
  );
}

