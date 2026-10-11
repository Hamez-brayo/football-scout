# Building a Consistent Validation Boundary for a TypeScript API

## Context

Vysion Analytics is a football talent scouting platform built around a TypeScript backend and a mobile client. The API accepts data for player profiles and exposes search endpoints that allow users to discover talent by attributes such as position, nationality, age, and experience level.

These endpoints need a consistent way to reject malformed input before it reaches the application logic. Without that boundary, individual controllers can end up implementing validation differently, producing inconsistent errors and making the API harder to maintain.

## Design

I use Zod to define data contracts in a shared package and Express middleware to enforce those contracts at the API boundary.

For example, the shared search schema defines optional filters, constrains numeric values such as age and height, and applies defaults to pagination parameters. The API's player routes then connect this schema to the validation middleware:

- `validateQuery(SearchFiltersSchema)` validates player-search parameters.
- `validateBody(PlayerProfileSchema)` validates incoming player-profile data.
- `validateBody(PlayerProfileSchema.partial())` allows profile updates to submit only the fields being changed.

This keeps the rules close to the data contract instead of scattering them throughout controller methods.

## Error handling

The validation middleware uses Zod's asynchronous parsing and catches validation errors before passing control to the next handler. Invalid requests receive a `400 Bad Request` response with a consistent structure containing a machine-readable error code, a human-readable message, field-level validation details, and a timestamp.

That structure gives clients a predictable way to handle invalid submissions and makes it easier to identify which fields need correction.

Separating validation from controllers also keeps the request-handling flow easier to follow: the route defines the validation rules, the middleware enforces them, and the controller handles the application operation.

## Trade-offs and next steps

This implementation establishes a reusable validation boundary, but it is not the end of the work.

I would strengthen it by adding automated tests for valid and invalid payloads, checking edge cases around pagination and numeric query parameters, and ensuring that the parsed and validated values are the same values consumed by downstream handlers. I would also tighten the schema types and remove avoidable `any` casts in the service layer.

Validation is only one part of API correctness. Database constraints, authorization, safe error handling, and tests are still necessary to protect the application and preserve data integrity.

## Conclusion

The main lesson from this part of Vysion is that maintainability often comes from making boundaries explicit. Shared schemas define what the application accepts, middleware enforces those rules consistently, and controllers can focus on their responsibilities. As the platform grows, that separation gives the team a clearer foundation for extending the API without duplicating validation logic across endpoints.
