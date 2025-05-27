---
title: n8n Debugging - Line Invalid JSON Error
tags:
  - n8n
  - n8n-debug
categories:
  - n8n
page_type: post
id: n8n-debug-line-invalid-json-en
description: Getting "Invalid JSON" errors with Line Message API in n8n? This debugging guide covers common causes and solutions for JSON validation errors in n8n workflows, especially when dealing with AI-generated content.
bgImage: blog-n8n-invalid-json-bg.jpg
preload:
  - blog-n8n-invalid-json-bg.jpg
date: 2025-05-10 18:22:12
modified: 2025-05-10 18:22:12
---

{% darrellImageCover blog-n8n-invalid-json-bg blog-n8n-invalid-json-bg.jpg %}

## Invalid JSON Error

Getting that "Invalid JSON" error when working with the Line Message API in n8n? Yeah, it's frustrating. I've been there more times than I'd like to admit, and it's one of those errors that seems to pop up at the worst moments.

The culprit is usually the previous step outputting something unexpected—especially when you're using AI models to generate text. Sometimes it's plain text, sometimes JSON, sometimes... well, who knows what. AI can be unpredictable like that.

Here are the most common scenarios I've encountered and how to fix them.

{% darrellImage800 n8n-line_invalid_json_error_message n8n-line_invalid_json_error_message.png max-800 %}

### Double Quote Issues

n8n makes debugging pretty straightforward. When you're in `expression` mode, there's a preview button in the bottom-right corner of the Expression field. Click it to see exactly what your data looks like.

{% darrellImage800 n8n-line_invalid_json-double_quotes_issue n8n-line_invalid_json-double_quotes_issue.png max-800 %}

The issue: if OpenAI (or any AI service) outputs text with double quotes, and you wrap it in more double quotes, you get something like `"" text ""`. That's invalid JSON right there.

### Double Quotes Inside Text Content

Another common scenario. Your text content has double quotes embedded within it.

{% darrellImage800 n8n-line_invalid_json-double_quotes_between_string n8n-line_invalid_json-double_quotes_between_string.png max-800 %}

Example: ` "NVIDIA settles in "Beishi Tech Park" land rights review delayed, Taipei City government gets "no comment" from Shin Kong Life" `

Those extra double quotes around **Beishi Tech Park** will break your JSON. This happens when AI adds quotes for emphasis, or when your source data already contains them.

### Sending Objects as Objects

{% darrellImage800 n8n-line_invalid_json-send_object_as_object_object n8n-line_invalid_json-send_object_as_object_object.jpg max-800 %}

Seeing **[object Object]** in your output? This usually means the AI returned something unexpected, or you've selected the wrong variable.

{% darrellImage800 n8n-line_invalid_json-send_object_as_object_object_check_input n8n-line_invalid_json-send_object_as_object_object_check_input.png max-800 %}

Double-check your variable selection and make sure you're pulling the right data.

{% darrellImage800 n8n-line_invalid_json-n8n_input_type n8n-line_invalid_json-n8n_input_type.png max-400 %}

Those little icons on the left of input fields? They show the expected data type. For Line's Push Message API, you want String types. Anything else will cause problems.

### Using Online Tools to Check for Errors

When you've checked everything and still can't spot the issue, online JSON validators are your friend. Search for `JSON validator online` and you'll find tools like:

[JSONLint](https://jsonlint.com/)
[jsonformatter](https://jsonformatter.curiousconcept.com/)

Pro tip: copy the previewed output, not the expression field itself. The preview shows what actually gets sent.

{% darrellImage800 n8n-line_invalid_json-check_json_validate_online n8n-line_invalid_json-check_json_validate_online.png max-800 %}

These tools will pinpoint exactly where the JSON breaks.

## Fixing Invalid JSON in n8n

### toJsonString()

`toJsonString()` handles the heavy lifting for you. It properly escapes strings and wraps them in quotes.

{% darrellImage800 n8n-line_invalid_json-solution-to_json_string n8n-line_invalid_json-solution-to_json_string.png max-800 %}

Input:
`NVIDIA settles in "Beishi Tech Park" land rights review delayed`

After `toJsonString()`:
`"NVIDIA settles in \"Beishi Tech Park\" land rights review delayed"`

It adds the outer quotes and escapes internal quotes. Simple and effective.

This breaks: ` "textext"aaa"textext" ` ❌

This works: ` "textext\"aaa\"textext" ` ✅

### replaceAll()

If you know your data contains double quotes and you want to remove them entirely:

`"{{ $json.title.replaceAll('"', '') }}"`

{% darrellImage800 n8n-line_invalid_json-solution-replace_all n8n-line_invalid_json-solution-replace_all.png max-800 %} 