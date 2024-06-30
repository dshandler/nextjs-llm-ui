import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
//import { Login } from '../icons';

import { Button } from "@/components/ui/button";

export function Login() {
    return (
      <svg 
        className=""
        xmlns="http://www.w3.org/2000/svg" 
        height="24"
        width="24"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
      <g data-name="Layer 2">
        <path 
          d="M19 4h-2a1 1 0 0 0 0 2h1v12h-1a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zm-7.2 3.4a1 1 0 0 0-1.6 1.2L12 11H4a1 1 0 0 0 0 2h8.09l-1.72 2.44a1 1 0 0 0 .24 1.4 1 1 0 0 0 .58.18 1 1 0 0 0 .81-.42l2.82-4a1 1 0 0 0 0-1.18z" 
          data-name="log-in"></path>
        </g>
      </svg>
    )
  }

function LogInOut() {
    const { user, error, isLoading } = useUser();

    if (isLoading) return (
        <p>Loading...</p>
    );
    if (error) {
        return (
            <p>{error}</p>
        );
    } else if (user) {
        return (
            <div className="grid justify-items-center">
                {/* <div className="text-[14px] sm:text-xl text-gray-600">
                    Welcome {user.name}! 
                </div> */}
                <div >
                    <a href="/api/auth/logout" className="flex flex-nowrap gap-4 text-xl text-gray-600 w-full">
                        
                        <Button className="w-full gap-2" type="submit">
                        <Login /> 
                        <p>Logout</p>
                        </Button>
                    </a>
                </div>
            </div>
          );
    } else {
        return (
            <a href="/api/auth/login" className="flex flex-nowrap gap-4 text-xl text-gray-600 w-full">
                
            <Button className="w-full gap-2" type="submit">
                <Login /> 
                <p>Login</p>
                </Button>
            </a>
        )
    }

}
export default LogInOut;