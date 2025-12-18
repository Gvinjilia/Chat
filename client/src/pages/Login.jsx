import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import loginSignupBg from '../images/LoginSignupBg.png';

const Login = () => {
    const { login } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            email: e.target.email.value,
            password: e.target.password.value
        };

        login(data);
    };
    
    return (
        <>
            <main className="h-screen flex flex-col items-center justify-center">
                <div className="relative">
                    <img src={loginSignupBg} className="lg:h-screen lg:block md:hidden sm:hidden hidden" />
                </div>
                <div className="absolute w-full flex flex-col justify-center items-center">
                    <p className="text-[39px] w-87.5 text-center font-bold mb-2">Connect and Chat With New People</p>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input type="email" name="email" placeholder="Enter Your email:" className="border lg:w-175 md:w-160 sm:w-140 w-70 p-2 outline-none" required />
                        <input type="password" name="password" placeholder="Enter Your password:" className="border lg:w-175 md:w-160 sm:w-140 w-full p-2 outline-none" required /> 

                        <button style={{ backgroundColor: 'var(--button-bg-color, #2567f9)' }} className="border lg:w-175 md:w-full sm:w-full w-full p-2 text-white font-semibold">Submit</button>
                    </form>
                </div>
            </main>
        </>
    )
};

export default Login;