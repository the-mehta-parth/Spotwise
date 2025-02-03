import { Link } from "react-router-dom"

export const NavigationBar = () => {
    return<div>
            <div className="bg-gray-100 font-sans">
                <div className="bg-white shadow">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between py-4">
                            <div className="text-gray-800 text-md font-semibold hover:text-blue-600 mr-4">
                                <Link to={'/'}>Spotwise</Link>
                            </div>
                            <div className="relative text-gray-600 border-2 border-gray-300 bg-white h-10 pl-2 pr-8 rounded-lg md:block hidden">
                                <input className=" text-sm focus:outline-none" type="search" placeholder="Search"></input>
                                <button className="" type="submit">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                    </svg>
                                </button>  
                            </div>         
                        </div>
                    </div>
                </div>
            </div>
        </div>
   
}