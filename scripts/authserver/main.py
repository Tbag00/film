from database import *

init_db()

#add_user("Paolo Volpi", "foxbaggings@email.com", "zuppa")

#add_user("Elia Troppa", "elia@example.com", "forzajuve")

#read_user("Elia Troppa")
# read_user(None, "foxbaggings@email.com")

#delete_user("Elia Troppa")
# read_user("Elia Troppa")

update_user("Paolo Volpi", "acerbi@email.com")
read_user("Paolo Volpi")

