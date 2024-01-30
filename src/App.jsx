// src/App.jsx

import { useState, useEffect } from 'react';
import Home from './components/pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { GoogleLogin } from '@react-oauth/google';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
// import { useGoogleOneTapLogin } from '@react-oauth/google';
import axios from 'axios';


function App() {

  const [ user, setUser ] = useState(null);
   
    const [profile, setProfile] = useState(() => {
      // Retrieve profile from localStorage on component mount
      const storedProfile = localStorage.getItem('profile');
      return storedProfile ? JSON.parse(storedProfile) : null;
    });

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {console.log('codeResponse:', codeResponse) ;  setUser(codeResponse)},
        onError: (error) => console.log('Login Failed:', error) 
    });
   
    useEffect(
        () => {
            if (user) {
              console.log(user, user.access_token)
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                      console.log("axios res:",res.data)
                        setProfile(res.data);
                        // Store the profile in localStorage
                        localStorage.setItem('profile', JSON.stringify(res.data));
                    })
                    .catch((err) => console.log(err));
            }
        },
        [ user ]
    );

    // // log out function to log the user out of google and set the profile array to null
    const logOut = () => {
        googleLogout();
        setProfile(null);
        // Clear the profile from localStorage
        localStorage.removeItem('profile');
    };


  return (
    <div className="d-flex flex-column align-items-center">
      <h1 className="text-center mb-4">YouTube Subtitles Extractor</h1>
      
    
      
     
{profile && Object.keys(profile).length > 0 ? (
                <Home />
                
            ) : (
                <button onClick={() => login()}>Sign in with Google 🚀 </button>
            )}
      
    </div>
  );
}

export default App;
