# The Muon Data Gateway

The Muon Data gateway is a small server which allows on one hand to display the
data collected by the Muon Correlation Experiemnt and to derive from it random
number tables. On the other hand the server provides a REST api for the
experiment controler to store the measured data in a MSSQL database.

## Deployment Overview

The picture below shows the complete deployment diagram of the project. The
experiment hardware is managed by an onboard controler using an PSOC. The
board can autonomously count the rates of both detector and derives the
correlation count. The data can be red out via an I2C Interface. The front end
contoler (based on a beaglebone black) reads out the data every minute will
store the data on the SD file system of the beagle bone. At the same time
the data is beeing send to the backend server using an REST API. The backend
server will store the data in database.

![Deployment Overview](doc/deploy.png)

The backend server lives as an WebService in the Azure cloud. It is build
using NodeJS. It provides a classical html interface and a rest API in
order to store and retrive data.

## The backend server

The backend server is based on nodejs express framework but has been modified
during its development.

Basically the server provide two interfaces:

* API Interface
* Html Interface to be used by a web browser interface

### The Html Interfaces

All html pages are rendered in the same way by using the a common template
index.ejs which takes two parameters; the java script to be executed and the
title of the response page. The template defines the basic structure of the
page and it is the responsibility of the java script to fill page with
contents. In order to support modular scripting browserify is beeing used.


## npm 

