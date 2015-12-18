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
6. *Optional for Metasploit - Enable Logging
    - I keep this as an optional since logs get pretty big, but you have the ability to log every command and result from Metasploit’s Command Line Interface (CLI). This becomes very useful for bulk attack/queries or if your client requires these logs.

        ```shell
        > echo “spool/root/msf_console.log” >/root/.msf4/msfconsole.rc
        ```
        Logs will be stored at/root/msf_console.log
        
