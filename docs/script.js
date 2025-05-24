const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const imageSection = document.getElementById('imageSection');
const generatedImage = document.getElementById('generatedImage');
const downloadBtn = document.getElementById('downloadBtn');
const loading = document.getElementById('loading');
const errorMsg = document.getElementById('errorMsg');
const promptHistory = document.getElementById('promptHistory');

// 🔐 Replace with your Unsplash Access Key
const UNSPLASH_ACCESS_KEY = "eY1SwzdabpnKYUMHPms2CD8NYPsER5jq1Di2UJpVtOc";

generateBtn.addEventListener('click', handleGenerate);
downloadBtn.addEventListener('click', downloadImage);

function handleGenerate() {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    showError("Please enter a prompt.");
    return;
  }

  showLoading(true);
  errorMsg.classList.add('hidden');
  imageSection.classList.add('hidden');

  fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(prompt)}&client_id=${UNSPLASH_ACCESS_KEY}`)
    .then(res => {
      if (!res.ok) throw new Error("Unsplash API error");
      return res.json();
    })
    .then(data => {
      const imageUrl = data.urls.regular;
      generatedImage.src = imageUrl;
      generatedImage.alt = prompt;
      imageSection.classList.remove('hidden');
      savePrompt(prompt);
    })
    .catch(() => showError("Failed to fetch image. Try another prompt."))
    .finally(() => showLoading(false));
}

function showLoading(state) {
  loading.classList.toggle('hidden', !state);
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove('hidden');
}

function downloadImage() {
  const link = document.createElement('a');
  link.href = generatedImage.src;
  link.download = 'unsplash-image.jpg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function savePrompt(prompt) {
  let prompts = JSON.parse(localStorage.getItem('promptHistory')) || [];
  prompts.unshift(prompt);
  prompts = prompts.slice(0, 5);
  localStorage.setItem('promptHistory', JSON.stringify(prompts));
  renderPromptHistory();
}

function renderPromptHistory() {
  let prompts = JSON.parse(localStorage.getItem('promptHistory')) || [];
  promptHistory.innerHTML = '';
  prompts.forEach(p => {
    const btn = document.createElement('button');
    btn.textContent = p;
    btn.onclick = () => {
      promptInput.value = p;
      handleGenerate();
    };
    promptHistory.appendChild(btn);
  });
}

window.onload = renderPromptHistory;
