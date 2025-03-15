import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";


export default function Header() {
  const [pageState, setPageState] = useState("sign in")
	const location = useLocation();
	const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if(user){
        setPageState("profile")
      } else{
        setPageState("sign in");
      }
    });

  }, [auth])
	function pathMatchRoute(route) {
		if (route === location.pathname) {
			return true;
		}
	}

	return (
		<div className="bg-white border-b shadow-sm sticky top-0 z-40">
			<header className="flex justify-between items-center px-3 max-w-6xl mx-auto">
				<di>
					<img
						src="https://i.postimg.cc/5tMS00N9/Realtor-logo.webp"
						alt="logo"
						className="h-20 cursor-pointer rounded-full m-6"
						onClick={() => navigate("/")}
					/>
				</di>
				<div>
					<ul className="flex space-x-10">
						<li
							className={` cursor-pointer py-3 text-sm font-semibold text-gray-400
              border-b-[3px] border-transparent${
								pathMatchRoute("/") && "text-black border-b-red-500"
							} `}
							onClick={() => navigate("/")}
						>
							Home
						</li>
						<li
							className={` cursor-pointer py-3 text-sm font-semibold text-gray-400
              border-b-[3px] border-transparent${
								pathMatchRoute("/offers") && "text-black border-b-red-500"
							} `}
							onClick={() => navigate("/offers")}
						>
							Offers
						</li>
						<li
							className={`cursor-pointer py-3 text-sm font-semibold text-gray-400
              border-b-[3px] border-transparent${
								(pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) && "text-black border-b-red-500"
							} `}
							onClick={() => navigate("/profile")}
						>
							{pageState}
						</li>
					</ul>
				</div>
			</header>
		</div>
	);
}
