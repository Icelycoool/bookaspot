import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-offwhite fixed bottom-0 left-0 w-full py-6 px-4 text-center md:text-left md:py-8 md:px-12">
        <div className="container m-auto flex flex-col md:flex-row justify-between items-center">
            {/* Copyright Section */}
            <p className="font-medium text-gray-500">
            Bookaspot &copy; {new Date().getFullYear()}
            </p>

            {/* Links Section */}
            <ul className="flex flex-wrap items-center gap-y-2 gap-x-8 md:gap-x-12 mt-4 md:mt-0">
            <li>
                <Link
                to="#about-us"
                className="font-medium transition-colors hover:text-primary focus:text-primary"
                aria-label="About Us"
                >
                About Us
                </Link>
            </li>
            <li>
                <Link
                to="#license"
                className="font-medium transition-colors hover:text-primary focus:text-primary"
                aria-label="License"
                >
                License
                </Link>
            </li>
            <li>
                <Link
                to="#contribute"
                className="font-medium transition-colors hover:text-primary focus:text-primary"
                aria-label="Contribute"
                >
                Contribute
                </Link>
            </li>
            <li>
                <Link
                to="#contact-us"
                className="font-medium transition-colors hover:text-primary focus:text-primary"
                aria-label="Contact Us"
                >
                Contact Us
                </Link>
            </li>
            </ul>
        </div>
    </footer>
  );
}
