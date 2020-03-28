var video = document.querySelector("#videoElement");
var video2 = document.querySelector("#videoElement2");
var startBtn = document.querySelector("#start");
var stopBtn = document.querySelector("#stop");
var btnContainer = document.querySelector(".btn-container");
var mediaRecorder = null;
var chunks = [];
var mediaSource;
var sourceBuffer;
var buffer;

async function handleDataAvailable(e) {
  console.log("push chunks");
  chunks.push(e.data);

  var blob = new Blob(chunks, { type: "video/x-matroska;codecs=avc1" });
  chunks = [];

  buffer = await blob.arrayBuffer();
  mediaSource = new MediaSource();
  video2.src = URL.createObjectURL(mediaSource);
  mediaSource.addEventListener("sourceopen", function() {
    sourceBuffer = mediaSource.addSourceBuffer();
    sourceBuffer.addEventListener("updateend", function() {
      mediaSource.endOfStream();
      video2.play();
    });
    sourceBuffer.appendBuffer(buffer);
  });
  saveVideo(blob);
}

function saveVideo(data) {
  const link = document.createElement("a");
  const btn = document.createElement("button");
  link.href = URL.createObjectURL(data);
  link.download = "Video.mkv";
  btn.innerText = "save";
  link.appendChild(btn);
  btnContainer.appendChild(link);
}

function init() {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1280, height: 720 }, audio: true })
      .then(function(stream) {
        video.srcObject = stream;
        video.muted = true;
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.addEventListener("dataavailable", handleDataAvailable);
      })
      .catch(function(error) {
        console.log("Something went wrong!");
        console.dir(error);
      });
  }

  startBtn.addEventListener("click", function(e) {
    if (mediaRecorder) {
      mediaRecorder.start();
      console.log(mediaRecorder.state);
    } else {
      console.log("MediaRecorder not exist");
    }
  });

  stopBtn.addEventListener("click", function(e) {
    if (mediaRecorder) {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
    } else {
      console.log("MediaRecorder not exist");
    }
  });
}

init();
