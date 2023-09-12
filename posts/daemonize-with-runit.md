---
title: Daemonize With Runit
date: 2010-03-25
---

_You may have a load of services/applications that you want to
daemonize on production server. This post will introduce you runit, and
guide you through the configurations on Debian-like systems._

I've been working on an interesting monitoring application for
[Superfeedr](http://superfeedr.com). There're a couple of ruby processes
I'd like to daemonize on the production server, though I'm yet too new
to work with `Process.fork` stuff. Then Superfeedr's
[Julien](http://twitter.com/julien51) kinda introduced me **runit**.

[runit][1] is a Unix init scheme written by Gerrit Pape, it works like
`/etc/init.d/` (i.e. SysVinit), though with [good
benefits](http://smarden.org/runit/benefits.html). We'll utilize its
simple scheme to help us supervising background processes.


## Installing runit

    $ sudo apt-get install runit runit-services

This will _only_ install the runit's supervision module, which is enough
for our use case. Though there's another package `runit-run` that (if
installed) will completely replace your `/sbin/init` and take charge of
your system boot, so take care. If you really want to, ref [this][2].

It will create you `/etc/sv/` and `/etc/service` respectively, if on a
recent Debian-like system. Or if no `/etc/service/` on your system, it
may be at `/service/` or `/var/service/`. Additionally, it comes with
executables like `sv`, `update-service`, `runsv`, etc. Mostly, we'll
only use `sv` and `update-service` to manage background services.

## How It Works

For every service (or application) you want to run in background, you
need create a subdirectory in `/etc/sv/`, with a executable `run` in.
Then `update-service` will tell runit to manage this service. The
service will be picked up, and run in background. And it automatically
get started on system restart.

Let's say, we have a worker `/path/to/worker/bin/workerd` that want to
be managed via runit.


## Add daemonize script

    $ cat /etc/sv/worker/run
    #!/bin/sh
    env RACK_ENV=production
    cd /path/to/worker; bin/workerd
    $ sudo chmod +x /etc/sv/woker/run

The `run` executable is just a shell script, so you could adjust
environments, make housekeepings. The script is like `/etc/init.d`
, but much simpler.


## Update service

Then we need tell runit to mange this `worker` service.

    $ sudo update-service --add /etc/sv/worker

This will add a service called `worker` (instead of `workerd`) to runit.
The `update-service` just sym-linked `/etc/sv/worker` in
`/etc/service/`, then runit knows about this new service, and will start
it automatically.

Play more with it:

    $ sudo update-service --help


## Service management

The `sv` command comes on stage.

    $ sudo sv status worker
    $ sudo sv start worker
    $ sudo sv kill worker
    $ sudo sv hup worker # send hup signal
    $ man sv


## Conclusion

While `/etc/init.d` scripts might do the job as well, it feels more free
and enjoyble to work with runit. Though your preference may vary, choose
what you like with wisdom. Thanks!

[1]: http://smarden.org/runit/ "runit - a Unix scheme with service supervision"

[2]: http://www.linux.com/archive/articles/54137 "runit makes a speedy replacement for init"
