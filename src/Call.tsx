import React, { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import useAgora from "./utility/useAgora";
import MediaPlayer from "./components/MediaPlayer";
import "./Call.css";
import Canvas from "./Canvas";

const client = AgoraRTC.createClient({ codec: "h264", mode: "rtc" });

function Call() {
  const [appid, setAppid] = useState("");
  const [token, setToken] = useState("");
  const [channel, setChannel] = useState("");
  const {
    localAudioTrack,
    localVideoTrack,
    leave,
    join,
    joinState,
    remoteUsers,
  } = useAgora(client);

  useEffect(() => {
    join(
      "c03db604c122416bb66808238ef30cde",
      "Test",
      "006e627c11c6e35488fa91ca886ca1bbe45IADwDirwFBe4reSGwGe7pR8Ppz+S31nfX7l5rj+uMODBVjLRTXgAAAAAEAAE2jd4EifFYgEAAQATJ8Vi"
    );
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [dimension, setDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const getStreamFromCanvas = () => {
    const canvasElement: HTMLCanvasElement = canvasRef!.current!;
    let stream = (canvasElement as HTMLCanvasElement).captureStream(25);
  };

  const [videoData, setVideoData] = useState<any>([]);

  const getVideoData = () => {
    const videoCollection =
      document.getElementsByClassName("agora_video_player");
    setVideoData(videoCollection);
    handleVideo();
  };

  let video = document.createElement("video");
  video.src = "http://techslides.com/demos/sample-videos/small.mp4";
  video.autoplay = true;
  video.loop = true;
  video.autoplay = true;
  video.muted = true;

  const handleVideo = () => {
    video.play();
    update();
  };

  const update = () => {
    const ctx = canvasRef!.current!.getContext("2d");
    ctx!.font = "30px Arial";
    ctx!.fillText("Agora Conference", dimension.width / 3, 50);
    ctx!.drawImage(video, 400, 150, 500, 500);
    requestAnimationFrame(update);
  };

  useEffect(() => {
    setTimeout(() => {
      getStreamFromCanvas();
      getVideoData();
    }, 0);
  }, [videoData]);

  return (
    <>
      <div className="call" style={{ display: "none" }}>
        <form className="call-form">
          <label>
            AppID:
            <input
              type="text"
              name="appid"
              onChange={(event) => {
                setAppid(event.target.value);
              }}
            />
          </label>
          <label>
            Token(Optional):
            <input
              type="text"
              name="token"
              onChange={(event) => {
                setToken(event.target.value);
              }}
            />
          </label>
          <label>
            Channel:
            <input
              type="text"
              name="channel"
              onChange={(event) => {
                setChannel(event.target.value);
              }}
            />
          </label>
          <div className="button-group">
            <button
              id="join"
              type="button"
              className="btn btn-primary btn-sm"
              disabled={joinState}
              onClick={() => {
                join(appid, channel, token);
              }}
            >
              Join
            </button>
            <button
              id="leave"
              type="button"
              className="btn btn-primary btn-sm"
              disabled={!joinState}
              onClick={() => {
                leave();
              }}
            >
              Leave
            </button>
          </div>
        </form>
        <div className="player-container">
          <div className="local-player-wrapper">
            <p className="local-player-text">
              {localVideoTrack && `localTrack`}
              {joinState && localVideoTrack ? `(${client.uid})` : ""}
            </p>
            <MediaPlayer
              videoTrack={localVideoTrack}
              audioTrack={undefined}
            ></MediaPlayer>
          </div>
          {remoteUsers.map((user) => (
            <div className="remote-player-wrapper" key={user.uid}>
              <p className="remote-player-text">{`remoteVideo(${user.uid})`}</p>
              <MediaPlayer
                videoTrack={user.videoTrack}
                audioTrack={user.audioTrack}
              ></MediaPlayer>
            </div>
          ))}
        </div>
      </div>

      {videoData.length > 0 ? <Canvas data={videoData} /> : null}

      <canvas
        ref={canvasRef}
        width={dimension.width}
        height={dimension.height}
      ></canvas>
    </>
  );
}

export default Call;

declare global {
  interface HTMLCanvasElement {
    captureStream(frameRate?: number): MediaStream;
  }
}
