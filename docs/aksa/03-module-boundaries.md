# Module Boundaries

## Proposed source structure

```text
src/
├── app/
│   ├── router/
│   ├── layouts/
│   ├── providers/
│   └── guards/
├── design-system/
│   ├── tokens/
│   ├── components/
│   └── icons/
├── core/
│   ├── curriculum/
│   ├── skills/
│   ├── learner/
│   ├── mastery/
│   └── content/
├── features/
│   ├── learn/
│   ├── skill-map/
│   ├── labs/
│   ├── projects/
│   ├── assessment/
│   ├── ai-tutor/
│   ├── mentors/
│   ├── live/
│   ├── portfolio/
│   ├── passport/
│   └── career/
├── studio/
│   ├── editor/
│   ├── templates/
│   ├── media/
│   ├── content-factory/
│   ├── validation/
│   └── review/
├── integrations/
│   ├── supabase/
│   ├── ai/
│   ├── openmaic/
│   ├── live/
│   ├── office/
│   ├── notebook/
│   └── spatial/
└── shared/
```

## Dependency direction

Allowed:
`UI -> feature service -> core domain -> integration interface`

Forbidden:
- core domain importing page components,
- core domain importing OpenMAIC internals,
- validation rules hidden inside arbitrary UI components,
- direct AI-provider calls from learner/studio React components,
- direct database calls scattered across presentation components.

## AdminDashboard decomposition target

The existing large admin component should eventually split into:
- platform dashboard,
- users/roles,
- academic/curriculum,
- studio/content,
- validation/review,
- programs/commerce,
- analytics,
- configuration.

B1 may decompose shell and navigation; feature behavior migrations occur in later batches.
