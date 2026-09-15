# Redesign plan: Claude Design → live site

Source: Claude Design project "Harrington Data Co website design" (Home, Data Services, AI Services, FAQ, Contact, SiteNav, SiteFooter).
Principle: the design sets structure and copy; the existing build keeps its engineering (shared stylesheet, HubSpot integration, accessibility and layout fixes).

**Site-wide rules:**
- **Insights is out of scope.** It's not in the nav, the footer, or this plan.
- **No mention of AI policy anywhere:** services, FAQ, home copy, or contact form fields.
- **Contact email:** `hello@harringtondata.com`.
- **HubSpot-backed form options stay as they are** (budget ranges, company size, lead source), even where the design differs.

## Status

| # | Work | Status |
|---|------|--------|
| 1 | AI Services page (`ai-services.html`) + Services dropdown + new footer | Done |
| 2 | Roll new nav + footer out to `index`, `faq`, `contact`, `data-services` | Done |
| 3 | Data Services page (`data-services.html`) | Done |
| 4 | Home page rebuild | Done |
| 5 | Contact form: add Data / AI branching to the existing form | Done |
| 6 | FAQ copy update (8 → 10 questions) | Done |
| 7 | Retire `services.html` (redirect to `ai-services.html`) | Done |
| 8 | Full QA pass: mobile widths, keyboard nav, HubSpot test submission | Mostly done — see notes below |

**QA notes:**
- Verified in headless Chrome at 500px, 768px and 1280px on every page: no JS console errors, no horizontal overflow, nav dropdown opens/closes correctly (click, outside click, mobile full-width layout).
- Exercised the process rail (stage clicks, "Next" button, fill bar, last-stage hides "Next") — all correct.
- Exercised the contact form's full branching matrix (Data / AI / Both / Not sure yet, each data-work and AI-interest combination, message-label priority order) via scripted clicks — all correct. Confirmed the Strategize panel no longer has an AI-policy field.
- Confirmed site-wide: no "policy" text outside the one approved knowledge-base line, no "insights" mentions, no `.co` email, `services.html` redirects to `ai-services.html`.
- **Not done — needs a live HubSpot form:** an actual test submission per branch. `HUBSPOT_FORM_GUID` in `assets/js/contact.js` is still a placeholder pending the real form being built in HubSpot with the fields listed in that file's comment. Do this before launch.
- Keyboard-only dropdown navigation (Tab to trigger, Enter/Space to open, Tab through links, Escape to close) was implemented but not re-verified after this pass — worth a manual click-through.

## 1. AI Services — done

- `ai-services.html` built from the existing `.service-card` / `.jump-links` / `.cta-banner` components.
- New copy from the design. "Policy & guardrails" is gone; "Opportunity assessment" takes its place. The "Scoped by…" basis lines are dropped, as in the design.
- New closing banner points to Data Services.
- Services dropdown: `assets/js/nav.js` + `.nav-dropdown` styles. Hover on mouse, click/tap everywhere, Escape / outside click / focus-out closes. Full-width menu under 640px so it never runs off screen.
- The nav is Home · Services ▾ · FAQ · Get in touch, and the footer has no Insights link. Both deviate from the design, which includes Insights.

## 2. Nav + footer on every page

- Copy the `<nav>` and `<footer>` blocks from `ai-services.html` into each page.
- Move the `current` class to the matching link: Home, the Services trigger (on both service pages), or FAQ.
- Add `<script src="assets/js/nav.js"></script>` to each page.
- The Data services link is dead until step 3 exists, so do both in the same sitting.

## 3. Data Services

- Same template as AI Services, so no new CSS is needed.
- Three sections: Data engineering (3 cards), Reporting & dashboards (3), Advanced analytics (2). There are new icons for reporting (bar chart) and analytics (trend line).
- Closing banner: "Most AI projects fail on the data, not the model." → links to AI Services.

## 4. Home

Keep: the hero grid, `.work-card` styling, `.diff-card`, `.cta-banner`, and all tokens.

Change:
- **Hero:** new badge, headline and lede. The "How it starts" card is replaced by the **schematic card**: dotted-grid background, four source labels, animated dashed SVG connectors, a navy "One place the numbers live" block, and two outcomes. New CSS, including a `@keyframes flow`. Wrap the animation in `prefers-reduced-motion`.
- **Three ways we work** becomes **Two practices**: two large cards (Data / AI) with dash-bullet lists. "See the services" now scrolls to `#practices`.
  - Change the AI card's Strategize line from "audits, advisory and policy" to **"Strategize — audits and advisory"**.
- **Process table** becomes an **interactive 5-stage rail**: numbered dots on a progress track, a detail panel, and a "Next: …" button. It needs a small script (`assets/js/process.js`). The server-rendered HTML should show stage 01 so the section still reads without JS. The rail collapses to 2 columns with no track under 767px. Stages are now Conversation → Scoped proposal → Audit → The work itself → Support.
- **Why us:** headline becomes "…without a data department"; the vendor lock-in copy is updated.
- **CTA banner:** minor copy tweak.

## 5. Contact — keep the build, adopt the branching

**Keep from the current build (do not replace with the design's version):**
- The HubSpot Forms API submission, `data-hs-prop` mapping, `hutk` cookie, loading state and error message.
- First name / Last name as separate fields. HubSpot has separate properties; the design merges them into one "Name" field.
- Company size, budget and lead source options exactly as they are today, matching the HubSpot property values. The design's options are not used.
- Email `hello@harringtondata.com`. The design shows `.co`, which is wrong.
- The subgrid label alignment, `.field-solo`, and the `[hidden]` fix.
- The "Other" tool checkbox with its text field. The design dropped it.
- The Build panel's agent vs. knowledge-base follow-ups. The design dropped these too.
- Panel answers compiled into the `message` field.

**Adopt from the design:**
- **New first question, "Which side are you here about?":** single-select Data / AI / Both / Not sure yet.
- **Data panel** (for Data or Both): a multi-select of the three data services; selects for "What do you report in today?", "How many systems hold the data?" and "Who maintains reporting now?"; and a text field for systems to pull from.
- **The existing Train / Strategize / Build buttons move under "On the AI side, what are you after?"** They show only for AI or Both, and their panels work as they do today.
- **Not sure yet** panel gains the sentence "Plenty of people can't tell whether their problem is the data or the AI…"
- **New message-label order:** Not sure → Reporting → Analytics → any Data → Build → Train → Strategize.
- **Copy:** lede "Tell us which side you're here about…"; confirmation heading "Got it, thanks".

**Remove:**
- The Strategize panel's **"Do you have an AI policy today?"** field. The panel keeps "What's prompting this?" and "Who needs to be in the room?"; the second field goes full width or stays paired.

**`contact.js` changes:**
- Add `practice` (single) and `dataWork` (multi) state.
- Panel visibility becomes practice-driven.
- `buildMessage()` prepends "Practice: …" and "Data work: …", then collects from the Data panel with the existing `collectPanelNotes`.
- **Optional:** add a HubSpot contact property for practice so leads can be filtered without parsing the message.

## 6. FAQ

- Keep the `<details>` markup and `.faq-box` styles.
- Replace the content with the design's 10 Q&As, with these edits:
  - **03 (train, strategize, build):** drop "and a written policy". Strategy becomes "an audit of where the hours go and time with whoever makes the call."
## 7. Retire services.html

- Once the nav no longer links to it, replace it with a redirect to `ai-services.html` (host redirect preferred, meta refresh as a fallback). Old links and search results keep working.
- Its "Policy & guardrails" card goes away with it.

## 8. QA

- Check 400px, 768px and 1280px on every page, and that the dropdown works by keyboard.
- Search the whole site for "policy" and "insights"; nothing should turn up apart from the knowledge-base line about a client's own documents.
- Send one real HubSpot test submission per branch (Data, AI, Both, Not sure yet) and confirm the message field reads cleanly.
