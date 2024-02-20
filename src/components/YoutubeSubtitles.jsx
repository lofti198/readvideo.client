import { useState, useEffect,useMemo, useRef } from 'react';
import { Alert, Button } from 'react-bootstrap';

// Use environment variables to get the URLs
const URL_DEV = import.meta.env.VITE_API_URL_DEV//"https://localhost:7271/api/youtubesubtitles"// import.meta.env.VITE_API_URL_DEV; //
const URL_PROD = import.meta.env.VITE_API_URL_PROD;
const URLBase = import.meta.env.MODE === 'production' ? URL_PROD : URL_DEV;

console.log(import.meta.env.MODE, URLBase)
const language = ""
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
        // const jwtToken = localStorage.getItem('jwtToken'); // Retrieve the JWT token from localStorage

        console.log(userProfile)
        // console.log(jwtToken)
      
        // Define the URL
        const URL = `${URLBase}?videoId=${videoId}&minspan=${2000}`;
        console.log(URL)
        // youtubesubtitles/LoadTextBlocks?videoId=fhM0V2N1GpY&language=en&minspan=2000
        const response = await fetch(URL, {
          method: 'GET', // Changed from POST to GET
          headers: {
            'Content-Type': 'application/json',
            'Email': userProfile.email,
           
            // 'Authorization': `Bearer ${jwtToken}`, // Include the JWT token in the Authorization header
          },
          // No body is needed for a GET request
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
       
            const captions = await response.json();
            showNotification('Transcript fetched successfully!');
            console.log("fetched", captions)
            setTranscript(captions);

            // Cache the transcript data for future use
            cachedTranscripts.set(cacheKey, captions);
         
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
      .then(() => showNotification('All subtitles copied to clipboard!'))
      .catch((err) => console.error('Error copying text:', err));
  };


  const copyCellToClipboard = (text) => {
    navigator.clipboard.writeText(`Subtitle text block from video 'VIDEO_NAME' at URL:
${text}

`)

      .then(() => showNotification('Text copied to clipboard!'))
      .catch((err) => console.error('Failed to copy text to clipboard:', err));
  };


  return (
    <div>
      
    {showAlert && (
        <Alert variant={notificationType === 'info' ? 'info' : (notificationType === 'warning' ? 'warning' : 'danger')} onClose={() => setShowAlert(false)} dismissible className="alert-bottom fixed-bottom">
          {notificationText}
        </Alert>
      )}
      {
        transcript.length==0 && 
        (  <button
          type="button"
          className="btn btn-primary center-button"
          onClick={fetchTranscript}
        >
          Get Captions
        </button>)
      }
     

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
          </span>, prompt GPT to:&nbsp;  
          <span
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => handleCopySubtitles(`Given the following randomly broken YouTube subtitles and their corresponding offsets (if available), please organize them into a coherent and logical text. 
Focus on accurately determining where punctuation marks, especially sentence separators, should be located. Minimize rephrasing unless necessary to enhance clarity. 
Consider the duration of each phrase and pauses between them to ensure the resulting text preserves the original meaning as closely as possible. 
Additionally, divide the resulting text into logical paragraphs. 
Aim for paragraphs of ideally 3-4 sentences each. This will help maintain readability and structure in the final output. 
Also  (if it is possible) lets unite paragraphs into logical text sections of 2-5 paragraphs (each having its header).
The source text given below:`)}
            >
            turn in text
          </span>,&nbsp;  
          <span
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => handleCopySubtitles(`Given the following randomly broken YouTube subtitles and their corresponding offsets, please organize them into a short summary with main ideas.
The source text given below:`)}
            >
            make text summary
          </span>
          {/* , 
          <span
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => handleCopySubtitles('Summarize:')}
          >
            summarize
          </span> */}
        </p>
        <table className="fixed-width-table">
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
                <td class="caption-text" onDoubleClick={() => copyCellToClipboard(caption.Text)} >{caption.Text}</td>
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
