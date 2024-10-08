'use client';

import LoadingSpinner from "@/components/Shared/LoadingSpinner";
import useAuth from "@/hooks/useAuth";
import useIsCustomer from "@/hooks/useIsCustomer"
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Swal from "sweetalert2";

const CustomerRoutesLayout = ({ children }) => {
    const { user, loading, signOutUser } = useAuth();
    const [isCustomer, isCustomerLoading] = useIsCustomer();

    const router = useRouter();
    const pathName = usePathname();

    useEffect(() => {
        // console.log(isCustomerLoading, isCustomer);
        if (!loading && !isCustomerLoading && isCustomer === false) {
            localStorage.setItem('masterHistory', pathName);
            Swal.fire('Login With Your Customer Account To Use This Feature!');
            signOutUser();
            return router.push('/signin');
        }

        if (!isCustomerLoading && isCustomer) {
            localStorage.removeItem('masterHistory');
        }

    }, [isCustomer, isCustomerLoading, loading, pathName, router, signOutUser]);

    if (loading || isCustomerLoading) {
        return <LoadingSpinner />;
    }

    if(!loading && user?.email && !isCustomerLoading && isCustomer) {
        return children;
    }
}

export default CustomerRoutesLayout;