import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ListingItem } from "../components/ListingItem";

export const Search = () => {
  const [sideBarData, setSideBarData] = useState({
    searchItem: "",
    type: "rentAndSale",
    bodyType: "all",
    sort: "createdAt",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (
      e.target.id === "rentAndSale" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSideBarData({ ...sideBarData, type: e.target.id });
    }

    if (e.target.id === "searchItem") {
      setSideBarData({ ...sideBarData, searchItem: e.target.value });
    }

    if (
      e.target.id === "sedan" ||
      e.target.id === "suv" ||
      e.target.id === "hatchback" ||
      e.target.id === "others" ||
      e.target.id === "all"
    ) {
      setSideBarData({ ...sideBarData, bodyType: e.target.id });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";
      setSideBarData({ ...sideBarData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchItem", sideBarData.searchItem);
    urlParams.set("type", sideBarData.type);
    urlParams.set("bodyType", sideBarData.bodyType);
    urlParams.set("sort", sideBarData.sort);
    urlParams.set("order", sideBarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const setSearchItemFromURL = urlParams.get("searchItem");
    const typeFromURL = urlParams.get("type");
    const bodyTypeFromURL = urlParams.get("bodyType");
    const orderFromURL = urlParams.get("order");
    const sortFromURL = urlParams.get("sort");

    if (
      setSearchItemFromURL ||
      typeFromURL ||
      bodyTypeFromURL ||
      orderFromURL ||
      sortFromURL
    ) {
      setSideBarData({
        searchItem: setSearchItemFromURL || "",
        type: typeFromURL || "all",
        bodyType: bodyTypeFromURL || "all",
        order: orderFromURL || "desc",
        sort: sortFromURL || "createdAt",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/server/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };
    fetchListings();
  }, [location.search]);

  const handleShowMore = async () => {
    const noOfListings = listings.length;
    const startIndex = noOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/server/listing/get?${searchQuery}`);
    const data = await res.json;
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border b-2 md:border-r-2 md: min-h-screen">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Item:
            </label>
            <input
              type="text"
              id="searchItem"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sideBarData.searchItem}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type: </label>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="rentAndSale"
                className="w-5"
                checked={sideBarData.type === "rentAndSale"}
                onChange={handleChange}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                checked={sideBarData.type === "rent"}
                onChange={handleChange}
              />
              <span>Rent </span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                checked={sideBarData.type === "sale"}
                onChange={handleChange}
              />
              <span>Sale </span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Body Type: </label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                checked={sideBarData.bodyType === "all"}
                onChange={handleChange}
              />
              <span>All</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sedan"
                className="w-5"
                checked={sideBarData.bodyType === "sedan"}
                onChange={handleChange}
              />
              <span>Sedan </span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="suv"
                className="w-5"
                checked={sideBarData.bodyType === "suv"}
                onChange={handleChange}
              />
              <span>SUV </span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="hatchback"
                className="w-5"
                checked={sideBarData.bodyType === "hatchback"}
                onChange={handleChange}
              />
              <span>HatchBack </span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="others"
                className="w-5"
                checked={sideBarData.bodyType === "others"}
                onChange={handleChange}
              />
              <span>Others</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort: </label>
            <select
              id="sort_order"
              className="border rounded-lg p-3"
              onChange={handleChange}
              defaultValue={"createdAt_desc"}>
              <option value={"price_desc"}>Price High to Low</option>
              <option value={"price_asc"}>Price Low to High</option>
              <option value={"createdAt_desc"}>Latest</option>
              <option value={"createdAt_asc"}>Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing Results
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl">No Listings Found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              className="text-green-700 hover:underline p-7 text-center w-full"
              onClick={handleShowMore}>
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
