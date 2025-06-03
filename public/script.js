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

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const today = now.toISOString().split('T')[0];
  const alreadyPlayedDate = localStorage.getItem('birthdayMusicPlayed');
  const isBirthdayTime = currentHour === 11 && currentMinute === 30;
  const isAfterBirthdayTime = currentHour > 11 || (currentHour === 11 && currentMinute > 30);

  if (slide.type === 'cumple') {
    if (isBirthdayTime && alreadyPlayedDate !== today) {
      // 🎵 Mostrar con música solo una vez por día a las 11:30
      localStorage.setItem('birthdayMusicPlayed', today);
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
    } else if (isAfterBirthdayTime || alreadyPlayedDate === today) {
      // ✅ Mostrar sin música después de 11:30 o si ya sonó hoy
      container.innerHTML = `
        <div class="slide active bg-dark text-white d-flex" style="width: 100vw; height: 100vh;">
          <div style="flex: 1; display: flex; align-items: center; justify-content: center;">
            <img src="${slide.url}" alt="" style="max-width: 90%; max-height: 90%; object-fit: contain;" />
          </div>
          <div style="flex: 1; padding: 2rem; display: flex; flex-direction: column; justify-content: center;">
            <h2>${slide.title}</h2>
            <p style="font-size: 1.5rem;">${slide.description}</p>
          </div>
        </div>
      `;
    } else {
      // ⏩ Antes de 11:30 AM → ignorar y pasar al siguiente
      nextSlide();
      return;
    }

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

function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  renderSlide(currentIndex);
  resetAutoSlide();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  renderSlide(currentIndex);
  resetAutoSlide();
}

// document.getElementById('prevBtn')?.addEventListener('click', prevSlide);
// document.getElementById('nextBtn')?.addEventListener('click', nextSlide);
