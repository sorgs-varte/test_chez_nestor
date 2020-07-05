# test_chez_nestor

J'ai développer selon une architecture REST.
J'ai découper mes endpoints en fonction de chaque objet (*room*, *apartment*, *client* et *reservation*) et du type de requête fait avec (*getone*, *getall*, *create*, *update* et *delete*).

J'ai fais le choix de créer un objet **Reservation** qui sert de `table` de lien entre les chambres et les clients, le tout avec une date d'entrée et une date de sortie.

J'ai pris la liberté de rédiger quelques tests unitaires sur les routes _client_ .
Le **JWT** a été mis en place pour la protection des données.

Il ne peux pas y avoir 2 chambres avec le même nom à une même adresse. 
Il n'est pas possible de réserver une chambre qui est déjà occupé à une certaine date ou de loué une chambre si le client a déjà une réservation à une même date.
L'adresse email d'un client est unique.
Un appartement est forcément créé avec une chambre. 

La base de donnée est une base MongoDB, l'adresse et le nom de la base sont configuré dans le fichier `config.js`.
Ce travail a été réaliser en 4h45/5h. 
