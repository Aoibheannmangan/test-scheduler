<a name="ForgotPsw"></a>

## ForgotPsw() => <code>JSX.Element</code>
ForgotPsw component that renders the password reset form and handles password resetting
validates new password, checks for existing user email,
navigates to calendar page on success, displays alert if failed

**Kind**: global function  
**Returns**: <code>JSX.Element</code> - The ForgotPsw component  
**Component**:   
**Example**  
```js
<Route path="/forgot-password" element={<ForgotPsw />} />
```
