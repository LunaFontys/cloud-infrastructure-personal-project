\# Experiment 001 - EduCloud Environment Exploration



\## Date

8 September 2026



\## Goal



Understand which infrastructure resources EduCloud provides before creating

the first virtual machine.



\## Observations



The EduCloud environment provides access to resources including:



\- Virtual machine instances

\- Guest networks

\- VPCs

\- Public IP addresses

\- Volumes and snapshots

\- Templates and ISOs

\- Kubernetes clusters

\- Network ACLs



The environment currently contains one shared guest network:



\- Name: DHCP-S4-Internet-Only

\- Type: Shared

\- IPv4 CIDR: 10.64.0.0/20

\- Zone: Eindhoven-Zone



I could not find a Security Groups section in the interface. Network ACLs are

available, so I still need to investigate how firewall and access control are

configured in this EduCloud environment.



\## Current Questions



\- How does a VM receive network connectivity?

\- Can the VM access the internet by default?

\- Can the internet access the VM by default?

\- When is a public IP required?

\- How are inbound firewall rules configured?

\- Are Network ACLs used instead of Security Groups?

\- Which Ubuntu template should be used?



\## Next Step



Inspect the instance creation process before creating the first VM.



\## VM Configuration



For the first experimental VM I selected:



\- Zone: Eindhoven-Zone

\- Image: Ubuntu 24.04.4 LTS Cloud (Noble Numbat)

\- CPU: 1 vCPU

\- Memory: 4 GB

\- Data disk: 20 GB

\- Network: DHCP-S4-Internet-Only

\- Authentication: SSH public key



I chose an Ubuntu Cloud template instead of a desktop image or ISO because the

VM will be used as a server and managed remotely.



I chose a relatively small compute configuration because the initial application

does not require many resources. The configuration can be increased later if

testing shows that more resources are necessary.



I created a dedicated Ed25519 SSH key pair for the project. The public key was

registered with EduCloud while the private key remains on my local computer and

is protected with a passphrase.



\## Connectivity Test 1



I attempted to connect to the VM from my local PC using SSH:



ssh -i <private-key> ubuntu@10.64.0.5



Result:



Connection timed out on port 22.



This indicates that my PC could not reach the SSH service on the VM. The failure

occurred before SSH authentication, so the username or SSH key are not yet the

likely cause.



The VM currently only has a private 10.64.x.x address, so I need to investigate

how EduCloud provides external access to instances, for example through a public

IP, VPN, NAT, or other network configuration.



\### Network observations



The VM received IPv4 address 10.64.0.5 through the shared

DHCP-S4-Internet-Only network.



The network uses:



\- IPv4 CIDR: 10.64.0.0/20

\- IPv4 gateway: 10.64.0.1

\- IPv6 CIDR: 2001:67c:6ec:7331::/64



The network also provides DNS servers.



The EduCloud interface does not currently allow me to acquire an additional

public IP address for this shared network.



I still need to determine the intended method for remotely accessing instances

on this network.



\### VM console credentials



After reaching the VM through the EduCloud console, I discovered that the console

required login credentials that I did not have.



The EduCloud documentation suggested using a password reset option, but this

option was not available in my current EduCloud interface.



I asked a teacher about the current procedure. I was told that the login

information is shown once when the VM is created and needs to be saved. If it

is lost, the VM needs to be recreated.



Because this VM did not contain any project configuration or data yet, I decided

to recreate it and save the provided credentials securely.



\## VM Inspection



After successfully connecting to the VM through SSH, I inspected the operating

system, memory, networking, and storage.



The VM is running Ubuntu 24.04.4 LTS and the `ubuntu` user is used for remote

administration.



The VM has approximately 4 GB of memory, matching the compute offering selected

in EduCloud.



The main network interface (`ens3`) received:



\- a private IPv4 address from the 10.64.0.0/20 network

\- an IPv6 address from the EduCloud IPv6 network



This confirmed that the EduCloud network is dual-stack.



\## Storage



Inspecting the storage with `lsblk` and `df -h` showed that the VM has two

virtual disks.



The Ubuntu template uses a small root disk (`vda`). The root filesystem is

approximately 2.4 GB and was already around 80% used after deployment.



The 20 GB data disk selected during VM creation appears separately as `vdb`.

It is currently unpartitioned and unmounted, meaning that simply attaching a

disk in EduCloud does not automatically make it usable as filesystem storage

inside Linux.



Before installing Docker, I need to decide how storage should be configured

because the current root filesystem has very little free space.



\## Result



I successfully created and remotely accessed an Ubuntu VM in EduCloud.



The VM could not initially be reached directly from my PC because its IPv4

address is part of a private network. After checking the EduCloud documentation,

I installed and connected through the provided OpenVPN connection.



With the VPN active, my PC could reach the VM's SSH service.



During the first VM setup I lost the one-time login information. The current

EduCloud interface did not provide the password reset option described in the

documentation. After asking a teacher, I learned that the credentials need to

be saved when the VM is created and that a new VM must be created if they are

lost.



I recreated the VM, stored the credentials securely, and successfully connected

using SSH.



\## What I Learned



This experiment helped me understand the relationship between:



\- cloud VM configuration and the resources visible inside Linux

\- private IP addresses and remote network reachability

\- VPN access to a private cloud network

\- SSH public/private keys and SSH host keys

\- cloud-attached disks and mounted Linux filesystems

\- troubleshooting a connection by identifying whether the problem is networking,

&#x20; authentication, or the operating system



\## Follow-up



Before installing Docker, investigate how storage should be configured for the

VM because the Ubuntu root filesystem currently has limited free space.

