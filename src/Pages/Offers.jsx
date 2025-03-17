import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
	where,
} from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

export default function Offers() {
	const [listings, setListings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [lastFetchedListings, setLastFetchedListings] = useState(null);

	useEffect(() => {
		async function fetchListings() {
			try {
				const listingRef = collection(db, "listings");
				const q = query(
					listingRef,
					where("offer", "==", true),
					orderBy("timestamp", "desc"),
					limit(10)
				);
				const querySnap = await getDocs(q);

				if (!querySnap.empty) {
					const lastVisible = querySnap.docs[querySnap.docs.length - 1];
					setLastFetchedListings(lastVisible);
				}

				const fetchedListings = querySnap.docs.map((doc) => ({
					id: doc.id,
					data: doc.data(),
				}));

				setListings(fetchedListings);
				setLoading(false);
			} catch (error) {
				toast.error("Error fetching listings");
			}
		}
		fetchListings();
	}, []);

	async function onFetchMoreListings() {
		try {
			if (!lastFetchedListings) return;

			const listingRef = collection(db, "listings");
			const q = query(
				listingRef,
				where("offer", "==", true),
				orderBy("timestamp", "desc"),
				startAfter(lastFetchedListings),
				limit(4)
			);
			const querySnap = await getDocs(q);

			if (!querySnap.empty) {
				const lastVisible = querySnap.docs[querySnap.docs.length - 1];
				setLastFetchedListings(lastVisible);
			}

			const fetchedListings = querySnap.docs.map((doc) => ({
				id: doc.id,
				data: doc.data(),
			}));

			setListings((prevState) => [...prevState, ...fetchedListings]);
		} catch (error) {
			toast.error("Error fetching more listings");
		}
	}

	return (
		<div className="max-w-6xl mx-auto px-3">
			<h1 className="text-3xl text-center mt-6 font-bold mb-6">Offers</h1>

			{loading ? (
				<Spinner />
			) : listings.length > 0 ? (
				<>
					<main>
						<ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
							{listings.map((listing) => (
								<ListingItem key={listing.id} listing={listing.data} id={listing.id} />
							))}
						</ul>
					</main>
					{lastFetchedListings && (
						<div className="flex justify-center items-center mt-6">
							<button
								onClick={onFetchMoreListings}
								className="bg-white px-3 py-1.5 text-gray-700 border border-gray-300 hover:border-slate-600 rounded transition duration-150 ease-in-out mb-10"
							>
								Load more
							</button>
						</div>
					)}
				</>
			) : (
				<p>There are no current offers</p>
			)}
		</div>
	);
}
  
  // In the above code, we have created a new page component called  Offers  that fetches the listings with the  offer  field set to  true  from Firestore. We have also added a button to load more listings when clicked. 
  // Step 4: Add the Offers Route 
  // Next, we need to add the new  Offers  page to the router. Open the  App.jsx  file and add the following code: