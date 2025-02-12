<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Anniversary Cake</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <h1>🎂 Happy Anniversary! 🎂</h1>

    <div class="cake-container">
        <div class="cake">
            <div class="candle">
                <div class="flame" id="flame"></div>
            </div>
        </div>
    </div>

    <button onclick="startBlowDetection()">Blow on Mic</button>

    <p id="message">🎉 Wishing you lots of love and happiness! 🎉</p>

    <script src="script.js"></script>
</body>
</html>

body {
    text-align: center;
    font-family: Arial, sans-serif;
    background-color: #ffe5b4;
}

h1 {
    color: darkred;
}

.cake-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    position: relative;
    animation: bounce 1s infinite alternate;
}

@keyframes bounce {
    0% { transform: translateY(0); }
    100% { transform: translateY(-10px); }
}

.cake {
    width: 200px;
    height: 100px;
    background: pink;
    border-radius: 10px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    position: relative;
}

.candle {
    width: 20px;
    height: 60px;
    background: red;
    position: absolute;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 5px;
}

.flame {
    width: 20px;
    height: 30px;
    background: orange;
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 50%;
    box-shadow: 0 0 10px yellow;
    animation: flicker 0.5s infinite alternate;
}

@keyframes flicker {
    from { transform: translateX(-50%) scale(1); opacity: 1; }
    to { transform: translateX(-50%) scale(1.1); opacity: 0.8; }
}

button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 16px;
    background-color: red;
    color: white;
    border: none;
    cursor: pointer;
}

#message {
    display: none;
    font-size: 20px;
    font-weight: bold;
    color: darkred;
    margin-top: 20px;
}
function startBlowDetection() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Your browser does not support microphone access.");
        return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
            const audioContext = new AudioContext();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);
            analyser.fftSize = 512;
            microphone.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            function checkBlow() {
                analyser.getByteFrequencyData(dataArray);
                let sum = dataArray.reduce((a, b) => a + b, 0);
                let average = sum / dataArray.length;

                console.log("Blow detection level:", average); // Debugging output

                if (average > 15) { // Adjusted threshold for better detection
                    document.getElementById("flame").style.animation = "fadeOut 1s forwards";
                    document.getElementById("message").style.display = "block";

                    stream.getTracks().forEach(track => track.stop()); // Stop mic
                } else {
                    requestAnimationFrame(checkBlow);
                }
            }

            checkBlow();
        })
        .catch(function (error) {
            alert("Microphone access is required to blow out the candle.");
        });
}

// Smooth flame fade-out animation
const style = document.createElement("style");
style.innerHTML = 
    @keyframes fadeOut {
        to { opacity: 0; transform: scale(0); }
    }
;
document.head.appendChild(style);
