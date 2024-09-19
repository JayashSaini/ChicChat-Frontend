import React, { useEffect, useState } from "react";

const RequestToJoinRoom: React.FC = () => {
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null); // New state for video errors
  const [audioError, setAudioError] = useState<boolean>(false); // New state for audio errors
  const [mediaSupported, setMediaSupported] = useState<boolean>(true); // New state for media support
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false); // New state for permission issues

  useEffect(() => {
    // Check if browser supports media devices
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Request video and audio by default
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          setStream(mediaStream);
          const videoElement = document.getElementById(
            "userVideo"
          ) as HTMLVideoElement;
          if (videoElement) {
            videoElement.srcObject = mediaStream;
          }
        })
        .catch((error) => {
          if (error.name === "NotFoundError") {
            setVideoError("No camera found"); // Set video error message
          }
          if (error.name === "NotReadableError") {
            setAudioError(true); // Disable audio button if no audio input
          }
          if (
            error.name === "PermissionDeniedError" ||
            error.name === "NotAllowedError"
          ) {
            setPermissionDenied(true); // Set permission denied flag
            setVideoError("Permission to access camera and microphone denied.");
          }
        });
    } else {
      // Handle case when getUserMedia is not supported
      setMediaSupported(false);
      setVideoError("Your device or browser does not support media access.");
    }

    return () => {
      // Cleanup media stream when component unmounts
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
        setIsAudioOn(!isAudioOn);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-textPrimary px-4">
      <div className="relative w-full max-w-3xl bg-cardBg rounded-lg shadow-lg">
        {/* Video Container */}
        <div className="w-full h-56 bg-backgroundTertiary rounded-lg overflow-hidden flex items-center justify-center">
          {videoError || !mediaSupported ? (
            <div className="text-center text-xl text-error h-full flex items-center justify-center">
              {videoError || "Media access not supported on your device"}
            </div>
          ) : (
            <video
              id="userVideo"
              autoPlay
              muted
              className="w-full h-full object-cover"
            ></video>
          )}
        </div>

        {/* Media Access Notification */}
        {permissionDenied && (
          <div className="p-4 bg-red-600 text-white rounded-md mt-4">
            <p className="text-lg">
              Please allow media access to use video and audio features. Go to
              your browser settings to enable access for this site.
            </p>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex flex-wrap justify-center gap-4 p-4 mt-4">
          {/* Toggle Video */}
          <button
            onClick={toggleVideo}
            className={`px-4 py-2 rounded-full font-semibold ${
              isVideoOn ? "bg-danger" : "bg-gray-700"
            } hover:bg-opacity-90`}
            disabled={!!videoError || !mediaSupported || permissionDenied} // Disable if no video, no media support, or permission denied
          >
            {isVideoOn ? "Turn Off Video" : "Turn On Video"}
          </button>

          {/* Toggle Audio */}
          <button
            onClick={toggleAudio}
            className={`px-4 py-2 rounded-full font-semibold ${
              isAudioOn ? "bg-success" : "bg-gray-700"
            } hover:bg-opacity-90`}
            disabled={audioError || !mediaSupported || permissionDenied} // Disable if no audio, no media support, or permission denied
          >
            {isAudioOn ? "Turn Off Audio" : "Turn On Audio"}
          </button>

          {/* Request to Join */}
          <button className="px-4 py-2 bg-buttonBg text-buttonText rounded-full font-semibold hover:bg-opacity-90">
            Request to Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestToJoinRoom;
