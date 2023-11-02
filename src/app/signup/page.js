"use client";

import Lottie from 'lottie-react';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { AuthContext } from '@/providers/AuthProvider';
import authAnimation from '@/assets/animation/authAnimation.json';
import Swal from 'sweetalert2';
import axios from 'axios';


const SignUp = () => {
    const { signUpUser, updateUser, signOutUser } = useContext(AuthContext);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const router = useRouter();

    const onSubmit = (data) => {
        if (data.password === data.passwordconfirm) {
            const formData = new FormData();
            formData.append('image', data.profilepic[0]);

            const img_hosting_url = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_img_hosting_token}`;

            fetch(img_hosting_url, {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .then(imgResponse => {
                    if (imgResponse.success) {
                        const imgURL = imgResponse.data.display_url;

                        signUpUser(data.email, data.password)
                            .then(result => {
                                updateUser(data.name, imgURL)
                                    .then(() => {
                                        signOutUser()
                                            .then(() => {
                                                const newUser = {
                                                    name: data.name,
                                                    email: data.email,
                                                    profilePic: imgURL,
                                                    country: 'Bangladesh'
                                                };

                                                axios.post('http://localhost:5000/users', newUser)
                                                    .then(res => {
                                                        if (res.status === 201) {
                                                            Swal.fire('You are signed up for food masters successfully!');
                                                            reset();
                                                            router.push('/signin');
                                                        }
                                                    })
                                                    .catch(error => console.log(error));
                                            })
                                            .catch(error => console.log(error));
                                    })
                                    .catch(error => console.log(error));
                            })
                            .catch(error => {
                                Swal.fire({
                                    icon: 'error',
                                    text: `${error?.message}`,
                                });
                            });
                    }
                })
                .catch(error => console.log(error));
        }
        else {
            Swal.fire({
                icon: 'error',
                text: 'Password And Confirm Password Does Not Match',
            })
        }
    };

    return (
        <section className="bg-orange-100 py-24 min-h-screen flex justify-center items-center px-4 lg:px-0">
            <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-12 bg-white">
                <div
                    className="flex items-end bg-green-100 lg:col-span-5 lg:h-full xl:col-span-6"
                >
                    <Lottie animationData={authAnimation} />
                </div>

                <main
                    className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
                >
                    <div className="max-w-xl lg:max-w-3xl">
                        <h1 className="text-center text-3xl text-green-600 font-semibold pb-5">
                            Food <span className="text-orange-500"> Masters</span>
                        </h1>
                        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-3">
                                <label
                                    htmlFor="name"
                                    className="block text-base font-medium text-gray-700"
                                >
                                    Name
                                </label>

                                <input
                                    type="text"
                                    id="name"
                                    {...register("name", { required: true })}
                                    className="mt-1 w-full h-8 rounded-sm border-2 border-gray-300 bg-white text-sm text-gray-700 shadow-sm"
                                />
                                {errors.name && <span className="text-red-600 mt-2">** Name is required</span>}
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label
                                    htmlFor="profilepic"
                                    className="block text-base font-medium text-gray-700"
                                >
                                    Profile Picture
                                </label>

                                <input
                                    type="file"
                                    id="profilePic"
                                    {...register("profilepic", { required: true })}
                                    className="mt-1 w-full h-8 rounded-sm border-2 border-gray-300 bg-white text-sm text-gray-700 shadow-sm"
                                />
                                {errors.profilepic && <span className="text-red-600 mt-2">** Profile Picture is required</span>}
                            </div>

                            <div className="col-span-6">
                                <label htmlFor="email" className="block text-base font-medium text-gray-700">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    id="email"
                                    {...register("email", { required: true })}
                                    className="mt-1 w-full h-8 rounded-sm border-2 border-gray-300 bg-white text-sm text-gray-700 shadow-sm"
                                />
                                {errors.email && <span className="text-red-600 mt-2">** Email is required</span>}
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="password" className="block text-base font-medium text-gray-700">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    id="password"
                                    {...register("password", { required: true })}
                                    className="mt-1 w-full h-8 rounded-sm border-2 border-gray-300 bg-white text-sm text-gray-700 shadow-sm"
                                />
                                {errors.password && <span className="text-red-600 mt-2">** Password is required</span>}
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label
                                    htmlFor="passwordconfirm"
                                    className="block text-base font-medium text-gray-700"
                                >
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    id="passwordconfirm"
                                    {...register("passwordconfirm", { required: true })}
                                    className="mt-1 w-full h-8 rounded-sm border-2 border-gray-300 bg-white text-sm text-gray-700 shadow-sm"
                                />
                                {errors.passwordconfirm && <span className="text-red-600 mt-2">** Confirm Password is required</span>}
                            </div>

                            <div className="col-span-6">
                                <p className="text-base text-gray-500">
                                    By creating an account, you agree to our
                                    <Link href="#" className="text-gray-700 underline">
                                        terms and conditions
                                    </Link>
                                    and
                                    <Link href="#" className="text-gray-700 underline">privacy policy</Link>.
                                </p>
                            </div>

                            <div className="col-span-8 justify-center sm:flex sm:items-center sm:gap-4">
                                <button
                                    className="inline-block shrink-0 rounded-md border border-green-600 bg-green-600 px-12 py-2.5 mt-2 text-base font-medium text-white transition hover:bg-green-700 focus:outline-none focus:ring active:text-green-600"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </form>
                        <div className="w-full mt-8">
                            <p className="mt-4 text-base text-gray-500 sm:mt-0">
                                Already have an account?
                                <Link href="/signin" className="text-green-600 font-medium"> Sign In</Link>.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
            <div className="bg-white text-xl font-medium fixed bottom-0 right-0 flex justify-center items-center rounded-sm">
                <Link href="/" className="py-3 px-5 text-black"><span className="text-green-600">Food</span> <span className="text-orange-500"> Masters</span> For Business</Link>
                <Link href="/" className="py-3 px-5 bg-green-500 text-white">Go To Home</Link>
            </div>
        </section>
    )
}

export default SignUp;