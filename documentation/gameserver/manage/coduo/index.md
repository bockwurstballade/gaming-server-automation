## Join the Server

Start your game
Open the console

Enter the following command into the console

```
/connect IP:Port
e. g. /connect coduo.sons-of-lan-archy.de:28980
```

## Set Rcon Password

In order to be able to administer the server, you first need to start your game and Join the Server

After that, you need to set the RconPassword

```
/set rconPassword "YourPassword"
```

After that, you are authenticated via rcon and able to administer the server using rcon commands

## Load another server config

After you authenticated via Rcon

You can load any other server config that is in the folder `/games/coduo/uo/`. For example, if you have a file there that is called `ctf.cfg`, you load it like this

```
rcon exec ctf.cfg
```


## Switch the map

```
rcon map mp_carentan
```