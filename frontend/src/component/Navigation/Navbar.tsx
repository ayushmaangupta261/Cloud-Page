import React from 'react'
import { logOutUser } from "../../services/operations/authApi";
import logo from "../../assets/dashboard/logo.png"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

    const dispatch = useDispatch()
    const user = useSelector((state: any) => state.auth.user)
    const navigate = useNavigate();


    const signOutHandler = async () => {
        try {
            await logOutUser(dispatch);
        } catch (error) {
            console.log("Error during logout");

        }
    }

    return (
        < div className="flex justify-between items-center py-4 " >
            <div className="flex items-center space-x-4">
                
                {
                    user ?
                        (<p className="text-lg font-semibold cursor-pointer">Dashboard</p>)
                        :
                        (<p
                            className="text-3xl font-semibold cursor-pointer text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                                       hover:scale-105 transition-transform duration-200 ease-in-out"
                            onClick={() => navigate("/")}
                        >
                            Cloud Page
                        </p>
                        )
                }
            </div>
            {user && <p className="text-[#367AFF] underline underline-offset-4 cursor-pointer" onClick={signOutHandler}>
                Sign Out
            </p>}
        </div >
    )
}

export default Navbar