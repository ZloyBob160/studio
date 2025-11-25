# Firebase Studio

This project powers AnalystAI, a Next.js + Firebase experience for gathering business requirements and generating the supporting documentation.

## Getting Started

```bash
npm install
npm run dev
```

Then open http://localhost:9002.

## Environment Variables

Create a `.env.local` file and provide the Firebase configuration that the rest of the app already expects. To enable Confluence export you also need to set:

```
CONFLUENCE_BASE_URL=https://<your-site>.atlassian.net/wiki
CONFLUENCE_SPACE_KEY=<space key>
CONFLUENCE_EMAIL=<atlassian account email>
CONFLUENCE_API_TOKEN=<api token>
# optional: nest new pages under an existing page
CONFLUENCE_PARENT_PAGE_ID=<page id>
```

## Confluence Integration

Once the AI finishes generating the Business Requirements Document + analytical artifacts you can export them directly to Confluence using the **Export to Confluence** button. The integration will:

- Create a new page in the configured space when the title does not exist
- Update the existing page when you re-export the same conversation
- Provide a link back to the Confluence page after a successful sync and surface any configuration errors inline in the UI

The generated content uses the Confluence storage format (HTML) and mirrors the Goal, Description, Scope, Business Rules, KPIs, Use Cases, User Stories, Process Diagrams, and Leading Indicators sections produced by the AI flow.
