import Link from "next/link";

const Custom404 = () => {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center text-white"
      // style={{
      //   backgroundImage: 'url("/images/hero.jpg")',
      // }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="relative z-10 text-center px-6">
        <h1 className="text-6xl font-bold mb-6">404</h1>
        <p className="text-xl mb-8">
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <Link
          href="/"
          className="bg-blue-600 text-white py-3 px-6 rounded-lg text-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default Custom404;
