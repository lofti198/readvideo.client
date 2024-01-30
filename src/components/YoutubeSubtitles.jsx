import { useState, useEffect,useMemo, useRef } from 'react';
import { Alert, Button } from 'react-bootstrap';

// Use environment variables to get the URLs
const URL_DEV = import.meta.env.VITE_API_URL_DEV;
const URL_PROD = import.meta.env.VITE_API_URL_PROD;
const URLBase = import.meta.env.MODE === 'production' ? URL_PROD : URL_DEV;

// console.log(import.meta.env.MODE, URLBase)
const language = "en"
const YouTubeSubtitles = ({ videoId ,handleGetCaptions}) => {
  const [transcript, setTranscript] = useState([]);

  const [showAlert, setShowAlert] = useState(false);
  const [notificationType, setNotificationType] = useState('');
  const [notificationText, setNotificationText] = useState('');

  const prevVideoIdRef = useRef();
  // Memoize the cachedTranscripts to keep it constant across renders
  const cachedTranscripts = useMemo(() => new Map(), []);

  
  const showNotification = (text, type) => {
    if(!type)type="info";

    setNotificationText(text);
    setNotificationType(type);
    setShowAlert(true);
    
    // Hide the alert after 2 seconds
    setTimeout(() => {
      setShowAlert(false);
      setNotificationText('');
      setNotificationType('');
    }, 2000);
  };


  // useEffect(() => {
  //   console.log("useeffect",videoId, prevVideoIdRef )
  //   if(prevVideoIdRef.current!==videoId)
  //     fetchTranscript();

  //   prevVideoIdRef.current = videoId;
  // },[videoId])

  

  const fetchTranscript = async () => {
    try {

      // Generate a unique key for caching based on both videoId and language
      const cacheKey = `${videoId}_${language}`;
      
      // Check if the transcript is already cached for the given key
      if (cachedTranscripts.has(cacheKey)) {
      
        const cachedData = cachedTranscripts.get(cacheKey);
        setTranscript(cachedData);
      } else {

        // Get user data from localStorage
        const userProfile = JSON.parse(localStorage.getItem('profile'));
        const userEmail = userProfile.email;
        const userFullname = userProfile.name;

        // Define the URL
        const URL = `${URLBase}/LoadSubtitles`;

        // Create a UserRequest object with videoId, language, email, and fullname
        const userRequest = {
          videoId: videoId, // Replace with the actual videoId
          language: language, // Replace with the actual language
          email: userEmail,
          fullname: userFullname,
        };
        console.log(`userRequyest:`,userRequest)
        
          // Fetch subtitles using POST request
          const result = await fetch(URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userRequest),
          });

          if (result.ok) {
            const captions = await result.json();
            showNotification('Transcript fetched successfully!');
            console.log("fetched", captions)
            setTranscript(captions);

            // Cache the transcript data for future use
            cachedTranscripts.set(cacheKey, captions);
          } else {
            // If the result is not okay, throw an exception
            throw new Error('Error fetching subtitles. HTTP status: ' + result.status);
          }
      
      }
    } catch (error) {
      showNotification('Error fetching subtitles!','error');
      console.error('Error fetching subtitles:', error);
    }
  };

  
  // Helper function to format offset (remove milliseconds)
  const formatOffset = (offset) => {
    // Assuming offset is in the format "00:00:02.6390000"
    const parts = offset.split('.');
    return parts[0];
  };

  
  // Handler to copy subtitles to clipboard
  const handleCopySubtitles = (additionalText) => {
    const subtitlesText = transcript.map((caption) => caption.Text).join('\n');
    const fullText = additionalText ? `${additionalText}\n${subtitlesText}` : subtitlesText;

    navigator.clipboard.writeText(fullText)
      .then(() => alert('Text copied to clipboard!'))
      .catch((err) => console.error('Error copying text:', err));
  };



  return (
    <div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={fetchTranscript}
      >
        Get Captions
      </button>

    {showAlert && (
        <Alert variant={notificationType === 'info' ? 'info' : (notificationType === 'warning' ? 'warning' : 'danger')} onClose={() => setShowAlert(false)} dismissible className="alert-top">
          {notificationText}
        </Alert>
      )}
      {transcript.length > 0 &&
      
      (
        <div>
      <p>
          <b>Operations with captions: </b>
          <span
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => handleCopySubtitles('')}
          >
            copy
          </span>, prompt GPT to 
          <span
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => handleCopySubtitles(`Given the following randomly broken YouTube subtitles and their corresponding offsets, please organize them into a coherent and logical text. 
            Focus on accurately determining where punctuation marks, especially sentence separators, should be located. Minimize rephrasing unless necessary to enhance clarity. 
            Consider the duration of each phrase and pauses between them to ensure the resulting text preserves the original meaning as closely as possible. 
            Additionally, divide the resulting text into logical paragraphs. 
            Aim for paragraphs of ideally 3-4 sentences each. This will help maintain readability and structure in the final output. 
            Also  (if it is possible) lets unite paragraphs into logical text sections of 2-5 paragraphs (each having its header).')}
            `)}
            >
            turn in text
          </span>
          {/* , 
          <span
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => handleCopySubtitles('Summarize:')}
          >
            summarize
          </span> */}
        </p>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Offset</th>
              <th scope="col">Text</th>
            </tr>
          </thead>
          <tbody>
            {transcript.map((caption, index) => (
              <tr key={index}>
                <td>{formatOffset(caption.Offset)}</td>
                <td>{caption.Text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
      
    </div>
  );
};

export default YouTubeSubtitles;
