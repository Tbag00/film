window.addEventListener('DOMContentLoaded', async () => {
  const filmSelect = document.getElementById('filmSelect');
  const todayList = document.getElementById('todayList');

  filmSelect.innerHTML = '<option value="" disabled selected>Seleziona un film</option>';

  const films = await fetch('/api/movies').then(r => r.json());

  films.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.title;
    opt.textContent = f.title;
    filmSelect.appendChild(opt);
  });

  const screenings = await fetch('/api/screenings').then(r => r.json());

  const today = new Date();
  const filtered = screenings.filter(s => {const d = new Date(s.timecode); return d.toDateString() === today.toDateString();});

  filtered.forEach(s => {
    const label = document.createElement('label');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Acquista';

    btn.addEventListener('click', () => {
        window.location.href = `/private/seats_choice.html?id=${s.id}`;
    });

    const timeStr = new Date(s.timecode).toLocaleTimeString();
    label.textContent = `${s.title} alle ${timeStr} `;
    label.appendChild(btn);
    todayList.appendChild(label);
    todayList.appendChild(document.createElement('br'));
  });
});

filmSelect.addEventListener('change', async () => {
  const screeningList = document.getElementById('screeningList');
  const filmSelect = document.getElementById('filmSelect');

  const screenings = await fetch('/api/screenings').then(r => r.json());

  const selected = filmSelect.value;
  const now = new Date();
  const filtered = screenings.filter(s => s.title === selected && new Date(s.timecode) > now);

  screeningList.innerHTML = '';

  filtered.forEach(s => {
    const label = document.createElement('label');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Acquista';

    const timeStr = new Date(s.timecode).toLocaleTimeString();
    const dateStr = new Date(s.timecode).toLocaleDateString('it-IT', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    btn.addEventListener('click', () => {
        window.location.href = `/private/seats_choice.html?id=${s.id}`;
    });

    label.append(`Spettacolo delle: ${timeStr} - ${dateStr}`);
    label.appendChild(btn);
    screeningList.appendChild(label);
    screeningList.appendChild(document.createElement('br'));
  });
});

const params = new URLSearchParams(window.location.search);
const msgBox = document.getElementById('msgBox');
if (params.has('error')) {
      const error = params.get('error');
      msgBox.className = 'error';
      if (error === 'fatal-error') msgBox.textContent = 'Acquisto non riuscito';
      else msgBox.textContent = 'Errore sconosciuto.';
    } else if (params.has('success')) {
      msgBox.className = 'success';
      if (params.get('success') === 'confirm') msgBox.textContent = 'Biglietti acquistati';
    }