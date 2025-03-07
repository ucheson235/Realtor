import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import "swiper/css/navigation"; 
import { FaShare } from "react-icons/fa";

export default function Listing() {
	const params = useParams();
	const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(true);
	const [shareLinkCopied, setShareLinkCopied] = useState(false);

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
			<div  className="fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 
			rounded-full w-12 h-12 flex justify-center items-center">
			  <FaShare className="text-lg text-slate-500" onClick={()=> {
				  navigator.clipboard.writeText(window.location.href);
				  setShareLinkCopied(true);
				  setTimeout(() => {
					  setShareLinkCopied(false);
				  }, 2000);
				  
			  }} />
			  {shareLinkCopied &&  <p className="fixed top-[23%] right-[5%]
				font-semibold border-2 border-gray-400 bg-white
				p-2 rounded-md z-10">Link Copied</p>}

			     
			</div>
		</main>
	);
}
