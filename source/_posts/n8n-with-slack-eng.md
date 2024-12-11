---
title: n8n with Slack - Sending Messages and Triggering Workflows
tags:
  - n8n
  - Integration
  - Webhook
categories:
  - Automation
page_type: post
id: n8n-with-slack
description: Slack is a widely used communication tool, especially among developers for notification purposes. Integrating n8n with Slack is relatively simple for non-technical users, allowing them to achieve automation through no-code solutions without programming knowledge.
bgImage: n8n-with-slack_bg.jpg
preload:
  - n8n-with-slack_bg.jpg
date: 2024-12-08 17:57:04
---

{% darrellImageCover n8n-with-slack_bg n8n-with-slack_bg.jpg %}

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

## Credentials Setup

{% darrellImage n8n_set_slack_credentials n8n_set_slack_credentials.png max-800 %}

There are two ways to set up Slack credentials in n8n:

### OAuth

{% darrellImage n8n_set_slack_credentials_oauth_step1 n8n_set_slack_credentials_oauth_step1.png max-400 %}
{% darrellImage n8n_set_slack_credentials_oauth_success n8n_set_slack_credentials_oauth_success.png max-800 %}

This is the simplest and most intuitive method - just log in to Slack and authorize.
Pros and Cons:   
✅ No need to manage Access Tokens
✅ Automatically handles required permissions (Slack permissions are complex, we'll discuss Access Tokens later)
❌ Cannot customize permissions
❌ Cannot be used as Slack-related Triggers

### Access Token

To obtain a Token, you need to complete the following steps:

1. Create a new APP in Slack
{% darrellImage n8n_slack_create_app n8n_slack_create_app.png max-800 %}
2. Adjust the Scope permissions
{% darrellImage n8n_slack_app_set_scope n8n_slack_app_set_scope.png max-800 %}
Regarding Scopes, as mentioned in the pros and cons, there are many options to set.
n8n provides documentation on which settings are needed:

[View required Slack Scopes settings list](https://docs.n8n.io/integrations/builtin/credentials/slack/#scopes)

<div class="copy-scopes">
  <p>Click the text below to copy the required Scopes:</p>
  <div class="scope-text">
    <div class="scope-item"><span>channels:read</span></div>
    <div class="scope-item"><span>chat:write</span></div>
    <div class="scope-item"><span>files:read</span></div>
    <div class="scope-item"><span>files:write</span></div>
    <div class="scope-item"><span>groups:read</span></div>
    <div class="scope-item"><span>im:read</span></div>
    <div class="scope-item"><span>mpim:read</span></div>
    <div class="scope-item"><span>reactions:read</span></div>
    <div class="scope-item"><span>reactions:write</span></div>
    <div class="scope-item"><span>usergroups:read</span></div>
    <div class="scope-item"><span>usergroups:write</span></div>
    <div class="scope-item"><span>users:read</span></div>
  </div>

  <div class="scope-warning">
    <p>The following Scopes are not applicable for Bot Tokens:</p>
    <div class="scope-text bot-invalid">
      <div class="scope-item"><span>users.profile:write</span></div>
      <div class="scope-item"><span>stars:write</span></div>
      <div class="scope-item"><span>stars:read</span></div>
      <div class="scope-item"><span>channels:write</span></div>
    </div>
  </div>
</div>

<style>
.copy-scopes {
  margin: 20px 0;
  padding: 15px;
  background: #2d2d2d;
  border-radius: 5px;
  color: #fff;
}
.scope-text {
  padding: 10px;
  background: #1e1e1e;
  border-radius: 4px;
  margin-top: 10px;
  font-family: monospace;
}
.scope-warning {
  margin-top: 20px;
}
.scope-warning p {
  color: #ff9800;
  margin-bottom: 5px;
}
.bot-invalid {
  border-left: 3px solid #ff9800;
}
.scope-item {
  padding: 8px 10px;
}
.scope-item span {
  color: #e0e0e0;
  cursor: pointer;
  user-select: none;
}
.scope-item span:hover {
  color: #fff;
}
.scope-item span.copied {
  color: #66bb6a;
  text-shadow: 0 0 8px rgba(102, 187, 106, 0.3);
}
</style>

<script>
document.querySelector('.copy-scopes').addEventListener('click', function(e) {
  if (e.target.tagName === 'SPAN') {
    const scope = e.target.textContent.replace(' (Copied)', '');
    navigator.clipboard.writeText(scope).then(() => {
      if (!e.target.classList.contains('copied')) {
        e.target.textContent = scope + ' (Copied)';
        e.target.classList.add('copied');
      }
    });
  }
});
</script>

3. Install the APP to your workspace
4. Get the Access Token
{% darrellImage n8n_slack_app_reinstall_app_get_token n8n_slack_app_reinstall_app_get_token.png max-800 %}
5. Enter the Token in n8n Credentials
{% darrellImage n8n_slack_paste_access_token n8n_slack_paste_access_token.png max-800 %}
6. To send messages to a Channel, you need to invite the App to that Channel first
{% darrellImage n8n_slack_send_message_invite_bot_to_channel n8n_slack_send_message_invite_bot_to_channel.png max-800 %}

## Sending Messages

After setting up the Credentials, you can create a Node to send messages
{% darrellImage n8n_slack_send_message_setting n8n_slack_send_message_setting.png max-800 %}

1. Select the credentials you just created
2. Choose the Channel to send to
   We'll use Channel as an example here. If you select User, it will send messages to specific users
3. Enter the message you want to send. For testing, you can use fixed text
{% darrellImage n8n_slack_send_message_setting_step2 n8n_slack_send_message_setting_step2.png max-400 %}

4. Click Test Action to test. If you see the screenshot like this, it means success
{% darrellImage n8n_slack_send_message_test_success n8n_slack_send_message_test_success.png max-400 %}

## Triggering Workflows with Slack

Besides being an action, Slack can also serve as a Trigger
We'll demonstrate using app mention
This means when we @APP in a Slack Channel, it will trigger the n8n workflow

### Setup Steps

{% darrellImage n8n_slack-set_trigger_on_bot_app_mentioned n8n_slack-set_trigger_on_bot_app_mentioned.png max-800 %}

First, add a new Node
1. Choose the desired Slack Trigger, there are eight types available
We'll select On bot app mention here
2. Confirm the Trigger is what you just selected
3. Choose a Channel, you'll need to @{your app} in this Channel later
If you can't select in this step, there might be permission issues. Please check if you've set all the recommended permissions mentioned above
4. You'll get a Webhook URL, which needs to be pasted into Slack for verification as shown below

{% darrellImage n8n_slack-check_webhook_url n8n_slack-check_webhook_url.png max-800 %}

5. After successful verification, seeing "Verified" means the setup is complete

### Testing the Trigger

Testing is quite simple. First, click Test Step on the Trigger in n8n
Then you'll see it start listening
Since it's listening for app mentioned events
We need to go to the specified Channel and @APP to trigger it

{% darrellImage n8n_slack-test_slack_trigger n8n_slack-test_slack_trigger.png max-400 %}

After going to Slack and sending a message with @APP, return to n8n and you'll see this information

{% darrellImage n8n_slack-get_test_information n8n_slack-get_test_information.png max-400 %}

Let's mention a few important schemas for future use:
user: The User ID of the message sender. You'll need this ID if you want the App to mention that user
channel: The Channel ID. You'll need this ID if you want to send messages back to this specific Channel
text: The content of the user's message. You'll need to extract this content if you want to process based on the message
team: The workspace ID
ts: The timestamp of the message. You'll need this timestamp if you want the App to reply under that specific message

Here's how to use the timestamp as shown below
{% darrellImage n8n_slack-post_message_to_reply n8n_slack-post_message_to_reply.png max-400 %}

## Results

The scenario demonstrated here is quite simple

After sending a message with @APP, the message content is directly sent to OpenAI API's 4o-mini model for response
The reason for choosing 4o-mini is simply because the API is cheaper and responds quickly

I originally wanted to test Perplexity's API but it seems n8n doesn't directly support it yet
Would need to use n8n's Http Request instead and additionally process the response format

{% darrellImage n8n_slack-demo_success n8n_slack-demo_success.png max-400 %}

I hope this article helps those interested in n8n and Slack. If you have any questions, feel free to email me
or DM me on [IG](https://www.instagram.com/darrell_tw_/)
