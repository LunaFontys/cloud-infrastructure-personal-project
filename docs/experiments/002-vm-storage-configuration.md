\# Experiment 002 - VM Storage Configuration



\## Date



9 September 2026



\## Goal



Configure sufficient system storage for the VM and create separate persistent

storage for project data.



\## Starting Situation



Initial inspection showed:



\- root filesystem: approximately 2.4 GB

\- root filesystem usage: approximately 80%

\- free root space: approximately 500 MB

\- separate data disk: 20 GB

\- data disk had no partition, filesystem, or mount point



This was a problem because the root filesystem did not provide enough free space

for future software such as Docker.



\## Implementation



\### Root disk



The EduCloud root volume was resized from approximately 3.5 GB to 10 GB.



After rebooting, Ubuntu automatically expanded the root partition and ext4

filesystem.



Result:



\- root filesystem: approximately 8.7 GB

\- free space: approximately 6.4 GB

\- usage: approximately 27%



\### Data disk



The 20 GB data disk was configured as:



`/dev/vdb` → `/dev/vdb1` → ext4 → `/srv/cloud-project`



The filesystem UUID was added to `/etc/fstab` so that it is mounted automatically.



\## Validation



The `/etc/fstab` configuration was checked with:



`findmnt --verify`



The filesystem was manually unmounted and successfully restored using:



`mount -a`



A persistence test file was then created on `/srv/cloud-project`.



After rebooting the VM:



\- the data disk automatically mounted at `/srv/cloud-project`

\- `/dev/vdb1` was confirmed as the backing filesystem

\- the test file still existed with the expected contents



\## Conclusion



The storage configuration meets the intended design.



The VM now has sufficient root space for system/runtime software and a separate

persistent filesystem for future application data.

