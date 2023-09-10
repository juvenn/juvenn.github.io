---
title: Monitoring Superfeedr
date: 2010-03-31
---

At [Superfeedr](http://superfeedr.com), they have built a cost-effective
feed delivering infrastructure, it's real-time delivering. As a
subscriber, you don't need to constantly ping tons of topics anymore,
you just subscribe via Superfeedr, and you'll get universal atom
notifications in real-time (ok, it's nearly real-time); and as a
publisher, your cloud server will get less and less dummy requests,
allocate these saved computing resources to serve more users instead,
this will be achieved by establishing a hub at Superfeedr, and redirect
your subscribers to this new hub.

In the last couple of months, I've built an external monitering
application for Superfeedr, that will constantly simulate requests, and
measure Superfeedr's performance and reliablity from outside. It's a
good and enjoyable experience to work with various subscribe protocals,
APIs, and powerfull Ruby libraries.


## Overview

Superfeedr supports both PubSub ([XMPP
0060](http://xmpp.org/extensions/xep-0060.html)) and
[PubSubHubbub](http://pubsubhubbub.googlecode.com/svn/trunk/pubsubhubbub-core-0.3.html)
(PuSH as [Josh Fraser](http://twitter.com/joshfraser) has coincided)
protocals, and it delivers standard atom notifications, regardless of
original feed format. We need simulate requests for both protocols, and
measure `min`, `max`, `average`, `median` time in an interval (hourly),
as well as `failure rate`.

Our monitoring application has two main components: a `Worker` that will
constantly simulate requests, from PubSub subscribe, to PuSH ping; a
`WebServer` that will act as a PuSH callback server to process verify
requests from Superfeedr, parse atom notifications, as will as providing
an visualization interface.


## Simulate Requests

The worker is evented in nature, it periodically sends requests, handles
responses when requests get returned, and it's working in a non-blocking
thread. That's what [EventMachine](http://rubyeventmachine.com) built for.

Our worker is simply an EventMachine run loop, which constantly
simulating request, saves the request record into datastore. When it
gets response, it will fetch the request record, compute elapsed time,
update record with the elapsed time and a status which indicates fail or
succees of the request.

Only with [Blather](http://blather.squishtech.com/), a great evented
XMPP Ruby library, we could built pubsub module with ease, though we
have only used a subset (pubsub) of Blather. A stream connection is
established, when the worker gets initialized. Then we stream xml
stanzas over the connection, when received response, we parse it with
the excellent xml parse library [Nokogiri](http://nokogiri.org). Working
with PubSub is significantly easier than I had expected, I'd say.

But monitoring the PubSubHubbub has proven much more work. We chose
[em-http-request](http://github.com/igrigorik/em-http-request) to
asynchronously send http request, and deal with different status codes
as requests returns from Superfeedr server. That's the case for sync
mode of PuSH.  For async mode of PuSH, we have `WebServer` to handle
requests from Superfeedr.

And there's full ping cycle. We publish new entries to subscribed
topics, then wait for Superfeedr propagating notifications to us, we
measure the elapsed time at last, to test Superfeedr's real-time
delivering ablity. When we simulate a full ping command, we generate a
request log record with a unique `id`, then build a new entry with this
`id`, publish the entry to the subscribed topic. When we get atom
notifications from Superfeedr, we imediately parse for the `id`, query
database record by this `id`, update it with the computed elapsed time,
put it back to database then.


## The WebServer

Originally, we have had only a simple EventMachine based http server for
handling Superfeedr's verify requests as well as atom notifications. But
when I began to work on a web interface for visualizing statistics, I
realized a [Sinatra](http://sinatrarb.com) module might replace the http
server very well.

Now we have only Sinatra to serv http requests. It's responsible for
verifying subscribe or unsubscribe attempts, parsing atom notifications
for ping command, as well as providing a google visualization interface
to backend statistics, which makes on-demand stats review easier.


## Computing Stats

We have [MongoDB](http://mongodb.org) as the datastore, which offers
built-in [map/reduce](http://www.mongodb.org/display/DOCS/MapReduce). In
Worker's running loop, map/reduce are scheduled hourly, to produce
required statistics.

To produce hourly stats, I've employed a small trick - emitting
hourly-timestamped key with the request type. The process will map on
all recorded requests that have completed, reduce them to a collection
of hourly timestamped and typed docs, with computed min, max, median,
average, failure rate. The whole collection will be updated every hour
with newly computed stats.

With [google's
visualization](http://code.google.com/apis/visualization/documentation/gallery/annotatedtimeline.html),
we dynamically download typed stats to local browser, and update
visualization with the new data.


## Conclusion

The most difficult part of working with evented architecture is
debugging. Unexpected status codes, malformed xml format, and there's
even a Nokogiri xpath issue that took me days to work it out. It's
always **not** the solution you try to find that took most of your time,
but trials to figure out where's the cause that do.

When there's any thing going wrong, you'll need setup a whole stack of
services to emit different set of events, so you could figure out the
cause, and that may take you struggling days. curl,
[hurl](http://hurl.it), and [postbin](http://www.postbin.org) are your
friends, as well.

The two main Ruby libraries, i.e. EventMachine and Sinatra, as well as
MongoDB have reduced the complexity in a magnitude, fortunately. I've
really enjoyed working with these beautifully crafted software.

The application is already running for a couple of weeks now, and shows
a pretty good uptime and stablities. Thankfully to the great Ruby
community!
