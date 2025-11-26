<a name="PopUp"></a>

## PopUp(param0) =><code>JSX.Element</code> \| <code>null</code>
A custom popup component used to confirm an action with the user
Dislays a confirmation message with the option to confirm or close

**Kind**: global function  
**Returns**: <code>JSX.Element</code> \| <code>null</code> - A JSX element representing the popup if open, or null if closed  

| Param | Type | Description |
| --- | --- | --- |
| param0 | <code>Object</code> | The props object |
| param0.isOpen | <code>boolean</code> | If the popup is open or closed |
| param0.onClose | <code>function</code> | The function to call when the popup is closed |
| param0.onConfirm | <code>function</code> | The function to call when the user has confirmed |
| param0.message | <code>string</code> | The message displayed by the popup |

