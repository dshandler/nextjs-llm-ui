import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
//import { Login } from '../icons';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export function RegisterUser() {
    return (
        <svg 
            className=""
            xmlns="http://www.w3.org/2000/svg" 
            height="24"
            width="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            id="add-user">
            <g>
                <path d="M21 6h-1V5a1 1 0 0 0-2 0v1h-1a1 1 0 0 0 0 2h1v1a1 1 0 0 0 2 0V8h1a1 1 0 0 0 0-2zm-11 5a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0-6a2 2 0 1 1-2 2 2 2 0 0 1 2-2zm0 8a7 7 0 0 0-7 7 1 1 0 0 0 2 0 5 5 0 0 1 10 0 1 1 0 0 0 2 0 7 7 0 0 0-7-7z">
                </path>
            </g>
        </svg>
    )
  }

function Register() {
    
    return (
        <a href="https://www.rationare.com" className="flex flex-nowrap gap-2 text-xl text-gray-600 w-full">
            <Button className="w-full gap-2" type="submit">
            <RegisterUser/> 
            <p className="">Register</p>
            </Button>
        </a>
    )
    

}
export default Register;