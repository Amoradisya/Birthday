// ==========================================
// KONSTANTA & VARIABEL GLOBAL
// ==========================================
const CORRECT_PIN = "070999";
let currentPin = "";

const purpleFlowerImages = [
    'purple-flower1.png',
    'purple-flower2.png'
];

let blownCount = 0;

const songsList = [
    {
        title: "Bergema Sampai Selamanya",
        artist: "Nadhif Basalamah",
        src: "bergema-sampai-selamanya.mp4"
    },
    {
        title: "Perahu Kertas",
        artist: "Tulus",
        src: "perahu-kertas.mpeg"
    },
    {
        title: "1000x",
        artist: "Ghea Indrawari",
        src: "1000x.mp4"
    }
];

let currentSongIndex = 0;
let isPlaying = false;

// Helper aman panggilan Confetti (Library canvas-confetti)
function triggerConfetti(options) {
    if (typeof confetti === 'function') {
        confetti(options);
    }
}

// ==========================================
// INITIALIZATION & TRANSISI AWAL
// ==========================================
window.addEventListener("DOMContentLoaded", () => {
    // 1. Partikel Background & Petals
    createFloatingParticles();
    createPetals();

    // 2. TRANSISI: Loading Screen -> Papan PIN
    setTimeout(() => {
        const loadingWrapper = document.getElementById("loadingWrapper");
        const contentWrapper = document.getElementById("contentWrapper");

        if (loadingWrapper) {
            loadingWrapper.style.opacity = "0";
            setTimeout(() => {
                loadingWrapper.style.display = "none";
                if (contentWrapper) contentWrapper.classList.remove("hidden");
            }, 800);
        }
    }, 3000);

    // 3. Event Listener untuk Tombol On-screen PIN & Kado
    initPinButtons();
    initGiftListener();

    // 4. Dukungan Keyboard Desktop untuk PIN
    window.addEventListener("keydown", (e) => {
        const contentWrapper = document.getElementById("contentWrapper");
        if (contentWrapper && contentWrapper.classList.contains("hidden")) return;

        if (e.key >= "0" && e.key <= "9") {
            pressNum(e.key);
        } else if (e.key === "Backspace" || e.key === "Delete") {
            clearPin();
        } else if (e.key === "Enter") {
            submitPin();
        }
    });

    // 5. Inisialisasi Fitur
    initCandles();
    initScrollObserver();
    initFlowerGlow();
    initPolaroidMemories();
    initGratitudeJar();
    initMusicPlayer();
});

// ==========================================
// LOGIKA PARTIKEL & KELOPAK BUNGA GUGUR
// ==========================================
function createFloatingParticles() {
    const container = document.getElementById("particles-container");
    if (!container) return;

    setInterval(() => {
        const particle = document.createElement("div");
        particle.classList.add("particle");

        const size = Math.random() * 8 + 6;
        particle.style.width = `${size}px`;
        particle.style.height = `${size + 4}px`;
        particle.style.left = `${Math.random() * 100}vw`;

        const duration = Math.random() * 4 + 5;
        particle.style.animationDuration = `${duration}s`;

        container.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    }, 400);
}

function createPetals() {
    const container = document.getElementById('petal-container');
    if (!container) return;

    const totalPetals = 18;

    for (let i = 0; i < totalPetals; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal');

        const size = Math.random() * 8 + 10;
        petal.style.width = `${size}px`;
        petal.style.height = `${size * 1.3}px`;
        petal.style.left = `${Math.random() * 100}%`;

        const fallDuration = Math.random() * 7 + 7;
        const swayDuration = Math.random() * 3 + 3;
        const delay = Math.random() * 10;

        petal.style.animationDuration = `${fallDuration}s, ${swayDuration}s`;
        petal.style.animationDelay = `${delay}s, ${delay}s`;

        container.appendChild(petal);
    }
}

// ==========================================
// LOGIKA PIN & TRANSISI PIN -> KADO
// ==========================================
function initPinButtons() {
    const pinKeys = document.querySelectorAll("[data-key]");
    pinKeys.forEach(key => {
        key.addEventListener("click", () => {
            const keyValue = key.getAttribute("data-key");
            if (keyValue === "clear") {
                clearPin();
            } else if (keyValue === "submit") {
                submitPin();
            } else {
                pressNum(keyValue);
            }
        });
    });
}

function pressNum(num) {
    if (currentPin.length < 6) {
        currentPin += num;
        updateDots();
    }
}

function clearPin() {
    currentPin = "";
    updateDots();
}

function updateDots() {
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
        if (index < currentPin.length) {
            dot.classList.add("filled");
        } else {
            dot.classList.remove("filled");
        }
    });
}

function submitPin() {
    const pinCard = document.querySelector(".pin-card");

    if (currentPin === CORRECT_PIN) {
        const contentWrapper = document.getElementById("contentWrapper");
        const giftWrapper = document.getElementById("giftWrapper");

        if (contentWrapper) {
            contentWrapper.classList.remove("fade-in");
            contentWrapper.classList.add("fade-out");
        }

        setTimeout(() => {
            if (contentWrapper) contentWrapper.classList.add("hidden");
            if (giftWrapper) {
                giftWrapper.classList.remove("hidden");
                void giftWrapper.offsetWidth;
                giftWrapper.classList.add("fade-in");
            }
        }, 800);
    } else if (pinCard) {
        pinCard.classList.add("shake");
        setTimeout(() => {
            pinCard.classList.remove("shake");
            clearPin();
        }, 400);
    }
}

// ==========================================
// LOGIKA KADO & BURST BUNGA PURPLE
// ==========================================
function initGiftListener() {
    const gift = document.getElementById("purpleGift");
    if (gift) {
        gift.addEventListener("click", openGift);
    }
}

function openGift() {
    const gift = document.getElementById("purpleGift");
    const giftWrapper = document.getElementById("giftWrapper");
    const mainWrapper = document.getElementById("mainWrapper");

    if (gift) gift.classList.add("gift-sway");

    setTimeout(() => {
        if (giftWrapper) {
            giftWrapper.classList.remove("fade-in");
            giftWrapper.classList.add("fade-out");
        }

        setTimeout(() => {
            if (giftWrapper) giftWrapper.classList.add("hidden");
            if (mainWrapper) {
                mainWrapper.classList.remove("hidden");
                void mainWrapper.offsetWidth;
                mainWrapper.classList.remove("fade-out");
                mainWrapper.classList.add("fade-in");

                initScrollObserver();
            }

            triggerPurpleFlowerBurst();

            setTimeout(() => {
                showBirthdayLetter();
            }, 3200);

        }, 800);
    }, 1000);
}

function triggerPurpleFlowerBurst() {
    const container = document.getElementById("flower-burst-container");
    if (!container) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const maxScreenRadius = Math.sqrt(Math.pow(window.innerWidth / 2, 2) + Math.pow(window.innerHeight / 2, 2));
    const totalFlowers = 48;

    for (let i = 0; i < totalFlowers; i++) {
        const img = document.createElement("img");
        img.classList.add("custom-flower-burst");
        img.src = purpleFlowerImages[Math.floor(Math.random() * purpleFlowerImages.length)];

        const angle = (i / totalFlowers) * Math.PI * 2 + (Math.random() * 0.2 - 0.1);
        const distanceFactor = Math.random() * 0.75 + 0.40;
        const distance = maxScreenRadius * distanceFactor;

        const vx = Math.cos(angle) * distance;
        const vy = Math.sin(angle) * distance;
        const endRot = (Math.random() - 0.5) * 600;
        const endScale = Math.random() * 0.9 + 1.6;

        const size = Math.random() * 60 + 90; 
        img.style.width = `${size}px`;
        img.style.height = `auto`;

        img.style.setProperty("--startX", `${centerX - (size / 2)}px`);
        img.style.setProperty("--startY", `${centerY - (size / 2)}px`);
        img.style.setProperty("--vx", `${vx}px`);
        img.style.setProperty("--vy", `${vy}px`);
        img.style.setProperty("--endRot", `${endRot}deg`);
        img.style.setProperty("--endScale", endScale);

        const duration = Math.random() * 0.8 + 2.2; 
        img.style.animationDuration = `${duration}s`;

        container.appendChild(img);

        setTimeout(() => {
            img.remove();
        }, duration * 1000);
    }
}

function showBirthdayLetter() {
    const mainCardWrapper = document.getElementById("mainCardWrapper");
    if (!mainCardWrapper) return;
    
    mainCardWrapper.classList.remove("hidden");
    mainCardWrapper.style.display = "flex";
    setTimeout(() => {
        mainCardWrapper.style.opacity = "1";
        mainCardWrapper.style.transform = "translateY(0) scale(1)";
    }, 50);

    const closeBtn = mainCardWrapper.querySelector(".close-letter-btn") || mainCardWrapper.querySelector(".close-btn");
    if (closeBtn) {
        closeBtn.onclick = () => hideBirthdayLetter();
    }

    mainCardWrapper.onclick = (e) => {
        if (e.target === mainCardWrapper) {
            hideBirthdayLetter();
        }
    };
}

function hideBirthdayLetter() {
    const mainCardWrapper = document.getElementById("mainCardWrapper");
    if (!mainCardWrapper) return;

    mainCardWrapper.style.opacity = "0";
    mainCardWrapper.style.transform = "translateY(20px) scale(0.95)";

    setTimeout(() => {
        mainCardWrapper.classList.add("hidden");
        mainCardWrapper.style.display = "none";
    }, 300);
}

// ==========================================
// 1. LOGIKA LILIN & CONFETTI
// ==========================================
function initCandles() {
    const candleItems = document.querySelectorAll('.candle-item');
    const instructionBadge = document.querySelector('.instruction-badge');

    candleItems.forEach(candle => {
        candle.addEventListener('click', () => {
            const flame = candle.querySelector('.flame');

            if (!flame || flame.classList.contains('off')) return;

            flame.classList.add('off');
            blownCount++;

            if (instructionBadge) {
                instructionBadge.textContent = `Tap setiap lilin satu per satu! 🎂 (${blownCount}/3)`;
            }

            const rect = candle.getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = rect.top / window.innerHeight;

            triggerConfetti({
                particleCount: 80,
                spread: 60,
                origin: { x: x, y: y },
                colors: ['#ffb4a2', '#e5989b', '#b5838d', '#ffffff', '#ffd166']
            });

            if (blownCount === 3 && instructionBadge) {
                instructionBadge.textContent = 'Semua lilin ditiup! Scroll ke bawah 📜';
            }
        });
    });
}

// ==========================================
// 2. OBSERVER FADE SCROLL
// ==========================================
function initScrollObserver() {
    const sections = document.querySelectorAll('.scroll-fade-section');
    const observerOptions = {
        root: null,
        threshold: 0.15
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            } else {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(25px) scale(0.97)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(25px) scale(0.97)';
        section.style.transition = 'opacity 0.7s cubic-bezier(0.25, 1, 0.5, 1), transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)';
        sectionObserver.observe(section);
    });
}

// ==========================================
// 3. EFEK BUNGA BERSINAR & TOAST
// ==========================================
function initFlowerGlow() {
    const flowerItems = document.querySelectorAll('.flower-item');
    const toastText = document.getElementById('toastText');

    flowerItems.forEach(flower => {
        flower.addEventListener('click', () => {
            flowerItems.forEach(f => f.classList.remove('glowing'));
            flower.classList.add('glowing');

            const msg = flower.getAttribute('data-msg');
            if (toastText) toastText.textContent = msg;

            const rect = flower.getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;

            triggerConfetti({
                particleCount: 25,
                spread: 40,
                startVelocity: 15,
                origin: { x: x, y: y },
                colors: ['#ffb4a2', '#ffffff', '#ffd166']
            });
        });
    });
}

// ==========================================
// 4. LOGIKA POLAROID MEMORIES
// ==========================================
function initPolaroidMemories() {
    const memoryCards = document.querySelectorAll('.memory-card');

    memoryCards.forEach(card => {
        card.addEventListener('click', () => {
            if (card.classList.contains('revealed')) return;

            const imgSrc = card.getAttribute('data-img');
            const title = card.getAttribute('data-title');
            const desc = card.getAttribute('data-desc');

            const imgEl = card.querySelector('.polaroid-img');
            const titleEl = card.querySelector('.polaroid-title');
            const textEl = card.querySelector('.polaroid-text');

            if (imgEl) imgEl.src = imgSrc;
            if (titleEl) titleEl.textContent = title;
            if (textEl) textEl.textContent = desc;

            card.classList.add('revealed');

            const rect = card.getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;

            triggerConfetti({
                particleCount: 35,
                spread: 50,
                origin: { x: x, y: y },
                colors: ['#ffb4a2', '#ffffff', '#e5989b']
            });
        });
    });
}

// ==========================================
// 5. LOGIKA GRATITUDE JAR
// ==========================================
function initGratitudeJar() {
    const gratitudeNotes = [
        "Senang kenal kamu deh Mba...",
        "Aku pernah nemu quotes begini, sebanyak apapun rasa sedih, semoga satu hal baik tetap membuat kamu tersenyum.",
        "Gelooo ihhh, aku bisa nulis ini wkwk. Do what you love, and love what you do!",
        "Semoga takdir baik menyertaimu selalu, Mba.",
        "Teramini, selalu doamu.",
        "Still healthy, Mr Eko.",
        "Dimana pun itu, semoga setiap pijakan kamu memiliki takdir baik.",
        "Sehat selalu, untuk dua jiwa yang selalu dilindungi Tuhan."
    ];

    let currentNoteIndex = 0;
    const shakeJarBtn = document.getElementById('shakeJarBtn');
    const jarGlass = document.querySelector('.jar-glass');
    const noteModal = document.getElementById('noteModal');
    const noteText = document.getElementById('noteText');
    const noteCounter = document.getElementById('noteCounter');
    const closeNoteBtn = document.getElementById('closeNoteBtn');

    if (shakeJarBtn) {
        shakeJarBtn.addEventListener('click', () => {
            if (jarGlass) jarGlass.classList.add('shaking');

            setTimeout(() => {
                if (jarGlass) jarGlass.classList.remove('shaking');

                if (noteText) noteText.textContent = `"${gratitudeNotes[currentNoteIndex]}"`;
                if (noteCounter) noteCounter.textContent = `CATATAN ${currentNoteIndex + 1} DARI ${gratitudeNotes.length}`;
                if (noteModal) noteModal.classList.add('active');

                triggerConfetti({
                    particleCount: 30,
                    spread: 50,
                    origin: { x: 0.5, y: 0.5 },
                    colors: ['#ffb4a2', '#e5989b', '#ffffff']
                });

                currentNoteIndex = (currentNoteIndex + 1) % gratitudeNotes.length;
            }, 600);
        });
    }

    if (closeNoteBtn && noteModal) {
        closeNoteBtn.addEventListener('click', () => {
            noteModal.classList.remove('active');
        });
    }

    if (noteModal) {
        noteModal.addEventListener('click', (e) => {
            if (e.target === noteModal) {
                noteModal.classList.remove('active');
            }
        });
    }
}

// ==========================================
// 6. LOGIKA PEMUTAR MUSIK
// ==========================================
function initMusicPlayer() {
    const audioPlayer = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const songTitle = document.getElementById('songTitle');
    const songArtist = document.getElementById('songArtist');
    const vinylRecord = document.getElementById('vinylRecord');
    const progressBar = document.getElementById('progressBar');
    const currentTimeEl = document.getElementById('currentTime');
    const durationTimeEl = document.getElementById('durationTime');
    const trackItems = document.querySelectorAll('.track-item');

    if (!audioPlayer || !playBtn) return;

    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    function loadSong(index) {
        const song = songsList[index];
        if (songTitle) songTitle.textContent = song.title;
        if (songArtist) songArtist.textContent = song.artist;
        audioPlayer.src = song.src;

        trackItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }

    function playSong() {
        isPlaying = true;
        playBtn.textContent = '❚❚';
        if (vinylRecord) vinylRecord.classList.add('spinning');
        audioPlayer.play().catch(err => {
            console.log("Menunggu interaksi pengguna untuk memutar audio:", err);
        });
    }

    function pauseSong() {
        isPlaying = false;
        playBtn.textContent = '▶';
        if (vinylRecord) vinylRecord.classList.remove('spinning');
        audioPlayer.pause();
    }

    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSongIndex = (currentSongIndex - 1 + songsList.length) % songsList.length;
            loadSong(currentSongIndex);
            playSong();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSongIndex = (currentSongIndex + 1) % songsList.length;
            loadSong(currentSongIndex);
            playSong();
        });
    }

    trackItems.forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.getAttribute('data-index'));
            if (!isNaN(index)) {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                playSong();
            }
        });
    });

    audioPlayer.addEventListener('loadedmetadata', () => {
        if (durationTimeEl) durationTimeEl.textContent = formatTime(audioPlayer.duration);
    });

    audioPlayer.addEventListener('timeupdate', () => {
        if (audioPlayer.duration) {
            const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            if (progressBar) progressBar.value = progressPercent;
            if (currentTimeEl) currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        }
    });

    if (progressBar) {
        progressBar.addEventListener('input', () => {
            if (audioPlayer.duration) {
                const seekTime = (progressBar.value / 100) * audioPlayer.duration;
                audioPlayer.currentTime = seekTime;
            }
        });
    }

    audioPlayer.addEventListener('ended', () => {
        currentSongIndex = (currentSongIndex + 1) % songsList.length;
        loadSong(currentSongIndex);
        playSong();
    });

    loadSong(currentSongIndex);
}