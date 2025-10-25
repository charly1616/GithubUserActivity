https://roadmap.sh/projects/github-user-activity

# GitHub Activity Viewer

A Node.js command-line tool that displays GitHub user activity in a simplified, readable format.

## Features

- 📊 View GitHub activity for multiple users
- 🎯 Simplified, human-readable event descriptions
- 🔄 Groups consecutive push events to reduce noise
- ⚡ Real-time command-line interface
- 📅 Shows events from the last 30 days

## Installation

1. Make sure you have Node.js installed on your system
2. Clone or download this script to your local machine
3. Navigate to the script's directory in your terminal

## Usage

### Basic Usage

Run the script with:
```bash
node script-name.js
```

Then enter GitHub usernames when prompted:
```
github-activity> username1 username2 username3
```

### Example Output

```
github-activity> octocat torvalds

===== Actions of octocat =====
 > Pushed to the main branch in the Hello-World repo
 + Created the branch feature/new-feature in the Hello-World repo
 - Closed the issue [Bug fix] of Hello-World

===== Actions of torvalds =====
 >> Pushed 3 times to the master branch in the linux repo
 + Opened the issue [Kernel panic] in the linux repo
 @ Added new-contributor to the linux repo from torvalds
```

## Event Types Displayed

The tool recognizes and formats these GitHub event types:

### 🔨 Push Events
- `> Pushed to the [branch] branch in the [repo] repo`
- `>> Pushed [X] times to the [branch] branch in the [repo] repo` (for consecutive pushes)

### 👁️ Watch Events
- `o Watched the repository [repo] from [organization]`

### 🆕 Create Events
- `+ Created the [type] [name] in the [repo] repo`

### 📢 Public Events
- `> Published the [repo] repo`

### 💬 Comment Events
- `/ Commented on the issue [title] of [repo]`

### 🔀 Pull Request Events
- `- Closed the PULL REQUEST [branch] in the [repo] repo`

### 👥 Member Events
- `@ Added [user] to the [repo] repo from [organization]`

### 🐛 Issue Events
- `- Closed the issue [title] of [repo]`
- `+ Opened the issue [title] in the [repo] repo`
- `# Labeled the issue [title] as [label] in the [repo] repo`
- `^ Assigned the issue [title] to [user] in the [repo] repo`

### Default
- `* Made the action of [type] in the repo [repo]` (for unrecognized event types)

## How It Works

1. **Data Fetching**: Uses GitHub's REST API to fetch user events
2. **Event Simplification**: Groups consecutive push events to the same repository and branch
3. **Readable Formatting**: Converts raw GitHub event data into human-readable messages
4. **Multiple Users**: Processes multiple usernames in a single command

## Error Handling

- Displays friendly error messages for invalid usernames
- Handles network connectivity issues
- Shows "No events were found" when users have no recent activity
- Continues processing other users if one fails

## Limitations

- Only shows events from the last 30 days (GitHub API limitation)
- Requires internet connectivity
- No authentication (uses public GitHub API rate limits)

## Tips

- Enter multiple usernames separated by spaces
- The tool will automatically group multiple pushes to the same branch
- Empty results mean the user has no public activity in the last 30 days
- Press `Ctrl+C` to exit the application

## Dependencies

- Node.js (built-in modules only - no external dependencies)
- `readline` for command-line interface
- `fetch` API (available in Node.js 18+)

## API Reference

The tool uses the GitHub Events API:
```
GET https://api.github.com/users/{username}/events
```

For more information about GitHub's event types, see the [GitHub Events API Documentation](https://docs.github.com/en/rest/activity/events).