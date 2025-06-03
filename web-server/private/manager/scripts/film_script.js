window.addEventListener('DOMContentLoaded', async () => {
  const filmSelect = document.getElementById('filmSelect');

  filmSelect.innerHTML = '<option value="" disabled selected>Seleziona un film</option>';
  
  const films = await fetch('/api/movies').then(r => r.json());

  films.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.title;
    opt.textContent = f.title;
    filmSelect.appendChild(opt);
  });
});

const params = new URLSearchParams(window.location.search);
const msgBox = document.getElementById('msgBox');
if (params.has('error')) {
      const error = params.get('error');
      msgBox.className = 'error';
      if (error === 'campi_obbligatori') msgBox.textContent = 'Tutti i campi sono obbligatori.';
      else if (error === 'film_esistente') msgBox.textContent = 'Film già esistente.';
      else if (error === 'errore_db') msgBox.textContent = 'Errore del database.';
      else if (error === 'non_trovato') msgBox.textContent = 'Questo film non esiste';
      else if (error === 'durata') msgBox.textContent = 'Inserire durata positiva';
      else msgBox.textContent = 'Errore sconosciuto.';
    } else if (params.has('success')) {
      msgBox.className = 'success';
      if (params.get('success') === 'aggiunto') msgBox.textContent = 'Film aggiunto correttamente';
      else if (params.get('success') === 'rimosso') msgBox.textContent = 'Film rimosso';
    }