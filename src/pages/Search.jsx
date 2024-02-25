export const Search = () => {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border b-2 md:border-r-2 md: min-h-screen">
        <form className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Item:
            </label>
            <input
              type="text"
              id="searchItem"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type: </label>
            <div className="flex gap-2 ">
              <input type="checkbox" id="all" className="w-5" />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2 ">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent </span>
            </div>
            <div className="flex gap-2 ">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Rent </span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Body Type: </label>
            <div className="flex gap-2 ">
              <input type="checkbox" id="all" className="w-5" />
              <span>All</span>
            </div>
            <div className="flex gap-2 ">
              <input type="checkbox" id="sedan" className="w-5" />
              <span>Sedan </span>
            </div>
            <div className="flex gap-2 ">
              <input type="checkbox" id="suv" className="w-5" />
              <span>SUV </span>
            </div>
            <div className="flex gap-2 ">
              <input type="checkbox" id="hatchback" className="w-5" />
              <span>HatchBack </span>
            </div>
            <div className="flex gap-2 ">
              <input type="checkbox" id="others" className="w-5" />
              <span>Others</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort: </label>
            <select id="sort_order" className="border rounded-lg p-3">
              <option>Price High to Low</option>
              <option>Price Low to High</option>
              <option>Latest</option>
              <option>Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing Results
        </h1>
      </div>
    </div>
  );
};
