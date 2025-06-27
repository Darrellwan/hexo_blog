---
title: Google Launches Free Gemini CLI Tool - Comparison with Claude Code
tags:
  - Gemini
  - CLI
categories:
  - AI
page_type: post
id: google-gemini-cli-en
description: Google releases free Gemini CLI command-line tool with generous free tier. Installation guide and comparison with Claude Code using identical prompts.
bgImage: blog-gemini-cli-bg.jpg
preload:
  - blog-gemini-cli-bg.jpg
date: 2025-06-26 00:40:04
modified: 2025-06-27 07:54:32
---

{% darrellImageCover blog-gemini-cli-bg blog-gemini-cli-bg.jpg %}

## Introducing the Gemini CLI
Google has just released a powerful command-line interface that brings serious competition to Claude Code.

## Installation

[Official GitHub Documentation](https://github.com/google-gemini/gemini-cli)

```
npx https://github.com/google-gemini/gemini-cli

# or

npm install -g @google/gemini-cli
```

First, generate an API key in Google AI Studio:

{% darrellImage800 gemini-generate_api_key gemini-generate_api_key.png max-800 %}

Next, export it as an environment variable:

```
export GEMINI_API_KEY="YOUR_API_KEY"
```

Alternatively, you can authenticate directly in Gemini CLI:

```
/auth 
# Choose your preferred authentication method
```

{% darrellImage800 gemini-generate_login_auth gemini-generate_login_auth.png max-800 %}

### Supported Platforms

- macOS
- Linux
- Windows (native support—no WSL needed, a major advantage over Claude Code)

## Gemini Commands

### auth

Switch between authentication methods. You're not limited to API keys—you can also sign in directly with your Google account.

### about

Display the current configuration and system information:

```
About Gemini CLI                                                                       │
│                                                                                        │
│ CLI Version                   0.1.1                                                    │
│ Git Commit                    852210e1 (local modifications)                           │
│ Model                         gemini-2.5-pro                                           │
│ Sandbox                       no sandbox                                               │
│ OS                            darwin        
```
 
### chat

Manage conversation history and sessions.

Use `save + tag` to label a conversation, then run `/chat resume <tag>` to continue where you left off.
Run `/chat list` to view all saved conversations.

{% darrellImage800 gemini_cli-chat gemini_cli-chat.png max-800 %}

### compress

Compress the current conversation history to reduce token usage:

```
✦ Chat history compressed from 2644 to 195 tokens.
```

In this example, token usage was reduced by over 90%.

### doc 

Open the official Gemini CLI documentation.

### editor
Configure your preferred editor settings:

{% darrellImage800 gemini_cli-editor gemini_cli-editor.png max-800 %}

### help

Display a list of all available commands.

### mcp 

Register and manage MCP (Model Context Protocol) tools.

MCP is configured through a `settings.json` file:

The configuration file supports multiple scopes:
- User scope settings
`~/.config/gemini/settings.json`

- Project scope settings
`./project-name/.gemini/settings.json`

```json
// Line MCP Server example
{
  "mcpServers": {
    "line-chatbot": {
      "command": "/opt/homebrew/bin/node",
      "args": [
        "/xxx/dist/index.js"
      ],
      "env": {
        "CHANNEL_ACCESS_TOKEN" : "xxx",
        "DESTINATION_USER_ID" : "line_uid"
      }
    }
  }
}
```

#### Line MCP Server Test

Here's a practical example using the Line MCP Server:

``` json
// prompt
line push_flex_message about how to use gemini cli     
```

{% darrellImage800 gemini_cli-mcp_line_sending gemini_cli-mcp_line_sending.png max-800 %}

The integration worked seamlessly, and the generated Line Flex template is well-structured and professional.

### quit

Exit the Gemini CLI application.

### stats 

View your current usage statistics and token consumption:

{% darrellImage800 gemini_cli-stat gemini_cli-stat.png max-800 %}

### theme 

Customize the interface with different color themes:

{% darrellImage800 gemini_cli-theme gemini_cli-theme.png max-800 %}

### tools

Display all available tools and their capabilities:

{% darrellImage800 gemini_cli-tools gemini_cli-tools.png max-800 %}

Before executing any tool, Gemini CLI requests user permission—similar to the confirmation prompt shown when invoking `WebFetch`:

{% darrellImage800 gemini_cli-tools_web_fetch gemini_cli-tools_web_fetch.png max-800 %}

## Performance Comparison: Weather Animation Test

I tested both tools using a common benchmark: creating an interactive weather animation.
Even with **Gemini-2.5-pro**, the results were underwhelming.

{% darrellImage800 gemini_cli-weather_animation gemini_cli-weather_animation.png max-800 %}

Running the identical prompt through **Claude Code** demonstrates that Claude continues to excel at front-end development and visual tasks:

{% darrellImage800 claude_code-weather_animation claude_code-weather_animation.png max-800 %}

## Usage Limits and Pricing

The free tier offers generous quotas: **60 requests per minute** and **1,000 requests per day**.

This is remarkably generous, especially considering you get full access to the `gemini-2.5-pro` model.
It remains to be seen how long Google will maintain such generous free limits.

{% darrellImage800 blog-gemini-cli-pricing blog-gemini-cli-pricing.jpg max-800 %} 