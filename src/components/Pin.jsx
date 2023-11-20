import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid'
import { MdDownloadForOffline} from 'react-icons/md'
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'

import { client, urlFor } from "../client";
import { fetchUser } from "../utils/fetchUser";

export default function Pin({ pin: { postedBy, image, _id, destination, save } }) {
    const [postHovered, setPostHovered] = useState(false)
    const [savingPost, setSavingPost] = useState(false)

    const navigate = useNavigate()

    const user = fetchUser()

    const alreadySaved = !!(save?.filter((item) => item.postedBy._id === user?.sub))?.length

    const savePin = (id) => {

        if(!alreadySaved) {
            setSavingPost(true)

            client
                .patch(id)
                .setIfMissing({ save: [] })
                .insert('after', 'save[-1]', [{
                    _key: uuidv4(),
                    userId: user?.sub,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user?.sub
                    }
                }])
                .commit()
                    .then(() => {
                        window.location.reload()
                        setSavingPost(false)
                    })
        }
    }

    const checklength = () => {
        console.log(save?.length);
    }

    const deletePin = (id) => {
        client
            .delete(id)
            .then(() => {
                window.location.reload()
            })
    }

    return (
        <div className="m-2">
            <div
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`/pin-detail/${_id}`)}
                className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
            >
                <img className="rounded-2xl w-full" alt="user-post" src={urlFor(image).width(250).url()} />
                {postHovered && (
                    <div
                        className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
                        style={{ height: '100%' }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                <a
                                    href={`${image?.asset?.url}?dl=`}
                                    download
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-white w-7 h-7 rounded-full flex items-center justify-center text-dark text-lg opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                                >
                                    <MdDownloadForOffline />
                                </a>
                            </div>
                            {alreadySaved ? (
                                <button type="button" className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-sm rounded-3xl hover:shadow-md outline-none">
                                    {save?.length} Saved
                                </button>
                            ) : (
                                    <button 
                                        onClick={(e) =>{
                                            e.stopPropagation()
                                            savePin(_id)
                                        }}
                                        type="button"
                                        className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-sm rounded-3xl hover:shadow-md outline-none"
                                    >
                                        {/* {savingPost ? 'Saving' : `${save?.length} Saved`} */}
                                        Save
                                </button>
                            )}
                        </div>
                        <div className="flex justify-between items-center gap-2 w-full">
                            {destination && (
                                <a
                                    onClick={(e) => e.stopPropagation()}
                                    href={destination}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white flex items-center gap-2 text-black font-bold p-1 pl-3 pr-3 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                                >
                                    <BsFillArrowUpRightCircleFill />
                                    {destination.length > 15 ? `${destination.slice(0, 15)}...` : destination}
                                </a>
                            )}
                            {postedBy?._id === user?.sub && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        deletePin(_id)
                                    }}
                                    className="bg-white p-2 opacity-70 hover:opacity-100 text-dark font-bold text-sm rounded-full hover:shadow-md outline-none"
                                >
                                    <AiTwotoneDelete />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div>
                <Link
                    to={`user-profile/${postedBy?._id}`}
                    className="flex gap-2 mt-2 items-center"
                >
                    <img
                        className="w-7 h-7 rounded-full object-cover"
                        src={postedBy?.image}
                        alt="user-profile"
                    />
                    <p className="font-semibold capitalize">{postedBy?.userName}</p>
                </Link>
            </div>
        </div>
    )    
}