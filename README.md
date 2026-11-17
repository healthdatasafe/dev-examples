# Health Data Safe — developer examples

Small, runnable examples for building on [Health Data Safe](https://www.healthdatasafe.org) (HDS). Each folder is
a standalone project: `cd` into it, `npm install`, and follow its README.

| Example | What it shows |
|---|---|
| [`weight-quickstart`](weight-quickstart/) | The smallest web app: sign-in button (demo or production), store a weight, list the stored weights. Plain JavaScript + Vite + `hds-lib`. |

All examples run against the **demo** platform by default (`demo.datasafe.dev`): accounts are free, instant and
throwaway, so you can experiment without touching real health data.

## Learn more

- Developer docs: <https://docs.datasafe.dev>
- Building with an AI agent: <https://agents.datasafe.dev>
- Data model browser (item keys): <https://model-browser.datasafe.dev>

## Contributing an example

One folder per example, self-contained (its own `package.json` and `README.md`), runnable with `npm install` +
one command, on demo by default. Run `npm install && npm run lint` at the repository root before opening a pull
request.

## License

[BSD-3-Clause](LICENSE)
