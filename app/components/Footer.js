import Link from "next/link";

export default function Footer() {
  return (
    <div>
      <footer className="mt-16 bg-gray-800 text-white py-6 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Fortune, IyaInTech. All rights reserved.
        </p>
        {/* <p className="mt-2">
          <Link href="/about" className="text-blue-400 hover:underline">
            About Us
          </Link>{" "}
          |{" "}
          <Link href="/contact" className="text-blue-400 hover:underline">
            Contact
          </Link>
        </p> */}
      </footer>
    </div>
  );
}
