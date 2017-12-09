# Overview

This is the Gateway for the Muon Correlation experiment.

THis server exposes the interface to the experiement equptment which allows to store meansurment data in real time. THe gateway stores the data on an MSQL database server. ON the ither hand this server provides the GUI
to access the measurement data on time basis.

# The GUI

THe GUI allows any browser user to access the data using simple HTML interface sd shoen below 

![The GUI](https://github.com/merdmann/muon-be/tree/master/img/Screenshot%20from%202017-12-09%2009-57-29.png "The GUI")

IN right upper coprder the numbrt of ss,pled measurement is shown. ON the rigt side there is small navigation bar 
which allows to select what is to be shown on the screen.

THe function are exposed to the end user:

   * Displaying the data on a time basis
   * Generating tabes of random numbers.


# Random Data

The detector counts of D1 and D2 can be used as seed for generating tables of random numbers. The size of the numbrtd in terms
of bits can be specified and the ammount of number to be generated can be specified in depedant input fields. Pls. not the page does not 
take of any overflow caused bz using number sizes, upto 16 bits are working well.


![Random data](https://github.com/merdmann/muon-be/tree/master/img/Screenshot%20from%202017-12-09%2010-29-25.png "Random Data"


# Displaying Data

THe display page allows to display data for the D1, D2 and the corelation data in a given time range. In order keep the execution times in reasinable limits event for large time slices the selection fo data points is done by the database 
server whhch stores the measurements. From the result set of a time query a fixed number of points is selected and returned to 
the gateway for display. THe users browser will render the diagrams.

![DIsplaying Data](https://github.com/merdmann/muon-be/tree/master/img/Screenshot%20from%202017-12-09%2010-29-25.png "Displying Data"






