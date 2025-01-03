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

        <nav>
          <Link href="/login" className="text-white hover:text-gray-300">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
