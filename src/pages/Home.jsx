import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function Home() {
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/server/listing/get?type=rent&limit=4");
        const data = res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/server/listing/get?type=sale&limit=4");
        const data = res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRentListings();
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span> <br />
          car wih ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Vehicle Vista will help you find your next ride fast and easy
          <br />
          We have a wide range of car collection to choose from.
        </div>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline">
          Lets Get Started
        </Link>
      </div>
      <Swiper>
        {saleListings &&
          saleListings.length > 0 &&
          saleListings.map((listing) => (
            <SwiperSlide key={listing}>
              <div
                style={{
                  background: `url(${listing.imageURLs[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
                key={listing._id}></div>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}
