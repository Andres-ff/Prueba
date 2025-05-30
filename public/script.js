let slides = [];
let currentIndex = 0;
let autoSlideInterval;

fetch('/api/slides')
  .then(res => res.json())
  .then(data => {
    slides = data;
    renderSlide(currentIndex);
    startAutoSlide();
  });

function renderSlide(index) {
  const container = document.getElementById('slider');
  const slide = slides[index];

if (slide.type === 'cumple') {
  container.innerHTML = `
    <div class="slide active bg-dark text-white d-flex" style="width: 100vw; height: 100vh;">
      <audio autoplay>
        <source src="/audio/cumple.mp3" type="audio/mpeg">
        Tu navegador no soporta audio.
      </audio>
      <div style="flex: 1; display: flex; align-items: center; justify-content: center;">
        <img src="${slide.url}" alt="" style="max-width: 90%; max-height: 90%; object-fit: contain;" />
      </div>
      <div style="flex: 1; padding: 2rem; display: flex; flex-direction: column; justify-content: center;">
        <h2>${slide.title}</h2>
        <p style="font-size: 1.5rem;">${slide.description}</p>
      </div>
    </div>
  `;
  } else if (slide.type === 'image') {
    container.innerHTML = `
      <div class="slide active">
        <img src="${slide.url}" alt="" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>
    `;
  } else if (slide.type === 'iframe') {
    container.innerHTML = `
      <div class="slide active">
        <iframe src="${slide.url}" style="width: 100vw; height: 100vh; border: none;" allowfullscreen></iframe>
      </div>
    `;
  }
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  renderSlide(currentIndex);
  resetAutoSlide();
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  renderSlide(currentIndex);
  resetAutoSlide();
}

function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    renderSlide(currentIndex);
  }, 20000); // 20 segundos
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

document.getElementById('prevBtn').addEventListener('click', prevSlide);
document.getElementById('nextBtn').addEventListener('click', nextSlide);
