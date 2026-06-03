// ==========================================
// ==========================================
const CORRECT_PIN = "2107";     // Mã PIN mở khóa

const VID_HEADER = "Family Video";
const VID_SRC = "family.mp4";        // Tên file video
const VID_TITLE = "KHOẢNH KHẮC GIA ĐÌNH";
const GREETING = "Con chào ba mẹ,";
const MESSAGE = "Cảm ơn ba mẹ đã luôn yêu thương và ủng hộ con trong suốt quá trình học tập và trưởng thành.";

let currentPin = "";
let textToType = MESSAGE;

// --- LOGIC BÀN PHÍM SỐ ---
function updateDots() {
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
        if (index < currentPin.length) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }
    });
}

function addNumber(num) {
    if (currentPin.length < 4) {
        currentPin += num;
        updateDots();
        document.getElementById("error-msg").style.display = "none";

        // Tự động kiểm tra khi đủ 4 số
        if (currentPin.length === 4) {
            setTimeout(checkPin, 200);
        }
    }
}

function clearPin() {
    currentPin = "";
    updateDots();
    document.getElementById("error-msg").style.display = "none";
}

function checkPin() {
    if (currentPin === CORRECT_PIN) {
        // Ẩn màn hình đăng nhập, hiện màn hình chính
        document.getElementById("login-screen").classList.add("hidden");
        document.getElementById("main-screen").classList.remove("hidden");

        // Gắn thông tin vào giao diện
        document.getElementById("vid-header").innerText = VID_HEADER;
        document.getElementById("my-video").src = VID_SRC;
        document.getElementById("vid-title").innerText = VID_TITLE;
        document.getElementById("letter-greeting").innerText = GREETING;
    } else {
        document.getElementById("error-msg").style.display = "block";
        currentPin = "";
        updateDots();
    }
}

let typeIndex = 0;
let isTyping = false;

function startTypewriter() {
    if (isTyping) return;
    const textElement = document.getElementById("typewriter-text");
    textElement.innerHTML = "";
    typeIndex = 0;
    isTyping = true;

    function type() {
        if (typeIndex < textToType.length) {
            textElement.innerHTML += textToType.charAt(typeIndex);
            typeIndex++;
            setTimeout(type, 80);
        } else {
            isTyping = false;
        }
    }
    type();
}

// --- LOGIC CUSTOM VIDEO PLAYER ---
const video = document.getElementById("my-video");
const playBtn = document.getElementById("play-pause-btn");
const progressBar = document.getElementById("progress-bar");
const currentTimeDisplay = document.getElementById("current-time");
const durationDisplay = document.getElementById("duration");

function togglePlay() {
    if (video.paused) {
        video.play();
        playBtn.innerHTML = "⏸";
        playBtn.style.paddingLeft = "0px";
    } else {
        video.pause();
        playBtn.innerHTML = "▶";
        playBtn.style.paddingLeft = "5px";
    }
}

function seekVideo(seconds) {
    video.currentTime += seconds;
}

function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    if (sec < 10) sec = "0" + sec;
    return min + ":" + sec;
}

video.addEventListener("loadedmetadata", () => {
    progressBar.max = Math.floor(video.duration);
    durationDisplay.innerText = formatTime(video.duration);
});

video.addEventListener("timeupdate", () => {
    progressBar.value = Math.floor(video.currentTime);
    currentTimeDisplay.innerText = formatTime(video.currentTime);
});

progressBar.addEventListener("input", () => {
    video.currentTime = progressBar.value;
});

video.addEventListener("ended", () => {
    playBtn.innerHTML = "▶";
    playBtn.style.paddingLeft = "5px";
});

// --- LOGIC FULLSCREEN (dùng chung cho Gift & Picture) ---
function toggleFullscreen(boxId, iconId) {
    const box = document.getElementById(boxId);
    const expandIcon = document.getElementById(iconId);
    box.classList.toggle("fullscreen");
    if (box.classList.contains("fullscreen")) {
        expandIcon.innerHTML = "🗗";
    } else {
        expandIcon.innerHTML = "⛶";
    }
}

// --- LOGIC MODAL, TYPEWRITER & MUSIC ---

// Tự động bật nhạc Intro ngay khi chạm vào web
let isMusicStarted = false;
document.body.addEventListener('click', () => {
    if (!isMusicStarted) {
        const introMusic = document.getElementById("intro-music");
        introMusic.volume = 0.5;
        introMusic.play().catch(e => console.log("Đang chờ tương tác..."));
        isMusicStarted = true;
    }
});

function openModal(modalId) {
    document.getElementById(modalId).classList.remove("hidden");
    const introMusic = document.getElementById("intro-music");

    if (modalId === 'letter-modal') {
        startTypewriter();
    }

    if (modalId === 'video-modal' || modalId === 'gift-modal' || modalId === 'picture-modal') {
        introMusic.pause();
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add("hidden");
    const introMusic = document.getElementById("intro-music");

    if (modalId === 'video-modal') {
        video.pause();
        document.getElementById("play-pause-btn").innerHTML = "▶";
        introMusic.play();
    }

    if (modalId === 'gift-modal') {
        introMusic.play();
        // Reset lại iframe để tắt nhạc hoa và chuẩn bị cho lần mở sau
        document.querySelector("#flower-container iframe").src = "Gift.html";
        // Đặt lại icon fullscreen nếu đang fullscreen
        const giftBox = document.getElementById("gift-box");
        if (giftBox.classList.contains("fullscreen")) {
            giftBox.classList.remove("fullscreen");
            document.getElementById("expand-icon").innerHTML = "⛶";
        }
    }

    if (modalId === 'picture-modal') {
        introMusic.play();
        // Reset lại iframe
        document.querySelector("#picture-container iframe").src = "index-picture.html";
        // Đặt lại icon fullscreen nếu đang fullscreen
        const pictureBox = document.getElementById("picture-box");
        if (pictureBox.classList.contains("fullscreen")) {
            pictureBox.classList.remove("fullscreen");
            document.getElementById("picture-expand-icon").innerHTML = "⛶";
        }
    }
}