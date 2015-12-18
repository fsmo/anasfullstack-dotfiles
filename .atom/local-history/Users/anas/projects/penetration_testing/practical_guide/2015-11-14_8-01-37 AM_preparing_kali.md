#Preparing Kali
1. Login with the username ´root´ and the default password ´toor´
2. Open a Terminal
3. Change Password
    - Always important to change the root password, especially if you enable SSH services.
    - ```passwd```
4. Update Image with the Command:
    ```shell
    > apt-get update
    > apt-get dist-upgrade
    ```
    
5. Setup database for Metasploit
    - This is to configure Metasploit to use a database for stored results and indexing the modules.

      ```shell
      > service postgresql start
      > service Metasploit start
      ```