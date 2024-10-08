"use client"

import { useQuery } from "@tanstack/react-query";
import AddMenu from "./AddMenu";
import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import EditMenu from "./EditMenu";
import Swal from "sweetalert2";
import useAxiosSecureBusiness from "@/hooks/useAxiosSecureBusiness";
import Image from "next/image";
import useBusinessMenu from "@/hooks/useBusinessMenu";
import Aos from 'aos';
import 'aos/dist/aos.css';

const Menus = () => {
    const [availableCategory, setAvailableCategory] = useState([]);
    const [currentCategory, setCurrentCategory] = useState("All Food");
    const [isEditFoodModalOpen, setIsEditFoodModalOpen] = useState(false);
    const [currentMenu, setCurrentMenu] = useState(null);

    const { user } = useAuth();
    const { setIsBusinessMenuOpen } = useBusinessMenu();

    const [axiosSecureBusiness] = useAxiosSecureBusiness();

    const { data: menus = [], refetch } = useQuery({
        queryKey: ["menus", user?.email],
        queryFn: async (req, res) => {
            try {
                const response = await axiosSecureBusiness.get(`/menus/${user?.email}`);

                const categorySet = new Set();
                response.data?.filter(menu => categorySet.add(menu?.foodCategory));

                setAvailableCategory(Array.from(categorySet));

                if (currentCategory === 'All Food') {
                    return response.data;
                }
                else {
                    return response.data.filter((menu) => menu.foodCategory === currentCategory);
                }
            } catch (error) {
                console.log(error?.message);
            }
        }
    });

    useEffect(() => {
        Aos.init();
    }, []);

    useEffect(() => {
        setIsBusinessMenuOpen(false);
    }, [setIsBusinessMenuOpen]);

    useEffect(() => {
        refetch();
    }, [currentCategory, refetch]);

    const handleDeleteMenu = async (id) => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await axiosSecureBusiness.delete(`/menus/${id}`);
                    if (response.status === 200) {
                        refetch();
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "Food Item Removed!",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                }
            });
        } catch (error) {
            console.log(error?.message);
        }
    }

    return (
        <section className="px-4 2xl:px-0">
            <div className="max-w-7xl mx-auto">
                <AddMenu refetch={refetch} />
                <div className="flex justify-end mt-12">
                    <div className="w-full md:w-[30%] lg:w-[25%] xl:w-[20%] flex justify-center items-start gap-5">
                        <label htmlFor="foodcategory" className="block text-lg font-medium text-gray-900">
                            Category:
                        </label>

                        <select
                            name="foodcategory"
                            defaultValue="All Food"
                            id="foodcategory"
                            className="h-8 w-full rounded-lg bg-orange-100 border-gray-300 text-gray-700 sm:text-sm ps-2"
                            onChange={(e) => setCurrentCategory(e.target.value)}
                        >
                            <option>All Food</option>
                            {
                                availableCategory.map((category, index) => <option key={index}>
                                    {category}
                                </option>)
                            }
                        </select>
                    </div>
                </div>
                <div className="flex justify-center items-center flex-wrap gap-12 py-20">
                    {
                        menus?.length === 0 && (
                            <h4 className="text-xl font-medium text-center">
                                No Food Is Available Now To Show...
                            </h4>
                        )
                    }
                    {
                        menus.map(menu => {
                            return (
                                <div 
                                key={menu?._id} 
                                className="w-[400px] flex justify-start items-start bg-orange-200 rounded relative shadow"
                                data-aos="fade-in"
                                data-aos-duration="1500">
                                    <div className="w-[40%] h-[220px] relative">
                                        <Image fill={true} src={menu?.foodImage} alt="Food Image" className="w-full h-full object-cover rounded-tl rounded-bl" />
                                    </div>
                                    <div className="w-[60%] ps-7 py-2 pr-1">
                                        <h4 className="text-lg font-medium">{menu?.foodName}</h4>
                                        <div className="bg-green-600 text-white font-medium w-fit px-4 py-1 absolute top-0 left-0 rounded-tl">
                                            {menu?.foodCategory}
                                        </div>
                                        <p title={menu?.foodDesc} className="mt-2 text-sm cursor-pointer">{menu?.foodDesc.slice(0, 40)} ...</p>
                                        <div className="bg-white w-fit px-4 py-1.5 mt-4 rounded">
                                            BDT. <span className="font-medium ms-2">{menu?.foodPrice}</span>
                                        </div>
                                        <div className="absolute bottom-0 right-0 shadow">
                                            <button
                                                onClick={() => {
                                                    setIsEditFoodModalOpen(true);
                                                    setCurrentMenu(menu);
                                                }}
                                                className="px-6 py-1.5 bg-yellow-400">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDeleteMenu(menu?._id)} className="px-4 py-1.5 bg-red-600 text-white rounded-br">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                {
                    isEditFoodModalOpen && (
                        <EditMenu setIsEditFoodModalOpen={setIsEditFoodModalOpen} menu={currentMenu} setCurrentMenu={setCurrentMenu} refetch={refetch} />
                    )
                }
            </div>
        </section>
    )
}

export default Menus;