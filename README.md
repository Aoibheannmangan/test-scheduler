# INFANT Scheduler

This is a repository for INFANT's scheduler web application for viewing, booking and managing appointments. 
This is a dockerised REACT JS application using Python as the backend.  
Entire scope is unknown. Studies that will utilise are unknown. Aimhigh is the most probable. Created to take over the google calendar.

## Prerequisites

The following programs must be downloaded in order for the application to run and function

|Software| Version| Purpose|
|:---------|:-------:|--------:|
|Node JS|20.x|Run Javascript frontened|
|npm|Comes with Node|Package manager for js dependancies|
|Python|3.11|Run Python backend|
|pip|Comes with Python|Package manager for python dependancies|
|Docker|Latest|Container runtime|

## Design

### Tech stack

|Service|Software| Version| Purpose|
|:------|:---------:|:-------:|--------:|
|__Frontend__|React|19.10|Main UI framework for web app|
|__Backend__|Flask|3.0.3|Python web framework for REST API|
|__API Integration__|Axios|1.11.0|HTTP client for API requests|
|__Database ORM__|SQLAlchemy|3.1.1|Database operations and models|
|__HTTP Client__|Requests||REDCap API Integration|
|__Authentication__|bcrypt|4.1.3|Password hashing in database|
||PyJWT|2.8.0|Provided JWT tokens|
|__Containerisation__|Docker|Latest|Application deployment|
|__Web Server__|Nginx|stable-alpine|Reverse proxy and static files.|
|__Testing__|Jest|27.51|Frontend testing framework|
|__Documentation__|MKDocs|latest|API and user documentation|

Further in depth design choices about the database can be found in the documentation.

## Set Up

1. As with any project, make sure to ``Git clone`` the project.
2. Create a ``.env`` file with your REDCap API token and the REDCap API URL. (A .env example is supplied)
3. Now time to set up our Docker container with this command:

```powershell
docker compose up --build
```

4. To set up the database, remove any existing or mistakenly added database material with this command:

```powershell
docker exec test-scheduler-backend-1 rm /app/instance/scheduler.db
```

5. Initialise the database and migrate it with the following commands:

```powershell
docker exec -e FLASK_APP=run.py test-scheduler-backend-1 flask db init
```

```powershell
docker exec -e FLASK_APP=run.py test-scheduler-backend-1 flask db migrate -m "Migration"
```

__Note:__ (If problems with the migrate process was encountered try upgrading the database)

```powershell
docker exec -e FLASK_APP=run.py test-scheduler-backend-1 flask db upgrade
```

_**Now your program should be up and running!**_

## Usage

There are three main pages with the Scheduler. There is the __Calendar__ page, the __Appointment View__ page and the __Reports__ page. These pages all have different purposes.

### Calendar Page

The main component of this page is the React Big Calendar used to display leave, blocked dates, window ranges and bookings. It is interactive, the view can be changed and events can be clicked and modified. Events can even be filtered using the room filter below it.

The calendar page is used for a number of functions. Booking, deleting, viewing and rescheduling appointments. As well as blocking/ unblocking dates dates either for employee leave or just in a general case. Viewing patient windows is also very helpful to have when booking appointments in that window.

### Appointment View

Appointment view allows clinicians to view a lot of patient information relevant to the appointment. There are indicators the booking's proximity and to view if the patient is "Out of Area." The patient ID and the current visit number us also a table element. 

There is also the factor of the ID being red depending if a booking is in place for that patient.  
By clicking on the record, information such as the date of birth, location and appointment/ window dates are available. Like the calendar page, the window range can also be viewed here.  
There is also features like filtering records by study and searching by patient ID.

### Reports

Reports is a page that is used to visualise the window and booking forecast and also booking statistics. They are able to see the amount of appointments in a certain month and if they are outside of the visit window or if they were a no-show appointment. 

### Login, Signup and Forgot Password

After Signing up/ logging in, a JWT token will be supplied in local storage. This will be checked and no API or database operations can be performed without it.  
Forgot password is a page the user can navigate to if they have forgot the password to reset. It is not connected to the database and runs off of the old local storage functionality.  
__TODO: CHANGE FROM LOCAL STORAGE__

## Documentation

There is documentation for this project using MKDocs Material. JS functions, API and DB functionality is covered in it. This documentation is throughout this code but may be easier if you clicked [here](https://aoibheannmangan.github.io/test-scheduler/)