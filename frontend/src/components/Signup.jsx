import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiAccountCircle2Line } from "react-icons/ri";

import axios from "axios";

import formimg from "../assets/formimg.png"

const Signup = () => {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
        is_owner: false,
    });
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [message, setMessage] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate(); // Initialize useNavigate

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setMessage(null);
        try {
            const response = await axios.post(`${apiUrl}/api/auth/signup`, formData);
            setMessage(response.data.message);
            navigate("/login");
        } catch (error) {
            const errorData = error.response?.data;
            if (errorData?.errors) {
                setErrors(errorData.errors);
            } else {
                setMessage(errorData?.message || "An error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container m-auto g-6 flex h-full flex-wrap items-center justify-center lg:justify-between mt-28">
            {/* Image Column */}
            <div className="shrink-1 mb-12 grow-0 basis-auto  md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
                <img
                    src={formimg}
                    className="w-full hidden lg:block"
                    alt="Sample image"
                />
            </div>

            {/* Form Column */}
            <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-md">
                <RiAccountCircle2Line className="fill-primary size-20 mx-auto p-4"/>
                <h2 className="text-2xl font-semibold text-center text-primary mb-4 uppercase">Sign Up</h2>
                {message && <p className="text-center text-red-500 mb-4">{message}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="firstname"
                        placeholder="First Name"
                        value={formData.firstname}
                        onChange={handleChange}
                        className={`w-full p-2 border border-primary rounded-md ${errors.firstname ? "border-red-500" : ""}`}
                    />
                    {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname}</p>}
                    <input
                        type="text"
                        name="lastname"
                        placeholder="Last Name"
                        value={formData.lastname}
                        onChange={handleChange}
                        className={`w-full p-2 border  border-primary rounded-md ${errors.lastname ? "border-red-500" : ""}`}
                    />
                    {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname}</p>}
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`w-full p-2 border  border-primary rounded-md ${errors.username ? "border-red-500" : ""}`}
                    />
                    {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full p-2 border  border-primary rounded-md ${errors.email ? "border-red-500" : ""}`}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full p-2 border  border-primary rounded-md ${errors.password ? "border-red-500" : ""}`}
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    <input
                        type="password"
                        name="password_confirmation"
                        placeholder="Confirm Password"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        className={`w-full p-2 border border-primary rounded-md ${errors.password_confirmation ? "border-red-500" : ""}`}
                    />
                    {errors.password_confirmation && <p className="text-red-500 text-sm">{errors.password_confirmation}</p>}
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="is_owner"
                            checked={formData.is_owner}
                            onChange={handleChange}
                            className="w-4 h-4  text-primary"
                        />
                        <span className="text-primary">I am an owner</span>
                    </label>

                    <div className="text-center">
						<p>Have an account?</p>
						<button type="button" className="text-primary font-bold hover:underline" onClick={() => navigate("/login")}>
							LOG IN
						</button>
					</div>

                    <button
                        type="submit"
                        className={`w-full p-2 ${loading ? "bg-secondaryHover" : "bg-secondary"} text-offwhite rounded-md hover:bg-secondaryHover`}
                        disabled={loading}
                    >
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>
                <div className="text-center pt-10">Bookaspot &copy;{new Date().getFullYear()}</div>
            </div>

        </div>
    );
};

export default Signup;
