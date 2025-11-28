# Database Overview

The database serves as the persistence layer for the scheduling system, bridging the gap between the external REDCap patient registry and the internal booking/calendar management system. It follows a hybrid data model where patient information remains in REDCap while scheduling metadata lives locally.

---

## Design

- Patient data (demographics, medical info) → REDCap API (source of truth)  
- Scheduling data (bookings, calendar events) → Local SQLite database  
This prevents data duplication and maintains HIPAA/GDPR compliance by not storing sensitive patient information locally  
  
The system treats everything as an Event - whether it's a booked appointment, a visit window, a blocked date, or staff leave. This unified approach simplifies calendar rendering and filtering logic  

The database acts as an integration hub as it serves both the REDCap and the frontend.  
The database can maintain state for the REDCap and calculate visit numbers.

---

## Limitations

- No blocking behavior. (Concurrent users is a big issue)
- Simultaneous users booking appointments will result in delays or failures.
- Complex REDCap fetches can cause timeout errors.
