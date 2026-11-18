# Repository security and quality assessment

The owner authorized the four-step security maintenance plan: enable monitoring,
audit main and pilot, prepare focused dependency fixes, and verify/review before
a human-approved merge. They also requested implementation of main protection
after reading GitHub's documentation, with an agent-led repository assessment.

## Approach and constraints

Use an active main-only ruleset, no bypass actors, deletion/force-push blocks,
PR requirement and resolved threads. Independent AUDITOR approved this baseline.
Zero GitHub approvals supports the solo-owner identity; documented independent
agent review and human merge approval remain required. Requiring nonexistent CI
checks would lock integration; add exact gates after CI is integrated and runs.
Linear history is deferred to preserve the current stacked PR ancestry.

Monitoring and protections are settings changes; dependencies travel through a
focused feature branch. Use a patched supported Next.js release with the smallest
compatible migration, verify registry/advisory data, refresh authoritative locks,
and identify baseline build failures separately. Do not use forceful blanket
dependency upgrades or weaken checks to hide failures.

Remote branch count stays at main plus five. Prepare local work if publication
needs a slot; preserve active PR bases and ask for a concrete merge approval only
after review evidence is available. No deployment, migration, database test/write,
environment overwrite, secret inspection, or history rewrite is authorized here.

The health assessment records actual participants, command outcomes, remaining
risks and owners. It is an on-demand workflow, not an installed scheduled bot.
