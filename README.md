# Gatsby-airtable-cms

## Client
Gatsby is a static site generator built to output highly optimized static pages.  The idea here is that a client could use Airtable as their CMS/Dashboard instead of needing a separate CMS service. 

Even better, since the output is just static HTML it makes it extremely and lightweight to host wherever you need it. By querying Airtable during the build phase we can generate optimized static content, without having to query airtable after the site loads (AIRTABLE IS SLOOOOW).

The thing that makes this all work is that Airtable saves their "rich text" as Markdown, which is the goto format for gatsby builds.
This is built off of the popular gatsby-starter-blog starter kit, and is modified to query Airtable instead of the filesystem for markdown content.



## Server
This package also makes use of a fastify server to: 
  - Respond to Airtable automations in order to trigger build scripts.
  - A very rough system to mimic "immutable" server creation (so users dont see junk while the server rebuilds)
