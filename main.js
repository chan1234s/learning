// Modal logic
const privacyLink = document.getElementById('privacy-link');
const privacyModal = document.getElementById('privacy-modal');
const closeBtn = document.querySelector('.close');

privacyLink.addEventListener('click', (e) => {
    e.preventDefault();
    privacyModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    privacyModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == privacyModal) {
        privacyModal.style.display = 'none';
    }
});

const generateBtn = document.getElementById('generate-btn');
const lottoNumbersContainer = document.querySelector('.lotto-numbers');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Theme toggle logic
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = 'Light Mode';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    themeToggle.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
});

generateBtn.addEventListener('click', () => {
    lottoNumbersContainer.innerHTML = '';
    const numbers = new Set();

    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    sortedNumbers.forEach(number => {
        const numberDiv = document.createElement('div');
        numberDiv.classList.add('number');
        numberDiv.textContent = number;
        lottoNumbersContainer.appendChild(numberDiv);
    });
});

// Smile Detector Logic
const URL = "./my_model/";
let model, labelContainer, maxPredictions;

async function loadModel() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log("Model loaded successfully");
    } catch (e) {
        console.error("Failed to load model", e);
        document.getElementById('label-container').innerHTML = "Error: Model files not found in /my_model/";
    }
}

const imageUpload = document.getElementById('image-upload');
const uploadBtn = document.getElementById('upload-btn');
const imagePreview = document.getElementById('image-preview');
const labelContainerEl = document.getElementById('label-container');

uploadBtn.addEventListener('click', () => imageUpload.click());

imageUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
        imagePreview.src = event.target.result;
        imagePreview.style.display = 'block';
        
        if (!model) {
            labelContainerEl.innerHTML = "Loading model...";
            await loadModel();
        }
        
        if (model) {
            predict();
        }
    };
    reader.readAsDataURL(file);
});

async function predict() {
    const prediction = await model.predict(imagePreview);
    labelContainerEl.innerHTML = '';
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + (prediction[i].probability * 100).toFixed(2) + "%";
        const div = document.createElement('div');
        div.innerHTML = classPrediction;
        labelContainerEl.appendChild(div);
    }
}

// Pre-load model
loadModel();
