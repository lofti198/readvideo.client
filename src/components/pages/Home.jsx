// src/components/Home.jsx
import React, { useState, useEffect } from 'react';
import YouTubeSubtitles from '../YoutubeSubtitles';

const Home = () => {
  const [youtubeVideoLink, setYoutubeVideoLink] = useState('');
  const [showSubtitleBlock, setShowSubtitleBlock] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [videoId, setVideoId] = useState('');

  useEffect(() => {
    // Logic to handle changes in youtubeVideoLink
    setShowSubtitleBlock(false);
    setWarningMessage('');

    const videoIdTemp = extractVideoId(youtubeVideoLink);
    console.log("useEffect", videoIdTemp);
    if (videoIdTemp) {
      setShowSubtitleBlock(true);
      setVideoId(videoIdTemp)
      setWarningMessage(''); // Clear warning if videoId is successfully extracted
    } else {
      if(youtubeVideoLink)setWarningMessage('Invalid YouTube link. Please enter a valid link.');
    }
  }, [youtubeVideoLink]);

  const handleGetCaptions = () => {
    console.log("handleGetCaptions")
  };

  return (
    <div className="d-flex flex-column align-items-center">
      
      <div className="mb-3">
        <label htmlFor="youtubeLink" className="form-label">Enter YouTube Video Link:</label>
        <input
          type="text"
          className="form-control wide-input"
          id="youtubeLink"
          value={youtubeVideoLink}
          onChange={(e) => {setYoutubeVideoLink(e.target.value);}}
        />
      </div>


      {warningMessage && <p className="text-danger mt-2">{warningMessage}</p>}

      {showSubtitleBlock && <YouTubeSubtitles videoId={videoId} handleGetCaptions={handleGetCaptions} />}
    </div>
  );
};

// Helper function to extract videoId from YouTube link
const extractVideoId = (link) => {
  // Logic to extract videoId from YouTube link goes here
  // For simplicity, let's assume the link is in the format: https://www.youtube.com/watch?v=VIDEO_ID
  const match = link.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : '';
};

export default Home;
