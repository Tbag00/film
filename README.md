# FILM
Film Is a Light Manger
## Cosa fa Film?
Film è un software per la gestione di multisale cinematografiche.
Offre i seguenti servizi:
1. Creazione di utenti base e manager
2. Servizio di autenticazione integrato e/o OpenAuth 
3. Gestione intuitiva di sale, film, prenotazioni e proiezioni
4. Gestione di transazioni
5. Sistema di creazione offerte

# PER USARE
1. installa npm e usa il comando npm install nella root di ogni server
2. installa mysql e crea un utente (es. admin) 
    CREATE USER 'admin'@'localhost' IDENTIFIED BY 'password';
3. Garantisci all' utente privilegi per creare database
    GRANT CREATE ON *.* TO 'admin'@'localhost';
    FLUSH PRIVILEGES

# Documentazione del Software: FILM

# Obiettivi del Progetto
FILM è un sistema completo per la gestione di multisale cinematografiche. I suoi obiettivi principali sono:

Consentire la gestione di utenti (base e manager).

Fornire un sistema di autenticazione integrato (custom e OpenAuth).

Amministrare sale, proiezioni, prenotazioni e film in modo centralizzato.

Gestire transazioni economiche in sicurezza.

Offrire un sistema per promozioni e offerte personalizzate.

# Specifiche Tecniche
Architettura:
Modulare e basata su microservizi.

Utilizzo di Docker Compose per orchestrazione.

Componenti scritti in Node.js (autenticazione) e Python (probabilmente FastAPI per i servizi REST).

Database relazionale: MySQL.

Componenti principali:
auth-server/: gestione autenticazione con JWT o OpenAuth.

docker-compose.yml: definisce i servizi containerizzati.

.env / .env.example: gestione delle variabili d’ambiente.

scripts/: script di backup/restore (non ancora presenti ma previsti).

# Requisiti:
Node.js + npm

MySQL con privilegi di creazione DB

Docker + Docker Compose

# Punti di Forza
Scalabilità modulare: ogni servizio è containerizzato e può essere scalato indipendentemente.

Autenticazione sicura: supporta token personalizzati e standard come OpenAuth.

Orientato al business: include logiche di promozione, gestione offerte e biglietteria.
