const id = new URLSearchParams(location.search).get('id');
let selectedSeats = [];

async function loadSeats() {
  const data = await fetch(`/api/seats/${id}`).then(r => r.json());
  const filmList = await fetch(`/api/screenings`).then(r => r.json());
  const seatGrid = document.getElementById('seatGrid');
  const seatStatus = data.seats;
  seatGrid.innerHTML = '';
  const seatsPerRow = 15;

  filmList.forEach(f => {
    if(f.id == id){
        const film = document.createElement('h2');
        const time = new Date(f.timecode);
        const formattedTime = time.toLocaleString('it-IT', {
            dateStyle: 'long',
            timeStyle: 'short'
        });
        film.textContent = `${f.title} - ${formattedTime}`;
        document.body.prepend(film);
    }
  });


  for (let i = 0; i < seatStatus.length; i++) {
    if (i % seatsPerRow === 0) seatGrid.appendChild(document.createElement('br'));

    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'seats[]';
    checkbox.value = i;
    checkbox.disabled = seatStatus[i] === '1';

    checkbox.addEventListener('change', () => {
        const seatIndex = Number(checkbox.value);
        if (checkbox.checked) {
        selectedSeats.push(seatIndex);
        } else {
        selectedSeats = selectedSeats.filter(idx => idx !== seatIndex);
        }
    });

    label.appendChild(checkbox);
    seatGrid.appendChild(label);
    }
}

document.getElementById('purchaseBtn').addEventListener('click', async () => {

  const response = await fetch(`/api/purchases/${id}`);
  const existing = await response.json();

  const takenSeats = existing.seats.split(',');
  console.log(takenSeats);
  const alreadyTaken = takenSeats.some(seat => selectedSeats.includes(seat));
  console.log(alreadyTaken);
  if (alreadyTaken) {
    alert('Uno o più posti selezionati sono già stati acquistati.');
    return;
  }

  await fetch('/seats/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id_projection: id,
      seats: selectedSeats,
      user_id: 'fakeUser', // temporaneo
    })
  });

  window.location.href = '/booking_manager.html?confirm';
});

loadSeats();