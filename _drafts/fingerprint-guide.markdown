---
layout: post
title: Developing fingerprint driver for libfprint - a journeyman's guide
---

[Libfprint](http://www.reactivated.net/fprint/wiki/Libfprint) is a
beautiful piece of software when you're looking into using your
fingerprint device on Linux. There're already a dosen of [devices
supported](http://www.reactivated.net/fprint/wiki/Supported_devices),
and it's [exapanding](http://cgit.freedesktop.org/libfprint/libfprint/).

When you're going to work on the unsupported device drivers, you should
have the right toolkits and documents under your hood, as well as the
source code. This is a guide for getting started.


The Toolkits and References
----

Personally, I've found Daniel Drake's [academic
paper](http://www.reactivated.net/fprint/academic-project/fprint_report.pdf)
most helpful, which will give you a good overview of libfprint:
the internal interface for device driver, the external application
interface, the devices differences, the algorithms, and etc. Feel free
to have a read, it's quite a good technical document.

Another is Steve Toth's _Reverse engineering Windows USB device
drivers for Linux_, which is a generic but helpful guide on setting up
toolkit and moniter the usb trafficc on Windows, then learning us how to
translate the raw usb traffic data for Linux.

Follow the guide, 


Get The Right Source Code
----

The now active development has been undergoing at
[http://cgit.freedesktop.org/libfprint/libfprint](), instead of the
[official repo](http://github.com/dsd/libfprint), which has been
un-maintained since 2009.


