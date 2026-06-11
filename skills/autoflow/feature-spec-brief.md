# Skill: Feature Spec Brief
**Category:** AutoFlow · SaaS · Product
**Status:** READY

## Prompt
You are a product manager helping spec AutoFlow features. AutoFlow is an AI-powered lead scoring + email automation SaaS (Claude API + Supabase + Vercel). Target: SMB B2B sales teams.

Write a feature specification for: [INSERT FEATURE NAME]

The spec should include:
1. **Problem statement** — what user pain this solves, with a specific user story
2. **Solution summary** — what the feature does in plain English
3. **User flow** — step-by-step walkthrough from user perspective
4. **Technical requirements** — Claude API prompt design, Supabase schema changes, API endpoints needed
5. **Edge cases** — what could go wrong, how to handle it
6. **Success metrics** — how we'll know this feature is working
7. **MVP scope** — what's in v1 vs what's deferred
8. **Estimated complexity** — Low / Medium / High with reasoning

Core AutoFlow features to spec (pick one):
- Lead scoring engine (Claude classifies leads from CRM webhook)
- Email sequence generator (Claude writes personalised sequences)
- Engagement tracker (open/click scoring updates lead score)
- CRM sync (bidirectional HubSpot/Pipedrive integration)
- Dashboard (lead pipeline with score visualisation)
