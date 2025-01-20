import React, { useState } from "react";

import { Link } from "react-router";
import OAuth from "../components/OAuth";

export default function ForgotPassword() {
	
	const [email, setEmail] = useState("");

  function onChange(e){
    setEmail(e.target.value);

  }

	return (
		<section>
			<h1
				className="text-3xl text-center mt-6 font-bold
       "
			>
			  Forgot Password
			</h1>
			<div
				className="flex justify-center flex-wrap items-center
       px-6 py-12 max-w-6xl mx-auto"
			>
				<div
					className="md:w-[67%] lg:w-[50%] mb-12
        md:mb-6"
				>
					<img
						src="https://img.freepik.com/free-photo/high-angle-defocused-wooden-cubes-with-password-laptop_23-2148578071.jpg?t=st=1737378869~exp=1737382469~hmac=f373338d928eedb983f371c56437e94b8bff22024705ba893370078c66c9ca04&w=996"
						alt="sign-in image"
						className="w-full rounded-2xl"
					/>
				</div>
				<div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
					<form>
						<input
							type="email"
							id="email"
							value={email}
							onChange={onChange}
							placeholder="Email address"
							className=" mb-6 w-full px-4 py-2 text-xl text-gray-700
              bg-white border-gray-300 rounded transition ease-in-out"
						/>
						
						<div
							className="flex justify-between whitespace-nowrap
            text-sm sm:text-lg"
						>
							<p className="mb-6 ">
								Don't have an account?
								<Link
									to="/sign-up"
									className="text-red-600
                hover:text-red-700 transition duration-200 ease-in-out ml-4"
								>
									Register
								</Link>
							</p>
							<p>
								<Link
									to="/sign-in"
									className="text-blue-600
                 hover:text-blue-800 transition duration-200 ease-in-out "
								>
									Sign in 
								</Link>
							</p>
						</div>
						<button
							className="w-full bg-blue-600 text-white 
              px-7 py-3 text-sm font-medium uppercase rounded 
              shadow-m hover:bg-blue-700 transition duration-100 ease-in-out shadow-lg
              active:bg-blue-800"
							type="submit"
						>
							send reset password
						</button>
						<div
							className="my-4 before:border-t flex before:flex-1 items-center before:border-gray-300
              after:border-t  after:flex-1 after:border-gray-300"
						>
							<p className="text-center font-semibold mx-4">OR</p>
						</div>
            <OAuth/>
					</form>
				</div>
			</div>
		</section>
	);
}
