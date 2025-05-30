function loadSlides() {
  fetch('/api/slides')
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('slideList');
      list.innerHTML = '';

      data.forEach((slide, index) => {
        const isStatic = slide.url?.includes('app.powerbi.com/view?r=eyJrIjoiZDFmMjU1MmYtNTk4Yy00OWQ1LThmZTItNzJkZmI3NGVmZTI2');

        const deleteButton = isStatic
          ? ''
          : `<button class="btn btn-outline-danger btn-sm" onclick="deleteSlide(${index})">
               <i class="bi bi-trash"></i> Eliminar
             </button>`;

        const cardHTML = `
          <div class="col-md-6 col-lg-4" id="slide-${index}">
            <div class="card h-100 shadow-sm border-0">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title text-primary">
                  <i class="bi bi-easel"></i> ${slide.title}
                </h5>
                <p class="card-text mb-1">
                  <span class="badge bg-${getTypeColor(slide.type)}">${slide.type}</span>
                </p>
                <p class="text-muted small">${slide.description || 'Sin descripción'}</p>
                <div class="mt-auto d-flex justify-content-between">
                  ${deleteButton}
                </div>
              </div>
            </div>
          </div>
        `;
        list.insertAdjacentHTML('beforeend', cardHTML);
      });

      // 🔄 Inicializa Sortable después de insertar los slides
      new Sortable(list, {
        animation: 150,
        ghostClass: 'bg-light',
        onEnd: function (evt) {
          console.log('Nuevo orden:', evt.oldIndex, '→', evt.newIndex);
          // Puedes guardar aquí el orden si deseas
        }
      });
    });
}

// Ejecuta la carga al iniciar
loadSlides();


function getTypeColor(type) {
  switch (type) {
    case 'iframe': return 'info';
    case 'image': return 'success';
    case 'cumple': return 'warning';
    default: return 'secondary';
  }
}


async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  if (!res.ok) throw new Error('Error subiendo imagen');

  const data = await res.json();
  return data.url; // la URL pública devuelta por el backend
}


document.getElementById('slideForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const type = document.getElementById('type').value;
  const fileInput = document.getElementById('imageFile');
  let url = '';

  if (type === 'image' || type === 'cumple') {
    if (!fileInput.files.length) {
      alert('Por favor selecciona una imagen.');
      return;
    }
    try {
      url = await uploadImage(fileInput.files[0]);
    } catch (err) {
      alert('Error subiendo imagen: ' + err.message);
      return;
    }
  } else if (type === 'iframe') {
    url = document.getElementById('url').value.trim();
    if (!url) {
      alert('Por favor ingresa la URL del iframe.');
      return;
    }
  }

  const slide = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    type,
    url
  };

  fetch('/api/slides', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(slide)
  }).then(() => {
    this.reset();
    document.getElementById('type').dispatchEvent(new Event('change'));
    loadSlides();
  });
});

function deleteSlide(index) {
  fetch('/api/slides/' + index, { method: 'DELETE' }).then(loadSlides);
}


loadSlides();
