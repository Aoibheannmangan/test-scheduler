<a name="Appointments"></a>

## Appointments() => <code>JSX.Element</code>
Appointments component that renders an overview of patient appointments.
Fetches user data from an API, merges it with booked events from localStorage,
and displays the information with search and filter capabilities.

**Kind**: global function  
**Returns**: <code>JSX.Element</code> - The Appointments component that renders the appointment overview.  
**Component**:   
**Example**  
```js
<Route path="/appointments" element={<Appointments />} />
```

* [Appointments()](#Appointments) <code>JSX.Element</code>
    * [~isFarAway(date)](#Appointments..isFarAway) => <code>boolean</code>
    * [~isMid(date)](#Appointments..isMid) => <code>boolean</code>
    * [~isClose(date)](#Appointments..isClose) => <code>boolean</code>
    * [~toggleCollapseIds(id)](#Appointments..toggleCollapseIds)  => <code>void</code>

<a name="Appointments..isFarAway"></a>

### Appointments~isFarAway(date) => <code>boolean</code>
Checks if the appointment date is more than one month away.

**Kind**: inner method of [<code>Appointments</code>](#Appointments)  
**Returns**: <code>boolean</code> - True if the date is more than one month away, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>Date</code> \| <code>string</code> | The date to check. |

<a name="Appointments..isMid"></a>

### Appointments~isMid(date) => <code>boolean</code>
Checks if the appointment date is between one week and one month away.

**Kind**: inner method of [<code>Appointments</code>](#Appointments)  
**Returns**: <code>boolean</code> - True if the date is between one week and one month away, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>Date</code> \| <code>string</code> | The date to check. |

<a name="Appointments..isClose"></a>

### Appointments~isClose(date) => <code>boolean</code>
Checks if the appointment date is within one week.

**Kind**: inner method of [<code>Appointments</code>](#Appointments)  
**Returns**: <code>boolean</code> - True if the date is within one week, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>Date</code> \| <code>string</code> | The date to check. |

<a name="Appointments..toggleCollapseIds"></a>

### Appointments~toggleCollapseIds(id) => <code>void</code>
Toggles the collapsed state for a given appointment ID.

**Kind**: inner method of [<code>Appointments</code>](#Appointments)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The appointment ID to toggle. |

