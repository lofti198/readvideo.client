// src/components/Home.jsx
import React, { useState } from 'react';
import YouTubeSubtitles from '../YoutubeSubtitles';

const Home = () => {
  const [youtubeVideoLink, setYoutubeVideoLink] = useState('');
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const handleGetCaptions = () => {
    setShowSubtitles(false);
    const videoId = extractVideoId(youtubeVideoLink);
    if (videoId) {
      setShowSubtitles(true);
      setWarningMessage(''); // Clear warning if videoId is successfully extracted
    } else { 
      setWarningMessage('Invalid YouTube link. Please enter a valid link.');
    }
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <h1 className="text-center mb-4">YouTube Subtitles Extractor</h1>

      <div className="mb-3">
        <label htmlFor="youtubeLink" className="form-label">Enter YouTube Video Link:</label>
        <input
          type="text"
          className="form-control"
          id="youtubeLink"
          value={youtubeVideoLink}
          onChange={(e) => {setYoutubeVideoLink(e.target.value);setWarningMessage('');}}
        />
      </div>

      <button
        type="button"
        className="btn btn-primary"
        onClick={handleGetCaptions}
      >
        Get Captions
      </button>

      {warningMessage && <p className="text-danger mt-2">{warningMessage}</p>}

      {showSubtitles && <YouTubeSubtitles videoId={extractVideoId(youtubeVideoLink)} />}
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
