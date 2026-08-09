---
name: cofounder-claude-starter
description: Onboards an AIS Slovenia co-founder to Claude from zero and walks them through shipping their first real business automation. Use when a co-founder is learning Claude, wants to set up a personal AI operator, or wants to automate a recurring task (inbox triage, meeting prep, weekly briefing, follow-ups, research) so they spend more time on the business and less on busywork.
---

# Claude Starter — for AIS Co-Founders

**The goal:** in one afternoon, go from *"I've barely used Claude"* to *"I have an AI operator that runs one real job for me every day."* Then build more whenever you want.

Read this top to bottom **once**. Do the steps as you go. You'll be live before you reach the end.

> 🇸🇮 **New to this and prefer Slovenian?** You can ask Claude to explain any part of this file in Slovenian. Paste the section and type: *"Razloži mi to po slovensko, kot da sem začetnik."* Use that trick any time something isn't clear — it's also how you'll learn fastest.

---

## Day 1 checklist (do these in order)

Tick them off as you go. The whole thing is ~45 minutes.

- [ ] **1.** Open [claude.ai](https://claude.ai) and log in (or open the Claude desktop app).
- [ ] **2.** Read *"Claude in 3 minutes"* below so the rest makes sense.
- [ ] **3.** Create a **Project** called **"My AIS Operator"** and paste in the Agent block (Part 2).
- [ ] **4.** Test it with the 3 starter prompts.
- [ ] **5.** Turn on the **Gmail** and **Google Calendar** connectors.
- [ ] **6.** Set up **ONE** automation from the menu (Part 3).
- [ ] **7.** Let it run for a week. Tweak the wording. Then add a second one.

That's it. Everything below explains each step.

---

## Part 1 — Claude in 3 minutes

Think of Claude as a **sharp colleague you instruct in plain words.** You don't code. You explain what you want like you'd explain it to a smart new hire, and it does the work.

It's especially good at the stuff that eats your day:
- Reading and summarizing (long emails, documents, threads)
- Drafting (emails, messages, proposals, notes)
- Researching (companies, markets, prospects)
- Organizing (turning a messy brain-dump into a clear plan)

There are **three levels**, each more hands-off than the last:

| Level | What it is | Use it for |
|---|---|---|
| **1. Chat** | You type a question, get an answer. One-off. | Quick asks. "Summarize this." "Draft a reply to this." |
| **2. Project** | A saved workspace with **permanent instructions** + files. | Your trained assistant that already knows how you work and what AIS is. **This is your "agent."** |
| **3. Automation** | Claude runs **on a schedule** and reaches into your **Gmail / Calendar / Notion**. | Jobs that should happen by themselves. "Every morning, triage my inbox." |

The mental model:
- **Chat** = ask once.
- **Project** = a colleague who remembers everything every time.
- **Automation** = that colleague shows up and does the job without being asked.

You'll set up a Project first (your agent), then point one automation at it. Done.

---

## Part 2 — Set up your Operator Agent (15 min)

This is the core. You're creating one assistant that knows what AIS is, knows how you like to work, and never does anything risky without your OK.

**Step 1 — Create a Project.**
On claude.ai (or the desktop app), find **Projects** in the left sidebar → **New Project** → name it **"My AIS Operator."**

> If you don't see Projects, you can still do everything below — just paste the block at the **start of any new chat**. Projects are nicer because the instructions stick permanently.

**Step 2 — Paste in the instructions.**
Open the Project's **instructions / custom instructions** box and paste this whole block in. (This is "the agent." Edit the parts in [brackets].)

```text
You are my AIS Operator — the personal business assistant for a co-founder of
AIS Slovenia. I am your only human owner. Your job is to save me time so I can
focus on growing the company.

## About AIS Slovenia (your context)
AIS Slovenia is an AI-native company with three co-founders. We build and run
deployed AI agent systems that take over one specific, bounded function inside a
client's business. We do NOT sell "AI seats," hours, or generic consulting.
Pricing is a build fee + a monthly operate retainer. Our first paying client is
INSPECTUS (vehicle inspection — we automated their damage-report data pipeline).
Most clients are Slovenian businesses still doing manual / Excel work.
My name is [YOUR NAME]. My main focus inside AIS is [e.g. sales & clients / 
strategy & AI / legal & ops].

## What you own
First drafts, summaries, research, organizing, and prep — anything I will review
before it counts. You turn my messy notes, inboxes, and half-thoughts into clear,
prioritized, ready-to-act output.

## What you NEVER do without my explicit OK
Before any of these, show me the draft and wait for me to say "yes, send it":
- Send any email, message, or DM to anyone outside AIS.
- Make any commitment, price, or promise to a client on my behalf.
- Post anything publicly.
You may DRAFT all of these freely. You just never send or post them yourself.
I press the button.

## How you talk
- Short and plain. Lead with the answer or the action. Skip the warm-up.
- Never use filler words: no "leverage," "synergy," "cutting-edge,"
  "game-changer," "robust solution," "world-class." Say the specific thing instead.
- Client-facing copy in Slovenian → write it in Slovenian. Internal thinking can
  be English.
- When you're missing something, ask me ONE sharp question instead of guessing.
- If a task is bigger than it looks, say so and propose the smallest first step.

## When to stop and flag me
- Anything involving money, legal, a client complaint, or a decision I can't
  undo → stop and ask first.
- If a client-facing draft needs to sound like a specific real person, ask me for
  real writing samples first (the more the better). We don't ship voice-dependent
  copy from a cold start.

Start each session by asking: "What's on your plate today?" — then help me clear it.
```

**Step 3 (optional) — Give it memory.**
If your Project has a **"knowledge" / files** area, drop in anything it should always know: a short doc on what AIS does, your service list, your prices. The more it knows, the less you repeat yourself.

**Step 4 — Test it.** Start a chat *inside the Project* and try these:
1. *"What's on my plate today?"* — see how it opens.
2. *"Here are my rough notes from a client call: [paste 3 messy lines]. Draft a short Slovenian follow-up email. Don't send it."*
3. *"I have 2 hours free this afternoon. Based on what AIS is, what's the highest-value thing I could do with it?"*

If the replies feel off, edit the instructions block and try again. **Editing the instructions is how you "train" it.** That's the whole skill.

---

## Part 3 — Build your first automation (the fun part)

Now you make it run *by itself*. First, turn on the tools it needs:

**Connectors.** In Claude's **Settings → Connectors** (names may differ slightly on your plan), connect **Gmail** and **Google Calendar**. If you use **Notion** or **Google Drive**, connect those too. Can't find it? Ask Claude directly: *"How do I connect my Gmail on my current plan?"* — it'll walk you through it.

Then pick **the one job that eats the most of your week** from this menu and set it up. Each one is copy-paste.

> **How to schedule:** look for **"Tasks" / "Scheduled" / "Automations"** in Claude, create a new one, and paste the prompt. If your plan doesn't have scheduling yet, just run the prompt manually each morning — it still saves you the time, you're only missing the timer.

### 1. Inbox triage — *"what actually needs me today"*
**Does:** Reads your unread mail and hands you a ranked list instead of a scary inbox.
```text
Every weekday at 7:30, look at my unread Gmail from the last 24 hours. Group it
into: (1) Needs my reply today, (2) FYI only, (3) Can ignore. For group 1, give me
one line on what they want plus a one-sentence reply I can edit. Do NOT send anything.
```
**Guardrail:** drafts only — you send.

### 2. Meeting prep — *walk in ready*
**Does:** A half-page brief before every external meeting.
```text
Each morning, check today's calendar. For every meeting with someone outside AIS,
give me a short prep: who they are, the goal of the meeting, 3 smart questions I
should ask, and one thing that could go wrong. Half a page max per meeting.
```
**Guardrail:** internal only — just for your eyes.

### 3. Weekly AIS briefing — *close the week clean*
**Does:** A Friday wrap-up so Monday isn't a cold start.
```text
Every Friday at 16:00, ask me 3 quick questions about my week. Then write a
one-page briefing: wins, what's stuck, and my top 3 priorities for next week.
Keep the briefing so we can compare to it next Friday.
```
**Guardrail:** internal only.

### 4. Follow-up drafts — *never drop a lead*
**Does:** Turns your call notes into a ready-to-send follow-up. (On-demand — no schedule needed.)
```text
I'll paste my notes from a call. Draft a short Slovenian follow-up email: thank
them, recap what we agreed, and state the ONE next step with a date. Under 120
words. Don't send it — give it to me to review.
```
**Guardrail:** draft only. If it must sound like you, give it 3–5 of your real emails first.

### 5. Prospect / market research — *show up informed*
**Does:** A structured brief on any company or topic. (On-demand.)
```text
Research [company name]. Tell me: what they do, any signs they still work manually
or in Excel, the ONE function AIS could take over for them first, and a 3-sentence
opening angle for a first conversation. Cite where you found each fact.
```
**Guardrail:** it's a starting point — sanity-check the facts before you act on them.

**Ship one this week.** Don't set up all five. Pick the single one that matches your biggest weekly time-sink, get it running today, let it run five days, and adjust the wording. *Then* add a second.

---

## Part 4 — The rules (read once, they keep you safe)

These are AIS's house rules, in plain English. They're not bureaucracy — they're what keeps an AI from embarrassing you.

1. **You are the owner.** Every automation has exactly one human responsible for it: you. No "set it and forget it forever" — you glance at the output.
2. **Claude drafts, you send.** Nothing reaches a client or the public without you pressing send. This is non-negotiable.
3. **No paid-ads work.** AIS doesn't do Google/Meta ad campaigns. Don't ask Claude to build ad strategies — it's not our model.
4. **Real voice needs samples.** Client-facing copy only sounds human after Claude sees ~15 real examples of that person's writing. Until then, treat its copy as a rough draft, not the final word.
5. **No filler.** If a draft says "leverage," "synergy," "cutting-edge," or "game-changer," delete the sentence and ask for the specific version. AIS writing is sharp and concrete.
6. **Mind the data.** Don't paste a client's confidential files into a random chat if you wouldn't email them. When in doubt, summarize instead of pasting raw.

---

## Part 5 — Level up (when you're comfortable)

**The 4-part prompt.** When a result is mediocre, it's usually missing one of these. Give Claude all four:
> **Role** (who it should act as) + **Task** (what to do) + **Context** (the background it needs) + **Format** (how you want the answer).
>
> *Example:* "**You're my sales assistant.** **Write a follow-up email.** **The client is a Slovenian logistics firm we met Tuesday; they liked the demo but worried about price.** **Slovenian, under 100 words, friendly but direct.**"

**Let Claude teach you.** Stuck? Ask it. Try: *"I'm new to Claude — show me 3 ways you could save me an hour this week,"* or *"What could I automate in my role at AIS that I haven't thought of?"*

**Turn a good prompt into a reusable Skill.** When a prompt works great and you keep reusing it, say: *"Turn this into a reusable Skill I can save and trigger by name."* Claude will format it for you.

**When to ping Ian:**
- Setup that this file didn't get you through (connectors, scheduling, your plan).
- You want a *custom* agent built for a specific AIS workflow (Ian builds these with Claude Code).
- Anything touching the shared AIS systems (the client dashboards, INSPECTUS, the VPS).

---

## Appendix — install this file as a Skill (bonus)

You already got 90% of the value from the Project in Part 2. This is optional polish.

A **Skill** is a reusable capability Claude can pull in by name. To install this one:
1. Keep this file named **`SKILL.md`** inside a folder named **`cofounder-claude-starter`**.
2. In Claude, go to **Settings → Capabilities → Skills** (wording may vary by plan) and **add / upload** the folder.
3. Now you can summon it any time by asking for the "cofounder claude starter" skill.

> Don't see a Skills option? It depends on your Claude plan. No problem — the **Project** method is just as powerful for everything in this guide. Ask Ian if you want Skills enabled.

---

*Built for AIS Slovenia co-founders. Questions → Ian. Now go clear your plate.*
