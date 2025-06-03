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