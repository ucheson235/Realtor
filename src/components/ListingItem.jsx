import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

export default function ListingItem({ listing, id, onEdit, onDelete }) {
	return (
		<li className="relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-[10px]">
			<Link className="contents" to={`/category/${listing.type}/${id}`}>
				<img
					className="h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in"
					loading="lazy"
					src={listing.imageUrls[0]}
					alt=""
				/>
				<div className="w-full p-[10px]">
					<div className="flex items-center space-x-1">
						<FaMapMarkerAlt className="h-4 w-4 text-green-600" />
						<p className="font-semibold text-sm mb-[2px] text-gray-600 truncate">
							{listing.address}
						</p>
						
					</div>
					<p className="font-semibold mt-0 text-xl truncate">{listing.name}</p>
					<p className="text-[#457b9d] mt-2 font-semibold">
						$
						{listing.offer
							? listing.discountedPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
							: listing.regularPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
						{listing.type === "rent" && " / month"}
					</p>
					<div className="flex items-center mt-[10px] space-x-3 mb-6">
						<div className="flex items-center space-x-1">
							<p className="font-semibold text-xs">
								{listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
							</p>
						</div>
						<div className="flex items-center space-x-1">
							<p className="font-semibold text-xs">
								{listing.bathrooms > 1
									? `${listing.bathrooms} Baths`
									: "1 Bath"}
							</p>
						</div>
					</div>
				</div>
			</Link>
			{onDelete && (
				<FaTrash
					className="absolute bottom-2 right-2 h-5 w-5 cursor-pointer text-red-500 hover:text-red-700"
					onClick={()=>onDelete(listing.id)}
				/>
			)}

			{onEdit &&(
				<MdEdit className="absolute bottom-2 right-8 h-5 w-5 cursor-pointer" 
				onClick={()=>onEdit(listing.id)}
				 />

			)}
		</li>
	);
}
