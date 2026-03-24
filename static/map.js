document.addEventListener('DOMContentLoaded', () => {
  const map = L.map('map').setView([20, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Disable scroll wheel zoom to prevent UI breaking
  map.scrollWheelZoom.disable();

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
    const coords = [pin.latitude, pin.longitude];
    const marker = L.marker(coords).addTo(map);
    let popupHtml = `<strong>${pin.product_name}</strong><br><em>${pin.city}, ${pin.country}</em>`;
    if (pin.product_description) {
      popupHtml += `<br>${pin.product_description}`;
    }
    if (pin.image_url) {
      popupHtml += `<br><img src="${pin.image_url}" alt="${pin.product_name}"/>`;
    }
    marker.bindPopup(popupHtml);
    marker.on('click', () => {
      showPinDetail(pin);
    });
  }

  async function loadPins() {
    try {
      const response = await fetch('/api/pins');
      const pins = await response.json();
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

  map.on('click', (e) => {
    if (!addPinModal.classList.contains('show')) return;
    selectedLatLng = e.latlng;
    coordLatitude.textContent = selectedLatLng.lat.toFixed(6);
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