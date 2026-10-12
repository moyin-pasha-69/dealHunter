# DealHunter --- Product Requirements Document (PRD)

**Document version:** 1.0\
**Status:** Initial specification\
**Product:** DealHunter\
**Product type:** Price tracking and deal alert application\
**Initial market:** India\
**Primary currency:** INR (₹)\
**Backend stack:** Node.js, Express.js, MongoDB, Mongoose\
**Document owner:** Project team\
**Last updated:** 12 October 2026

------------------------------------------------------------------------

## 1. Executive Summary

DealHunter helps users track the prices of online products and learn
when prices drop or reach a target price. A user adds a product from a
supported source, sets a target price, and DealHunter stores price
observations over time. The system compares new observations with
previous prices and sends an alert when a configured deal condition is
met.

The initial release prioritizes a reliable backend and a clear
separation between product metadata, user tracking preferences, price
observations, and notifications. The first development stages may use
manually supplied or mock prices so the core workflow can be tested
before connecting an approved live price source.

DealHunter must not assume that arbitrary retailer pages can be scraped.
Live price collection will use retailer APIs, affiliate/product APIs,
licensed data providers, or other sources that explicitly permit the
intended use. Each recorded price should include its source and
observation time.

## 2. Problem Statement

People often want to buy products at a lower price but cannot
continuously check several shopping websites. Prices can change
frequently, and a single current price does not show whether an offer is
genuinely lower than a product's recent price.

DealHunter aims to reduce manual checking by: - keeping a watchlist of
products; - allowing users to set target prices; - recording price
history; - detecting price drops and target-price matches; - notifying
users about relevant changes; and - showing enough context for users to
evaluate a deal.

## 3. Product Goals

### 3.1 Goals

1.  Allow a registered user to create and manage a personal product
    watchlist.
2.  Record timestamped price observations for tracked products.
3.  Detect target-price matches and meaningful price drops.
4.  Avoid duplicate alerts for the same price event.
5.  Provide price history and basic deal context.
6.  Keep the application secure, maintainable, testable, and suitable
    for future expansion.
7.  Build the system incrementally, starting with a testable backend.

### 3.2 Non-goals for the initial release

-   Buying products on behalf of users.
-   Storing payment-card information or processing payments.
-   Guaranteeing that a price is the lowest available across the entire
    internet.
-   Supporting every retailer from day one.
-   Circumventing retailer anti-bot protections, authentication,
    CAPTCHAs, or access controls.
-   Automatically predicting future prices using machine learning.
-   A native mobile application.
-   Browser extensions.
-   Social feeds, public profiles, or user-to-user messaging.

## 4. Target Users and Use Cases

### Primary users

-   Budget-conscious shoppers who can wait for a price drop.
-   Students and young professionals comparing prices before purchasing.
-   Users tracking electronics, accessories, home goods, books, and
    other supported products.

### Core user stories

-   As a user, I want to add a product to my watchlist so I do not have
    to remember to check it manually.
-   As a user, I want to set a target price so I can be notified when
    the product reaches an acceptable price.
-   As a user, I want to see previous prices so I can judge whether a
    price change is meaningful.
-   As a user, I want to pause tracking when I no longer care about a
    product.
-   As a user, I want to remove a product from my watchlist.
-   As a user, I want to receive an alert when a qualifying deal is
    detected.
-   As a user, I want to know when the price was last checked so I can
    judge how current the information is.
-   As a user, I want to control notification preferences so I am not
    overwhelmed by alerts.

## 5. Product Scope and Release Plan

### MVP (minimum viable product)

The first usable release includes: - user registration and login; -
authenticated, user-owned watchlists; - adding a product using a
supported source or development/test price input; - setting and updating
a target price; - listing, viewing, updating, pausing, resuming, and
removing tracked items; - recording timestamped price observations; -
viewing price history; - evaluating target-price and price-drop
conditions; - storing notification events; - basic request validation,
error handling, logging, and automated tests.

### Post-MVP

-   Email notifications.
-   Multiple supported retailer/data providers.
-   Scheduled monitoring with a background worker.
-   Retry and backoff handling for transient provider failures.
-   Product comparison across supported retailers.
-   Historical low and percentage-change summaries.
-   User-configurable check frequency where provider terms and system
    capacity allow it.
-   Frontend dashboard and charts.
-   Admin monitoring for provider health and failed jobs.

### Future possibilities

-   Browser extension or mobile application.
-   Price trend insights and forecasting.
-   Shared wishlists.
-   Price-drop digest emails.
-   More currencies and regional marketplaces.

## 6. Functional Requirements

Priority definitions: - **P0:** Required for the MVP. - **P1:**
Important follow-up. - **P2:** Future enhancement.

### FR-1: Account and authentication (P0)

-   Users can register with a valid email address and password.
-   Email addresses must be normalized and unique.
-   Passwords must be hashed with a suitable password-hashing algorithm
    such as bcrypt or Argon2; plaintext passwords must never be stored.
-   Users can log in and receive an authentication token.
-   Protected endpoints must reject missing, invalid, or expired
    credentials.
-   Users can access only their own watchlist and private records.
-   Authentication secrets and token configuration must be stored in
    environment variables.
-   Logout/token revocation behavior must be documented based on the
    selected token strategy.

### FR-2: Product catalog and tracking item (P0)

-   A user can add a product from a supported product source.
-   The tracking record must identify the product and the user tracking
    it.
-   The user can set a target price greater than zero.
-   The user can optionally set a preferred product variant, such as
    color, storage size, or model, if the source supports variants.
-   The user can view the tracked product's name, retailer/source,
    product URL, latest known price, target price, tracking status, and
    last checked time.
-   Duplicate tracking of the same product by the same user should be
    handled deliberately: return the existing record or return a clear
    conflict response rather than silently creating duplicates.
-   A product URL must be validated against supported providers.
    Arbitrary URLs must not be fetched by the server.

### FR-3: Watchlist management (P0)

-   A user can list their tracked products.
-   A user can retrieve one tracked item they own.
-   A user can update the target price and supported tracking
    preferences.
-   A user can pause and resume tracking.
-   A user can remove a tracking item.
-   Removing a tracking item must not accidentally remove a shared
    catalog product or another user's tracking record.
-   List endpoints should support pagination and stable sorting.

### FR-4: Price observation and history (P0)

-   Each price observation records the product or tracking target,
    amount, currency, source, observation timestamp, and relevant
    provider metadata.
-   Price values must be numeric and greater than zero unless a source
    explicitly provides a valid zero-price promotion; such cases require
    explicit handling rather than accidental acceptance.
-   Historical observations are append-only in normal operation.
    Corrections should be auditable.
-   The latest known price must be distinguishable from the historical
    price records.
-   The API must return the observation time and currency with each
    price.
-   Missing or failed price checks must not be recorded as a price of
    zero.
-   Repeated identical prices may be retained at a configured cadence or
    deduplicated according to a documented policy. The initial
    implementation should favor a clear, consistent policy.

### FR-5: Price source integration (P0 for mock/manual adapter; P1 for live provider)

-   Price retrieval must be isolated behind a provider/adapter
    interface.
-   The initial development environment can use a mock provider or
    explicitly submitted test prices.
-   Each provider must have documented input, output, limits,
    authentication, and failure behavior.
-   Live integrations must comply with the provider's terms, rate
    limits, and applicable laws.
-   The system must identify the source of each price observation.
-   Provider errors must be logged safely and must not expose
    credentials or sensitive response data.
-   A product that cannot be refreshed should retain its last known
    price and display a stale/failed-check status.

### FR-6: Deal detection (P0)

The initial business rules are: 1. **Target-price match:** the newly
observed price is less than or equal to the user's target price. 2.
**Price drop:** the newly observed price is lower than the previous
valid observation by a configured minimum amount or percentage, if that
threshold is enabled. 3. **No valid observation:** do not evaluate a
deal if the price is missing, invalid, or stale beyond the configured
policy. 4. **Duplicate suppression:** do not create repeated alerts for
the same tracking item and unchanged qualifying price event. 5.
**Currency safety:** compare prices only when they use the same currency
or have been converted using a documented exchange-rate source and
timestamp. The MVP should avoid implicit currency conversion. 6. **Price
source:** store the observation that triggered the event so the alert
can be audited.

The exact policy for re-alerting after a price rises and later falls
again must be documented. A reasonable MVP rule is to permit a new alert
after the price leaves the qualifying state and subsequently qualifies
again, while suppressing repeated alerts for unchanged qualifying
observations.

### FR-7: Notifications (P0 for in-app notification records; P1 for email delivery)

-   When a deal condition is met, create a notification event for the
    user.
-   A notification includes the tracking item, observed price, target
    price where applicable, currency, trigger reason, source, and
    observation time.
-   Notification creation must be idempotent to avoid duplicates caused
    by job retries.
-   Users can list notifications and mark them as read.
-   Email delivery can be added after in-app notification records work
    reliably.
-   Delivery status and failure reason should be recorded without
    storing unnecessary sensitive content.
-   A failed email attempt must not delete the underlying deal event.

### FR-8: Scheduled monitoring (P1)

-   A background scheduler selects active tracking items eligible for a
    price check.
-   Checks must respect provider rate limits and configured system
    limits.
-   A failed check must not stop checks for unrelated products.
-   Jobs must have timeouts, retries for transient failures, and a
    maximum retry limit.
-   Repeated failures should be observable and may temporarily pause a
    source or item according to policy.
-   A scheduled job must be safe to retry and must not create duplicate
    observations or notifications unintentionally.
-   For multi-instance deployments, scheduling must avoid duplicate
    execution through a queue, lock, or other coordination mechanism.

### FR-9: Search, filtering, and sorting (P1)

Users can filter tracked products by: - tracking status; - deal/target
reached status; - retailer/source; - category, if available; - recently
checked or stale status.

Users can sort by: - recently added; - latest price; - largest recent
drop; - target-price distance; - last checked time.

### FR-10: Product summary (P1)

For each tracked item, provide: - latest valid price; - target price; -
absolute and percentage change from a defined comparison observation; -
lowest recorded price within the available history window; - last
successful check time; - tracking and data freshness status.

The interface and API must state that a historical low is based only on
the data DealHunter has collected, not necessarily the retailer's
all-time low.

## 7. Business Rules and Definitions

### Price and currency

-   Store money as a decimal-safe representation. Do not rely on
    floating-point arithmetic for financial comparisons without a clear
    precision strategy.
-   Store the ISO currency code, such as `INR`.
-   Validate prices at the API boundary and again where appropriate in
    domain logic.
-   Do not compare prices in different currencies directly.

### Price change

Given previous price `P_old` and current price `P_new`:

-   Absolute change = `P_new - P_old`
-   Percentage change = `((P_new - P_old) / P_old) * 100`, provided
    `P_old > 0`

A negative change indicates a price decrease. The API may also expose
the discount magnitude as a positive number for display, but its naming
must be unambiguous.

### Target price

A target is reached when `currentPrice <= targetPrice`, in the same
currency and for the intended product variant.

### Freshness

-   A price record must include `observedAt`.
-   The application should distinguish a successful recent observation
    from an old last-known price.
-   Freshness thresholds should be configurable rather than scattered as
    hard-coded values.

### Product identity

-   Product identity must include the provider/source and a stable
    provider product identifier where available.
-   A URL alone may not reliably identify a variant.
-   The system should normalize URLs only in provider-specific code and
    must not strip meaningful variant parameters without confirmation.

## 8. API Requirements

Base path: `/api/v1`

The following routes are proposed. Exact response envelopes and error
codes should be standardized during implementation.

### Health

  -----------------------------------------------------------------------
  Method            Endpoint          Purpose           Priority
  ----------------- ----------------- ----------------- -----------------
  GET               `/health`         Basic application P0
                                      health            

  GET               `/ready`          Check readiness,  P1
                                      including         
                                      required database 
                                      connectivity      
  -----------------------------------------------------------------------

### Authentication

  ------------------------------------------------------------------------
  Method            Endpoint           Purpose           Priority
  ----------------- ------------------ ----------------- -----------------
  POST              `/auth/register`   Create a user     P0
                                       account           

  POST              `/auth/login`      Authenticate a    P0
                                       user              

  POST              `/auth/logout`     Log out or revoke P1
                                       a token where     
                                       supported         

  GET               `/auth/me`         Return the        P0
                                       authenticated     
                                       user's profile    
  ------------------------------------------------------------------------

### Tracked products

  ---------------------------------------------------------------------------------------
  Method            Endpoint                          Purpose           Priority
  ----------------- --------------------------------- ----------------- -----------------
  POST              `/watchlist`                      Add a product to  P0
                                                      the user's        
                                                      watchlist         

  GET               `/watchlist`                      List the user's   P0
                                                      tracked products  

  GET               `/watchlist/:trackingId`          Get one owned     P0
                                                      tracking item     

  PATCH             `/watchlist/:trackingId`          Update target     P0
                                                      price or          
                                                      supported         
                                                      settings          

  PATCH             `/watchlist/:trackingId/status`   Pause or resume   P0
                                                      tracking          

  DELETE            `/watchlist/:trackingId`          Remove an item    P0
                                                      from the user's   
                                                      watchlist         
  ---------------------------------------------------------------------------------------

### Price history and deal events

  ---------------------------------------------------------------------------------------------
  Method            Endpoint                                Purpose           Priority
  ----------------- --------------------------------------- ----------------- -----------------
  GET               `/watchlist/:trackingId/prices`         Get price history P0
                                                            for an owned      
                                                            tracking item     

  GET               `/deals`                                List deal events  P0
                                                            for the           
                                                            authenticated     
                                                            user              

  GET               `/notifications`                        List notification P0
                                                            records           

  PATCH             `/notifications/:notificationId/read`   Mark a            P0
                                                            notification as   
                                                            read              
  ---------------------------------------------------------------------------------------------

### Internal or development-only endpoints

  ---------------------------------------------------------------------------------
  Method            Endpoint                   Purpose           Notes
  ----------------- -------------------------- ----------------- ------------------
  POST              `/internal/price-checks`   Trigger a         Must be protected;
                                               controlled price  never publicly
                                               check             exposed without
                                                                 authorization

  POST              `/internal/test-prices`    Submit a test     Development/test
                                               observation       only; disabled in
                                                                 production
  ---------------------------------------------------------------------------------

All private routes must authenticate the user and verify ownership.
Internal endpoints must use a separate trusted authorization mechanism.
Never accept a user ID from the request body as proof of ownership.

### API conventions

-   Use JSON request and response bodies.
-   Use appropriate HTTP status codes, including `201`, `200`, `204`,
    `400`, `401`, `403` or `404` according to the chosen
    resource-disclosure policy, `409`, `422`, and `500`.
-   Use a consistent error response structure, for example: `code`,
    `message`, and optional safe `details`.
-   Validate route parameters, query parameters, and request bodies.
-   Support pagination with documented parameters such as `page` and
    `limit`, or a cursor-based strategy.
-   Avoid returning stack traces, database internals, tokens, or
    provider secrets to clients.
-   Version the API from the beginning.

## 9. Data Model

The following are logical models. Exact Mongoose schemas and indexes
will be finalized during implementation.

### 9.1 User

-   `_id`
-   `name`
-   `email` (normalized, unique)
-   `passwordHash`
-   `role` (default `user`; elevated roles only if needed)
-   `notificationPreferences`
-   `createdAt`
-   `updatedAt`

Never return `passwordHash` from API responses.

### 9.2 Product

Represents a source-specific product identity. - `_id` - `provider` -
`providerProductId` (when available) - `title` - `productUrl` -
`imageUrl` (optional) - `category` (optional) - `variant` (optional) -
`createdAt` - `updatedAt`

Suggested uniqueness rule: unique compound index on `provider` and
`providerProductId` when a stable provider ID exists. Handle products
without stable IDs using a separate, documented identity strategy.

### 9.3 TrackingItem

Represents one user's tracking settings for a product. - `_id` -
`userId` (reference to User) - `productId` (reference to Product) -
`targetPrice` - `currency` - `status` (`active`, `paused`,
`unavailable`, or `error`, as defined by implementation) -
`lastCheckedAt` (optional) - `lastSuccessfulCheckAt` (optional) -
`lastKnownPrice` (optional cache) - `lastCheckStatus` (optional) -
`notificationSettings` - `createdAt` - `updatedAt`

Suggested index: compound index on `userId` and `createdAt`. Define a
deliberate uniqueness rule to prevent duplicate tracking of the same
product by the same user where appropriate.

### 9.4 PriceObservation

An append-oriented record of a price check. - `_id` - `productId` and/or
`trackingItemId`, depending on whether observations are shared at
product level or user-specific - `price` - `currency` - `provider` -
`observedAt` - `recordedAt` - `checkStatus` (`success` or `failure`, if
failures are represented here) - `sourceMetadata` (minimal safe metadata
only)

Prefer successful price observations in the history collection.
Operational failures can be stored in job logs or a separate
check-attempt collection. Choose whether prices are shared by product or
tracked per user based on provider cost, variant identity, and refresh
policy; do not mix these models accidentally.

### 9.5 DealEvent

-   `_id`
-   `userId`
-   `trackingItemId`
-   `priceObservationId`
-   `type` (`target_reached`, `price_drop`, or a future defined type)
-   `currentPrice`
-   `targetPrice` (if applicable)
-   `currency`
-   `previousPrice` (optional)
-   `createdAt`
-   `deduplicationKey`

Suggested index: unique `deduplicationKey` or an equivalent compound key
that enforces idempotent deal creation.

### 9.6 Notification

-   `_id`
-   `userId`
-   `dealEventId` (optional for non-deal notifications)
-   `channel` (`in_app`, `email`, or future channel)
-   `status` (`pending`, `sent`, `failed`, or `read`, with delivery and
    read state modeled carefully)
-   `title`
-   `message`
-   `readAt` (optional)
-   `sentAt` (optional)
-   `failureCode` (optional)
-   `createdAt`
-   `updatedAt`

Delivery status and read status may be separate fields to avoid mixing
email delivery with in-app read state.

### Relationships

-   One user can have many tracking items.
-   One product can be tracked by many users.
-   A tracking item belongs to one user and one product.
-   A product can have many price observations.
-   A tracking item can produce many deal events over time.
-   A deal event can generate one or more notification records.

## 10. System Architecture

Use a modular monolith for the initial backend. This is simpler to build
and deploy than microservices while keeping responsibilities separated.

Suggested structure:

``` text
dealhunter/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── validate.middleware.js
│   │   └── rateLimit.middleware.js
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   └── user.model.js
│   │   ├── products/
│   │   ├── watchlist/
│   │   ├── prices/
│   │   ├── deals/
│   │   └── notifications/
│   ├── providers/
│   │   ├── provider.interface.js
│   │   └── mock.provider.js
│   ├── jobs/
│   │   └── price-check.job.js
│   ├── utils/
│   ├── app.js
│   └── server.js
├── tests/
├── .env.example
├── .gitignore
├── package.json
└── PRD.md
```

Responsibilities: - **Routes:** map HTTP methods and paths to
middleware/controllers. - **Controllers:** parse validated request data
and format HTTP responses. - **Services:** implement business rules and
coordinate models/providers. - **Models:** define persistence schema,
validation, and indexes. - **Providers:** retrieve prices from mock or
approved live sources. - **Jobs:** run scheduled checks and handle
retries. - **Middleware:** authentication, validation, rate limiting,
and centralized errors. - **Configuration:** validate environment
variables and initialize external services.

Keep business logic out of route files and keep controllers thin.

## 11. Non-functional Requirements

### Security

-   Hash passwords using a suitable password-hashing algorithm.
-   Keep secrets out of source control.
-   Validate and normalize user input.
-   Enforce ownership checks on every private resource.
-   Apply rate limits to authentication and expensive endpoints.
-   Use secure HTTP headers and configure CORS narrowly for known
    frontend origins.
-   Protect internal job-trigger endpoints.
-   Prevent server-side request forgery (SSRF): do not fetch arbitrary
    user-supplied URLs; use an allowlist and validate redirects, DNS
    resolution, and destination IPs when fetching permitted URLs.
-   Avoid logging passwords, authorization headers, tokens, or provider
    secrets.
-   Use HTTPS in production.
-   Keep dependencies updated and audit them periodically.

### Reliability

-   A provider failure must not crash the API server.
-   Use request timeouts, bounded retries, and backoff for transient
    errors.
-   Preserve the last successful price when a new check fails.
-   Make price-check and notification workflows idempotent.
-   Handle MongoDB disconnections and graceful shutdown.
-   Ensure scheduled work is coordinated if more than one application
    instance runs.

### Performance and scalability

-   Add indexes for common lookups, sorting, uniqueness, and
    deduplication.
-   Paginate potentially large result sets.
-   Avoid unbounded price-history queries.
-   Separate scheduled price-check work from normal HTTP request
    handling.
-   Use a queue when job volume requires it.
-   Set provider concurrency and request-rate limits.

### Maintainability

-   Use a consistent naming convention and module structure.
-   Use environment-based configuration.
-   Centralize error handling.
-   Document API contracts and business rules.
-   Add unit and integration tests.
-   Use structured logs with timestamps and request/job identifiers.

### Accessibility and usability (for the future frontend)

-   Clearly show the last price-check time.
-   Distinguish stale data from current data.
-   Explain why a deal alert was triggered.
-   Avoid implying that a price is guaranteed to remain available.
-   Display currency consistently.

## 12. Environment Configuration

Use `.env` locally and `.env.example` as a safe template. Do not commit
real credentials.

Expected variables may include:

``` dotenv
NODE_ENV=development
PORT=3000
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=1d
FRONTEND_ORIGIN=http://localhost:5173
PRICE_CHECK_INTERVAL_MINUTES=360
PRICE_PROVIDER=mock
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=
```

Only add variables when the corresponding feature is implemented.
Validate required environment variables at startup and fail with a clear
configuration error when required values are missing. Use a strong,
unique secret in each environment.

## 13. Validation and Error Handling

Validate: - email format and uniqueness; - password length and basic
security policy; - valid MongoDB IDs; - supported provider and product
URL; - target price greater than zero and within supported precision; -
currency code; - allowed tracking statuses; - pagination limits; -
update fields against an allowlist; - price observation source and
timestamp; - ownership before read, update, or delete.

The API should distinguish invalid input, missing resources,
authorization failures, duplicate resources, provider failures, and
internal errors. Error messages must help the user without revealing
internal implementation details.

## 14. Testing Strategy

### Unit tests

-   target-price comparison;
-   price-drop calculation;
-   percentage-change calculation;
-   currency mismatch handling;
-   duplicate-alert suppression;
-   URL/provider validation;
-   input validation and normalization.

### Integration tests

-   registration and login;
-   protected route access;
-   adding and listing watchlist items;
-   updating target price;
-   pause/resume behavior;
-   retrieving price history;
-   generating a deal event;
-   marking a notification as read;
-   ensuring one user cannot access another user's data;
-   ensuring provider failure does not overwrite the last known price;
-   ensuring repeated job execution does not create duplicate alerts.

### End-to-end acceptance tests

1.  Register a user and log in.
2.  Add a supported test product with a target price.
3.  Record an initial price above the target.
4.  Record a later price equal to or below the target.
5.  Verify that a deal event and notification are created.
6.  Repeat the same check and verify that duplicate notifications are
    not created.
7.  Verify that the price history contains the expected observations.
8.  Verify that another user cannot read or change the tracking item.
9.  Pause tracking and verify that scheduled checks skip the item.
10. Simulate provider failure and verify that the previous successful
    price remains available.

## 15. MVP Acceptance Criteria

The MVP is considered complete when: - a user can register, log in, and
access protected endpoints; - each user can manage only their own
tracking items; - a supported/mock product can be tracked with a target
price; - the user can update, pause, resume, and remove tracking; -
valid price observations are stored with currency, source, and
timestamps; - price history can be retrieved in a predictable order; -
target-price conditions produce a deal event; - duplicate deal events
are suppressed; - notification records can be listed and marked read; -
provider failures are handled without corrupting price history; -
validation and centralized error handling are present; - automated tests
cover core business rules and access control; - setup instructions and
environment-variable documentation are complete.

## 16. Risks and Mitigations

  -----------------------------------------------------------------------
  Risk                    Impact                  Mitigation
  ----------------------- ----------------------- -----------------------
  Retailer blocks or      Price checks fail or    Use approved APIs/data
  disallows automated     violate terms           providers; confirm
  scraping                                        terms before
                                                  integration

  Provider rate limits    Delayed or incomplete   Throttle requests,
                          checks                  cache results, queue
                                                  work, and honor limits

  Stale or incorrect      Users make decisions    Store observation
  prices                  using old data          timestamps and show
                                                  stale status

  Product variants are    Wrong price alerts      Track provider IDs and
  confused                                        variant attributes

  Duplicate background    Duplicate observations  Use idempotency keys,
  jobs                    and alerts              locks, or queue-based
                                                  coordination

  Unauthorized access     Exposure or             Authenticate and verify
                          modification of private ownership on every
                          data                    resource

  API or provider outage  Monitoring              Preserve last
                          interruptions           successful data, retry
                                                  safely, and expose
                                                  health status

  Uncontrolled provider   Operating expense grows Start with mock data,
  costs                                           measure usage, and
                                                  enforce budgets and
                                                  quotas
  -----------------------------------------------------------------------

## 17. Analytics and Success Metrics

For a personal/portfolio MVP, record operational metrics without
collecting unnecessary personal data: - number of active tracked
items; - successful versus failed price checks; - percentage of checks
that return a valid price; - time since last successful check; - number
of deal events created; - duplicate notification prevention count; -
notification delivery success rate when email is added; - API error rate
and response latency.

Possible initial engineering targets, to be reviewed after
measurement: - core API p95 response time below 500 ms under a modest
test load, excluding external provider latency; - no duplicate deal
events for the same idempotency key; - all private-resource access tests
pass; - provider failures do not erase valid historical data.

These are development targets, not guarantees of production performance.

## 18. Development Milestones

### Milestone 1 --- Server foundation

-   Initialize Node.js project.
-   Create Express app and server entry point.
-   Add health route and centralized error middleware.
-   Configure environment variables.
-   Connect MongoDB.

### Milestone 2 --- Watchlist API

-   Define Product and TrackingItem models.
-   Implement watchlist create/read/update/delete operations.
-   Add validation and pagination.
-   Initially use test data or a mock provider.

### Milestone 3 --- Price history

-   Define PriceObservation model.
-   Add service for recording observations.
-   Add price-history endpoint.
-   Test currency and timestamp handling.

### Milestone 4 --- Deal detection

-   Implement target-price and price-drop rules.
-   Define DealEvent and Notification models.
-   Add idempotency and duplicate suppression.
-   Add tests for repeated observations.

### Milestone 5 --- Authentication

-   Add User model, registration, login, and protected routes.
-   Enforce ownership on all watchlist, price-history, deal, and
    notification routes.
-   Add rate limiting and security checks.

### Milestone 6 --- Automated price checks

-   Implement the provider adapter.
-   Add a scheduled worker and safe retry behavior.
-   Add monitoring for failed checks.
-   Connect an approved live data provider only after verifying its
    terms and access.

### Milestone 7 --- Alerts and release readiness

-   Add email delivery if desired.
-   Document API behavior and setup.
-   Complete integration tests.
-   Prepare deployment configuration and operational health checks.

## 19. Decisions to Finalize During Implementation

The following choices should be explicitly resolved before the
corresponding feature is implemented: 1. Which retailer or price-data
provider will be integrated first? 2. Are price observations shared at
product level or collected separately per user's tracking item? 3. What
is the policy for repeated identical prices and re-alerting after a
price changes? 4. Which authentication/token strategy will be used, and
how will logout/revocation work? 5. What is the first notification
channel: in-app only or email? 6. What price-check interval is permitted
by the provider and affordable for the project? 7. Which data-retention
policy applies to price history, job logs, and notifications? 8. Will
the initial release use a mock provider, manual test prices, or a live
approved provider?

Do not block initial API development on a live price provider. Build and
test the domain logic using a mock provider first.

## 20. Definition of Done

A feature is complete when: - its requirements and edge cases are
understood; - request validation and authorization are implemented; -
business logic is separated from HTTP handlers; - success and failure
paths are handled; - automated tests cover expected behavior and
important edge cases; - API behavior is documented; - no secrets are
committed; - logs do not expose credentials or sensitive data; - the
feature works with the local development setup.

------------------------------------------------------------------------

## Appendix A --- Suggested GitHub Repository Description

**DealHunter is a price-tracking backend built with Node.js, Express,
and MongoDB. It manages product watchlists, records price history,
detects target-price matches, and supports scheduled checks and deal
notifications through configurable price-source adapters.**

## Appendix B --- MVP Guiding Principle

Build a reliable price-tracking workflow before adding complexity. First
prove that DealHunter can track a test product, record valid
observations, detect a qualifying deal, and avoid duplicate alerts. Then
integrate a permitted live price source and add automated monitoring.
