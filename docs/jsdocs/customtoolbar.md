<a name="CustomToolbar"></a>

## CustomToolbar(param0) => <code>JSX.Element</code>
Custom toolbar for navigation of the Calendar
Allows user to toggle between different calendar views (Month, Week, Day, Agenda)

**Kind**: global function  
**Returns**: <code>JSX.Element</code> - The rendered toolbar with navigation and view buttons  

| Param | Type | Description |
| --- | --- | --- |
| param0 | <code>Object</code> | The Props object |
| param0.label | <code>string</code> | The label to display in the toolbar |
| param0.onNavigate | <code>function</code> | Callback function to navigate to different time periods (Today, previous, next) |
| param0.onView | <code>function</code> | Callback function to change calendar view (Month, Day, Week, Agenda) |
| param0.view | <code>string</code> | The current calendar view |

