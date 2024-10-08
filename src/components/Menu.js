"use client";

import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useIsCustomer from "@/hooks/useIsCustomer";
import { CartContext } from "@/providers/CartProvider";
import axios from "axios";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Aos from 'aos';
import 'aos/dist/aos.css';

const Menu = ({ menu }) => {
    const { refetch } = useContext(CartContext);

    const router = useRouter();
    const pathName = usePathname();

    const { user, signOutUser } = useAuth();
    const [isCustomer, isCustomerLoading] = useIsCustomer();

    const [axiosSecure] = useAxiosSecure();

    useEffect(() => {
        Aos.init();
    }, [])

    const handleAddToCart = async (menu) => {
        if (!isCustomerLoading && !isCustomer) {
            toast.error('Login using customer account!', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            if(user) {
                await signOutUser();
            }
            localStorage.setItem('masterHistory', pathName);
            return router.push('/signin');
        }

        const cartInfo = {
            foodId: menu._id,
            foodName: menu.foodName,
            foodCategory: menu.foodCategory,
            foodImage: menu.foodImage,
            foodPrice: menu.foodPrice,
            foodDesc: menu.foodDesc,
            restaurantEmail: menu.restaurantEmail,
            restaurantId: menu.restaurantId,
            restaurantName: menu.restaurantName
        };

        try {
            const res = await axiosSecure.get(`/carts/${user?.email}`);

            if (res.status === 200) {
                if (res?.data) {
                    if (res?.data?.cartItems.length !== 0) {
                        if (res?.data?.cartItems[0].restaurantId !== cartInfo?.restaurantId) {
                            Swal.fire({
                                title: "Food Item From Different Restaurant!",
                                text: "Your Previous Cart Items Will Removed As The Restaurants Are Different!",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Yes, Add It!"
                            }).then(async (result) => {
                                if (result.isConfirmed) {
                                    const response = await axiosSecure.post(`/carts/${user?.email}`, cartInfo);

                                    if (response.status === 200) {
                                        refetch();
                                        toast.success('Added To The Cart', {
                                            position: "top-right",
                                            autoClose: 1500,
                                            hideProgressBar: false,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true,
                                            progress: undefined,
                                            theme: "light",
                                        });
                                    }
                                }
                            });
                        }
                        else {
                            const response = await axiosSecure.post(`/carts/${user?.email}`, cartInfo);

                            if (response.status === 200) {
                                refetch();
                                toast.success('Added To The Cart', {
                                    position: "top-right",
                                    autoClose: 1500,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                    theme: "light",
                                });
                            }
                        }
                    }
                    else {
                        const response = await axiosSecure.post(`/carts/${user?.email}`, cartInfo);

                        if (response.status === 200) {
                            refetch();
                            toast.success('Added To The Cart', {
                                position: "top-right",
                                autoClose: 1500,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                            });
                        }
                    }
                }
                else {
                    const response = await axiosSecure.post(`/carts/${user?.email}`, cartInfo);

                    if (response.status === 200) {
                        refetch();
                        toast.success('Added To The Cart', {
                            position: "top-right",
                            autoClose: 1500,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                    }
                }
            }
        } catch (error) {
            console.log(error?.message);
        }
    };

    return (
        <div className="w-[400px] flex justify-start items-start bg-orange-200 rounded relative shadow"
        data-aos="fade-in"
        data-aos-duration="1500">
            <div className="w-[40%] h-[220px] relative">
                <Image fill={true} src={menu?.foodImage} alt={menu?.foodName} className="w-full h-full object-cover rounded-tl rounded-bl" />
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
                            handleAddToCart(menu);
                        }}
                        className="px-6 py-1.5 bg-green-600 text-white font-medium rounded-tl-sm">
                        Add To Cart
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Menu;