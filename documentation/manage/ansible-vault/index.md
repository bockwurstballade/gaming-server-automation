# View the contents of your current Ansible Vault

Navigate to the main directory of the Project

```
cd ~/ansible/gaming-server-automation/
```

From there, execute the following command.


```
ansible-vault view secrets/secrets.yml
```

Enter the Ansible Vault password.

# Edit the contnets of your current Ansible Vault

Navigate to the main directory of the Project

```
cd ~/ansible/gaming-server-automation/
```

From there, execute the following command.


```
ansible-vault edit secrets/secrets.yml
```

Enter the Ansible Vault password.

From here, you can edit the contents using the standard controls of the editor `vim`.

If you are not comfortable with `vim`, you mase use a different editor. For example, to use `nano` instead, execute

```
EDITOR=nano ansible-vault edit secrets.yml
```

Do not forget to save the file (on vim, in command mode, enter `:wq`)