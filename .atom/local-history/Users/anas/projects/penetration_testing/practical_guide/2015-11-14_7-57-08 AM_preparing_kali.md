#Preparing Kali
1. Login with the username root and the default password toor
2. Open a Terminal
3. Change Password
a. Always important to change the root password, especially if you enable SSH services.
b. passwd
4. Update Image with the Command:
a. apt-get update
b. apt-get dist-upgrade
5. Setup database for Metasploit
a. This is to configure Metasploit to use a database for stored results and indexing the
mo
dul
es.
b. service postgresql start
c. service Metasploit start