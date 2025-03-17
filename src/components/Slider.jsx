import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import Spinner from "../components/Spinner.jsx";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";

export default function Slider() {
	const [listings, setListings] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchListings() {
			const listingsRef = collection(db, "listings");
			const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
			const querySnap = await getDocs(q);
			let listingsArray = [];
			querySnap.forEach((doc) => {
				listingsArray.push({
					id: doc.id,
					data: doc.data(),
				});
			});
			setListings(listingsArray);
			setLoading(false);
		}
		fetchListings();
	}, []);

	if (loading) {
		return <Spinner />;
	}

	if (!listings || listings.length === 0) {
		return <div>No listings available</div>;
	}

	return (
		<div>
			<Swiper
				slidesPerView={1}
				navigation
				pagination={{ type: "progressbar" }}
				effect="fade"
				modules={[Navigation, Pagination, EffectFade, Autoplay]}
				autoplay={{ delay: 3000 }}
			>
				{listings.map(({ id, data }) => (
					<SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
						<div
							style={{
								backgroundImage: `url(${data.imageUrls[0]})`,
								backgroundSize: "cover",
								backgroundRepeat: "no-repeat",
								backgroundPosition: "center",
								height: "300px",
							}}
							className=" relative w-full cursor-pointer"
						></div>
                        <p className="text-[#f1faee] absolute left-1 top-3 font-medium
                         max-w-[90%] bg-[#457b9d] shadow-lg opacity-90 p-2 rounded-br-3xl">{data.name}
                         </p>
                        <p className="text-[#f1faee] absolute left-1 bottom-1 font-semibold
                         max-w-[90%] bg-[#e63946] shadow-lg opacity-90 p-2 rounded-br-3xl">
                          ${data.discountedPrice ?? data.discountedPrice}
                         {data.type === "rent" && " / month "}
                         </p>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
}
