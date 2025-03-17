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
import Spinner from "../components/Spinner.jsx";
import ListingItem from "../components/ListingItem.jsx";
import { useParams } from "react-router-dom";

export default function Category() {
	const [listings, setListings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [lastFetchedListings, setLastFetchedListings] = useState(null);
	const params = useParams();

	useEffect(() => {
		async function fetchListings() {
			try {
				const listingRef = collection(db, "listings");
				const q = query(
					listingRef,
					where("type", "==", params.categoryName),
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
	}, [params.categoryName]);

	async function onFetchMoreListings() {
		try {
			if (!lastFetchedListings) return;

			const listingRef = collection(db, "listings");
			const q = query(
				listingRef,
				where("type", "==", params.categoryName),
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
			<h1 className="text-3xl text-center mt-6 font-bold mb-6">
				{params.categoryName === "rent" ? "places for rent" : "places for sale"}
			</h1>

			{loading ? (
				<Spinner />
			) : listings.length > 0 ? (
				<>
					<main>
						<ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
							{listings.map((listing) => (
								<ListingItem
									key={listing.id}
									listing={listing.data}
									id={listing.id}
								/>
							))}
						</ul>
					</main>
					{lastFetchedListings && (
						<div className="flex justify-center items-center mt-6">
							<button
								onClick={onFetchMoreListings}
								className="bg-white px-3 py-1.5 text-gray-700 border border-gray-300 hover:border-slate-600 rounded transition duration-150 ease-in-out"
							>
								Load more
							</button>
						</div>
					)}
				</>
			) : (
				<p>
					There are no current{" "}
					{params.categoryName === "rent"
						? "places for rent"
						: "places for sale"}
				</p>
			)}
		</div>
	);
}

// In the code above, we are fetching listings based on the category name. We are using the  useParams  hook from  react-router-dom  to get the category name from the URL. We then use this category name to query the Firestore database and fetch listings that match the category name.
// We are using the  useEffect  hook to fetch listings when the component mounts. We are also using the  onFetchMoreListings  function to fetch more listings when the user clicks on the Load more button.
// We are using the  startAfter  method to fetch listings after the last fetched listing. This way, we can paginate through the listings.
// We are also using the  toast  method from  react-toastify  to show error messages when there is an error fetching listings.
// Now, let’s create the  ListingItem  component.
// ListingItem Component
// The  ListingItem  component is a functional component that displays a single listing.
