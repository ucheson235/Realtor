import { useNavigate } from "react-router-dom"; // Ensure correct import

export default function Footer() {
    const navigate = useNavigate(); // Correct function call

    return (
        <footer className="bg-black border-t shadow-sm w-full py-6 mt-auto">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
                
                {/* Logo */}
                <img
                    src="https://i.postimg.cc/5tMS00N9/Realtor-logo.webp"
                    alt="Realtor Logo"
                    className="h-16 cursor-pointer rounded-full"
                    onClick={() => navigate("/")}
                    aria-label="Go to Home"
                />

                {/* Copyright */}
                <p className="text-gray-400 text-sm font-semibold text-center my-4 md:my-0">
                    © devuc 2025
                </p>

                {/* Navigation Links */}
                <ul className="flex space-x-6">
                    <li
                        className="cursor-pointer text-sm font-semibold text-gray-400 hover:text-white transition"
                        onClick={() => navigate("/")}
                        aria-label="Go to Home"
                    >
                        Home
                    </li>
                    <li
                        className="cursor-pointer text-sm font-semibold text-gray-400 hover:text-white transition"
                        onClick={() => navigate("/offers")}
                        aria-label="View Offers"
                    >
                        Offers
                    </li>
                    <li
                        className="cursor-pointer text-sm font-semibold text-gray-400 hover:text-white transition"
                        onClick={() => navigate("/sign-in")}
                        aria-label="Sign In"
                    >
                        Sign In
                    </li>
                </ul>
            </div>
        </footer>
    );
}
