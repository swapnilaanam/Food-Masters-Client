"use client";

import Lottie from 'lottie-react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

import authAnimation from '@/assets/animation/authAnimation.json';
import { FaGoogle } from "react-icons/fa";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import useAuth from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { useEffect } from 'react';

const SignIn = () => {
  const { user, loading, signInUser, signInGoogle, signOutUser } = useAuth();

  const [axiosSecure] = useAxiosSecure();

  const router = useRouter();
 
  const { data: restaurants } = useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      try {
        const response = await axios.get('https://food-masters-server.vercel.app/restaurants');

        if (response?.status === 200) {
          return response?.data;
        }
      } catch (error) {
        console.log(error?.message);
      }
    }
  });

  useEffect(() => {
    if(!loading && user) {
      return router.push('/');
    }
  }, [loading, router, user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = (data) => {
    signInUser(data.email, data.password)
      .then(result => {
        const isExist = restaurants.find((restaurant) => restaurant?.restaurantEmail === result?.user?.email);

        if(isExist) {
          signOutUser();
          toast.error('Business Accounts Are Not Allowed')
          return reset();
        }

        toast.success("Signed In Successfully!");
        reset();

        const masterHistory = localStorage.getItem('masterHistory');

        if (masterHistory) {
          return router.push(masterHistory);
        }

        return router.push('/');
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          text: `${error?.message}`,
        });
      });
  };

  const handleGoogleSignIn = () => {
    signInGoogle()
      .then(result => {

        const isExist = restaurants.find((restaurant) => restaurant?.restaurantEmail === result?.user?.email);

        if(isExist) {
          signOutUser();
          toast.error('Business Accounts Are Not Allowed')
          return reset();
        }

        const loggedUser = result.user;

        const newUser = {
          name: loggedUser.displayName,
          email: loggedUser.email,
          profilePic: loggedUser.photoURL,
          country: "Bangladesh"
        };

        axiosSecure.post('/users', newUser)
          .then(res => {
            if (res.status === 201) {
              console.log("Data saved successfully!");
            }
          })
          .catch(error => console.log(error));

        toast.success('You Are Signed In Successfully!');

        const masterHistory = localStorage.getItem('masterHistory');

        if (masterHistory) {
          return router.push(masterHistory);
        }

        return router.push('/');
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          text: `${error?.message}`,
        });
      });
  }

  return (
    <main className="bg-orange-100 py-24 min-h-screen flex justify-center items-center px-4 2xl:px-0">
      <section className="max-w-7xl mx-auto lg:grid lg:grid-cols-12 bg-white">
        <div
          className="flex items-center bg-green-100 lg:col-span-5 lg:h-full xl:col-span-6"
        >
          <Lottie animationData={authAnimation} className="w-full" />
        </div>

        <div
          className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
        >
          <div className="w-[90%]">
            <h1 className="text-center text-3xl text-green-600 font-semibold pb-5">
              Food <span className="text-orange-500"> Masters</span>
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid grid-cols-6 gap-6">
              <div className="col-span-8">
                <label htmlFor="email" className="block text-base font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  id="email"
                  {...register("email", { required: true })}
                  className="mt-1 w-full h-8 rounded-sm border-2 border-gray-300 bg-white text-sm text-gray-700 shadow-sm ps-2"
                  placeholder="Type Your Email..."
                />
                {errors.email && <span className="text-red-600 mt-2">** Email is required</span>}
              </div>

              <div className="col-span-8">
                <label htmlFor="password" className="block text-base font-medium text-gray-700">
                  Password
                </label>

                <input
                  type="password"
                  id="password"
                  {...register("password", { required: true })}
                  className="mt-1 w-full h-8 rounded-sm border-2 border-gray-300 bg-white text-sm text-gray-700 shadow-sm ps-2"
                  placeholder="Type Your Password..."
                />
                {errors.password && <span className="text-red-600 mt-2">** Password is required</span>}
              </div>

              <div className="col-span-8 justify-center sm:flex sm:items-center sm:gap-4 text-center">
                <button
                  className="inline-block shrink-0 rounded-sm border border-green-600 bg-green-600 px-12 py-2.5 mt-2 text-base font-medium text-white transition hover:bg-green-700 focus:outline-none focus:ring active:text-green-600"
                >
                  Sign In
                </button>
              </div>
            </form>
            <div className="my-8 flex justify-center items-center gap-5">
              <div className='w-full border border-gray-700 border-dashed border-spacing-10'></div>
              <div className="font-medium text-lg">Or</div>
              <div className='w-full border border-gray-700 border-dashed border-spacing-10'></div>
            </div>
            <div className="flex justify-center items-center">
              <button onClick={handleGoogleSignIn} className="text-center bg-orange-300 px-12 py-3 rounded-sm text-base font-medium flex justify-center items-center gap-2">
                <FaGoogle />
                <span>Google</span>
              </button>
            </div>
            <div className="w-full mt-8">
              <p className="mt-4 text-base text-gray-500 sm:mt-0">
                {`Doesn't`} have an account?
                <Link href="/signup" className="text-green-600 font-medium"> Sign Up</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="bg-green-50 text-sm md:text-xl font-medium fixed bottom-0 right-0 flex justify-center items-center rounded-sm">
        <Link href="/business/signin" className="py-3 px-5 text-black"><span className="text-green-600">Food</span> <span className="text-orange-500"> Masters</span> For Business</Link>
        <Link href="/" className="py-3 px-5 bg-green-500 text-white">Go To Home</Link>
      </div>
    </main>
  )
}

export default SignIn;