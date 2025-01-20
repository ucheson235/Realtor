import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  function pathMathRoute(route){
    if(route === location.pathname){
      return true;
    }
  }
 
  return (
    <div className='bg-white border-b shadow-sm sticky top-0 z-50'>
        <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
         <di>
           <img src='https://files.oaiusercontent.com/file-JNsEPWFiLXi8S2QpuNqt2D?se=2025-01-20T09%3A58%3A52Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D13e156f5-dd48-4362-8b42-fe69a22ecd81.webp&sig=EaOCQZ3ncpfWXD2xtIGWUpXsFYsMwmOKA5zCP2ygSzk%3D' alt='logo' className='h-20 cursor-pointer rounded-full' onClick={()=> navigate("/")} />
         </di>
         <div>
          <ul className='flex space-x-10'>
             <li className={` cursor-pointer py-3 text-sm font-semibold text-gray-400
              border-b-[3px] border-transparent${pathMathRoute("/")
              && "text-black border-b-red-500"} `} onClick={()=> navigate("/")}>Home</li>
             <li  className={` cursor-pointer py-3 text-sm font-semibold text-gray-400
              border-b-[3px] border-transparent${pathMathRoute("/offers")
              && "text-black border-b-red-500"} `} onClick={()=> navigate("/offers")} >Offers</li>
             <li  className={`cursor-pointer py-3 text-sm font-semibold text-gray-400
              border-b-[3px] border-transparent${pathMathRoute("/sign-in")
              && "text-black border-b-red-500"} `} onClick={()=>navigate("sign-in")}>Sign in</li>
          </ul>
         </div>

        </header>
    </div>
  )
}



