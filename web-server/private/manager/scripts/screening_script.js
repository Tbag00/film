window.addEventListener('DOMContentLoaded', async () => {
  const filmSelect = document.getElementById('filmSelect');
  const roomSelect = document.getElementById('roomSelect');
  const screeningSelect = document.getElementById('screeningSelect');

  screeningSelect.innerHTML = '<option value="" disabled selected>Seleziona un film</option>';
  roomSelect.innerHTML = '<option value="" disabled selected>Seleziona una Sala</option>';
  filmSelect.innerHTML = '<option value="" disabled selected>Seleziona un film</option>';

  const films = await fetch('/api/movies').then(r => r.json());
  const rooms = await fetch('/api/rooms').then(r => r.json());

  films.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.title;
    opt.textContent = f.title;
    filmSelect.appendChild(opt);
  });

  films.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.title;
    opt.textContent = f.title;
    screeningSelect.appendChild(opt);
  });

  rooms.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r.name;
    opt.textContent = r.name;
    roomSelect.appendChild(opt);
  });
});

screeningSelect.addEventListener('change', async () => {
  const screeningList = document.getElementById('screeningList');
  const screeningSelect = document.getElementById('screeningSelect');

  const screenings = await fetch('/api/screenings').then(r => r.json());

  const selected = screeningSelect.value;
  const now = new Date();
  const filtered = screenings.filter(s => s.title === selected && new Date(s.timecode) > now);

  screeningList.innerHTML = '';
  filtered.forEach(s => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'screenings[]';
    checkbox.value = s.id;

    const timeStr = new Date(s.timecode).toLocaleString("it-IT");
    label.appendChild(checkbox);
    label.append(` ${timeStr}`);
    screeningList.appendChild(label);
    screeningList.appendChild(document.createElement('br'));
  });
});

const params = new URLSearchParams(window.location.search);
const msgBox = document.getElementById('msgBox');
if (params.has('error')) {
      const error = params.get('error');
      msgBox.className = 'error';
      if (error === 'campi_obbligatori') msgBox.textContent = 'Tutti i campi sono obbligatori.';
      else if (error === 'proiezione_esistente') msgBox.textContent = 'Proiezione già esistente in questo orario.';
      else if (error === 'errore_db') msgBox.textContent = 'Errore del database.';
      else if (error === 'non_trovata') msgBox.textContent = 'Questa proiezione non esiste';
      else if (error === 'conflitto') msgBox.textContent = 'Assicurati che il film precedente nella sala sia finito da almeno 10 minuti';
      else msgBox.textContent = 'Errore sconosciuto.';
    } else if (params.has('success')) {
      msgBox.className = 'success';
      if (params.get('success') === 'aggiunta') msgBox.textContent = 'Proiezione aggiunta correttamente';
      else if (params.get('success') === 'rimossa') msgBox.textContent = 'Proiezione rimossa';
    }
