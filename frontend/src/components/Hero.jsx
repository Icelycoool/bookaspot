import React from 'react';
import hero from "../assets/heroimg.jpg"
import { FaSearch } from "react-icons/fa";

const Hero = () => {
    return (
        <div className='container m-auto mt-28'>
            <section className="relative text-center bg-cover bg-center h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden mx-4" style={{ backgroundImage: `url(${hero})` }}>
                <div className="absolute inset-0 bg-accent bg-opacity-35"></div>
                <div className="relative z-10 text-white py-16">
                    <h1 className="text-3xl md:text-4xl font-bold mt-24 text-offwhite">
                        Find your perfect spot with Bookaspot
                    </h1>
                    <p className="mt-2 text-offwhite" >Discover amenities around you from the comfort of your house!</p>
                </div>
            </section>

            {/* Search Component */}
            <div className="relative -mt-12 z-20 flex justify-center px-4">
                <div className="bg-primary shadow-md rounded-xl px-6 py-4 flex flex-wrap justify-between items-center gap-4 w-full max-w-4xl">
                    <input type="text" placeholder="Location" className="px-4 py-2 border border-offwhite rounded-md w-full md:w-[40%]"/>
                    <input type="text" placeholder="Amenity Type" className="px-4 py-2 border  border-offwhite rounded-md w-full md:w-[20%]"/>
                    <input type="date" className="px-4 py-2 border rounded-md  border-offwhite w-full text-primary fill-primary md:w-[20%]"/>
                    <button className="px-6 py-2 text-white bg-offwhite rounded-full w-full md:w-auto"> <FaSearch  size={24} className='text-primary'/> </button>
                </div>
            </div>
        </div>
  );
};

export default Hero;


