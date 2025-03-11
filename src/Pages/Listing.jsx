import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import "swiper/css/navigation";
import {
	FaShare,
	FaMapMarkerAlt,
	FaBed,
	FaBath,
	FaParking,
	FaChair,
} from "react-icons/fa";
import Contact from "../components/Contact";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export default function Listing() {
	const auth = getAuth();
	const params = useParams();
	const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(true);
	const [shareLinkCopied, setShareLinkCopied] = useState(false);
	const [contactLandLord, setContactLandLord] = useState(false);

	useEffect(() => {
		async function fetchListing() {
			const docRef = doc(db, "listings", params.listingId);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				setListing(docSnap.data());
				setLoading(false);
			}
		}
		fetchListing();
	}, [params.listingId]);

	if (loading) {
		return <Spinner />;
	}

	return (
		<main>
			<Swiper
				slidesPerView={1}
				navigation={{ clickable: true }}
				pagination={{ type: "progressbar" }}
				effect="fade"
				modules={[Navigation, Pagination, EffectFade, Autoplay]}
				autoplay={{ delay: 3000 }}
			>
				{listing.imageUrls.map((url, index) => (
					<SwiperSlide key={index}>
						<div
							className="relative w-full overflow-hidden h-[300px]"
							style={{
								background: `url(${listing.imageUrls[index]}) center center/cover no-repeat `,
								backgroundSize: "cover",
							}}
						></div>
					</SwiperSlide>
				))}
				<SwiperSlide></SwiperSlide>
				<SwiperSlide></SwiperSlide>
			</Swiper>
			<div
				className="fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 
			rounded-full w-12 h-12 flex justify-center items-center"
			>
				<FaShare
					className="text-lg text-slate-500"
					onClick={() => {
						navigator.clipboard.writeText(window.location.href);
						setShareLinkCopied(true);
						setTimeout(() => {
							setShareLinkCopied(false);
						}, 2000);
					}}
				/>
				{shareLinkCopied && (
					<p
						className="fixed top-[23%] right-[5%]
				font-semibold border-2 border-gray-400 bg-white
				p-2 rounded-md z-10"
					>
						Link Copied
					</p>
				)}
			</div>
			<div
				className="m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg 
			shadow-lg bg-white lg:space-x-5"
			>
				<div className=" w-full ">
					<p className="text-2xl font-bold mb-3 text-blue-900">
						{listing.name} - ${""}
						{listing.offer
							? listing.discountedPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
							: listing.regularPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
						{listing.type === "rent" ? " / month" : ""}
					</p>
					<p className="flex items-center mt-6 mb-3 font-semibold text-gray-600">
						<FaMapMarkerAlt className="green-700 mr-1" />
						{listing.address}
					</p>
					<div className="flex justify-start items-center space-x-4 w-[75%] ">
						<p className="bg-red-800 w-full max-w-[200px] text-white text-center p-1 rounded-md font-semibold shadow-md">
							{listing.type === "rent" ? "Rent" : "sale"}
						</p>
						<p className="bg-green-800 w-full max-w-[200px] text-white text-center p-1 rounded-md font-semibold shadow-md">
							{listing.offer && (
								<p>
									${listing.regularPrice - listing.discountedPrice} discount
								</p>
							)}
						</p>
					</div>
					<p className="mt-3 mb-3">
						<span className="font-semibold"> Description</span> -
						{listing.description}
					</p>
					<ul className="flex items-center space-x-2 lg:space-x-10 text-sm font-semibold mb-6">
						<li className="flex items-center whitespace-nowrap">
							<FaBed className="text-lg mr-1" />
							{+listing.bedrooms > 1 ? `${listing.bedrooms}  Beds` : "1 Bed"}
						</li>
						<li className="flex items-center whitespace-nowrap">
							<FaBath className="text-lg mr-1" />
							{+listing.bathrooms > 1
								? `${listing.bathrooms}  Baths`
								: "1 Bath"}
						</li>
						<li className="flex items-center whitespace-nowrap">
							<FaParking className="text-lg mr-1" />
							{listing.parking ? "parking spot" : " no parking spot"}
						</li>
						<li className="flex items-center whitespace-nowrap">
							<FaChair className="text-lg mr-1" />
							{listing.furnished ? "furnished" : "not furnished"}
						</li>
					</ul>
					{listing.userRef !== auth.currentUser.uid && !contactLandLord && (
						<div className="mt-12">
							<button
								onClick={() => setContactLandLord(true)}
								className="px-7 py-3 bg-blue-600 text-white
							font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700
							hover:shadow-lg  focus:bg-blue-700 focus:shadow-lg w-full text-center
							transition-150 ease-in-out"
							>
								Contact LandLord
							</button>
						</div>
					)}
					{contactLandLord && (
						<Contact userRef={listing.userRef} listing={listing} />
					)}
				</div>
				<div className=" w-full h-[200px] md:h-[400px] z-10 overflow-x-hidden mt-6 md:mt-0 md:ml-2">
					<MapContainer
						center={[6.5244, 3.3792]}
						zoom={13}
						scrollWheelZoom={false}
						style={{ height: "100%", width: "100%"}}
					>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						<Marker position={[6.5244, 3.3792]}>
							<Popup>
								Lagos, Nigeria
							</Popup>
						</Marker>
					</MapContainer>
				</div>
			</div>
		</main>
	);
}
