// --- CONFIGURATION ---
const startDate = new Date("2024-10-20T00:00:00");
let heartClicks = 0;

// --- DOM ELEMENTS ---
const pages = document.querySelectorAll('.page');
const navBtns = document.querySelectorAll('.nav-btn, .back-link, #exploreBtn');
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
const introScreen = document.getElementById('intro-screen');
const appContainer = document.getElementById('app-container');
const customCursor = document.getElementById('custom-cursor');

// --- 0. CUSTOM CURSOR & TRAIL ---
const heartColors = ['#ffb6c1', '#ffe4e1', '#ffc0cb', '#ff69b4', '#ffb7b2'];
let lastTrailTime = 0;

document.addEventListener('mousemove', (e) => {
    // Update primary cursor position
    customCursor.style.left = `${e.clientX}px`;
    customCursor.style.top = `${e.clientY}px`;

    // Create trail heart every 50ms
    const now = Date.now();
    if (now - lastTrailTime > 50) {
        createTrailHeart(e.clientX, e.clientY);
        lastTrailTime = now;
    }
});

function createTrailHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'cursor-trail';
    heart.innerHTML = '❤';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.color = heartColors[Math.floor(Math.random() * heartColors.length)];
    heart.style.opacity = '0.8';
    heart.style.animation = 'fadeOut 0.6s linear forwards';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 600);
}

document.addEventListener('mousedown', (e) => {
    createBurst(e.clientX, e.clientY);
});

function createBurst(x, y) {
    for (let i = 0; i < 8; i++) {
        const heart = document.createElement('div');
        heart.className = 'cursor-burst';
        heart.innerHTML = '❤';
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        heart.style.color = heartColors[Math.floor(Math.random() * heartColors.length)];
        
        const angle = (i / 8) * Math.PI * 2;
        const velocity = 50 + Math.random() * 50;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        heart.style.setProperty('--tx', `${tx}px`);
        heart.style.setProperty('--ty', `${ty}px`);
        heart.style.animation = 'burst 0.5s ease-out forwards';
        
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 500);
    }
}

// --- 1. INTRO & HEARTS EXPLOSION ---
const passwordScreen = document.getElementById('password-screen');
const passwordBtn = document.getElementById('passwordBtn');
const passwordInput = document.getElementById('passwordInput');
const passwordError = document.getElementById('passwordError');

function unlockWebsite() {
    if (passwordInput.value !== "diamond'sWorldBhoomi") {
        passwordError.classList.remove('hidden');
        return;
    }
    
    // Success: Hide password screen, show intro
    passwordScreen.classList.add('hidden');
    introScreen.classList.remove('hidden');
    
    // Attempt Auto-play Music immediately on this granted user-gesture
    if (!isPlaying && bgMusic.paused) {
        bgMusic.play().catch(e => console.log("Audio play failed from password unlock", e));
        isPlaying = true;
        musicToggle.querySelector('.status').innerText = "Pause Music";
    }
    
    // Reveal text
    setTimeout(() => {
        document.querySelector('.intro-title').style.opacity = 1;
        createExplosion();
    }, 500);

    // Fade out intro and show app
    setTimeout(() => {
        introScreen.style.opacity = 0;
        setTimeout(() => {
            introScreen.classList.add('hidden');
            appContainer.classList.remove('hidden');
        }, 1000);
    }, 3500);

    // Start background floaters
    setInterval(createFloatingHeart, 800);
}

passwordBtn.addEventListener('click', unlockWebsite);
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') unlockWebsite();
});

function createExplosion() {
    const container = document.getElementById('explosion-container');
    for (let i = 0; i < 50; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = ['💖', '💗', '💓', '💕', '🌸'][Math.floor(Math.random() * 5)];
        heart.style.position = 'absolute';
        heart.style.fontSize = Math.random() * 2 + 1 + 'rem';
        heart.style.left = '50%';
        heart.style.top = '50%';
        
        // Random explosion vectors
        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 150;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        heart.style.transform = `translate(-50%, -50%)`;
        heart.style.transition = `all ${Math.random() * 1 + 0.5}s cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
        
        container.appendChild(heart);
        
        // Trigger reflow
        heart.getBoundingClientRect();
        
        heart.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${Math.random() + 0.5})`;
        heart.style.opacity = 0;
        
        setTimeout(() => heart.remove(), 1500);
    }
}

// --- GLOBAL FLOATING HEARTS & EASTER EGG ---
function createFloatingHeart() {
    const container = document.getElementById('hearts-container');
    const heart = document.createElement('div');
    heart.classList.add('bg-heart');
    heart.innerHTML = ['💖', '💗', '🌸', '✨'][Math.floor(Math.random() * 4)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 5 + 8 + 's';
    heart.style.opacity = Math.random() * 0.4 + 0.2;
    
    // Easter Egg Logic
    heart.addEventListener('click', () => {
        heartClicks++;
        heart.innerHTML = '💘';
        heart.style.opacity = 1;
        heart.style.transform = 'scale(2)';
        
        if (heartClicks === 10) {
            alert("You found the secret 💗");
            navigateTo('secret');
        }
    });

    container.appendChild(heart);
    setTimeout(() => heart.remove(), 15000);
}

// --- 2. SPA ROUTING ---
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        if(target) navigateTo(target);
    });
});

function navigateTo(pageId) {
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- MUSIC LOGIC ---
let isPlaying = false;
musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicToggle.querySelector('.status').innerText = "Play Music";
    } else {
        bgMusic.play().catch(e => console.log("Audio play failed", e));
        musicToggle.querySelector('.status').innerText = "Pause Music";
    }
    isPlaying = !isPlaying;
});

// Auto-pause background music when a video plays
const videos = document.querySelectorAll('video');
videos.forEach(video => {
    video.addEventListener('play', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.querySelector('.status').innerText = "Play Music";
        }
    });
    
    // Auto-resume background music when a video is paused or finishes
    video.addEventListener('pause', () => {
        // Only auto-resume if the user hasn't explicitly muted the background music overall
        if (isPlaying) {
            bgMusic.play().catch(e => console.log("Audio play failed", e));
            musicToggle.querySelector('.status').innerText = "Pause Music";
        }
    });

    video.addEventListener('ended', () => {
        if (isPlaying) {
            bgMusic.play().catch(e => console.log("Audio play failed", e));
            musicToggle.querySelector('.status').innerText = "Pause Music";
        }
    });
});

// (Password button now handles the initial music start gesture)


// --- 3. WHEEL GAME ---
const wheelSlices = [
    "Your Favorite Lip Tint", "1 Month Discord Nitro", "Any One Discord Decoration", 
    "Mystery Gift", "A Future Date Promise", "Your Favorite Chocolate", 
    "A Movie Night With Me", "A Day Where You Choose Everything"
];
const wheelEl = document.getElementById('spinning-wheel');
let currentRot = 0;

// Setup wheel DOM
const sliceAngle = 360 / wheelSlices.length;
wheelSlices.forEach((slice, i) => {
    const el = document.createElement('div');
    
    // Instead of full container, center a tiny div that acts as the text pivot
    el.style.position = 'absolute';
    el.style.top = '50%';
    el.style.left = '50%';
    
    // Translate text roughly 35% of the wheel width outwards
    el.style.transform = `translate(-50%, -50%) rotate(${i * sliceAngle + sliceAngle/2}deg) translateY(-35cqw)`;
    el.style.textAlign = 'center';
    
    // Instead of a rigid 140px width which overlaps on mobile, define relative scalable width
    // Making it exactly 35% of container width keeps it completely inside its slice bounds
    el.style.width = '35cqw'; 
    el.style.padding = '0 5px';
    
    // Responsive font scaling clamped tightly so long strings ("A day where you choose everything") 
    // never break their max bounds.
    el.style.fontSize = 'clamp(0.45rem, 3.2cqw, 1.05rem)';
    el.style.fontWeight = '800';
    el.style.color = 'var(--text-main)'; 
    el.style.lineHeight = '1.2';
    el.style.wordBreak = 'break-word';
    el.innerText = slice;
    wheelEl.appendChild(el);
});

document.getElementById('spinBtn').addEventListener('click', () => {
    const extraSpins = Math.floor(Math.random() * 5) + 5; // 5-10 full rotations
    const sliceIndex = Math.floor(Math.random() * wheelSlices.length);
    
    // The background is a conic-gradient starting at 0 degrees.
    // That means slice 0 occupies 0 to 45 deg, slice 1 occupies 45 to 90 deg, etc.
    // The visual center of slice 0 is at 22.5 deg. The visual center of slice 1 is at 67.5 deg.
    // We want the TOP pointer (which is at 0 degrees visually) to land on the center of the chosen slice.
    // If we want slice '0' at the top, we must rotate the wheel BACKWARDS by 22.5 deg (or forward by 360 - 22.5).
    const centerOfSlice = (sliceIndex * sliceAngle) + (sliceAngle / 2);
    const absoluteTarget = 360 - centerOfSlice;
    
    // Increase current rotation to the next 360 cycle to ensure wheel spins forward continuously
    const baseRot = Math.ceil(currentRot / 360) * 360;
    currentRot = baseRot + (extraSpins * 360) + absoluteTarget;
    
    wheelEl.style.transform = `rotate(${currentRot}deg)`;
    
    setTimeout(() => {
        document.getElementById('prize-result').innerText = wheelSlices[sliceIndex] + " 💕";
        
        let desc = "";
        if(wheelSlices[sliceIndex].includes("Date")) desc = "Looks like we’re making memories soon.";
        else desc = "I hope this makes you smile!";
        
        document.getElementById('prize-desc').innerText = desc;
        document.getElementById('wheel-popup').classList.remove('hidden');
    }, 4000);
});


// --- 4. WHY I LOVE YOU CARDS ---
const reasons = [
    "Your smile makes everything better.",
    "You make ordinary moments feel magical.",
    "Talking to you never feels boring.",
    "You understand me in ways nobody else does.",
    "Your laugh is literally addictive.",
    "You make me want to be better.",
    "You’re cute even when you're angry.",
    "You make distance feel smaller.",
    "You are my favorite notification.",
    "You’re the softest place in my world.",
    "You have the prettiest eyes.",
    "I love the way you think.",
    "You care so deeply about things.",
    "You are incredibly strong.",
    "You're just... *you*."
];
const reasonsGrid = document.getElementById('reasons-grid');
reasons.forEach((r, i) => {
    const card = document.createElement('div');
    card.className = 'reason-card';
    card.innerHTML = `<div class="card-front">💗</div><p>${r}</p>`;
    card.addEventListener('click', () => card.classList.toggle('flipped'));
    reasonsGrid.appendChild(card);
});


// --- 5. OPEN WHEN ENVELOPES ---
const envelopeData = [
    { title: "you're sad", msg: "Hey… I know things feel heavy sometimes.\nBut remember this: you are loved more than you realize.\nAnd somewhere in the world, there’s someone who thinks you're the most beautiful soul ever." },
    { title: "you miss me", msg: "I miss you too. More than words can say. Close your eyes, take a deep breath, and imagine my arms wrapped tightly around you." },
    { title: "you can't sleep", msg: "Rest your beautiful mind. The stars are watching over you, and I am dreaming about you. Sweet dreams, my love." },
    { title: "you're overthinking", msg: "Breathe. Everything is going to be okay. You are overthinking because you care, but don't let your mind trick your heart. I'm here for you." },
    { title: "you need motivation", msg: "You are capable of doing amazing things. Don't doubt yourself. I believe in you 1000%." },
    { title: "you want to smile", msg: "Just remember that time we laughed at absolutely nothing. You have the prettiest smile, please use it often." },
    { title: "you're feeling lonely", msg: "You are never truly alone. My heart is always with you, holding yours. Text me, call me, wake me up if you have to." },
    { title: "you feel like giving up", msg: "Please don't. The world needs your light. I need your light. Take a break, cry if you need to, but keep going. You're so strong." }
];
const envGrid = document.getElementById('envelopes-grid');
const letterPopup = document.getElementById('letter-popup');
envelopeData.forEach((env) => {
    const el = document.createElement('div');
    el.className = 'envelope';
    el.innerHTML = `<span class="env-topic">Open when<br>${env.title}</span>`;
    el.addEventListener('click', () => {
        document.getElementById('letter-title').innerText = `Open when ${env.title}`;
        document.getElementById('letter-body').innerText = env.msg;
        letterPopup.classList.remove('hidden');
    });
    envGrid.appendChild(el);
});


// --- 6. QUIZ LOGIC ---
const quizData = [
    { q: "Who texts first most of the time?", options: ["Me", "You"], a: 1 }, 
    { q: "Who is more dramatic?", options: ["Me", "You", "Both equally"], a: 2 },
    { q: "Who says “I miss you” more?", options: ["Me", "You"], a: 0 },
    { q: "Who falls asleep first on calls?", options: ["Me", "You", "It changes"], a: 1 },
    { q: "Who loves the other more?", options: ["Me", "You", "Infinity"], a: 2 } 
];
let bgCurrentQ = 0;
let bgScore = 0;

function loadQuiz() {
    if(bgCurrentQ >= quizData.length) {
        document.getElementById('quiz-box').classList.add('hidden');
        document.getElementById('quiz-result').classList.remove('hidden');
        document.getElementById('final-score').innerText = `Your Score: ${bgScore}/${quizData.length}`;
        launchConfetti();
        return;
    }
    document.getElementById('question-text').innerText = quizData[bgCurrentQ].q;
    const optsDiv = document.getElementById('quiz-options');
    optsDiv.innerHTML = "";
    quizData[bgCurrentQ].options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = "btn secondary-btn";
        btn.innerText = opt;
        btn.onclick = () => {
            if(idx === quizData[bgCurrentQ].a) bgScore++;
            // Actually, any answer is right because it's a cute quiz! Let's just award score
            if(idx !== quizData[bgCurrentQ].a) bgScore++; // rigged
            
            bgCurrentQ++;
            loadQuiz();
        };
        optsDiv.appendChild(btn);
    });
}
document.getElementById('retryQuiz').addEventListener('click', () => {
    bgCurrentQ = 0; bgScore = 0;
    document.getElementById('quiz-result').classList.add('hidden');
    document.getElementById('quiz-box').classList.remove('hidden');
    loadQuiz();
});

// Initialize Quiz lazy
document.querySelector('[data-target="quiz"]').addEventListener('click', loadQuiz);


// --- 7. DAILY GENERATOR ---
const dailyMsgs = [
    "You make my life softer.",
    "I’m proud of you every single day.",
    "Loving you is the easiest thing I’ve ever done.",
    "You're my favorite person to exist.",
    "I’m lucky you’re in my life.",
    "You are my calm in chaos.",
    "Even on boring days, you make life exciting."
];
document.getElementById('generatorBtn').addEventListener('click', () => {
    const box = document.getElementById('daily-text-box');
    const txt = document.getElementById('daily-text');
    box.classList.remove('hidden');
    txt.style.opacity = 0;
    setTimeout(() => {
        txt.innerText = dailyMsgs[Math.floor(Math.random() * dailyMsgs.length)];
        txt.style.transition = "opacity 0.5s";
        txt.style.opacity = 1;
        createExplosion(); // sparks
    }, 200);
});

// --- 8. FUTURE CHECKLIST ---
const futureItems = [
    "Watch sunsets together", "Go on late night walks", "Cook something together",
    "Travel somewhere random", "Have movie nights", "Share headphones and listen to music",
    "Watch the stars", "Laugh until we can't breathe", "Take cute pictures together",
    "Build a peaceful life together"
];
const futList = document.getElementById('future-list');
futureItems.forEach(item => {
    const div = document.createElement('div');
    div.className = "check-item";
    div.innerHTML = `<span class="check-icon">🤍</span><span class="check-text">${item}</span>`;
    div.addEventListener('click', () => {
        const icon = div.querySelector('.check-icon');
        icon.innerText = icon.innerText === '🤍' ? '💖' : '🤍';
        icon.style.color = icon.innerText === '💖' ? 'var(--pink-dark)' : '#ccc';
    });
    futList.appendChild(div);
});

// --- 9. HUG BUTTON ---
document.getElementById('hugBtn').addEventListener('click', () => {
    createExplosion();
    setTimeout(createExplosion, 500);
    setTimeout(createExplosion, 1000);
    document.getElementById('hug-message').classList.remove('hidden');
    document.getElementById('hug-gif-container').classList.remove('hidden');
});

// --- 10. COUNTER ---
function updateCounter() {
    const diff = new Date() - startDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    document.getElementById('time-display').innerHTML = 
        `${days}d : ${hours.toString().padStart(2, '0')}h : ${mins.toString().padStart(2, '0')}m : ${secs.toString().padStart(2, '0')}s`;
}
setInterval(updateCounter, 1000);
updateCounter();

// --- GLOBALS CLOSERS ---
document.querySelectorAll('.close-popup').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.target.closest('.popup').classList.add('hidden');
    });
});

// Tiny canvas confetti helper for quiz
function launchConfetti() {
    const canvas = document.getElementById('fxCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let particles = [];
    for(let i=0; i<100; i++) {
        particles.push({
            x: canvas.width/2,
            y: canvas.height/2,
            r: Math.random() * 6 + 2,
            dx: Math.random() * 10 - 5,
            dy: Math.random() * -10 - 2,
            color: ['#ffb6c1', '#ff69b4', '#fff0f5', '#e6e6fa'][Math.floor(Math.random()*4)]
        });
    }
    
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0,0,canvas.width, canvas.height);
        particles.forEach((p, i) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
            ctx.fillStyle = p.color;
            ctx.fill();
            p.x += p.dx;
            p.y += p.dy;
            p.dy += 0.2; // gravity
            if(p.y > canvas.height) particles.splice(i, 1);
        });
    }
    animate();
    setTimeout(() => ctx.clearRect(0,0,canvas.width,canvas.height), 4000); // cleanup
}
