"use client"

import Lottie from "lottie-react";

import deliveryAnimation from '@/assets/animation/deliveryAnimation.json';
import restaurantAnimation from '@/assets/animation/restaurantAnimation.json';
import arrowAnimation from '@/assets/animation/arrow.json';
import foodAnimation from '@/assets/animation/food.json';

const Features = () => {
    return (
        <section className="my-24">
            <div className="max-w-7xl 2xl:max-w-[1320px] mx-auto">
                <h2 className="text-center text-3xl font-medium tracking-wide mb-14">How It Works</h2>
                <div className="flex justify-between items-center gap-14">
                    <div className="pb-10 px-4 rounded-sm flex flex-col justify-center items-center w-[342px]">
                        <div className="w-52 h-52">
                            <Lottie animationData={foodAnimation} />
                        </div>
                        <h4 className="text-center text-xl font-medium">1. Place Your Order</h4>
                        <p className="mt-5 mx-2 text-center text-slate-600">Select Restaurant, Select Menu, Place The Order.</p>
                    </div>
                    <div className="w-20 h-20">
                        <Lottie animationData={arrowAnimation} />
                    </div>
                    <div className="pb-10 px-5 rounded-sm flex flex-col justify-center items-center w-[342px]">
                        <div className="w-52 h-52">
                            <Lottie animationData={restaurantAnimation} />
                        </div>
                        <h4 className="text-center text-xl font-medium">2. Foods Being Prepared</h4>
                        <p className="mt-5 mx-2 text-center text-slate-600">Wait For Your Food Being Prepared By The Restaurant.</p>
                    </div>
                    <div className="w-20 h-20">
                        <Lottie animationData={arrowAnimation} />
                    </div>
                    <div className="pb-10 px-5 rounded-sm flex flex-col justify-center items-center w-[342px]">
                        <div className="w-52 h-48">
                            <Lottie animationData={deliveryAnimation} />
                        </div>
                        <h4 className="text-center text-xl font-medium">3. Lighting Fast Delivery.</h4>
                        <p className="mt-5 mx-2 text-center text-slate-600">Get Foods Delivered Within 30 Mins From The Restaurant.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Features