"use client";

import Menus from "@/components/Menus";
import RestaurantInfo from "@/components/RestaurantInfo";
import TopBanner from "@/components/Shared/TopBanner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import { GrMapLocation } from "react-icons/gr";
import Rating from "react-rating";

import './page.css';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaRegStar, FaStar } from "react-icons/fa";
import RestaurantVouchers from "@/components/RestaurantVouchers";
import useMenu from "@/hooks/useMenu";

const Restaurant = () => {
  const [currentRestaurantPageView, setCurrentRestaurantPageView] = useState("Menu");
  const [ratedByCount, setRatedByCount] = useState();

  const { id } = useParams();

  const { setIsMenuOpen } = useMenu();

  const { data: restaurant = {} } = useQuery({
    queryKey: ["restaurant", id],
    queryFn: async () => {
      try {
        const response = await axios.get(`https://food-masters-server.vercel.app/restaurants/restaurant/${id}`);
        return response.data;
      } catch (error) {
        console.log(error?.message);
      }
    }
  });

  const { data: ratingsCount = 0 } = useQuery({
    queryKey: ["ratingsCount", id],
    queryFn: async () => {
      try {
        const response = await axios.get(`https://food-masters-server.vercel.app/ratings/${id}`);

        if (response.status === 200) {
          setRatedByCount(response?.data?.length);
          return (response?.data?.reduce((total, current) => total + current.rating, 0) / response?.data.length);
        }
      } catch (error) {
        toast.error(error?.message);
      }
    }
  });

  useEffect(() => {
    setIsMenuOpen(false);
  }, [setIsMenuOpen]);

  return (
    <main>
      <TopBanner title="Restaurant" />

      <section className="w-full h-[290px] xl:h-[220px] bg-orange-100 drop-shadow-md">
        <div className="max-w-7xl mx-auto h-full flex flex-col xl:flex-row xl:justify-start xl:items-start items-center justify-center gap-5">
          <div className="min-w-[180px] min-h-[180px] relative bg-green-50 -top-14 rounded-full">
            <Image fill={true} src={restaurant?.restaurantThumbnail} alt="Restaurant" className="w-full h-full p-2 xl:p-4 object-cover rounded-full" />
          </div>
          <div className="mt-2 ms-2 relative -top-20 text-center xl:static xl:-top-0 xl:text-left">
            <h2 className="text-4xl font-medium mt-4">{restaurant?.restaurantName}</h2>
            <div className="ms-4 flex justify-start items-center gap-4 mt-4">
              <GrMapLocation />
              <h4>{restaurant?.address}, {restaurant?.city}</h4>
            </div>
            <div className="mt-4 ms-4 flex justify-center xl:justify-start items-center">
              <Rating
                initialRating={ratingsCount}
                emptySymbol={<FaRegStar className="text-green-600 text-3xl" />}
                fullSymbol={<FaStar className="text-green-600 text-3xl" />}
                readonly
                className="mt-1.5"
              />
              <div className="mx-3 text-2xl font-medium"> - </div>
              <div className="text-2xl font-medium">
                {ratingsCount || 0} ({ratedByCount})
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-28 px-4">
        <div className="max-w-7xl 2xl:max-w-[1320px] mx-auto flex flex-col xl:flex-row justify-center xl:justify-between items-center xl:items-start gap-16">
          <aside className="w-full xl:w-[25%] bg-orange-100 border border-orange-200 drop-shadow-md py-10 px-5">
            <h3 className="text-xl font-medium mb-7">Restaurant Navigator</h3>
            <div className="px-20 xl:px-0 flex flex-col items-stretch justify-center gap-5">
              <button
                className={`${currentRestaurantPageView === 'Menu' ? 'bg-orange-600' : 'bg-green-600'} text-white font-medium px-4 py-2`}
                onClick={() => setCurrentRestaurantPageView("Menu")}
              >
                Menu
              </button>
              <button
                className={`${currentRestaurantPageView === 'Restaurant Vouchers' ? 'bg-orange-600' : 'bg-green-600'} text-white font-medium px-4 py-2`}
                onClick={() => setCurrentRestaurantPageView("Restaurant Vouchers")}
              >
                Vouchers
              </button>
              <button
                className={`${currentRestaurantPageView === 'Restaurant Info' ? 'bg-orange-600' : 'bg-green-600'} text-white font-medium px-4 py-2`}
                onClick={() => setCurrentRestaurantPageView("Restaurant Info")}
              >
                Restaurant Info
              </button>
            </div>
          </aside>
          <div className="w-full xl:w-[75%] bg-orange-50 border border-orange-200 p-5 pb-14 shadow-lg shadow-orange-100">
            {
              currentRestaurantPageView === "Menu" && <Menus restaurantId={id} restaurant={restaurant} />
            }
            {
              currentRestaurantPageView === "Restaurant Vouchers" && <RestaurantVouchers restaurantEmail={restaurant?.restaurantEmail} />
            }
            {
              currentRestaurantPageView === "Restaurant Info" && <RestaurantInfo restaurant={restaurant} />
            }


          </div>
        </div>
      </section>
    </main>
  )
}

export default Restaurant;