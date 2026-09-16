# First step: Log into your Gameserver

Before we even start to set up your game server with the help of the provided Ansible automations, you need to make sure that the current root password of the gameserver is working.

You may use any SSH Client to test this connection. This could be, for example

- MobaXTerm (recommendation)
- puTTY

# Harden the Gameserver using the Ansible Automations

## Create local user and upload your personal SSH Key to it

Ensure that in your inventory file, the `ansible_user` is still set to `root`, not to a local user account for each server. Example

```
all:
  children:
    gameservers:
      hosts:
        gameserver1:
          ansible_user: root
```

On your client host, change into your main Ansible directory

```
cd ~/ansible/gaming-server-automation
```

Execute the Ansible playbook


```
ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i inventory/inventory.yml -u root --ask-vault-pass operations/os/ssh/upload_key.yml
```

## Attempt to log in with your private SSH Key and sudo

The final expectation is:

- You are able to log in as the local user without providing its password, simply by using the private SSH Key.
- After executing `sudo -i`, you are prompted to input the local operating system password of the local user. After you do that successfully, you are logged in as `root`.

## Change the SSH Port

On your client host, change into your main Ansible directory

```
cd ~/ansible/gaming-server-automation
```

Execute the Ansible playbook


```
ansible-playbook -i inventory/inventory.yml -u root --ask-vault-pass operations/os/ssh/change_port.yml
```

After successful execution, you may now need to change the configuration of your SSH connections in your client (e. g. within `MobaXTerm`) to the new port.

the final expectation is:

- You are successfully able to log in with your local user, using private key, under the new port. Only then continue with the next steps.

## Hardening the SSH Configuration

Ensure that in your inventory file, the `ansible_user` is now set to your local user, in my example `dafrk`, not to the user `root` for each server. Example

```
all:
  children:
    gameservers:
      hosts:
        gameserver1:
          ansible_user: dafrk
```

On your client host, change into your main Ansible directory

```
cd ~/ansible/gaming-server-automation
```

Execute the playbook

```
ansible-playbook -i inventory/inventory.yml --ask-vault-pass operations/os/ssh/harden.yml
```

After successful execution, try again if you still can log in with your Private Key to SSH.

- You are successfully able to log in with your local user, using private key, under the new port. Only then continue with the next steps.
- Password-based logon via SSH is no longer possible
- Root logon via SSH is no longer possible.

## Configure Network Settings

On your client host, change into your main Ansible directory

```
cd ~/ansible/gaming-server-automation
```

Execute the playbook

```
ansible-playbook -i inventory/inventory.yml --ask-vault-pass operations/os/ssh/harden.yml
```

Expectations:

- The command `hostname` returns only the hostname of the server.
- The command `hostname -f` return the FQHN, so the hostname plus the domain.