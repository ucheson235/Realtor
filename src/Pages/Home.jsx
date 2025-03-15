import React, { useEffect, useState } from "react";
import Slider from "../components/Slider";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import {
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	where,
} from "firebase/firestore";
import { Link } from "react-router";
import ListingItem from "../components/ListingItem";

export default function Home() {
	// offers
	const [offerListings, setOfferListings] = useState(null);
	useEffect(() => {
		async function fetchListings() {
			try {
				// get reference
				const listingsRef = collection(db, "listings");
				// get query
				const q = query(
					listingsRef,
					where("offer", "==", true),
					orderBy("timestamp", "desc"),
					limit(4)
				);
				// execute query
				const querySnap = await getDocs(q);
				const listings = [];
				querySnap.forEach((doc) => {
					return listings.push({
						id: doc.id,
						data: doc.data(),
					});
				});
				setOfferListings(listings);
			} catch (error) {
				console.error(error);
			}
		}
		fetchListings();
	}, []);

	// places for rent
	const [rentListings, setRentListings] = useState(null);
	useEffect(() => {
		async function fetchListings() {
			try {
				// get reference
				const listingsRef = collection(db, "listings");
				// get query
				const q = query(
					listingsRef,
					where("type", "==", "rent"),
					orderBy("timestamp", "desc"),
					limit(4)
				);
				// execute query
				const querySnap = await getDocs(q);
				const listings = [];
				querySnap.forEach((doc) => {
					return listings.push({
						id: doc.id,
						data: doc.data(),
					});
				});
				setRentListings(listings);
				
			} catch (error) {
				console.error(error);
			}
		}
		fetchListings();
	}, []);

	// places for sale
	const [saleListings, setSaleListings] = useState(null);
	useEffect(() => {
		async function fetchListings() {
			try {
				// get reference
				const listingsRef = collection(db, "listings");
				// get query
				const q = query(
					listingsRef,
					where("type", "==", "sale"),
					orderBy("timestamp", "desc"),
					limit(4)
				);
				// execute query
				const querySnap = await getDocs(q);
				const listings = [];
				querySnap.forEach((doc) => {
					return listings.push({
						id: doc.id,
						data: doc.data(),
					});
				});
				setSaleListings(listings);
				
			} catch (error) {
				console.error(error);
			}
		}
		fetchListings();
	}, []);

	return (
		<div>
			<Slider />

			{/* offer*/}
			<div className="max-w-6xl mx-auto pt-4 space-x-6">
				{offerListings && offerListings.length > 0 && (
					<div className="m-2 mb-6">
						<h2 className="px-3 text-2xl mt-6 font-semibold ">
							{" "}
							Recent Offers
						</h2>
						<Link to="/offers">
							<p
								className="px-3 text-small text-blue-600 hover:text-blue-800
						transition duration-150 ease-in-out"
							>
								Show more offers
							</p>
						</Link>
						<ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
							{offerListings.map((listing) => (
								<ListingItem
									key={listing.id}
									listing={listing.data}
									id={listing.id}
								/>
							))}
						</ul>
					</div>
				)}
			</div>

			{/* Rent*/}
			<div className="max-w-6xl mx-auto pt-4 space-x-6">
				{rentListings && rentListings.length > 0 && (
					<div className="m-2 mb-6">
						<h2 className="px-3 text-2xl mt-6 font-semibold ">Recent Rents</h2>
						<Link to="/category/rent">
							<p
								className="px-3 text-small text-blue-600 hover:text-blue-800
						transition duration-150 ease-in-out"
							>
								Show more places for Rents
							</p>
						</Link>
						<ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{rentListings.map((listing) => (
								<ListingItem
									key={listing.id}
									listing={listing.data}
									id={listing.id}
								/>
							))}
						</ul>
					</div>
				)}
			</div>
			{/* Rent*/}
			<div className="max-w-6xl mx-auto pt-4 space-x-6">
				{saleListings && saleListings.length > 0 && (
					<div className="m-2 mb-6">
						<h2 className="px-3 text-2xl mt-6 font-semibold ">Recent Sales</h2>
						<Link to="/category/sale">
							<p
								className="px-3 text-small text-blue-600 hover:text-blue-800
						transition duration-150 ease-in-out"
							>
								Show more places for Sale
							</p>
						</Link>
						<ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{saleListings.map((listing) => (
								<ListingItem
									key={listing.id}
									listing={listing.data}
									id={listing.id}
								/>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
}
