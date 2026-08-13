# Pulse — Full-Stack Monorepo Roadmap

## Project Vision

**Pulse** is a production-minded product ecosystem built to demonstrate Staff/Principal Frontend Engineer capability—not merely CRUD implementation.

It will prove the ability to:

- Design scalable frontend architecture and developer experience.
- Build a reusable design system used by multiple real applications.
- Create a typed SDK rather than scattering `fetch` calls throughout UI code.
- Build accessible, responsive, high-performance React interfaces.
- Understand backend concerns: HTTP, authentication, middleware, persistence, observability, and deployment.
- Explain tradeoffs clearly in interviews through a coherent end-to-end project.

### Product Concept

Pulse is a project and work-management platform.

- **Dashboard:** internal workspace for projects, tasks, activity, analytics, and administration.
- **Demo Shop:** consumer e-commerce application that uses the same design system and selected shared packages.
- **API:** backend powering the product ecosystem.
- **Design System:** shared visual language and accessible UI primitives.
- **SDK:** typed client used by all frontend applications.

---

# Success Criteria

By the end of the roadmap, Pulse should demonstrate:

- [ ] A clean, maintainable TypeScript monorepo.
- [ ] An API with authentication, authorization, validation, logging, tests, and documented endpoints.
- [ ] A reusable, token-based design system.
- [ ] A typed SDK consumed by the dashboard and demo shop.
- [ ] A responsive dashboard with meaningful tables, filters, forms, charts, and states.
- [ ] A complete demo-shop journey: browse → product detail → cart → checkout.
- [ ] Unit, integration, and end-to-end tests.
- [ ] Docker-based local development and production-ready deployment configuration.
- [ ] CI/CD checks for quality, test coverage, and builds.
- [ ] Monitoring, error tracking, and a concise architecture narrative for interviews.

---

# Monorepo Architecture

```text
pulse/
├── apps/
│   ├── api/                    # Node.js backend and HTTP API
│   ├── dashboard/              # Internal Pulse workspace
│   ├── demo-shop/              # Consumer-facing commerce demo
│   └── docs/                   # Design-system and engineering documentation
│
├── packages/
│   ├── design-system/          # Shared accessible React components
│   ├── tokens/                 # Colors, spacing, typography, motion, themes
│   ├── sdk/                    # Typed API client and domain APIs
│   ├── hooks/                  # Shared React hooks
│   ├── utils/                  # Framework-agnostic utilities
│   ├── icons/                  # SVG icon library
│   ├── types/                  # Shared domain contracts where appropriate
│   ├── eslint-config/          # Shared lint configuration
│   └── tsconfig/               # Shared TypeScript base configuration
│
├── tooling/
│   └── scripts/                # Repository automation and checks
│
├── docker/
│   ├── api.Dockerfile
│   ├── dashboard.Dockerfile
│   └── demo-shop.Dockerfile
│
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## Package Responsibilities

| Area                     | Responsibility                                 | Must not own                    |
| ------------------------ | ---------------------------------------------- | ------------------------------- |
| `apps/api`               | HTTP routes, business logic, persistence, auth | UI concerns                     |
| `apps/dashboard`         | Internal product experiences                   | Direct low-level API calls      |
| `apps/demo-shop`         | Customer commerce experience                   | Duplicate UI primitives         |
| `packages/design-system` | Accessible UI primitives and compositions      | Product-specific business logic |
| `packages/tokens`        | Design decisions expressed as tokens           | Component behavior              |
| `packages/sdk`           | Typed API transport, errors, domain clients    | React UI state                  |
| `packages/hooks`         | Reusable React behavior                        | Product-specific workflows      |
| `packages/utils`         | Small pure helpers                             | React dependencies              |
| `packages/icons`         | Consistent SVG icons                           | Feature-specific illustrations  |
| `apps/docs`              | Component examples, usage guidance, ADRs       | Source-of-truth component code  |

---

# Operating Principles

- **Reuse deliberately:** extract only after a second credible use case.
- **Keep boundaries explicit:** apps compose packages; packages should not depend on apps.
- **Accessibility is a feature:** keyboard navigation, focus behavior, semantics, and contrast are definition-of-done requirements.
- **Build from foundations upward:** tokens → primitives → compositions → product features.
- **Prefer typed contracts:** API schemas, SDK types, and UI states should agree.
- **Document decisions:** use Architecture Decision Records (ADRs) for meaningful tradeoffs.
- **Show real product states:** loading, empty, error, permission-denied, and responsive states are never optional.

---

# Milestones

| Milestone            |         Target | Outcome                                               |
| -------------------- | -------------: | ----------------------------------------------------- |
| M1 — Foundation      |  End of Week 1 | Monorepo, quality tools, API skeleton, shared tokens  |
| M2 — Product Core    |  End of Week 3 | Authenticated API, database, first dashboard flows    |
| M3 — Design System   |  End of Week 5 | Production-quality primitives used by multiple apps   |
| M4 — Applications    |  End of Week 7 | Dashboard analytics and complete demo-shop journey    |
| M5 — Reliability     |  End of Week 9 | Tests, Docker, CI/CD, monitoring                      |
| M6 — Portfolio Ready | End of Week 10 | Polished deployment, docs, demos, interview narrative |

---

# 10-Week Roadmap

## Week 1 — Foundation and Developer Experience

### Phase Goal

Create a reliable monorepo baseline and establish conventions before feature work begins.

### Weekly Deliverables

- [ ] Workspace configured with package manager, TypeScript, linting, formatting, and test runner.
- [ ] `api`, `dashboard`, `demo-shop`, `design-system`, `tokens`, `sdk`, `hooks`, `utils`, and `icons` scaffolds exist.
- [ ] Shared TypeScript and lint configurations work across packages.
- [ ] API health route and application shell pages run locally.
- [ ] Initial README explains setup, architecture, and scripts.

### Daily Breakdown

| Day | Focus               | Completion Criteria                                                                      |
| --- | ------------------- | ---------------------------------------------------------------------------------------- |
| 1   | Repository setup    | Configure workspace, root scripts, TypeScript, linting, formatting, Git hooks if desired |
| 2   | App scaffolding     | Create API, dashboard, demo-shop, and docs application shells                            |
| 3   | Package scaffolding | Create tokens, design system, SDK, hooks, utils, icons, shared types                     |
| 4   | Shared conventions  | Establish imports, aliases, environment-variable policy, error conventions               |
| 5   | API baseline        | Add health endpoint, request ID, structured logging baseline, API README                 |
| 6   | UI baseline         | Add routes, app shell, theme foundation, responsive page container                       |
| 7   | Review and cleanup  | Verify fresh-clone setup; write first ADRs and backlog                                   |

### Learning Objectives

- Monorepo dependency boundaries.
- TypeScript project references and shared configuration.
- Package publishing versus internal workspace packages.
- Repository-level developer experience.

### Interview Topics

- Why a monorepo instead of multiple repositories?
- How do you prevent package coupling?
- Which shared code belongs in a package—and which does not?
- How do you make local development fast in a large frontend codebase?

---

## Week 2 — API Foundations, HTTP, and Database Design

### Phase Goal

Establish a backend that is intentionally structured rather than route-handler-driven.

### Weekly Deliverables

- [ ] Resource-oriented API conventions.
- [ ] Validation, error response, request logging, and centralized error handling.
- [ ] Initial database schema and migrations.
- [ ] Project, task, user, and workspace data model.
- [ ] Seed data for local development.

### Daily Breakdown

| Day | Focus             | Completion Criteria                                                   |
| --- | ----------------- | --------------------------------------------------------------------- |
| 1   | API conventions   | Define route naming, status codes, error envelope, pagination format  |
| 2   | Validation        | Add request parsing and schema validation for create/update flows     |
| 3   | Database schema   | Model users, workspaces, projects, tasks, memberships, activity       |
| 4   | Persistence layer | Add migrations, repositories/data-access layer, local seed script     |
| 5   | Project APIs      | Implement project list, detail, create, update, archive               |
| 6   | Task APIs         | Implement task CRUD, status transitions, assignment, filtering        |
| 7   | API review        | Test invalid inputs, document endpoints, refine errors and edge cases |

### Learning Objectives

- RESTful resource modeling.
- Schema validation and trusted input boundaries.
- Relational database design and migrations.
- Pagination, filtering, sorting, and query performance basics.

### Interview Topics

- How would you model projects and tasks relationally?
- Where should validation happen?
- Why use migrations instead of manually changing a database?
- How do you design stable error responses for frontend consumers?

---

## Week 3 — Authentication, Authorization, and Middleware Evolution

### Phase Goal

Build secure, understandable request processing and introduce real access control.

### Weekly Deliverables

- [ ] Authentication flow with secure session or token strategy.
- [ ] Protected routes and user context.
- [ ] Workspace role-based access control.
- [ ] Middleware pipeline with observability and error handling.
- [ ] Dashboard login and authenticated shell.

### Daily Breakdown

| Day | Focus             | Completion Criteria                                                        |
| --- | ----------------- | -------------------------------------------------------------------------- |
| 1   | Auth design       | Choose session or token approach; document security tradeoffs              |
| 2   | Identity routes   | Implement sign-up, sign-in, sign-out, current-user endpoint                |
| 3   | Authorization     | Add membership roles: owner, admin, member, viewer                         |
| 4   | Middleware        | Implement auth, authorization, request IDs, logging, errors                |
| 5   | Dashboard auth UI | Login form, route protection, user/session state                           |
| 6   | Security pass     | Password handling, rate-limiting strategy, CORS and environment review     |
| 7   | End-to-end flow   | Validate a user can authenticate and access only authorized workspace data |

### Middleware Evolution

| Stage | Middleware            | Purpose                                                  |
| ----- | --------------------- | -------------------------------------------------------- |
| 1     | Request ID            | Correlate logs and failures across a request             |
| 2     | Request logger        | Record method, path, response status, duration           |
| 3     | CORS/security headers | Define browser access and baseline protections           |
| 4     | Body parser           | Parse trusted request formats and set limits             |
| 5     | Validation            | Reject malformed data before business logic              |
| 6     | Authentication        | Resolve the current user                                 |
| 7     | Authorization         | Confirm role and resource access                         |
| 8     | Rate limiting         | Protect sensitive and expensive endpoints                |
| 9     | Error handler         | Convert expected/unexpected failures into safe responses |
| 10    | Metrics/tracing       | Measure latency, errors, and dependency behavior         |

### Learning Objectives

- Session versus JWT tradeoffs.
- Authentication versus authorization.
- Middleware ordering and error propagation.
- Multi-tenant resource authorization.

### Interview Topics

- How do you secure a multi-tenant API?
- What is the difference between authentication and authorization?
- Why is middleware order important?
- How would you debug a production request across services?

---

## Week 4 — Design Tokens and UI Primitives

### Phase Goal

Create the visual and interaction foundations that every app will share.

### Weekly Deliverables

- [ ] Token system for color, typography, spacing, radii, elevation, motion, and breakpoints.
- [ ] Light/dark theme capability or documented theme approach.
- [ ] Accessible primitives: Button, Input, Textarea, Select, Checkbox, Radio, Switch.
- [ ] Icon system with consistent sizing and accessible labels.
- [ ] Component documentation examples.

### Daily Breakdown

| Day | Focus                 | Completion Criteria                                                |
| --- | --------------------- | ------------------------------------------------------------------ |
| 1   | Foundations           | Define naming strategy and core design tokens                      |
| 2   | Typography and layout | Establish type scale, spacing scale, container and grid tokens     |
| 3   | Color and themes      | Define semantic colors, contrast checks, theme variables           |
| 4   | Form primitives       | Build controlled/uncontrolled input patterns and validation states |
| 5   | Button and feedback   | Build buttons, loading states, icons, badges, status indicators    |
| 6   | Icons and docs        | Create SVG icon API, component examples, usage guidance            |
| 7   | Adoption              | Replace duplicated dashboard UI styles with shared primitives      |

### Learning Objectives

- Primitive versus semantic design tokens.
- CSS custom properties and theming.
- Accessible form controls and labels.
- Controlled component APIs and composition.

### Interview Topics

- What makes a design system successful?
- How do tokens enable theming and consistency?
- How do you avoid building an overly abstract component library?
- How do you introduce a design system into an existing application?

---

## Week 5 — Advanced Components and CSS Mastery

### Phase Goal

Build complex accessible components and deepen layout, responsive, and interaction skills.

### Weekly Deliverables

- [ ] Card, Modal, Drawer, Tooltip, Dropdown/Menu, Tabs, Accordion, Toast, Avatar, and Table.
- [ ] Keyboard and focus-management behavior documented and tested.
- [ ] Responsive dashboard layout using CSS Grid.
- [ ] Component accessibility review.

### Daily Breakdown

| Day | Focus                  | Completion Criteria                                              |
| --- | ---------------------- | ---------------------------------------------------------------- |
| 1   | Layout primitives      | Build Stack, Inline, Container, Grid, and Card                   |
| 2   | Overlay components     | Build Modal and Drawer with portal, escape, focus return         |
| 3   | Navigation components  | Build Tabs, Menu, Dropdown, Tooltip                              |
| 4   | Information components | Build Table, Avatar, Badge, Empty State, Skeleton                |
| 5   | Feedback components    | Build Toast and inline validation patterns                       |
| 6   | Responsive CSS         | Implement dashboard grid, container queries where useful         |
| 7   | Accessibility audit    | Test keyboard paths, screen-reader names, contrast, focus states |

### CSS Mastery Roadmap

| Level             | Topics                                                       | Evidence in Pulse                           |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------- |
| Foundations       | Box model, cascade, specificity, custom properties           | Predictable global styles and tokens        |
| Layout            | Flexbox, Grid, intrinsic sizing, `minmax`, `auto-fit`        | Dashboard shell, cards, data layouts        |
| Responsive design | Mobile-first CSS, fluid type, media queries                  | Dashboard and shop work across screen sizes |
| Modern CSS        | `clamp`, `:is`, `:where`, `aspect-ratio`, logical properties | Maintainable component styles               |
| Component styling | Variants, states, composition, CSS layers                    | Design-system component APIs                |
| Advanced layout   | Container queries, subgrid when appropriate                  | Adaptable cards and dense data views        |
| Motion            | Transitions, reduced motion, keyframes                       | Toasts, drawers, feedback states            |
| Performance       | Containment, avoiding layout thrash, efficient selectors     | Smooth interaction under realistic data     |
| Accessibility     | Focus-visible, contrast, reduced motion, forced colors       | Inclusive shared components                 |

### Interview Topics

- Explain when to use Grid versus Flexbox.
- How would you build an accessible modal?
- How do container queries change component design?
- How do you manage CSS scale in a large frontend codebase?

---

## Week 6 — SDK, Shared Hooks, and Dashboard Product Core

### Phase Goal

Replace ad hoc network access with a typed SDK and build the dashboard’s core workflows.

### Weekly Deliverables

- [ ] API client with configuration, request handling, typed responses, and typed errors.
- [ ] Domain SDK modules: auth, projects, tasks, users, analytics.
- [ ] Shared data hooks or query integration.
- [ ] Dashboard project list, project details, task board, and task editing flows.
- [ ] Loading, empty, error, and permission-denied states.

### Daily Breakdown

| Day | Focus              | Completion Criteria                                                  |
| --- | ------------------ | -------------------------------------------------------------------- |
| 1   | SDK foundation     | Create client configuration, headers, error classes, request utility |
| 2   | Domain endpoints   | Add project, task, auth, and user SDK modules                        |
| 3   | Data strategy      | Add caching/query layer, invalidation policy, mutation patterns      |
| 4   | Dashboard projects | Build project list, filtering, sorting, pagination                   |
| 5   | Task workflow      | Build task board/list, create/edit task, status changes              |
| 6   | Product states     | Add skeletons, empty states, retry actions, permission feedback      |
| 7   | SDK review         | Confirm apps call SDK rather than raw `fetch`; document public API   |

### SDK Roadmap

| Capability     | Requirement                                                          |
| -------------- | -------------------------------------------------------------------- |
| Configuration  | Base URL, auth strategy, request timeout, environment support        |
| Transport      | Consistent JSON parsing, headers, status handling                    |
| Errors         | Typed API error, network error, validation error, unauthorized error |
| Domain modules | `projects`, `tasks`, `users`, `auth`, `analytics`                    |
| Types          | Request and response types aligned with backend contracts            |
| Extensibility  | Interceptors/hooks for logging, auth refresh, tracing                |
| Testing        | Mockable transport and contract-level tests                          |
| Documentation  | Examples for browser, server, and React usage if applicable          |

### Learning Objectives

- SDK boundaries and transport abstractions.
- Client-side caching and invalidation.
- Server state versus UI state.
- Optimistic updates and rollback strategies.

### Interview Topics

- Why create an SDK for an internal API?
- How should a frontend handle API errors?
- What state belongs in a global store?
- Explain cache invalidation after a mutation.

---

## Week 7 — Dashboard Analytics and Demo Shop

### Phase Goal

Demonstrate that the shared system works in distinct product contexts.

### Weekly Deliverables

- [ ] Dashboard overview with metrics, charts, filters, and activity feed.
- [ ] Demo-shop catalog, search, product detail, cart, and checkout.
- [ ] Shared design-system adoption in both applications.
- [ ] Responsive visual QA at mobile, tablet, and desktop widths.

### Daily Breakdown

| Day | Focus              | Completion Criteria                                                         |
| --- | ------------------ | --------------------------------------------------------------------------- |
| 1   | Dashboard overview | Add KPI cards, recent activity, project health sections                     |
| 2   | Analytics          | Add date ranges, filters, accessible chart summaries and table alternatives |
| 3   | Shop catalog       | Build category navigation, filters, product listing, search                 |
| 4   | Product details    | Build gallery, variants, inventory state, related products                  |
| 5   | Cart               | Build cart state, quantity controls, totals, empty cart                     |
| 6   | Checkout           | Build address/payment mock flow, validation, confirmation                   |
| 7   | Cross-app audit    | Confirm shared components feel appropriate in both contexts                 |

### Dashboard Roadmap

- [ ] Authenticated application shell and navigation.
- [ ] Project and task management.
- [ ] Table sorting, filtering, pagination, and bulk actions where useful.
- [ ] Dashboard overview and analytics.
- [ ] Activity/audit timeline.
- [ ] Profile, team, and workspace settings.
- [ ] Responsive and accessible data-dense interfaces.
- [ ] Error, loading, empty, and permission state coverage.

### Demo-Shop Roadmap

- [ ] Home and promotional landing page.
- [ ] Search and category browsing.
- [ ] Product listing with filtering and sorting.
- [ ] Product details with variants and availability.
- [ ] Cart with persisted local state.
- [ ] Checkout with form validation and order confirmation.
- [ ] Order history or success state.
- [ ] Responsive product imagery and accessible commerce controls.

### Interview Topics

- How do you keep a design system flexible across products?
- How do you make charts accessible?
- What makes a table usable on small screens?
- How would you structure cart state and checkout validation?

---

## Week 8 — Quality, Testing, and Performance

### Phase Goal

Turn a functioning project into a dependable one.

### Weekly Deliverables

- [ ] Unit tests for utilities, business logic, and components.
- [ ] API integration tests for critical routes.
- [ ] End-to-end tests for authentication, project/task workflow, and checkout.
- [ ] Performance baseline and targeted improvements.
- [ ] Accessibility test coverage for key components and flows.

### Daily Breakdown

| Day | Focus            | Completion Criteria                                                       |
| --- | ---------------- | ------------------------------------------------------------------------- |
| 1   | Test strategy    | Define unit, integration, component, contract, and E2E responsibilities   |
| 2   | API tests        | Cover auth, authorization, validation, projects, tasks                    |
| 3   | Component tests  | Test forms, overlays, menus, states, keyboard interactions                |
| 4   | SDK tests        | Test serialization, errors, mocked transport, domain clients              |
| 5   | E2E dashboard    | Test sign-in, create task, update task, filters                           |
| 6   | E2E shop         | Test browse, add to cart, checkout confirmation                           |
| 7   | Performance/a11y | Run audits; reduce avoidable renders, improve landmark and focus coverage |

### Testing Pyramid

| Test Type     | Purpose                               | Examples                                        |
| ------------- | ------------------------------------- | ----------------------------------------------- |
| Unit          | Verify isolated logic quickly         | token helpers, date utilities, task state rules |
| Component     | Verify user-facing component behavior | modal focus trap, input errors, menus           |
| Integration   | Verify collaborating layers           | API route + database + authorization            |
| Contract      | Verify API/SDK expectations           | response schema and error-envelope alignment    |
| End-to-end    | Verify critical user journeys         | sign in → task update; browse → checkout        |
| Visual/manual | Verify layout and design quality      | responsive snapshots, browser/device checks     |

### Learning Objectives

- Choosing the correct test level.
- Testing behavior instead of implementation details.
- Accessibility automation limitations and manual checks.
- Frontend performance profiling basics.

### Interview Topics

- What would you test first in a time-constrained project?
- How do you prevent flaky end-to-end tests?
- How do you investigate a slow React page?
- Why is accessibility testing not fully automatable?

---

## Week 9 — Docker, CI/CD, Deployment, and Monitoring

### Phase Goal

Make Pulse reproducible locally and reliable in a deployed environment.

### Weekly Deliverables

- [ ] Dockerfiles and Docker Compose development environment.
- [ ] CI pipeline for linting, type checks, tests, and builds.
- [ ] Preview or production deployment.
- [ ] Environment management and secret-handling documentation.
- [ ] Error tracking, structured logs, and health checks.

### Daily Breakdown

| Day | Focus             | Completion Criteria                                                      |
| --- | ----------------- | ------------------------------------------------------------------------ |
| 1   | Container plan    | Define dev/prod Docker strategy and service dependencies                 |
| 2   | Docker setup      | Add API and frontend Dockerfiles plus Compose environment                |
| 3   | CI pipeline       | Run install, lint, typecheck, test, build on every pull request          |
| 4   | Deployment        | Deploy API, dashboard, demo shop, and database as applicable             |
| 5   | Configuration     | Document environment variables, secrets, migrations, rollback steps      |
| 6   | Monitoring        | Add health endpoint, error tracking, logs, baseline metrics              |
| 7   | Reliability drill | Simulate invalid config, database outage, and failed deployment response |

### CI/CD Checklist

- [ ] Lockfile is enforced.
- [ ] Linting runs on changed code.
- [ ] Type checking runs across the workspace.
- [ ] Unit/integration tests run automatically.
- [ ] End-to-end tests run on a suitable environment.
- [ ] Builds must pass before merge.
- [ ] Dependency and secret scanning are considered.
- [ ] Deployments are traceable to a commit.
- [ ] Database migrations have a documented release sequence.
- [ ] Rollback approach is documented.

### Monitoring Checklist

- [ ] Health/readiness endpoint exists.
- [ ] Structured logs include request ID, method, path, status, and duration.
- [ ] Error tracking captures frontend and backend exceptions.
- [ ] Sensitive data is excluded from logs.
- [ ] Basic latency, error-rate, and availability metrics exist.
- [ ] Alerts have an owner and actionable threshold.
- [ ] Runbook describes diagnosis and rollback.

### Interview Topics

- How would you deploy a monorepo?
- What belongs in a Docker image versus runtime configuration?
- How do you safely handle database migrations?
- What signals tell you a service is unhealthy?

---

## Week 10 — Documentation, Polish, and Interview Readiness

### Phase Goal

Package the project as a persuasive portfolio artifact and prepare to discuss its decisions with confidence.

### Weekly Deliverables

- [ ] Updated README with setup, architecture, screenshots, and live links.
- [ ] Design-system documentation site or component documentation section.
- [ ] ADRs for key architectural decisions.
- [ ] Architecture diagram and data-flow documentation.
- [ ] Portfolio demo script and interview story bank.
- [ ] Final QA and backlog for future work.

### Daily Breakdown

| Day | Focus              | Completion Criteria                                                  |
| --- | ------------------ | -------------------------------------------------------------------- |
| 1   | Documentation      | Complete root README, application READMEs, contribution guidance     |
| 2   | System docs        | Document tokens, component usage, SDK usage, accessibility standards |
| 3   | Architecture       | Create diagrams for monorepo, request lifecycle, and deployment      |
| 4   | ADRs               | Document meaningful decisions and rejected alternatives              |
| 5   | Portfolio polish   | Capture screenshots, write case study, prepare live demo links       |
| 6   | Interview practice | Rehearse architecture walkthrough and behavioral stories             |
| 7   | Final release      | Run full QA, tag milestone, create prioritized future roadmap        |

### Portfolio Checklist

- [ ] Clear project statement and target engineering level.
- [ ] Public/demo environment works reliably.
- [ ] Architecture diagram is understandable in under two minutes.
- [ ] Screenshots show dashboard and commerce use cases.
- [ ] Design system has clear examples and accessibility notes.
- [ ] README includes local setup and technical decisions.
- [ ] Demo script follows a realistic user journey.
- [ ] Known limitations and next steps are stated honestly.

---

# Architecture Topics to Master

| Topic               | Pulse Application                                                     |
| ------------------- | --------------------------------------------------------------------- |
| Monorepo boundaries | Apps consume packages; packages remain independently understandable   |
| Domain modeling     | Users, workspaces, memberships, projects, tasks, products, orders     |
| API design          | Resource routes, validation, pagination, versioning strategy          |
| Authentication      | Identity, session/token lifecycle, protected routes                   |
| Authorization       | Tenant isolation and role-based permissions                           |
| State management    | Server state, local component state, URL state, persisted cart state  |
| Design systems      | Tokens, primitives, composites, documentation, governance             |
| Performance         | Bundle analysis, rendering behavior, caching, data pagination         |
| Accessibility       | Semantics, keyboard usage, focus, visual contrast, motion preferences |
| Observability       | Logs, errors, health checks, metrics, request correlation             |
| Delivery            | Docker, CI/CD, deployment, rollback, migrations                       |
| Evolution           | ADRs, technical debt, incremental refactoring, ownership              |

---

# Database Roadmap

## Core Tables

| Table                   | Key Responsibility                      |
| ----------------------- | --------------------------------------- |
| `users`                 | Identity and profile                    |
| `workspaces`            | Tenant boundary                         |
| `workspace_memberships` | User role within a workspace            |
| `projects`              | Project metadata and lifecycle          |
| `tasks`                 | Work items, state, priority, assignment |
| `task_comments`         | Collaboration and activity              |
| `activity_events`       | Audit/activity timeline                 |
| `products`              | Demo-shop catalog                       |
| `product_variants`      | SKU, price, stock, option combinations  |
| `orders`                | Checkout result and purchase history    |
| `order_items`           | Immutable product snapshot per order    |

## Database Practices

- [ ] Use migrations from the first schema change.
- [ ] Seed local development data consistently.
- [ ] Use foreign keys and relevant indexes.
- [ ] Treat authorization scope as part of every query.
- [ ] Avoid leaking database entities directly as API responses where a DTO is clearer.
- [ ] Plan pagination before lists become large.
- [ ] Record created/updated timestamps consistently.
- [ ] Document destructive migration and rollback strategy.

---

# Design System Roadmap

## Foundations

- [ ] Color, typography, spacing, radii, shadows, z-index, motion, breakpoints.
- [ ] Semantic token names such as `surface`, `text-primary`, and `action-primary`.
- [ ] Theme strategy and contrast validation.
- [ ] Icon sizing and stroke/fill conventions.

## Components

- [ ] Button
- [ ] Input / Textarea / Select
- [ ] Checkbox / Radio / Switch
- [ ] Form field and validation message
- [ ] Card
- [ ] Modal
- [ ] Drawer
- [ ] Tooltip
- [ ] Menu / Dropdown
- [ ] Tabs
- [ ] Accordion
- [ ] Toast
- [ ] Table
- [ ] Avatar
- [ ] Badge
- [ ] Empty State
- [ ] Skeleton
- [ ] Pagination

## Governance Checklist

- [ ] Every component documents purpose, variants, states, accessibility, and examples.
- [ ] Component APIs are consistent with existing primitives.
- [ ] Breaking changes are documented.
- [ ] Tokens are preferred over one-off values.
- [ ] Product-specific logic does not enter the design system without a reusable use case.
- [ ] Both dashboard and demo shop validate reuse.

---

# Progress Tracking Dashboard

## Overall Progress

| Area                             | Status         | Evidence / Link |
| -------------------------------- | -------------- | --------------- |
| Foundation                       | ⬜ Not started |                 |
| API and database                 | ⬜ Not started |                 |
| Authentication and authorization | ⬜ Not started |                 |
| Tokens and design system         | ⬜ Not started |                 |
| SDK and shared hooks             | ⬜ Not started |                 |
| Dashboard                        | ⬜ Not started |                 |
| Demo shop                        | ⬜ Not started |                 |
| Testing                          | ⬜ Not started |                 |
| Docker and deployment            | ⬜ Not started |                 |
| CI/CD and monitoring             | ⬜ Not started |                 |
| Documentation and portfolio      | ⬜ Not started |                 |

## Weekly Review Template

**Week:**  
**Status:** ⬜ Not started / 🟡 In progress / ✅ Complete  
**Primary outcome:**

### Completed

- [ ]

### Evidence

- Pull requests / commits:
- Screenshots or demo:
- Tests added:
- Documentation updated:

### Lessons Learned

-

### Risks or Blockers

-

### Next Week’s Focus

- [ ]

---

# Definition of Done

A feature is complete only when:

- [ ] User behavior is implemented.
- [ ] Loading, empty, error, and success states exist.
- [ ] Mobile and desktop layouts are checked.
- [ ] Keyboard behavior and focus states are checked.
- [ ] Relevant tests are added.
- [ ] Types are sound and linting passes.
- [ ] Errors are understandable to users and useful to developers.
- [ ] Documentation is updated if the feature affects shared behavior.
- [ ] The feature respects package boundaries and does not duplicate existing shared capabilities.

---

# Future Enhancements

- [ ] Storybook or richer component documentation.
- [ ] API contract generation from schemas.
- [ ] OpenAPI documentation.
- [ ] Real-time collaboration or notifications.
- [ ] File uploads and project attachments.
- [ ] Advanced dashboard permissions.
- [ ] Feature flags and experimentation.
- [ ] Internationalization and localization.
- [ ] Offline support or progressive web app features.
- [ ] Visual regression testing.
- [ ] Performance budgets.
- [ ] Database backup and disaster-recovery runbook.
- [ ] Multi-region or scalable production architecture.

---

# Final Interview Narrative

> “Pulse is a TypeScript monorepo designed as a small product ecosystem rather than a standalone CRUD application. I built a shared token and component system, then validated it across a data-dense internal dashboard and a customer-facing commerce app. Both consume a typed SDK backed by an API with validation, authentication, role-based authorization, migrations, tests, observability, and deployment automation. The project helped me practice not just implementation, but system boundaries, accessibility, developer experience, and the tradeoffs involved in scaling frontend architecture.”
