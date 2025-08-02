import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthProvider';
import './LoginPage.css';
import ResidentialConst from '../../assets/video/ResidentialConstVideo.mp4'
import CommercialConst from '../../assets/video/CommercialConstVideo.mp4'
import GoogleButton from 'react-google-button'

export default function LoginPage() {
  const { signInWithGoogle, user } = useAuth();

  const videoRef = useRef(null)
  const [firstVideoPlay, setfirstVideoPlay] = useState(true)

  const handleEnded = () =>{
    setfirstVideoPlay(prev =>!prev)
  }
  useEffect(()=>{
    if (videoRef.current){
      videoRef.current.load();
      videoRef.current.playbackRate =1;
      videoRef.current.play();
    }
  }, [firstVideoPlay])


  useEffect(() => {
    if (user) {
      // Redirect to home page after login
      window.location.href = '/';
    }
  }, [user]);

  return (
    <div className="login-page">
      <div className='login-panel-left'>
        <h2>Steel<br /> AI Consultant</h2>
        <button className="custom-google-signin" onClick={signInWithGoogle}>
          <img src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw " alt="Google" className="google-icon" />
          Sign in with Google
        </button>
      </div>
      <div className='login-panel-right'>
        <video ref={videoRef} autoPlay muted playsInline onEnded={handleEnded} className='house-video'>
          <source src= {firstVideoPlay ? ResidentialConst : CommercialConst} type="video/mp4" alt="Construction"/>
        </video>
      </div>
    </div>
  );
}
