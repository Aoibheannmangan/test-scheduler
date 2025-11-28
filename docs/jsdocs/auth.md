# Authentication Functions

::: api.scheduler_api.auth.register_user
    handler: python
    options:
        show_root_heading: true
        show_source: true

---
::: api.scheduler_api.auth.login
    handler: python
    options:
        show_root_heading: true
        show_source: true

---

## JWT Authentication and Interactions

* JWT tokens stored in browser localStorage after login
* Token validated on every protected API request via decorator (@token_required)
* User context passed through request chain for audit trails

---
::: api.scheduler_api.tokenDecorator.token_required
    handler: python
    options:
        show_root_heading: true
        show_source: true
