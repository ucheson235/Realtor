import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";

export default function EditListing() {
    const auth = getAuth()
    const navigate = useNavigate();
    const [geoLocationEnabled, setGeoLocationEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState(null);
    const [formData, setFormData] = useState({
        type: "rent",
        name: "",
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: "",
        description: "",
        offer: true,
        regularPrice: 0,
        discountedPrice: 0,
        latitude: 0,
        longitude: 0,
        images: [],
    });

    const {
        type,
        name,
        bedrooms,
        bathrooms,
        parking,
        furnished,
        address,
        description,
        offer,
        regularPrice,
        discountedPrice,
        latitude,
        longitude,
        images,
    } = formData;

    const params = useParams();

    useEffect(() => {
        setLoading(true);
        async function fetchListing() {
            const docRef = doc(db, 'listings', params.listingId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setListing(docSnap.data());
                setFormData({ ...docSnap.data() });
                setLoading(false);
            } else {
                navigate("/");
                toast.error("Listing not found");
            }
        }
        fetchListing();
    }, [navigate, params.listingId]);

    useEffect(()=>{
        if(listing && listing.userRef !==  auth.currentUser.uid){
            toast.error("you can't edit this listing");
            navigate("/");
        }
    }, [auth.currentUser.uid, listing, navigate]);

    function onChange(e) {
        let boolean = null;
        if (e.target.value === "true") {
            boolean = true;
        }
        if (e.target.value === "false") {
            boolean = false;
        }
        // Files
        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: Array.from(e.target.files),
            }));
        }
        // Text/Boolean/Number
        if (!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value,
            }));
        }
    }

    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);

        // Validate discount price
        if (offer && +discountedPrice >= +regularPrice) {
            setLoading(false);
            toast.error("Discounted price must be less than regular price");
            return;
        }

        // Validate image count
        if (images.length > 6) {
            setLoading(false);
            toast.error("Maximum of 6 images allowed.");
            return;
        }

        // Get authenticated user ID
        const auth = getAuth();
        const userId = auth.currentUser?.uid;
        if (!userId) {
            setLoading(false);
            toast.error("User not authenticated.");
            return;
        }

        let geoLocation = {};
        if (geoLocationEnabled) {
            // You might want to handle this part
        } else {
            geoLocation.lat = latitude;
            geoLocation.lng = longitude;
        }

        // Function to upload a single image
        const uploadImage = async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("userId", userId);

            const response = await fetch("http://localhost:3000/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Failed to upload image: ${response.statusText}`);
            }

            const data = await response.json();
            return data.url; // Return the uploaded image URL
        };

        try {
            // Upload all images
            const imageUrls = await Promise.all(images.map(uploadImage));

            // Create listing data
            const formDataCopy = {
                ...formData,
                imageUrls,
                geoLocation,
                userId,
                timestamp: serverTimestamp(),
            };
            delete formDataCopy.images; // Remove images array

            if (!formDataCopy.offer) delete formDataCopy.discountedPrice;

            // Update the listing in Firestore
            const db = getFirestore();
            const listingRef = doc(db, "listings", params.listingId);
            await updateDoc(listingRef, formDataCopy);

            toast.success("Listing updated successfully!");
            navigate(`/category/${formDataCopy.type}/${params.listingId}`);
        } catch (error) {
            console.error("Error:", error.message);
            toast.error(error.message);
        } finally {
            setLoading(false); // Stop loading regardless of success/failure
            navigate("/profile");
        }
    }

    if (loading) {
        return <Spinner />;
    }

    return (
		<main className="max-w-md px-2 mx-auto">
			<h1 className="text-3xl text-center mt-6 font-bold">Create a Listing </h1>
			<form onSubmit={onSubmit}>
				<p className="text-lg mt-6 font-semibold ">Sell / Rent</p>
				<div className="flex ">
					<button
						type="button"
						id="type"
						value="sale"
						onClick={onChange}
						className={` mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md 
            rounded hover:shadow-lg focus:shadow-lg active:shadow-lg 
            transition-150 ease-in-out w-full ${
							type === "rent"
								? "bg-white text-black"
								: "bg-slate-600 text-white"
						}`}
					>
						sell
					</button>
					<button
						type="button"
						id="type"
						value="rent"
						onClick={onChange}
						className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md 
            rounded hover:shadow-lg focus:shadow-lg active:shadow-lg 
            transition-150 ease-in-out w-full ${
							type === "sale"
								? "bg-white text-black"
								: "bg-slate-600 text-white"
						}`}
					>
						rent
					</button>
				</div>
				<p className="text-lg mt-6 font-semibold ">Name</p>
				<input
					type="text"
					id="name"
					value={name}
					onChange={onChange}
					placeholder="Name"
					maxLength="32"
					minLength="10"
					required
					className="w-full px-4 py-2 text-xl text-gray-700 bg-white
                border border-gray-300 rounded transition duration-150 ease-in-out
                focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
				/>
				<div className="flex space-x-6 mb-6">
					<div>
						<p className="text-lg font-semibold">Beds</p>
						<input
							type="number"
							id="bedrooms"
							value={bedrooms}
							onChange={onChange}
							min="1"
							max="50"
							required
							className=" w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded
                       transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
						/>
					</div>
					<div>
						<p className="text-lg font-semibold">Bath</p>
						<input
							type="number"
							id="bathrooms"
							value={bathrooms}
							onChange={onChange}
							min="1"
							max="50"
							required
							className=" w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded
                       transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
						/>
					</div>
				</div>
				<p className="text-lg mt-6 font-semibold ">parking Spot</p>
				<div className="flex ">
					<button
						type="button"
						id="parking"
						value={true}
						onClick={onChange}
						className={` mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md 
            rounded hover:shadow-lg focus:shadow-lg active:shadow-lg 
            transition-150 ease-in-out w-full ${
							!parking ? "bg-white text-black" : "bg-slate-600 text-white"
						}`}
					>
						yes
					</button>
					<button
						type="button"
						id="parking"
						value={false}
						onClick={onChange}
						className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md 
            rounded hover:shadow-lg focus:shadow-lg active:shadow-lg 
            transition-150 ease-in-out w-full ${
							parking ? "bg-white text-black" : "bg-slate-600 text-white"
						}`}
					>
						no
					</button>
				</div>
				<p className="text-lg mt-6 font-semibold ">Furnished</p>
				<div className="flex ">
					<button
						type="button"
						id="furnished"
						value={true}
						onClick={onChange}
						className={` mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md 
            rounded hover:shadow-lg focus:shadow-lg active:shadow-lg 
            transition-150 ease-in-out w-full ${
							!furnished ? "bg-white text-black" : "bg-slate-600 text-white"
						}`}
					>
						yes
					</button>
					<button
						type="button"
						id="furnished"
						value={false}
						onClick={onChange}
						className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md 
            rounded hover:shadow-lg focus:shadow-lg active:shadow-lg 
            transition-150 ease-in-out w-full ${
							furnished ? "bg-white text-black" : "bg-slate-600 text-white"
						}`}
					>
						no
					</button>
				</div>
				<p className="text-lg mt-6 font-semibold ">Address</p>
				<textarea
					type="text"
					id="address"
					value={address}
					onChange={onChange}
					placeholder="Addresses"
					required
					className="w-full px-4 py-2 text-xl text-gray-700 bg-white
                border border-gray-300 rounded transition duration-150 ease-in-out
                focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
				/>
				{!geoLocationEnabled && (
					<div className=" flex space-x-6 justify-start mb-6">
						<div className="">
							<p className="text-lg font-semibold">Latitude</p>
							<input
								type="number"
								id="latitude"
								value={latitude}
								onChange={onChange}
								required
								min="-90"
								max="90"
								className="w-full px-4 py-2 text-xl text-gray-700 bg-white
                border border-gray-300 rounded transition duration-150 ease-in-out
                focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
								
							/>
						</div>
						<div className="">
							<p className="text-lg  font-semibold">Longitude</p>
							<input
								type="number"
								id="longitude"
								value={longitude}
								onChange={onChange}
								required
								min="-180"
								max="180"
								className="w-full px-4 py-2 text-xl text-gray-700 bg-white
                border border-gray-300 rounded transition duration-150 ease-in-out
                focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
								
							/>
						</div>
					</div>
				)}
				<p className="text-lg mt-6 font-semibold ">Description</p>
				<textarea
					type="text"
					id="description"
					value={description}
					onChange={onChange}
					placeholder="Descriptions"
					required
					className="w-full px-4 py-2 text-xl text-gray-700 bg-white
                border border-gray-300 rounded transition duration-150 ease-in-out
                focus:text-gray-700 focus:bg-white focus:border-slate-600 "
				/>

				<p className="text-lg mt-6 font-semibold ">Offer</p>
				<div className="flex  mb-6">
					<button
						type="button"
						id="offer"
						value={false}
						onClick={onChange}
						className={` mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md 
            rounded hover:shadow-lg focus:shadow-lg active:shadow-lg 
            transition-150 ease-in-out w-full ${
							offer ? "bg-white text-black" : "bg-slate-600 text-white"
						}`}
					>
						yes
					</button>
					<button
						type="button"
						id="offer"
						value={true}
						onClick={onChange}
						className={`  ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md 
            rounded hover:shadow-lg focus:shadow-lg active:shadow-lg 
            transition-150 ease-in-out w-full ${
							!offer ? "bg-white text-black" : "bg-slate-600 text-white"
						}`}
					>
						no
					</button>
				</div>
				<div className="flex items-center mb-6">
					<div className="">
						<p className="text-lg font-semibold">Regular Price</p>
						<div className="flex w-full justify-center items-center space-x-6">
							<input
								type="number"
								id="regularPrice"
								value={regularPrice}
								onChange={onChange}
								min="50"
								max="400000000"
								required
								className="w-full px-4 py-2 text-lg text-gray-700 bg-white
                          border border-gray-300 rounded transition duration-150
                          ease-in-out focus:text-gray-700 focus:bg-white
                          focus:border-slate-600 text-center"
							/>
							{type === "rent" && (
								<div className="">
									<p className="text-md w-full whitespace-nowrap">$ / Month</p>
								</div>
							)}
						</div>
					</div>
				</div>
				{offer && (
					<div className="flex items-center mb-6">
						<div className="">
							<p className="text-lg font-semibold">discounted Price</p>
							<div className="flex w-full justify-center items-center space-x-6">
								<input
									type="number"
									id="discountedPrice"
									value={discountedPrice}
									onChange={onChange}
									min="50"
									max="400000000"
									required={offer}
									className="w-full px-4 py-2 text-lg text-gray-700 bg-white
                          border border-gray-300 rounded transition duration-150
                          ease-in-out focus:text-gray-700 focus:bg-white
                          focus:border-slate-600 text-center"
								/>
								{type === "rent" && (
									<div className="">
										<p className="text-md w-full whitespace-nowrap">
											$ / Month
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
				<div className="mb-6">
					<p className="text-lg font-semibold ">Images</p>
					<p className="text-gray-600">
						The first image will be the cover (max 6)
					</p>
					<input
						type="file"
						id="images"
						onChange={onChange}
						accept=".jpg,.png,.jpeg"
					
						required
						multiple
						className="w-full px-3 py-1.5 text-gray-700 bg-white
                    border border-gray-300 rounded transition duration-150 ease-in-out 
                     focus:bg-white focus:border-slate-600"
					/>
				</div>

				<button
					type="submit"
					className="mb-6 w-full 
                 px-7 py-3 bg-blue-600 text-white font-medium
                 text-sm uppercase rounded shadow-md hover:bg-blue-700
                 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg 
                 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
				>
					Edit Listing
				</button>
			</form>
		</main>
	);
}