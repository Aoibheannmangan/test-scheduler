<a name="ClickableDateCell"></a>

## ClickableDateCell(param0) => <code>JSX.Element</code>
A custom clickable cell that allows the selection of a date unless it's been blocked

**Kind**: global function  
**Returns**: <code>JSX.Element</code> - The code that renders the clickable date cell.  

| Param | Type | Description |
| --- | --- | --- |
| param0 | <code>Object</code> | The prop object passed to the ClickableCell component |
| param0.children | <code>React.ReactNode</code> | The content to be displayed inside the date cell |
| param0.value | <code>Date</code> | THe date value the cell represents |
| param0.onSelectedSlot | <code>function</code> | A callback function that is triggered when the date cell is selected |
| param0.blockedDates | <code>Array.&lt;Object&gt;</code> | An array containing all the blocked dates |

