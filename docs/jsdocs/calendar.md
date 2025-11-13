<a name="MyCalendar"></a>

## MyCalendar() => <code>JSX.Element</code>
Calendar component that renders the main calendar view and handles appointment management.
Includes functionality for booking, editing, deleting appointments,
blocking dates, searching patients, and managing visit windows.

**Kind**: global function  
**Returns**: <code>JSX.Element</code> - The Calendar component that renders the main calendar view and handles appointment management.  
**Component**:   
**Example**  
```js
<Route path="/calendar" element={<MyCalendar />} />
```

* [MyCalendar()](#MyCalendar) <code>JSX.Element</code>
    * [~roomList](#MyCalendar..roomList) =>  <code>void</code>
    * [~cleanupPastAppointments](#MyCalendar..cleanupPastAppointments) =>  <code>void</code>
    * [~allEvents](#MyCalendar..allEvents) => <code>Array.&lt;Object&gt;</code>
    * [~filteredAppointments](#MyCalendar..filteredAppointments) => <code>Array.&lt;Object&gt;</code>
    * [~handleSelectEvent(event)](#MyCalendar..handleSelectEvent) => <code>void</code>
    * [~handleBlockDate()](#MyCalendar..handleBlockDate) => <code>void</code>
    * [~handleUnBlockDate()](#MyCalendar..handleUnBlockDate) =>  <code>void</code>
    * [~handleShowBlockedDates()](#MyCalendar..handleShowBlockedDates)  => <code>void</code>
    * [~handleDateChange(event)](#MyCalendar..handleDateChange) => <code>void</code>
    * [~combinedEventGetter(event)](#MyCalendar..combinedEventGetter)  => <code>void</code>
    * [~handleNoShowChange(e)](#MyCalendar..handleNoShowChange) => <code>void</code>
    * [~handleUpdateEvent(updatedEvent)](#MyCalendar..handleUpdateEvent)  => <code>void</code>
    * [~saveEditedInfo()](#MyCalendar..saveEditedInfo) => <code>void</code>
    * [~handleSearchWindow()](#MyCalendar..handleSearchWindow) => <code>void</code>
        * [~patientBookedAppointments](#MyCalendar..handleSearchWindow..patientBookedAppointments)  => <code>void</code>
    * [~isAppointmentWithinVisitWindow(appointment, patient)](#MyCalendar..isAppointmentWithinVisitWindow) => <code>boolean</code>
    * [~proceedWithOutOfWindowBooking()](#MyCalendar..proceedWithOutOfWindowBooking) => <code>void</code>
    * [~handleClearWindow()](#MyCalendar..handleClearWindow) => <code>void</code>
    * [~confirmDeleteEvent()](#MyCalendar..confirmDeleteEvent) =>  <code>void</code>
    * [~handleEventClick(event)](#MyCalendar..handleEventClick)  => <code>void</code>
    * [~handleEventAdd()](#MyCalendar..handleEventAdd) => <code>void</code>
    * [~handleAddAppointment(appointment, [override])](#MyCalendar..handleAddAppointment) => <code>void</code>

<a name="MyCalendar..roomList"></a>

### MyCalendar~roomList =>  <code>void</code>
State to manage selected rooms for filtering appointments.

**Kind**: inner constant of [<code>MyCalendar</code>](#MyCalendar)  
**Returns**: <code>void</code> - Does not return a value.  
<a name="MyCalendar..cleanupPastAppointments"></a>

### MyCalendar~cleanupPastAppointments => <code>void</code>
Cleans up past appointments by removing them from bookedEvents and updating userList accordingly.

**Kind**: inner constant of [<code>MyCalendar</code>](#MyCalendar)  
**Returns**: <code>void</code> - Does not return a value.  
<a name="MyCalendar..allEvents"></a>

### MyCalendar~allEvents => <code>Array.&lt;Object&gt;</code>
Combines all event types into a single array for calendar display and applies filtering based on selected rooms.

**Kind**: inner constant of [<code>MyCalendar</code>](#MyCalendar)  
**Returns**: <code>Array.&lt;Object&gt;</code> - Array of filtered appointment objects for calendar display.  
<a name="MyCalendar..filteredAppointments"></a>

### MyCalendar~filteredAppointments => <code>Array.&lt;Object&gt;</code>
Filters appointments based on selected rooms and ensures date objects are properly formatted.

**Kind**: inner constant of [<code>MyCalendar</code>](#MyCalendar)  
**Returns**: <code>Array.&lt;Object&gt;</code> - Array of filtered appointment objects with proper date formatting.  
<a name="MyCalendar..handleSelectEvent"></a>

### MyCalendar~handleSelectEvent(event) => <code>void</code>
Handles selecting an event on the calendar.

**Kind**: inner method of [<code>MyCalendar</code>](#MyCalendar)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | The event object that was selected. |
| event.type | <code>string</code> | The type of the event (e.g., "booked", "window"). |
| event.title | <code>string</code> | The title of the event. |
| event.start | <code>Date</code> | The start date/time of the event. |
| event.end | <code>Date</code> | The end date/time of the event. |
| event.room | <code>string</code> | The room assigned to the event. |
| event.noShow | <code>boolean</code> | Indicates if the event was marked as a no-show. |
| event.noShowComment | <code>string</code> | Comments related to the no-show status. |

<a name="MyCalendar..handleBlockDate"></a>

### MyCalendar~handleBlockDate()  => <code>void</code>
Handles blocking a selected date on the calendar.

**Kind**: inner method of [<code>MyCalendar</code>](#MyCalendar)  
<a name="MyCalendar..handleUnBlockDate"></a>

### MyCalendar~handleUnBlockDate() => <code>void</code>
Handles unblocking a previously blocked date on the calendar.

**Kind**: inner method of [<code>MyCalendar</code>](#MyCalendar)  
<a name="MyCalendar..handleShowBlockedDates"></a>

### MyCalendar~handleShowBlockedDates() => <code>void</code>
Toggles the display of blocked dates on the calendar.

**Kind**: inner method of [<code>MyCalendar</code>](#MyCalendar)  
<a name="MyCalendar..handleDateChange"></a>

### MyCalendar~handleDateChange(event) => <code>void</code>
Handles the change of selected date from the date input.

**Kind**: inner method of [<code>MyCalendar</code>](#MyCalendar)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | The event object from the date input change. |
| event.target.value | <code>string</code> | The new selected date value. |

<a name="MyCalendar..combinedEventGetter"></a>

### MyCalendar~combinedEventGetter(event) => <code>void</code>
Handles combining event properties for styling and blocked status.

**Kind**: inner method of [<code>MyCalendar</code>](#MyCalendar)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | The event object to get properties for. |
| event.type | <code>string</code> | The type of the event (e.g., "booked", "window"). |
| event.title | <code>string</code> | The title of the event. |
| event.start | <code>Date</code> | The start date/time of the event. |
| event.end | <code>Date</code> | The end date/time of the event. |
| event.blocked | <code>boolean</code> | Indicates if the event is blocked. |
| event.room | <code>string</code> | The room assigned to the event. |
| event.noShow | <code>boolean</code> | Indicates if the event was marked as a no-show. |
| event.noShowComment | <code>string</code> | Comments related to the no-show status. |

<a name="MyCalendar..handleNoShowChange"></a>

### MyCalendar~handleNoShowChange(e) => <code>void</code>
Handles changes to the no-show checkbox in the event edit form.

**Kind**: inner method of [<code>MyCalendar</code>](#MyCalendar)  

| Param | Type | Description |
| --- | --- | --- |
| e | <code>React.ChangeEvent.&lt;HTMLInputElement&gt;</code> | The change event from the checkbox. |

<a name="MyCalendar..handleUpdateEvent"></a>

### MyCalendar~handleUpdateEvent(updatedEvent) => <code>void</code>
Handles updating an existing event in the booked events list.

**Kind**: inner method of [<code>MyCalendar</code>](#MyCalendar)  

| Param | Type | Description |
| --- | --- | --- |
| updatedEvent | <code>Object</code> | The event object with updated details. |
| updatedEvent.id | <code>string</code> | The unique identifier of the event. |
| updatedEvent.title | <code>string</code> | The title of the event. |
| updatedEvent.start | <code>Date</code> | The start date/time of the event. |
| updatedEvent.end | <code>Date</code> | The end date/time of the event. |
| updatedEvent.room | <code>string</code> | The room assigned to the event. |
| updatedEvent.noShow | <code>boolean</code> | Indicates if the event was marked as a no-show. |
| updatedEvent.noShowComment | <code>string</code> | Comments related to the no-show status. |

<a name="MyCalendar..saveEditedInfo"></a>

### MyCalendar~saveEditedInfo() =>  <code>void</code>
Handles saving edited event information.

**Kind**: inner method of [<code>MyCalendar</code>](#MyCalendar)  
<a name="MyCalendar..handleSearchWindow"></a>

### MyCalendar~handleSearchWindow()  => <code>void</code>
Handles searching for a patient by their ID.

**Kind**: inner method of [<code>MyCalendar</code>](#MyCalendar)  
<a name="MyCalendar..handleSearchWindow..patientBookedAppointments"></a>

#### handleSearchWindow~patientBookedAppointments => <code>void</code>
Handles checking for existing booked appointments for the patient and navigating the calendar accordingly.
If booked appointments exist, navigates to the next upcoming appointment or the earliest one.
If no booked appointments exist, navigates to the first visit window.
Displays alerts based on the navigation action taken.

**Kind**: inner constant of [<code>handleSearchWindow</code>](#MyCalendar..handleSearchWindow)  
<a name="MyCalendar..isAppointmentWithinVisitWindow"></a>

### MyCalendar~isAppointmentWithinVisitWindow(appointment, patient) => <code>boolean</code>
Handles checking if an appointment falls within the patient's visit windows.

**Kind**: inner method of [<code>MyCalendar</code>](#MyCalendar)  
**Returns**: <code>boolean</code> - True if the appointment is within any visit window, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| appointment | <code>Object</code> | The appointment object to check. |
| patient | <code>Object</code> | The patient object containing visit window information. |

<a name="MyCalendar..proceedWithOutOfWindowBooking"></a>

### MyCalendar~proceedWithOutOfWindowBooking() => <code>void</code>
Handles proceeding with booking an appointment outside the visit window after confirmation.

**Kind**: inner method of [<code>MyCalendar</code>](#MyCalendar)  
<a name="MyCalendar..handleClearWindow"></a>

### MyCalendar~handleClearWindow() => <code>void</code>
Handles clearing the search and window events on the calendar.

**Kind**: inner method of [<code>MyCalendar</code>](#MyCalendar)  
<a name="MyCalendar..confirmDeleteEvent"></a>

### MyCalendar~confirmDeleteEvent()  => <code>void</code>
Handles confirming the deletion of an event from the booked events list.

**Kind**: inner method of [<code>MyCalendar</code>](#MyCalendar)  
<a name="MyCalendar..handleEventClick"></a>

### MyCalendar~handleEventClick(event)  => <code>void</code>
Handles clicking on an event in the calendar to open the delete confirmation popup.

**Kind**: inner method of [<code>MyCalendar</code>](#MyCalendar)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | The event object that was clicked. |

<a name="MyCalendar..handleEventAdd"></a>

### MyCalendar~handleEventAdd() => <code>void</code>
Handles adding a new appointment by opening the appointment booking popup.

**Kind**: inner method of [<code>MyCalendar</code>](#MyCalendar)  
<a name="MyCalendar..handleAddAppointment"></a>

### MyCalendar~handleAddAppointment(appointment, [override]) => <code>void</code>
Hand;es adding a new appointment to the booked events list and updating patient context.

**Kind**: inner method of [<code>MyCalendar</code>](#MyCalendar)  
**Returns**: <code>void</code> - Does not return a value.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| appointment | <code>Object</code> |  | The appointment object containing details for the new appointment. |
| [override] | <code>boolean</code> | <code>false</code> | Flag indicating whether to override visit window checks. |

