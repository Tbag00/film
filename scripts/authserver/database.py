import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

print(load_dotenv())

config = {
    "user": os.getenv("DB_USER_AUTH"),
    "password": os.getenv("DB_PASSWORD_AUTH"),
    "host": os.getenv("DB_HOST_AUTH"),    
    "database": os.getenv("DB_NAME_AUTH")
}

def get_connection():
    try:
            connection = mysql.connector.connect(
                host=os.getenv("DB_HOST_AUTH"),
                port=os.getenv("DB_PORT_AUTH"),
                user=os.getenv("DB_USER_AUTH"),
                password=os.getenv("DB_PASSWORD_AUTH"),
                database=os.getenv("DB_NAME_AUTH")
            )
            if connection.is_connected():
                return connection
    
    except Error as e:
        print("Errore in connessione a MySQL:", e)
        return None 
    
def init_db():
    create_table_query = """
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('gestore', 'acquirente') NOT NULL
    )
    """
    conn = get_connection()
    if conn:
        cursor = conn.cursor()
        auth_name = os.getenv("DB_NAME_AUTH")
        query = "USE " + auth_name
        cursor.execute(query)
        cursor.execute(create_table_query)
        print("Tabella creata, database connesso!")
        cursor.close()
        conn.close()

def add_user(nome, email, password_hash):
    conn = get_connection()
    if conn:
        cursor = conn.cursor()
        insert_query = "INSERT INTO users (id, username, email, password) VALUES (0, %s, %s, %s)"
        data = (nome, email, password_hash)
        cursor.execute(insert_query, data)
    
        conn.commit()
        print(f"{cursor.rowcount} record inserted.")
    
        cursor.close()
        conn.close() 

def read_user(nome):        
    conn = get_connection()       
    if conn:
        cursor = conn.cursor()
        query = f"SELECT * FROM users WHERE username= \'{nome}\'"
        cursor.execute(query)
        rows = cursor.fetchall()
        for row in rows:
            print(row)
        cursor.close()
        conn.close()  

def update_user(nome, email):
    conn = get_connection()
    if conn:
        cursor = conn.cursor()
        update_query = "UPDATE users SET email = %s WHERE username = %s"
        data = (email, nome)
        cursor.execute(update_query, data)
        conn.commit()
        print(f"{cursor.rowcount} record aggiornato.")
        cursor.close()
        conn.close() 

def delete_user(nome):
    conn = get_connection()
        
    if conn:
        cursor = conn.cursor()
        delete_query = f"DELETE FROM users WHERE username = \'{nome}\'"
        cursor.execute(delete_query)
    
        conn.commit()
        print(f"{cursor.rowcount} record cancellato.")
    
        cursor.close()
        conn.close()      