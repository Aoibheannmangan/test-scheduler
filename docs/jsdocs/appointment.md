<a name="ToggleAppointment"></a>

## ToggleAppointment() => <code>void</code>
Toggle is not visible by default

**Kind**: global function  
**Returns**: <code>void</code> - Does not return a value  

* [ToggleAppointment()](#ToggleAppointment) => <code>void</code>
    * [~selectedStart](#ToggleAppointment..selectedStart) => <code>Date</code> \| <code>null</code> \| <code>Date</code> \| <code>null</code>
    * [~roomOptions](#ToggleAppointment..roomOptions) => <code>Array.&lt;Object&gt;</code>
    * [~isRoomAvailable(roomId, startTime, endTime, appointments)](#ToggleAppointment..isRoomAvailable) => <code>Boolean</code>
    * [~handleSubmit(e)](#ToggleAppointment..handleSubmit) => <code>void</code>

<a name="ToggleAppointment..selectedStart"></a>

### ToggleAppointment~selectedStart => <code>Date</code> \| <code>null</code> \| <code>Date</code> \| <code>null</code>
Calculates the selected start and end times based on the provided date and time.
These values are memoized to avoid recalculating unless dependencies change.

**Kind**: inner constant of [<code>ToggleAppointment</code>](#ToggleAppointment)  
**Returns**: <code>Date</code> \| <code>null</code> - The selected start time or `null` if invalid inputs.<code>Date</code> \| <code>null</code> - The selected end time or `null` if invalid inputs.  
<a name="ToggleAppointment..roomOptions"></a>

### ToggleAppointment~roomOptions => <code>Array.&lt;Object&gt;</code>
Generates the room options with avaliability based on selected start times

**Kind**: inner constant of [<code>ToggleAppointment</code>](#ToggleAppointment)  
**Returns**: <code>Array.&lt;Object&gt;</code> - - A list of rooms with their avaliabilty status  
<a name="ToggleAppointment..isRoomAvailable"></a>

### ToggleAppointment~isRoomAvailable(roomId, startTime, endTime, appointments) => <code>Boolean</code>
Checks if a room is avaliable at a time

**Kind**: inner method of [<code>ToggleAppointment</code>](#ToggleAppointment)  
**Returns**: <code>Boolean</code> - - Returns true if avaliable, false if not  

| Param | Type | Description |
| --- | --- | --- |
| roomId | <code>string</code> | The ID of the room |
| startTime | <code>Date</code> | Appointment start time |
| endTime | <code>Date</code> | Appointment end time |
| appointments | <code>Array.&lt;Object&gt;</code> | List of current appointments |

<a name="ToggleAppointment..handleSubmit"></a>

### ToggleAppointment~handleSubmit(e) => <code>void</code>
Handles form submission for new appointments
Validates the start and end times
Constructs a new appointment object and calls onAddAppointment
Resets form state after submission

**Kind**: inner method of [<code>ToggleAppointment</code>](#ToggleAppointment)  

| Param | Type | Description |
| --- | --- | --- |
| e | <code>Event</code> | Event triggered by form submission |

