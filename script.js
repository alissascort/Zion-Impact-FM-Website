// API Configuration
const API_BASE = 'http://localhost:8000/api'; // Update with your backend URL

// DOM Elements
const playLiveBtn = document.getElementById('playLiveBtn');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const volumeControl = document.getElementById('volumeControl');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const dropdowns = document.querySelectorAll('.dropdown-toggle');
const scriptureText = document.getElementById('scriptureText');
const scriptureRef = document.getElementById('scriptureRef');
const sermonGrid = document.getElementById('sermonGrid');
const newsGrid = document.getElementById('newsGrid');
const prevTestimony = document.getElementById('prevTestimony');
const nextTestimony = document.getElementById('nextTestimony');

let audioElement = new Audio();
let isPlaying = false;
let testimonies = [];
let currentTestimonyIndex = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializePlayer();
    initializeNavigation();
    loadCurrentProgram();
    loadSermons();
    loadTestimonies();
    loadNews();
    updateScripture();
    
    // Update every 10 seconds
    setInterval(loadCurrentProgram, 10000);
    setInterval(loadSermons, 10000);
    setInterval(loadTestimonies, 10000);
    setInterval(loadNews, 10000);
    setInterval(updateScripture, 10000);
});

// ============ PLAYER FUNCTIONALITY ============

function initializePlayer() {
    // Set stream URL (update with your Icecast/SHOUTcast URL)
    audioElement.src = 'http://your-stream-url:8000/stream'; // Replace with your stream URL
    audioElement.crossOrigin = 'anonymous';
    
    playLiveBtn.addEventListener('click', togglePlay);
    playPauseBtn.addEventListener('click', togglePlay);
    
    audioElement.addEventListener('timeupdate', updateProgress);
    progressBar.addEventListener('change', (e) => {
        audioElement.currentTime = (e.target.value / 100) * audioElement.duration;
    });
    
    volumeControl.addEventListener('change', (e) => {
        audioElement.volume = e.target.value / 100;
    });
    
    audioElement.volume = 0.7;
    
    audioElement.addEventListener('error', () => {
        console.error('[v0] Stream connection error');
    });
}

function togglePlay() {
    if (isPlaying) {
        audioElement.pause();
        isPlaying = false;
    } else {
        audioElement.play();
        isPlaying = true;
    }
    updatePlayButton();
}

function updatePlayButton() {
    if (isPlaying) {
        playPauseBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>';
    } else {
        playPauseBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    }
}

function updateProgress() {
    const progress = (audioElement.currentTime / audioElement.duration) * 100 || 0;
    progressBar.value = progress;
    currentTimeEl.textContent = formatTime(audioElement.currentTime);
    durationEl.textContent = formatTime(audioElement.duration);
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ============ API CALLS ============

async function fetchAPI(endpoint) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('[v0] API Error:', error);
        return null;
    }
}

// ============ CURRENT PROGRAM ============

async function loadCurrentProgram() {
    const data = await fetchAPI('/programs/current');
    if (data) {
        document.getElementById('songTitle').textContent = data.song_name || 'Zion Impact FM';
        document.getElementById('songArtist').textContent = data.presenter || 'Live Broadcasting';
        document.getElementById('currentShow').textContent = data.show_name || 'Live Show';
        document.getElementById('programName').textContent = data.show_name || 'Loading...';
        document.getElementById('programHost').textContent = `Host: ${data.presenter || 'TBA'}`;
        document.getElementById('programTime').textContent = `Time: ${data.start_time || '00:00'} - ${data.end_time || '02:00'}`;
        document.getElementById('programDesc').textContent = data.description || 'Currently broadcasting on Zion Impact FM.';
    }
}

// ============ SCRIPTURE ============

function updateScripture() {
    const scriptures = [
        { text: '"Trust in the LORD with all your heart and lean not on your own understanding." - Proverbs 3:5', ref: 'Proverbs 3:5' },
        { text: '"For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life." - John 3:16', ref: 'John 3:16' },
        { text: '"I can do all things through Christ who strengthens me." - Philippians 4:13', ref: 'Philippians 4:13' },
        { text: '"The Lord is my light and my salvation—whom shall I fear?" - Psalm 27:1', ref: 'Psalm 27:1' }
    ];
    
    const today = new Date();
    const index = today.getDate() % scriptures.length;
    const scripture = scriptures[index];
    
    scriptureText.textContent = scripture.text;
    scriptureRef.textContent = scripture.ref;
}

// ============ SERMONS ============

async function loadSermons() {
    const data = await fetchAPI('/sermons?limit=3');
    if (data && data.length) {
        sermonGrid.innerHTML = data.map(sermon => `
            <div class="sermon-card">
                <div class="sermon-image"></div>
                <div class="sermon-details">
                    <h3>${sermon.title}</h3>
                    <p class="sermon-preacher">${sermon.preacher}</p>
                    <p class="sermon-date">${new Date(sermon.date).toLocaleDateString()}</p>
                    <div class="sermon-buttons">
                        <button class="sermon-btn">Listen</button>
                        <button class="sermon-btn">Download</button>
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        sermonGrid.innerHTML = '<p class="loading">No sermons available at this time.</p>';
    }
}

// ============ TESTIMONIES ============

async function loadTestimonies() {
    const data = await fetchAPI('/testimonies?approved=1&limit=10');
    if (data && data.length) {
        testimonies = data;
        displayTestimony(0);
    }
}

function displayTestimony(index) {
    if (testimonies.length === 0) return;
    const testimony = testimonies[index];
    document.getElementById('testimonyText').textContent = `"${testimony.content}"`;
    document.getElementById('testimonyAuthor').textContent = `- ${testimony.name}`;
}

// ============ NEWS ============

async function loadNews() {
    const data = await fetchAPI('/news?limit=6');
    if (data && data.length) {
        newsGrid.innerHTML = data.map(news => `
            <div class="news-card">
                <div class="news-image"></div>
                <div class="news-content">
                    <p class="news-date">${new Date(news.date).toLocaleDateString()}</p>
                    <h3>${news.title}</h3>
                    <p>${news.excerpt || news.content.substring(0, 100)}...</p>
                </div>
            </div>
        `).join('');
    } else {
        newsGrid.innerHTML = '<p class="loading">No news available at this time.</p>';
    }
}

// ============ NAVIGATION ============

function initializeNavigation() {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    dropdowns.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = toggle.parentElement;
                parent.classList.toggle('active');
            }
        });
    });
}
