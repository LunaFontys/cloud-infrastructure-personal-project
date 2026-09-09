\# ADR-002: VM Storage Strategy



\## Date

9 September 2026



\## Problem



The initial Ubuntu VM was created with a small root disk. The root filesystem

was approximately 2.4 GB and already around 80% used after deployment.



A separate 20 GB data disk was also attached to the VM, but Linux detected it

as an unpartitioned and unmounted disk.



Docker will require additional disk space for packages, images, containers,

logs, and application data, so the initial configuration does not provide

enough usable root storage.



\## Options Considered



\### Option 1 - Keep the current root disk and use the data disk for everything



This would avoid resizing the root disk, but the operating system would still

have very little free space for packages, updates, logs, and temporary files.



\### Option 2 - Use only a larger root disk



This would be simpler, but system files, Docker data, and persistent application

data would all be stored together.



\### Option 3 - Enlarge the root disk and keep the separate data disk



The root disk can provide sufficient space for Ubuntu and Docker, while the

separate data disk can be used for persistent project data.



\## Decision



Use a larger root disk of approximately 10 GB for Ubuntu and Docker.



Keep the existing 20 GB data disk separate and use it later for persistent

application data.



\## Reason



This provides enough space for the operating system and Docker without making

the setup unnecessarily large.



It also separates persistent application data from the operating system,

making the storage layout easier to understand and maintain.



\## Consequences



\- The root disk must be resized.

\- The Linux root partition/filesystem may also need to be expanded after the

&#x20; virtual disk is resized.

\- The 20 GB data disk still needs to be partitioned, formatted, and mounted.

\- Persistent application data will later be stored on the separate data disk.



\## Implementation



I first inspected the existing storage configuration using `lsblk`, `df`, and

`fdisk`.



The Ubuntu VM initially had:



\- a 3.5 GB system disk (`vda`)

\- an approximately 2.4 GB root filesystem that was around 80% full

\- a separate unused 20 GB data disk (`vdb`)



The root partition was the final partition on the virtual disk, which meant that

additional disk space could be added after it.



I resized the EduCloud root volume to 10 GB. After rebooting, Ubuntu automatically

expanded both the root partition and the ext4 filesystem.



After the resize, the root filesystem had approximately 6.4 GB free space instead

of approximately 500 MB.



For the separate 20 GB data disk I:



1\. created a single partition (`/dev/vdb1`)

2\. created an ext4 filesystem on the partition

3\. created `/srv/cloud-project` as the mount point

4\. mounted `/dev/vdb1` at `/srv/cloud-project`

5\. configured `/etc/fstab` using the filesystem UUID so that the disk is mounted

&#x20;  automatically after boot



The `nofail` mount option was used so that the VM can still boot if the optional

data disk is unavailable.



\## Validation



The configuration was validated in multiple stages.



First, `findmnt --verify` was used to check the `/etc/fstab` configuration.



The filesystem was then manually unmounted. Running `mount -a` successfully

mounted it again using the `/etc/fstab` configuration.



Finally, I created a test file on `/srv/cloud-project` and rebooted the VM.



After the reboot:



\- `/srv/cloud-project` was automatically mounted

\- `findmnt` showed that it was backed by `/dev/vdb1`

\- the filesystem still had approximately 19 GB available

\- the test file created before the reboot was still present and contained the

&#x20; expected data



This validated that the data disk is mounted persistently across VM reboots.



\## Result



The VM now has enough root storage for the operating system and future Docker

installation while also having a separate filesystem available for persistent

project data.



The implemented layout is:



\- Root/system disk: Ubuntu and system/runtime software

\- 20 GB data disk: persistent project/application data



\## What I Learned



I learned that adding a virtual disk to a VM does not automatically make the disk

usable for storing files inside Linux.



The storage path consists of multiple layers:



Virtual disk → partition → filesystem → mount point



I also learned that increasing the size of a cloud volume does not conceptually

mean that the filesystem itself has automatically grown. In this case the Ubuntu

cloud image handled the partition and filesystem expansion automatically after

the EduCloud root volume was resized.



For persistent mounts, I learned how `/etc/fstab` is used and why identifying a

filesystem by UUID is preferable to relying only on a device name such as

`/dev/vdb1`.



The validation also showed the importance of testing configuration before and

after a reboot instead of assuming that a working manual mount is persistent.

