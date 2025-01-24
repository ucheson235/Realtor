import React, { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { getAuth, createUserWithEmailAndPassword,updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";


export default function SignIn() {
	const navigate = useNavigate()
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const { email, password } = formData;
	function onChange(e) {
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value,
		}));
	}
     async function onSubmit(e){
		e.preventDefault();

		try {
			const auth = getAuth()
			const userCredential = await signInWithEmailAndPassword
			(auth, email, password)
			if (userCredential.user){
				navigate("/")

			}
			
		} catch (error) {
			toast.error("Bad user credentials");
			
		}

	 }


	return (
		<section>
			<h1
				className="text-3xl text-center mt-6 font-bold
       "
			>
				Sign In
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
						src="https://media.istockphoto.com/id/2163352281/photo/securing-cybersecurity-a-businesswoman-protecting-personal-data-preventing-online-theft.webp?a=1&b=1&s=612x612&w=0&k=20&c=8LpYEXeqJJ0cnLe3_f2rDCby7T7NsAtwkG3_ZuprUnI="
						alt="sign-in image"
						className="w-full rounded-2xl"
					/>
				</div>
				<div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
					<form onSubmit={onSubmit}>
						<input
							type="email"
							id="email"
							value={email}
							onChange={onChange}
							placeholder="Email address"
							className=" mb-6 w-full px-4 py-2 text-xl text-gray-700
              bg-white border-gray-300 rounded transition ease-in-out"
						/>
						<div className="relative mb-6">
							<input
								type={showPassword ? "text" : "password"}
								id="password"
								value={password}
								onChange={onChange}
								placeholder="password"
								className="w-full px-4 py-2 text-xl text-gray-700
              bg-white border-gray-300 rounded transition ease-in-out"
							/>
							{showPassword ? (
								<FaEyeSlash
									className="absolute right-3 top-3 text-lg cursor-pointer"
									onClick={() => setShowPassword((preview) => !preview)}
								/>
							) : (
								<FaEye
									className="absolute right-3 top-3 text-lg cursor-pointer"
									onClick={() => setShowPassword((newLook) => !newLook)}
								/>
							)}
						</div>
						<div
							className="flex justify-between  whitespace-nowrap
            text-sm sm:text-lg"
						>
							<p className="mb-6 ">
								Don't have an account?
								<Link
									to="/sign-up"
									className="text-red-600
                hover:text-red-700 transition duration-200 ease-in-out mr-5"
								>
									Register
								</Link>
							</p>
							<p>
								<Link
									to="/forgot-password"
									className="text-blue-600
                 hover:text-blue-800 transition duration-200 ease-in-out "
								>
									Forgot Password?
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
							Sign In
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
