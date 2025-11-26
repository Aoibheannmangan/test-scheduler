<a name="LogIn"></a>

## LogIn() => <code>JSX.Element</code>
LogIn component that renders the LogIn form and handles user authentication

Checks for stored users, verifies credentials,
navigates to the calendar page on success, displays alert if failed

**Kind**: global function  
**Returns**: <code>JSX.Element</code> - The LogIn component  
**Component**:   
**Example**  
```js
<Route path="/login" element={<LogIn />} />
```
<a name="LogIn..handleLogin"></a>

### LogIn~handleLogin(e) => <code>void</code>
Handles the login form submission

Checks if the email and password submitted by the user match an already created account.
Displays a success alert and navigates to the calendar page if credentials are correct.
Displays an error alert if credentials are incorrect.

**Kind**: inner method of [<code>LogIn</code>](#LogIn)  

| Param | Type | Description |
| --- | --- | --- |
| e | <code>React.FormEvent.&lt;HTMLFormElement&gt;</code> | The form submission event. |

