window.addEventListener('DOMContentLoaded', async () => {
  const roomSelect = document.getElementById('roomSelect');
  const rooms = await fetch('/api/rooms').then(r => r.json());

  roomSelect.innerHTML = '<option value="" disabled selected>Seleziona una Sala</option>';

  rooms.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r.name;
    opt.textContent = r.name;
    roomSelect.appendChild(opt);
  });
});

const params = new URLSearchParams(window.location.search);
const msgBox = document.getElementById('msgBox');
if (params.has('error')) {
      const error = params.get('error');
      msgBox.className = 'error';
      if (error === 'campi_obbligatori') msgBox.textContent = 'Tutti i campi sono obbligatori.';
      else if (error === 'sala_esistente') msgBox.textContent = 'Sala già esistente.';
      else if (error === 'errore_db') msgBox.textContent = 'Errore del database.';
      else if (error === 'non_trovata') msgBox.textContent = 'Questa sala non esiste';
      else if (error === 'posti') msgBox.textContent = 'Inserire un numero positivo';
      else msgBox.textContent = 'Errore sconosciuto.';
    } else if (params.has('success')) {
      msgBox.className = 'success';
      if (params.get('success') === 'aggiunta') msgBox.textContent = 'Sala aggiunta correttamente';
      else if (params.get('success') === 'rimossa') msgBox.textContent = 'Sala rimossa';
    }