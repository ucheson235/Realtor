import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import "swiper/css/navigation"; 

export default function Listing() {
	const params = useParams();
	const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(true);

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
		</main>
	);
}
