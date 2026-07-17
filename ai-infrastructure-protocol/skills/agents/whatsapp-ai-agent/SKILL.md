---
name: whatsapp-ai-agent
description: Set up an AI-powered WhatsApp support agent using Manychat, Make.com, and the Anthropic API. Use this skill whenever someone asks to build a WhatsApp bot, WhatsApp AI assistant, WhatsApp automation with Claude, Manychat + Make.com integration, or any automated messaging system that uses the Anthropic API as the brain behind a WhatsApp number. Also trigger when someone mentions "WhatsApp support bot", "AI customer service WhatsApp", "Manychat webhook", "Make.com Anthropic", or asks how to connect Claude to WhatsApp. This skill prevents every pitfall discovered through real production debugging.
---

# WhatsApp AI Support Agent

Build a production WhatsApp AI support agent using Manychat (WhatsApp number via Meta Business Manager), Make.com (orchestration), and the Anthropic API (intelligence).

## Architecture Overview

```
User sends WhatsApp message
    |
    v
Manychat (WhatsApp Default Reply automation)
    |
    v  [GET request with ?message= query param]
Make.com Webhook (Module 1: receives message)
    |
    v  [POST to Anthropic API with system prompt + user message]
Make.com HTTP Module (Module 2: calls Claude)
    |
    v  [Returns JSON with reply field]
Make.com Webhook Response (Module 3: sends response back)
    |
    v
Manychat (maps response to bot_reply custom field)
    |
    v
WhatsApp (sends bot_reply as message)
```

## Setup Steps

### Step 1: Manychat Setup

#### Create a Custom User Field
1. Go to Manychat > Settings > Custom Fields > User Fields
2. Create a new field: `bot_reply` (type: Text)
3. This stores Claude's response temporarily per contact

#### Create the WhatsApp Default Reply Automation
1. Go to Automations > New Automation > WhatsApp Default Reply
2. Add trigger: "User sends a message" (Default Reply)
3. Add action: External Request
4. Add action: WhatsApp Send Message (using `bot_reply` field)

#### Configure the External Request

> **CRITICAL: Use GET, not POST.** Manychat's POST body builder has a broken JSON preview ("Invalid JSON / Variables are not defined") that causes silent failures. The GET method with query parameters works reliably and has been production-tested.

- **Request Type:** GET
- **Request URL:** `https://hook.eu1.make.com/YOUR_WEBHOOK_ID?message=` then insert the `Last Text Input` system variable
- **Headers:** None needed for GET
- **Body:** Leave empty
- **Response mapping tab:**
  - JSONPath: `$.reply`
  - Custom Field: `bot_reply`

#### Configure the Send Message Step
- Message content: Use the `bot_reply` custom field variable

### Step 2: Make.com Scenario

Create a scenario with 3 modules in sequence:

#### Module 1: Webhooks > Custom Webhook
1. Create a new webhook named descriptively (e.g., "AI WhatsApp Bot")
2. Copy the webhook URL and paste it into Manychat's External Request URL (before `?message=`)
3. After setting up Manychat, click "Re-determine data structure" and send a test WhatsApp message
4. Make.com should detect the `message` query parameter

#### Module 2: HTTP > Make a Request

**Connection settings:**
- Authentication: API Key
- Credentials: Create a new credential named "Claude" or similar
- URL: `https://api.anthropic.com/v1/messages`
- Method: POST

**Headers:**
- Header 1: `x-api-key` = your Anthropic API key
- Header 2: `anthropic-version` = `2023-06-01`
- Header 3: `content-type` = `application/json`

**Body:**
- Body content type: `application/json`
- Body input method: `JSON string`
- Parse response: `Yes`

**Body content (template):**

```
{"model":"claude-sonnet-4-20250514","max_tokens":300,"system":"YOUR SYSTEM PROMPT HERE. FORMAT ODGOVORA: Odgovarjaj VEDNO v enem samem odstavku brez prelomov vrstic. NIKOLI ne uporabljaj prelomov vrstic, narekovajev ali posebnih znakov. Pisi samo navaden tekst v eni vrstici.","messages":[{"role":"user","content":"{{1.message}}"}]}
```

> **CRITICAL: The system prompt MUST instruct Claude to respond in a single paragraph with no line breaks.** This is the #1 production-breaking issue. Claude's default responses contain newlines which break the JSON in the webhook response (Module 3). Manychat receives invalid JSON, fails to parse the `reply` field, and either sends nothing or falls back to a cached `bot_reply` value. The instruction "Odgovarjaj VEDNO v enem samem odstavku brez prelomov vrstic" (or English equivalent) is non-negotiable.

> **CRITICAL: The system prompt must also instruct Claude to avoid double quotes in responses.** Double quotes inside the response break the JSON wrapper in Module 3 the same way newlines do. Add: "Nikoli ne uporabljaj narekovajev (dvojnih navednic) v odgovorih."

#### Module 3: Webhooks > Webhook Response

- Status: `200`
- Body: `{"reply":"{{2.data.content[1].text}}"}`
- Custom headers: Key = `Content-Type`, Value = `application/json`
- Advanced settings: ON

> **CRITICAL: Type the Content-Type header key and value manually as plain text.** Do not use the variable picker. If Make.com inserts a variable reference (e.g., `{{2.Headers.Content-Type}}`) instead of the literal string, the header will be wrong and Manychat won't parse the response as JSON.

### Step 3: Activate and Test

1. Turn on the Make.com scenario (toggle to Active)
2. Send a WhatsApp message to your number
3. Check Make.com History for a green (successful) execution with 3 operations
4. Check WhatsApp for Claude's reply

---

## Troubleshooting Guide

### Problem: Make.com shows "user messages must have non-empty content" error
**Cause:** The `{{1.message}}` variable is empty. The webhook didn't receive the message from Manychat.
**Fix:** Check that Manychat's External Request URL ends with `?message=Last Text Input` (the variable, not the literal text). Re-determine the webhook data structure in Make.com Module 1.

### Problem: Make.com scenario runs 3/3 operations (all green) but no WhatsApp reply
**Cause:** Claude's response contains newlines or double quotes that break the JSON in Module 3's body. Manychat receives malformed JSON, can't extract the `reply` field, and uses the old cached `bot_reply` value (or empty).
**Fix:** Add single-paragraph instructions to the system prompt (see Module 2 above). This is the most common and hardest-to-diagnose issue because everything looks successful in Make.com.

### Problem: WhatsApp keeps sending old/cached replies
**Cause:** Manychat's `bot_reply` custom field stores per contact. If a valid value was set previously and a subsequent request fails silently, the old value persists.
**Fix:** Go to Manychat > Live Chat > find the contact > clear the `bot_reply` field manually. Then fix the underlying JSON issue.

### Problem: Manychat External Request shows "Invalid JSON / Variables are not defined"
**Cause:** This is a Manychat preview limitation. It can't resolve variables until the flow actually runs.
**Fix:** This is cosmetic IF using GET with query params. If using POST with a JSON body, this error might cause Manychat to skip the request entirely. Use GET instead.

### Problem: Make.com webhook stuck on "Listening for data" / won't determine structure
**Cause:** Manychat isn't sending requests to the webhook URL.
**Fix:** Make sure the automation is published/live and the Default Reply trigger is active. Send a WhatsApp message from a different number than the one connected to the business account. Check Manychat's Live Chat to confirm the automation triggered.

### Problem: Slovenian/special characters break the response
**Cause:** Characters like c, s, z or em dashes in Claude's response can cause encoding issues.
**Fix:** Ensure the webhook response (Module 3) has `Content-Type: application/json` header. Add em dash prohibition to the system prompt.

---

## Humanizer Integration

To make Claude's WhatsApp responses sound human rather than AI-generated, add these rules to the system prompt:

```
STIL PISANJA: Pisi kot pravi clovek, ne kot AI. Nikoli ne uporabljaj teh besed: delve, tapestry, landscape, intricate, pivotal, crucial, vibrant, profound, showcasing, underscoring, fostering, garner, testament, groundbreaking, renowned, seamless, comprehensive, robust, leverage, facilitate, utilize, navigate. Nikoli ne zacenjaj z: Here's the thing, Let's dive in, Let's explore. Nikoli ne uporabljaj em dash znaka. Uporabljaj kratke stavke in dolge stavke, ne enakomerne dolzine. Uporabljaj okrajsave. Ne povzemaj na koncu. Ne bodi promocijski ali pretirano pozitiven. Bodi direkten in konkreten.
```

These rules are in Slovenian but the banned word list is in English because Claude recognizes them regardless of output language and they sometimes bleed through.

For English bots, the equivalent:

```
WRITING STYLE: Write like a real person, not AI. Never use these words: delve, tapestry, landscape, intricate, pivotal, crucial, vibrant, profound, showcasing, underscoring, fostering, garner, testament, groundbreaking, renowned, seamless, comprehensive, robust, leverage, facilitate, utilize, navigate. Never start with: Here's the thing, Let's dive in, Let's explore. Never use em dashes. Mix short and long sentences. Use contractions. Don't summarize at the end. Don't be promotional or excessively positive. Be direct and specific.
```

---

## Production System Prompt Template

Here is a complete, production-ready body content for Module 2. Replace the bracketed sections with your specifics:

```
{"model":"claude-sonnet-4-20250514","max_tokens":300,"system":"[YOUR BOT IDENTITY AND ROLE]. [YOUR KNOWLEDGE BASE / FAQ CONTENT]. [ESCALATION INSTRUCTIONS - e.g., redirect to email/phone for unknown questions]. FORMAT ODGOVORA: Odgovarjaj VEDNO v enem samem odstavku brez prelomov vrstic. NIKOLI ne uporabljaj prelomov vrstic, narekovajev ali posebnih znakov. Pisi samo navaden tekst v eni vrstici. STIL PISANJA: Pisi kot pravi clovek, ne kot AI. Nikoli ne uporabljaj teh besed: delve, tapestry, landscape, intricate, pivotal, crucial, vibrant, profound, showcasing, underscoring, fostering, garner, testament, groundbreaking, renowned, seamless, comprehensive, robust, leverage, facilitate, utilize, navigate. Nikoli ne uporabljaj em dash znaka. Bodi direkten in konkreten.","messages":[{"role":"user","content":"{{1.message}}"}]}
```

**Parameter guidance:**
- `max_tokens: 300` is good for short support replies. Increase to 500-600 for more complex Q&A.
- `model`: Use `claude-sonnet-4-20250514` for the best balance of speed and quality. Haiku is faster but less capable for nuanced support.
- The `{{1.message}}` variable maps to the webhook's incoming message field. If your webhook field is named differently, update accordingly.

---

## Key Lessons (Hard-Won)

1. **GET beats POST for Manychat External Requests.** POST with JSON body causes silent failures due to Manychat's broken JSON preview/validation. GET with query params is reliable.

2. **The newline problem is invisible.** Make.com shows all 3 modules as green/successful even when the JSON response to Manychat is malformed. You have to inspect Module 3's actual output data to see the broken JSON.

3. **Manychat caches bot_reply per contact.** A previous successful response masks subsequent failures. Always clear the field when debugging.

4. **Module 3's Content-Type header must be manually typed.** Using Make.com's variable picker accidentally inserts a reference to Module 2's headers instead of the literal string.

5. **The Anthropic API version header matters.** Use `2023-06-01` or newer. Older versions may not support newer models.

6. **Test with a hardcoded response first.** Before debugging the full chain, set Module 3's body to `{"reply":"This is a test reply"}`. If that works, the Manychat/Make.com/WhatsApp chain is fine and the problem is in Claude's response format.
