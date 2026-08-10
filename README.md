# Interview Assignment: Backend API, Tests, CI, and Self-Review

Time: 60 minutes.

You may use AI coding tools. We are evaluating how well you direct the tool, verify its work, test the result, and review your own code.

You are starting from an empty repository. 

## Question

Build a small backend service for managing research notes.

A note has:

- `id`: string
- `title`: string
- `body`: string
- `priority`: `low` | `medium` | `high`
- `created_at`: ISO timestamp

## Tech Requirements

- Python
- FastAPI
- pytest
- GitHub Actions

## Scope Constraints

Do not add:

- frontend
- database
- authentication
- Docker
- large generated files
- unrelated tooling

## API Requirements

1. `POST /notes` creates a note.
2. `GET /notes` returns all notes.
3. `GET /notes/{id}` returns one note or returns `404` if not found.
4. `priority` defaults to `medium` if omitted.
5. Invalid priority values must be rejected with a `400` or `422` response.

## Testing Requirements

Add automated tests for at least:

1. Creating a note with an explicit priority.
2. Invalid priority rejection.
3. Missing note returns `404`.

## CI Requirements

Add or update GitHub Actions so tests run automatically on pull requests.

## PR Requirements

You may submit 1 to 3 pull requests for this assignment. It is up to you how you split the work. Small PR and clean code is preferred.

Keep the total scope small. We care more about clear judgment than a large implementation.

## Self-Review Requirements

You must review every PR you open.

For each PR, leave specific GitHub review comments on your own code. A review that only says "LGTM", "looks good", or "I see no issues" is incomplete.

You do not need to fix every concern you identify. It is acceptable to say something is intentionally out of scope because of time, but the comment must be specific to your code. We are happy to see you disagree with AI, the way it writes, etc.

## Final Submission

When you are done:

1. Add me as a collaborator to your repo so I can see your work (`ashkan-software2`)
2. Video submission (this is okay if it's submitted up to 15 min after work). Submit your video under `/video` folder

## Interview Note

We are not looking for a huge codebase. A strong solution is small, tested, and easy to review. We are especially interested in how you use AI, how you verify the code, and rigorously review it.
