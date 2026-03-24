document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('pixel-map');
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // 8-bit world map pixel data (simplified)
  const mapData = [
    // Ocean (light gray)
    ...Array(800 * 200).fill('#d3d3d3'),
    // Continents (dark gray/black)
    // Europe
    ...Array(50).fill('#696969'), ...Array(50).fill('#000000'), ...Array(50).fill('#696969'),
    // Asia
    ...Array(100).fill('#000000'), ...Array(100).fill('#696969'),
    // Africa
    ...Array(80).fill('#696969'), ...Array(40).fill('#000000'),
    // Americas
    ...Array(120).fill('#000000'), ...Array(80).fill('#696969'),
    // Australia
    ...Array(40).fill('#696969'), ...Array(20).fill('#000000'),
    // Fill rest with ocean
    ...Array(800 * 200 - 50 - 50 - 50 - 100 - 100 - 80 - 40 - 120 - 80 - 40 - 20).fill('#d3d3d3')
  ];

  function drawMap() {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        ctx.fillStyle = mapData[index] || '#d3d3d3';
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  // Animation: slow pixel twinkling
  function animate() {
    const twinklingPixels = [];
    for (let i = 0; i < 10; i++) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      twinklingPixels.push({x, y});
    }

    twinklingPixels.forEach(pixel => {
      const index = pixel.y * width + pixel.x;
      const originalColor = mapData[index];
      ctx.fillStyle = originalColor === '#000000' ? '#ffffff' : '#000000';
      ctx.fillRect(pixel.x, pixel.y, 1, 1);
    });

    setTimeout(() => {
      twinklingPixels.forEach(pixel => {
        const index = pixel.y * width + pixel.x;
        ctx.fillStyle = mapData[index];
        ctx.fillRect(pixel.x, pixel.y, 1, 1);
      });
    }, 500);
  }

  drawMap();
  setInterval(animate, 2000); // Twinkle every 2 seconds

  // Rest of the code remains the same for modals and functionality
  const statPins = document.getElementById('stat-pins');
  const statProducts = document.getElementById('stat-products');
  const statCountries = document.getElementById('stat-countries');

  let selectedLatLng = null;
  const pinModal = document.getElementById('pin-modal');
  const addPinModal = document.getElementById('add-pin-modal');
  const pinForm = document.getElementById('pin-form');
  const coordLatitude = document.getElementById('coord-latitude');
  const coordLongitude = document.getElementById('coord-longitude');
  const formMessage = document.getElementById('form-message');
  const clickInstruction = document.getElementById('click-instruction');
  const fileInput = document.getElementById('image');
  const fileNameLabel = document.getElementById('file-name');

  // ... (keep the rest of the code for modals, stats, etc.)


  const statPins = document.getElementById('stat-pins');
  const statProducts = document.getElementById('stat-products');
  const statCountries = document.getElementById('stat-countries');

  const i18n = {
    en: {
      title: '🗺️ LEATHER GOODS MIGRATION',
      subtitle: 'Migration of Leather Goods Worldwide',
      stats_pins: 'Pins:',
      stats_products: 'Products:',
      stats_countries: 'Countries:',
      add_pin_title: '📍 Add your pin',
      click_instruction: '👆 Click the map to choose a location',
      click_instruction_ready: '✅ Location selected. Complete the form and submit.',
      label_coords: 'Coordinates',
      input_city: 'City',
      input_country: 'Country',
      input_product_name: 'Product Name',
      input_product_description: 'Description (optional)',
      label_image: '📸 Product Photo',
      file_choose: 'Choose file',
      file_info: 'Max 5MB, JPG/PNG/GIF',
      btn_add_pin: '✨ Add pin to map',
      info_title: '💡 Tips',
      info_tip1: 'Click on the map first',
      info_tip2: 'Fill in all fields',
      info_tip3: 'Upload a nice photo',
      info_tip4: 'Submit and done!',
      footer: '© 2024 Leather Goods Migration. All pins are saved and visible to all visitors.',
      map_add_pin_title: 'Add pin',
      select_coords_error: 'Please select coordinates on the map.',
      pin_saved: 'Pin added successfully!',
      upload_file_default: 'Choose file',
    },
    ru: {
      title: '🗺️ LEATHER GOODS MIGRATION',
      subtitle: 'Миграция кожаных изделий по миру',
      stats_pins: 'Пинов:',
      stats_products: 'Изделий:',
      stats_countries: 'Стран:',
      add_pin_title: '📍 Добавить свой пин',
      click_instruction: '👆 Нажмите на карту, чтобы выбрать местоположение',
      click_instruction_ready: '✅ Местоположение выбрано. Заполните форму и отправьте.',
      label_coords: 'Координаты',
      input_city: 'Город',
      input_country: 'Страна',
      input_product_name: 'Название изделия',
      input_product_description: 'Описание (опционально)',
      label_image: '📸 Фото изделия',
      file_choose: 'Выберите файл',
      file_info: 'Макс 5MB, JPG/PNG/GIF',
      btn_add_pin: '✨ Добавить пин на карту',
      info_title: '💡 Советы',
      info_tip1: 'Нажмите на карту первым делом',
      info_tip2: 'Заполните все поля',
      info_tip3: 'Загрузите красивое фото',
      info_tip4: 'Отправьте - готово!',
      footer: '© 2024 Leather Goods Migration. Все пины сохраняются и видны всем посетителям.',
      map_add_pin_title: 'Добавить пин',
      select_coords_error: 'Выберите координаты на карте.',
      pin_saved: 'Успешно добавлен!',
      upload_file_default: 'Выберите файл',
    }
  };

  let selectedLatLng = null;
  const pinModal = document.getElementById('pin-modal');
  const addPinModal = document.getElementById('add-pin-modal');

  const langButtons = document.querySelectorAll('.lang-btn');
  let currentLang = localStorage.getItem('lang') || 'ru';

  function translatePage() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (i18n[currentLang] && i18n[currentLang][key]) {
        el.textContent = i18n[currentLang][key];
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      if (i18n[currentLang] && i18n[currentLang][key]) {
        el.setAttribute('placeholder', i18n[currentLang][key]);
      }
    });

    fileNameLabel.textContent = i18n[currentLang].upload_file_default;
    document.querySelector('.btn-add-pin-trigger').title = i18n[currentLang].map_add_pin_title;
    document.documentElement.lang = currentLang;

    langButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
  }

  function setLanguage(lang) {
    if (!i18n[lang]) return;
    currentLang = lang;
    localStorage.setItem('lang', lang);
    translatePage();
  }

  langButtons.forEach((btn) => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });

  translatePage();

  const pinForm = document.getElementById('pin-form');
  const coordLatitude = document.getElementById('coord-latitude');
  const coordLongitude = document.getElementById('coord-longitude');
  const formMessage = document.getElementById('form-message');
  const clickInstruction = document.getElementById('click-instruction');
  const fileInput = document.getElementById('image');
  const fileNameLabel = document.getElementById('file-name');

  function updateStats(pins) {
    const countries = [...new Set(pins.map(pin => pin.country.trim().toLowerCase()))].filter(Boolean);
    statPins.textContent = pins.length;
    statProducts.textContent = pins.length;
    statCountries.textContent = countries.length;
  }

  function renderPin(pin) {
    // For pixel map, we can draw a small marker on canvas
    const x = ((pin.longitude + 180) / 360) * width;
    const y = ((90 - pin.latitude) / 180) * height;
    ctx.fillStyle = '#ff0000'; // Red pin
    ctx.fillRect(x - 2, y - 2, 4, 4);
  }

  async function loadPins() {
    try {
      const response = await fetch('/api/pins');
      const pins = await response.json();
      drawMap(); // Redraw base map
      pins.forEach(renderPin);
      updateStats(pins);
    } catch (error) {
      console.error('Error loading pins', error);
    }
  }

  function showPinDetail(pin) {
    const body = document.getElementById('modal-body');
    body.innerHTML = `
      <h3>${pin.product_name}</h3>
      <p><strong>${pin.city}, ${pin.country}</strong></p>
      ${pin.product_description ? `<p>${pin.product_description}</p>` : ''}
      ${pin.image_url ? `<img src="${pin.image_url}" alt="${pin.product_name}"/>` : ''}
    `;
    pinModal.classList.add('show');
  }

  function openAddModal() {
    addPinModal.classList.add('show');
    selectedLatLng = null;
    coordLatitude.textContent = '-';
    coordLongitude.textContent = '-';
    pinForm.reset();
    formMessage.textContent = '';
    clickInstruction.textContent = i18n[currentLang].click_instruction;
  }

  function closeModal(modal) {
    modal.classList.remove('show');
  }

  canvas.addEventListener('click', (e) => {
    if (!addPinModal.classList.contains('show')) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Simulate lat/lng based on pixel position
    const lat = (height / 2 - y) / (height / 2) * 90;
    const lng = (x - width / 2) / (width / 2) * 180;
    selectedLatLng = { lat, lng };
    coordLatitude.textContent = lat.toFixed(6);
    coordLongitude.textContent = selectedLatLng.lng.toFixed(6);
    clickInstruction.textContent = i18n[currentLang].click_instruction_ready;
  });

  document.querySelectorAll('.modal-close').forEach((btn) => {
    btn.addEventListener('click', (ev) => {
      const modal = ev.target.closest('.modal');
      closeModal(modal);
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target === addPinModal || e.target === pinModal) {
      closeModal(e.target);
    }
  });

  document.querySelector('.btn-add-pin-trigger').addEventListener('click', openAddModal);

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      fileNameLabel.textContent = fileInput.files[0].name;
    } else {
      fileNameLabel.textContent = i18n[currentLang].upload_file_default;
    }
  });

  pinForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!selectedLatLng) {
      formMessage.style.color = 'var(--danger)';
      formMessage.textContent = i18n[currentLang].select_coords_error;
      return;
    }

    formMessage.textContent = '';

    const formData = new FormData();
    formData.append('latitude', selectedLatLng.lat);
    formData.append('longitude', selectedLatLng.lng);
    formData.append('city', document.getElementById('city').value.trim());
    formData.append('country', document.getElementById('country').value.trim());
    formData.append('product_name', document.getElementById('product_name').value.trim());
    formData.append('product_description', document.getElementById('product_description').value.trim());

    if (fileInput.files.length > 0) {
      formData.append('image', fileInput.files[0]);
    }

    try {
      const res = await fetch('/api/pins', { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Cannot save pin');
      }

      const newPin = await res.json();
      renderPin(newPin);
      const existingPins = await (await fetch('/api/pins')).json();
      updateStats(existingPins);

      formMessage.style.color = '#0b7a40';
      formMessage.textContent = i18n[currentLang].pin_saved;

      setTimeout(() => {
        closeModal(addPinModal);
      }, 750);
    } catch (error) {
      formMessage.style.color = 'var(--danger)';
      formMessage.textContent = error.message;
      console.error('Create pin failed', error);
    }
  });

  loadPins();
});