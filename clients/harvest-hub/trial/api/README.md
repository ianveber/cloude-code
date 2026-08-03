# api/

`extract.js` is the only server-side code in the trial deployment: it holds the Anthropic key and
turns one page of restored layout text — or one rendered page image — into the extracted JSON,
answering `{data, cost}` or `{error}`. It accepts POST only, refuses anything whose `Origin` is not
the deployment's own host (so curl and bots get 403), and applies a sliding-window call limit plus a
spend ceiling that are **per warm instance** — real deterrence against a runaway loop, not a security
boundary; the passcode gate in front of the site is the boundary.

It deliberately does **not**: receive or store PDFs (the browser reads them and only sends text or an
image, and nothing is written to disk); serve the agent register, the sample offers or any other
personal data; return the provider's error text, so no upstream response body can ever echo the key;
or log document contents. Nothing here persists between requests except the two counters above.
