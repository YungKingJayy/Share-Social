import React from 'react'
import { GoogleLogin, GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png'
import { jwtDecode } from 'jwt-decode'

import { client } from '../client'

export default function Login () {
  const navigate = useNavigate()
  const login = useGoogleLogin({
    onSuccess: credentialResponse => {
      localStorage.setItem('user', JSON.stringify(credentialResponse.profileObj))

      const { name, googleId, imageUrl } = credentialResponse

      console.log(credentialResponse);

      // const doc = {
      //   _id: googleId,
      //   _type: 'user',
      //   userName: name,
      //   image: imageUrl
      // }

      // client.createIfNotExists(doc)
      //   .then(() => {
      //     console.log("test");
      //     navigate('/', { replace: true })
      //   })
    },
  });


  const test = () => {
    console.log("clicked");
  }
  return (
    <div className='flex justify-start items-center flex-col h-screen'>
        <div className='relative w-full h-full'>
          <video
            src={shareVideo}
            type='video/mp4'
            loop
            controls={false}
            muted
            autoPlay
            className='w-full h-full object-cover'
          />

          <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
            <div className='p-5'>
              <img src={logo} width="130px" alt="logo" />
            </div>
            <div className='shadow-2xl'>
            {/* <button className='bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none' type='button' onClick={() => login()}>
              <FcGoogle className='mr-4'/> Sign in with Google
            </button> */}
            <GoogleLogin
              onSuccess={credentialResponse => {
                const details = jwtDecode(credentialResponse.credential)
                localStorage.setItem('user', JSON.stringify(details))
                const { sub, name, picture } = details
                const doc = {
                  _id: sub,
                  _type: 'user',
                  userName: name,
                  image: picture
                }
                client.createIfNotExists(doc)
                  .then(() => {
                    navigate('/', { replace: true })
                  })
              }}

              onError={error => {
                console.log(error);
              }}
            />
            </div>
          </div>
        </div>
    </div>
  )
}
