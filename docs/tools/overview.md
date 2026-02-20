# Publora MCP Tools Overview

Publora provides 16 MCP tools for managing social media via AI assistants.

## Posts (6 tools)

### list_posts

List your posts with filters.

**Parameters:**
- `status` (optional): `draft`, `scheduled`, `published`, `failed`, `partially_published`
- `platform` (optional): `twitter`, `linkedin`, `instagram`, etc.
- `fromDate` (optional): ISO 8601 date
- `toDate` (optional): ISO 8601 date
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20, max: 100)
- `sortBy` (optional): Sort field: `createdAt`, `updatedAt`, `scheduledTime`
- `sortOrder` (optional): Sort direction: `asc` or `desc`

**Example prompts:**
- "Show my scheduled posts"
- "List all posts from last week"
- "What LinkedIn posts are scheduled for next month?"

---

### create_post

Schedule or publish a post to one or more platforms.

**Parameters:**
- `content` (required): Post text
- `platforms` (required): Array of platform IDs (get from `list_connections`)
- `scheduledTime` (required): ISO 8601 datetime (e.g., `2026-03-01T14:00:00Z`)

**Example prompts:**
- "Schedule 'Hello world!' to LinkedIn for tomorrow at 9am"
- "Post 'We're hiring!' to Twitter and LinkedIn right now"
- "Create a draft post for Instagram"

---

### get_post

Get details of a specific post.

**Parameters:**
- `postGroupId` (required): Post group ID

**Example prompts:**
- "Show me the details of post pg_abc123"
- "What's the status of my last scheduled post?"

---

### update_post

Reschedule or change post status.

**Parameters:**
- `postGroupId` (required): Post group ID
- `status` (optional): `draft` or `scheduled`
- `scheduledTime` (optional): New time in ISO 8601 format

**Example prompts:**
- "Reschedule post pg_abc123 to Friday at 3pm"
- "Change my draft to scheduled"

---

### delete_post

Delete a post from all platforms.

**Parameters:**
- `postGroupId` (required): Post group ID

**Example prompts:**
- "Delete post pg_abc123"
- "Cancel my scheduled post for tomorrow"

---

### get_upload_url

Get a presigned URL to upload media.

**Parameters:**
- `postGroupId` (required): Post group ID
- `fileName` (required): File name (e.g., `photo.jpg`)
- `contentType` (required): MIME type (e.g., `image/jpeg`)
- `type` (required): `image` or `video`

**Example prompts:**
- "I need to upload an image for my post"
- "Get me an upload URL for a video"

---

## Connections (1 tool)

### list_connections

List all connected social media accounts.

**Parameters:** None

**Example prompts:**
- "Show my connected accounts"
- "What platforms am I connected to?"
- "List my social media accounts"

---

## LinkedIn Analytics (6 tools)

### linkedin_post_stats

Get engagement metrics for a LinkedIn post.

**Parameters:**
- `postedId` (required): LinkedIn post URN (e.g., `urn:li:share:123456`)
- `platformId` (required): Platform connection ID
- `queryTypes` (optional): Metrics to fetch (`IMPRESSION`, `MEMBERS_REACHED`, `RESHARE`, `REACTION`, `COMMENT`)

**Example prompts:**
- "How did my last LinkedIn post perform?"
- "Get impressions for my LinkedIn post"

---

### linkedin_account_stats

Get aggregated statistics for your LinkedIn account.

**Parameters:**
- `platformId` (required): Platform connection ID
- `queryTypes` (optional): Metrics to fetch
- `aggregation` (optional): `DAILY` or `TOTAL` (default: TOTAL)

**Example prompts:**
- "Show my LinkedIn analytics"
- "What's my total engagement on LinkedIn?"

---

### linkedin_followers

Get follower count or growth.

**Parameters:**
- `platformId` (required): Platform connection ID
- `period` (optional): `lifetime` or `daily`
- `dateRange` (optional): For daily period: `{start: {year, month, day}, end: {year, month, day}}`

**Example prompts:**
- "How many LinkedIn followers do I have?"
- "Show my follower growth this month"

---

### linkedin_profile_summary

Get combined profile overview.

**Parameters:**
- `platformId` (required): Platform connection ID
- `dateRange` (optional): Date range: `{start: {year, month, day}, end: {year, month, day}}`

**Example prompts:**
- "Give me a summary of my LinkedIn profile"
- "How's my LinkedIn doing overall?"

---

### linkedin_create_reaction

React to a LinkedIn post.

**Parameters:**
- `postedId` (required): LinkedIn post URN
- `platformId` (required): Platform connection ID
- `reactionType` (required): `LIKE`, `PRAISE`, `EMPATHY`, `INTEREST`, `APPRECIATION`, `ENTERTAINMENT`

**Example prompts:**
- "Like this LinkedIn post"
- "React with PRAISE to post xyz"

---

### linkedin_delete_reaction

Remove a reaction from a LinkedIn post.

**Parameters:**
- `postedId` (required): LinkedIn post URN
- `platformId` (required): Platform connection ID

**Example prompts:**
- "Remove my reaction from this post"

---

## Workspace/B2B (3 tools)

### list_workspace_users

List team members in your workspace.

**Parameters:** None

**Example prompts:**
- "Show my team members"
- "Who's in my workspace?"

---

### create_workspace_user

Add a new user to your workspace.

**Parameters:**
- `username` (required): Email address
- `displayName` (optional): Display name

**Example prompts:**
- "Add john@example.com to my workspace"
- "Create a new team member"

---

### workspace_detach_user

Remove a user from your workspace.

**Parameters:**
- `userId` (required): User ID to remove

**Example prompts:**
- "Remove user xyz from my workspace"
