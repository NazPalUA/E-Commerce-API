import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-slate-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-white font-bold text-xl hover:text-gray-300"
        >
          mern auth
        </Link>

        <nav className="space-x-4">
          <Link href="/login" className="text-white hover:text-gray-300">
            Login
          </Link>
          <Link href="/settings" className="text-white hover:text-gray-300">
            Settings
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
