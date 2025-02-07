'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRouter({children}:{children:React.ReactNode}){
    const router = useRouter()

    useEffect(()=>{
        const isLoggedIn = localStorage.getItem("isLoggedIn")
        if (!isLoggedIn){
            router.push("/admin/dashboard")
        }
    },[router])

    return<>{children}</>
}