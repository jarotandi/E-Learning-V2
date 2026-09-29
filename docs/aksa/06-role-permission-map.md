# Role & Permission Map

Initial AKSA roles:

| Role | Core capabilities |
|---|---|
| learner | learn, practice, submit work, request support |
| parent | permitted learner visibility for linked child/account |
| educator | teach, answer, mentor, create drafts, assess assigned learners |
| reviewer | review academic content within assigned scopes |
| specialist_reviewer | review high-risk/specialist domains |
| institution_admin | manage institution classes/users within tenant scope |
| platform_admin | platform governance and operations |

## Separation of duties

Creator and final approver should be distinct for high-risk content.

### Example content permissions

```text
content.create_draft
content.edit_own
content.submit_validation
validation.view
validation.resolve
review.claim
review.approve
review.request_revision
publish.execute
source.manage
curriculum.manage
```

## Tenant/security direction

B2 must implement:
- authenticated identity,
- organization/institution scope where applicable,
- row-level security,
- least privilege,
- deny-by-default mutation policies for governance tables,
- auditable approval/publish actions.

## Child/minor safety direction

Where learner age requires it, future policy must support:
- restricted educator contact,
- approved communication channels,
- session audit metadata,
- reporting/blocking,
- guardian/institution policy integration.
