---
title: LINE MCP Server Testing Experience - Send LINE Messages with Just One Prompt
date: 2025-04-14 20:30:00
tags:
  - LINE
  - MCP
  - Claude
page_type: post
description: Implementing LINE MCP Server to allow AI models like Claude to directly operate the LINE Messaging API for sending messages, and introducing several test scenarios
categories: 
  - AI
bgImage: line_mcp_server_bg.jpg
preload:
  - line_mcp_server_bg.jpg
---

{% darrellImageCover line_mcp_server_bg line_mcp_server_bg.jpg max-800 %}

## LINE MCP Server

LINE recently released an officially supported MCP Server
[Github Link](https://github.com/line/line-bot-mcp-server)

{% darrellImage line_mcp_server-github_introduce line_mcp_server-github_introduce.png max-800 %}

It mainly provides three Tools:

### 1. push_text_message

Text Message is the most basic text message format

{% darrellImage line_mcp_server-text_message line_mcp_server-text_message.png max-400 %}


### 2. push_flex_message

Flex Message is a more complex message type that can include text, images, buttons, and other elements

{% darrellImage line_mcp_server-flex_message line_mcp_server-flex_message.png max-400 %}


### 3. get_profile

get_profile retrieves user information, including the user's name, profile picture, status, etc.

{% darrellImage line_mcp_server-get_profile line_mcp_server-get_profile.png max-400 %}

## Installation

### Github Clone

Installation is very simple according to the documentation

```
git clone git@github.com/line/line-bot-mcp-server.git

cd line-bot-mcp-server && npm install && npm run build
```

### Claude Desktop Installation

{% darrellImage line_mcp_server-install_in_claude_desktop line_mcp_server-install_in_claude_desktop.png max-800 %}

The installation method for Cursor is the same

1. Paste the built /dist/index.js
2. Paste the Line Message API Channel Access Token
3. Paste your own Line User ID

After pasting, restart Claude Desktop and you've completed the setup when you see the following Tools listed

{% darrellImage line_mcp_server-claude_desktop_show_tools line_mcp_server-claude_desktop_show_tools.png max-400 %}

### How to find your Line User ID?

If you need to find your own ID, it's actually very simple

Go to the Developer Console 

[developers.line.biz](https://developers.line.biz/)

Click on Basic Settings and you'll find it at the bottom!

{% darrellImage line_mcp_server-check_line_user_id_in_developer_console line_mcp_server-check_line_user_id_in_developer_console.png max-800 %}

## Simple Testing

After installation, you can use prompts in Claude Desktop or other MCP Clients
to send Line messages to yourself

Examples:

### Tomorrow's Weather Forecast (Firecrawl MCP + Line MCP)

{% darrellImage line_mcp_server-demo_weather_prompt line_mcp_server-demo_weather_prompt.png max-800 %}

As you can see, Claude first used Firecrawl MCP to obtain weather data
and referenced more than one weather source website

Finally, after compiling the data, it smartly formatted the information into a Flex Message format and sent it via Line,
resulting in the beautiful display below

{% darrellImage line_mcp_server-demo_weather_result line_mcp_server-demo_weather_result.png max-800 %}


### GA4 Data Analysis

{% darrellImage line_mcp_server-demo_ga4_analyze_prompt line_mcp_server-demo_ga4_analyze_prompt.png max-800 %}

This GA4 MCP is one I created personally to analyze my personal website's GA4 data
When combined with Line, I only need to send a single command in Claude

Then I can see my recent GA4 data analysis on Line
**Note: If you're using GA4 or similar data for business purposes, it's not appropriate to analyze directly with Claude, ChatGPT, etc., as there may be issues with data being uploaded to the models**
For such analysis needs, it's recommended to use local computing models

{% darrellImage line_mcp_server-demo_ga4_analyze_result line_mcp_server-demo_ga4_analyze_result.png max-800 %}

## Limitations of Line MCP Server

### Can Only Send Messages to Specific Users

Currently, it's not possible to dynamically or mass send messages to multiple users
so it's not very suitable for marketing scenarios

For example, when a user adds items to a shopping cart but doesn't complete checkout within a day,
sending a Line message to encourage purchase

This cannot currently be achieved with Line MCP

The appropriate scenario is more like **personal use**
replacing the previous Line Notify functionality

Sending data collected by AI models and analysis results to users via Line
But it's important to note that **Line Message API has costs, with a free quota of 200 uses/month**

Using Line MCP will consume this quota faster
and you cannot check the remaining quota through Line MCP itself
