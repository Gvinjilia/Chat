import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import loginBg from '../images/LoginSignupBg.png';
import loginSignUpBgMobile from '../images/LoginSignupBgMobile.png';
import { useNavigate } from "react-router";

const Signup = () => {
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            fullname: e.target.fullname.value,
            email: e.target.email.value,
            password: e.target.password.value
        };
        
        signup(data);
    };

    return (
        <main className="h-screen flex flex-col items-center justify-center">
            <div className="relative">
                <img src={loginBg} className="lg:h-screen lg:block md:hidden sm:hidden hidden" />
            </div>
            <div>
                <img src={loginSignUpBgMobile} className="lg:h-screen lg:hidden md:h-screen sm:h-screen md:block sm:block block" />
            </div>
            <div className="absolute w-full flex flex-col justify-center items-center">
                <p className="lg:text-[39px] md:text-3xl sm:text-3xl text-3xl lg:w-87.5 md:w-auto sm:w-auto w-auto text-center font-bold mb-5">Connect and Chat With New People</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 lg:w-175 md:w-full sm:w-full w-full">
                    <input type="text" name="fullname" placeholder="Enter your fullname:" className="border p-2 outline-none" required />
                    <input type="email" name="email" placeholder="Enter Your Email:" className="border p-2 outline-none" required />
                    <input type="password" name="password" placeholder="Enter Your password:" className="border p-2 outline-none" required />
                    
                    <button style={{ backgroundColor: 'var(--button-bg-color, #2567f9)' }} className="border p-2 text-white font-semibold mb-4">Submit</button>
                </form>
                <button style={{border: '1px solid #2567f9'}} className="p-2 lg:w-175 md:w-full sm:w-full w-full" onClick={() => navigate('/')}>Login</button>
            </div>
        </main>
    )
};

export default Signup;