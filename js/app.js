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

var i = 0;
async function handleDataAvailable(e) {
  try {
    console.log("push chunks");
    chunks.push(e.data);

    var blob = new Blob(chunks, { type: 'video/webm;codecs=vp8,opus' });
    chunks = [];

    buffer = await blob.arrayBuffer();
    mediaSource = new MediaSource();
    video2.src = URL.createObjectURL(mediaSource);
    mediaSource.addEventListener("sourceopen", async function () {
      sourceBuffer = mediaSource.addSourceBuffer('video/webm;codecs=vp8,opus');
      sourceBuffer.mode = "sequence";
      sourceBuffer.addEventListener("updateend", function() {
        console.log("update end");
        if(i++ < 3) {
          sourceBuffer.appendBuffer(buffer);
          return;
        }
        mediaSource.endOfStream(); // 동영상 스트림이 끝났음을 알림
        video2.play();
      });
      sourceBuffer.appendBuffer(buffer);
    });
    saveVideo(blob);
  } catch(err) {
    console.log("삐삐");
    console.error(err);
  }
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
      .then(function (stream) {
        video.srcObject = stream;
        video.muted = true;
        const options = {
          mimeType: 'video/webm;codecs=vp8'
        }
        mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorder.addEventListener("dataavailable", handleDataAvailable);
      })
      .catch(function (error) {
        console.log("Something went wrong!");
        console.dir(error);
      });
  }

  startBtn.addEventListener("click", function (e) {
    if (mediaRecorder) {
      mediaRecorder.start();
      console.log(mediaRecorder.state);
    } else {
      console.log("MediaRecorder not exist");
    }
  });

  stopBtn.addEventListener("click", function (e) {
    if (mediaRecorder) {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
    } else {
      console.log("MediaRecorder not exist");
    }
  });
}

init();
