<a name="RebookingForm"></a>

## RebookingForm(param0) => <code>JSX.Element</code>
A form component that allows user to reschedule and event
Users can select a new start and end time, and provide a reason for the no-show

**Kind**: global function  
**Returns**: <code>JSX.Element</code> - The JSX for rendering the rebooking form  

| Param | Type | Description |
| --- | --- | --- |
| param0 | <code>Object</code> | The props object |
| param0.event | <code>Object</code> | The event to be rebooked, with details such as start and end time |
| param0.onSave | <code>function</code> | A function to save the updated event with new details |
| param0.onCancel | <code>function</code> | A function to cancel the rebooking process and close the form |

