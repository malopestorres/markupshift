# Contributing to MarkupShift

Thanks for taking the time to improve MarkupShift. Contributions of every size are welcome, from better attribute mappings and conversion edge cases to documentation and accessibility improvements.

## Before you start

- Search the existing issues to avoid duplicates.
- Open a bug report with a minimal HTML example when conversion output is incorrect.
- Open a feature request before starting a large change so the approach can be discussed.
- Keep conversion behavior deterministic. MarkupShift should never execute pasted code or require a remote service.

## Local setup

```bash
git clone https://github.com/malopestorres/markupshift.git
cd markupshift
npm install
npm run dev
```

The application is available at [http://localhost:3000](http://localhost:3000).

## Making a change

1. Fork the repository and create a branch from `main`.
2. Make one focused change.
3. Add or update tests for converter behavior.
4. Run the complete validation suite.
5. Open a pull request that explains the problem and the chosen solution.

```bash
npm run lint
npm test
npm run build
```

## Conversion guidelines

- Preserve valid HTML content whenever React supports it.
- Prefer explicit attribute mappings over fragile string replacement.
- Generated components should remain readable without a formatting step.
- Never evaluate event handler strings or scripts from pasted markup.
- Add a minimal test for every fixed parsing or serialization edge case.
- Avoid server dependencies; conversion must continue to work entirely in the browser.

## Pull requests

A useful pull request includes:

- A short description of the user-visible problem
- Before and after input/output examples
- Tests for the changed behavior
- Documentation updates when behavior or limitations change

By contributing, you agree that your work will be released under the repository's MIT License.
