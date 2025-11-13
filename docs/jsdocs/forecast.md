## Functions

<dl>
<dt><a href="#createData">createData(monthYear, count)</a> <code>Object</code></dt>
<dd><p>Creates a data row for the table.</p>
</dd>
<dt><a href="#Forecast">Forecast()</a>  <code>JSX.Element</code></dt>
<dd><p>Forecast component for displaying appointments.</p>
</dd>
</dl>

<a name="createData"></a>

## createData(monthYear, count) => <code>Object</code>
Creates a data row for the table.

**Kind**: global function  
**Returns**: <code>Object</code> - A data row object containing the monthYear and count.  

| Param | Type | Description |
| --- | --- | --- |
| monthYear | <code>string</code> | The month and year (e.g., "January 2025"). |
| count | <code>number</code> | The number of appointments booked in that month. |

<a name="Forecast"></a>

## Forecast() => <code>JSX.Element</code>
Forecast component for displaying appointments.

**Kind**: global function  
**Returns**: <code>JSX.Element</code> - The Forecast component that displays the forecast of booked appointments per month.  

* [Forecast()](#Forecast)  => <code>JSX.Element</code>
    * [~handleChangePage(_event, newPage)](#Forecast..handleChangePage) => <code>void</code>
    * [~handleChangeRowsPerPage(event)](#Forecast..handleChangeRowsPerPage) => <code>void</code>

<a name="Forecast..handleChangePage"></a>

### Forecast~handleChangePage(_event, newPage) =>  <code>void</code>
Handles page change in the table pagination.

**Kind**: inner method of [<code>Forecast</code>](#Forecast)  

| Param | Type | Description |
| --- | --- | --- |
| _event | <code>Event</code> | The pagination event. |
| newPage | <code>number</code> | The new page number to display. |

<a name="Forecast..handleChangeRowsPerPage"></a>

### Forecast~handleChangeRowsPerPage(event)  => <code>void</code>
Handles the change in the number of rows per page in the table pagination.

**Kind**: inner method of [<code>Forecast</code>](#Forecast)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>React.ChangeEvent</code> | The event triggering the change in rows per page. |

