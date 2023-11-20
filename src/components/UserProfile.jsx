import React from "react";
import { useState, useEffect } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from "../utils/data";
import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const randomImage = 'https://source.unsplash.com/1600x900/?technology'

const activeBtnStyles = 'bg-red-500 text-white p-1 rounded-full w-20 outline-none mt-2'
const notActiveBtnStyles = 'bg-primary text-black-500 p-1 rounded-full w-20 outline-none mt-2'

export default function UserProfile() {
    const [user, setUser] = useState(null)
    const [pins, setPins] = useState(null)
    const [text, setText] = useState("Created")
    const [activeBtn, setActiveBtn] = useState("created")
    const [isLoading, setIsLoading] = useState(false)
    
    const navigate = useNavigate()
    const { userId } = useParams()

    useEffect(() => {
        const query = userQuery(userId)

        client.fetch(query)
            .then((data) => {
                setUser(data[0])
            })
    }, [userId])

    useEffect(() => {
        if (text === 'Created') {
            const createdPinsQuery = userCreatedPinsQuery(userId)

            client.fetch(createdPinsQuery)
                .then((data) => {
                    setPins(data)
                })
        } else {
            const savedPinsQuery = userSavedPinsQuery(userId)

            client.fetch(savedPinsQuery)
                .then((data) => {
                    setPins(data)
                })
        }
    }, [text, userId])

    const logout = () => {
        googleLogout()
        localStorage.clear()
        navigate('/login')
    }

    if(!user) {
        return <Spinner message="Loading profile" />
    }

    return (
        <div className="relative pb-2 h-full justify-center items-center">
            <div className="flex flex-col pb-5">
                <div className="relative flex flex-col mb-7">
                    <div className="flex flex-col justify-center items-center">
                        <img
                            src={randomImage}
                            alt="banner-pic"
                            className="w-full h-370 2xl:h-510 shadow-lg object-cover"
                        />
                        <img
                            className="rounded-full w-20 h-20 -mt-10 shadow-2xl object-cover"
                            src={user.image}
                            alt="user-pic"
                        />
                        <h1 className="font-bold text-3xl text-center mt-3">{user.userName}</h1>
                        <div className="absolute top-0 z-1 right-0 p-2">
                            {userId === user._id && (
                                // <googleLogout
                                //     clientId='313681894321-gn0jlssqr9l3cfpf3puijsubmsolaeru.apps.googleusercontent.com'
                                //     render = {(renderProps) => (
                                //         <button className='bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none' type='button' onClick={() => login()}>
                                //             <AiOutlineLogout className='red' fontSize={21} />
                                //         </button>
                                //     )}
                                //     onSignOutSuccess={logout}
                                //     cookiePolicy={'single_host_origin'}
                                // />
                                <button className='bg-mainColor hover:bg-white transition-all duration-250 flex justify-center items-center p-3 rounded-full shadow-xl cursor-pointer outline-none' type='button' onClick={logout}>
                                    <AiOutlineLogout color="red" fontSize={18} />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="text-center mb-7">
                        <button
                            type="button"
                            onClick={(e) => {
                                setText(e.target.textContent)
                                setActiveBtn("created")
                            }}
                            className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
                        >
                            Created
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                setText(e.target.textContent)
                                setActiveBtn("saved")
                            }}
                            className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
                        >
                            Saved
                        </button>
                    </div>
                    {pins === null ? (<Spinner message="Loading Pins" />) : (null)}
                    {pins?.length ? (
                        <div className="px-2">
                                <MasonryLayout pins={pins} />
                        </div>
                    ) : (
                        <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
                            No Pins Found!
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}