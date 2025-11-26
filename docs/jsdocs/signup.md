<a name="SignUp"></a>

## SignUp() => <code>JSX.Element</code>
SignUp component that renders the SignUp form and handles user registration

Validates user input, checks for existing users, creates new user accounts,
navigates to the calendar page on success, displays alert if failed

**Kind**: global function  
**Returns**: <code>JSX.Element</code> - The SignUp component  
**Component**:   
**Example**  
```js
<Route path="/signup" element={<SignUp />} />
```

* [SignUp()](#SignUp) => <code>JSX.Element</code>
    * [~handlePasswordChange(e)](#SignUp..handlePasswordChange)
    * [~isEmailRegistered(email)](#SignUp..isEmailRegistered) => <code>boolean</code>
    * [~isIdInUse(staffId)](#SignUp..isIdInUse) => <code>boolean</code>
    * [~handleSubmit(e)](#SignUp..handleSubmit) => <code>void</code>

<a name="SignUp..handlePasswordChange"></a>

### SignUp~handlePasswordChange(e) =>
Password validation handler to validate password requirements

**Kind**: inner method of [<code>SignUp</code>](#SignUp)  

| Param | Type | Description |
| --- | --- | --- |
| e | <code>React.ChangeEvent.&lt;HTMLInputElement&gt;</code> | The event from the password input |

<a name="SignUp..isEmailRegistered"></a>

### SignUp~isEmailRegistered(email) => <code>boolean</code>
Checks if the email is already registered

**Kind**: inner method of [<code>SignUp</code>](#SignUp)  
**Returns**: <code>boolean</code> - True if email is registered, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| email | <code>string</code> | The email address to check |

<a name="SignUp..isIdInUse"></a>

### SignUp~isIdInUse(staffId)  => <code>boolean</code>
Checks if the given ID is already in use

**Kind**: inner method of [<code>SignUp</code>](#SignUp)  
**Returns**: <code>boolean</code> - True if ID is in use, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| staffId | <code>string</code> | The staff ID to check |

<a name="SignUp..handleSubmit"></a>

### SignUp~handleSubmit(e) =>  <code>void</code>
Handles the signup form submission, validates input data
saves new user to local storage if valid
navigates to calendar page on success, shows alert on failure

**Kind**: inner method of [<code>SignUp</code>](#SignUp)  

| Param | Type | Description |
| --- | --- | --- |
| e | <code>React.FormEvent.&lt;HTMLFormElement&gt;</code> | THe form submission event. |

