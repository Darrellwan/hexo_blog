---
title: n8n ElevenLabs Node - TTS Text-to-Speech Workflow Guide
tags:
  - n8n
  - n8n node
categories:
  - n8n
page_type: post
id: n8n-elevenlabs-tts-en
description: An in-depth guide to using n8n with ElevenLabs for voice automation, covering installation and feature tests.
bgImage: blog-n8n-elevenlabs-node-bg.jpg
preload:
  - blog-n8n-elevenlabs-node-bg.jpg
date: 2025-06-15 21:07:19
---

{% darrellImageCover blog-n8n-elevenlabs-node blog-n8n-elevenlabs-node-bg.jpg %}

## Getting Your API Key

After creating your account, head over to your profile settings and look for the **API Key** option.

{% darrellImage800 n8n_elevenlabs-setting_find_api_key n8n_elevenlabs-setting_find_api_key.png max-800 %}

Once you find it, generate a new API Key.

{% darrellImage800 n8n_elevenlabs-create_api_key n8n_elevenlabs-create_api_key.png max-400 %}

## Installing ElevenLabs Community Node in n8n and Setting Up Credentials

{% darrellImage800 n8n_elevenlabs-find_elevenlabs_node n8n_elevenlabs-find_elevenlabs_node.png max-800 %}

{% darrellImage800 n8n_elevenlabs-install_elevenlabs_node n8n_elevenlabs-install_elevenlabs_node.png max-400 %}

Just search for **elevenlabs** in the n8n node list; the ElevenLabs community node will appear.
The newer version of n8n lets you search for and install **officially verified** community nodes right from the editor.

After installation, setting up credentials is straightforward—simply paste your API Key and you're done.

{% darrellImage800 n8n_elevenlabs-create_elevenlabs_credentials n8n_elevenlabs-create_elevenlabs_credentials.png max-800 %}

## Using the ElevenLabs Node

### Text to Speech (TTS)

Text-to-speech is the feature most users are familiar with.
Provide some text, choose a voice, and instantly receive an audio file.

{% darrellImage800 n8n_elevenlabs-text_to_speech n8n_elevenlabs-text_to_speech.png max-800 %}

### Speech to Text (STT)

Speech-to-text is another highly requested feature.

It's typically used to convert recorded audio into text, ideally with speaker separation.

{% darrellImage800 n8n_elevenlabs-speech_to_text n8n_elevenlabs-speech_to_text.png max-800 %}

The results were disappointing.

1. No option to convert to Traditional Chinese
2. Unable to distinguish between speakers

I tested this with a NotebookLM recording featuring clearly distinct male and female voices, yet the node still failed to separate speakers.

### Speech to Speech (STS)

Voice-to-voice conversion - this is handy when you're not happy with how your voice sounds in a video recording and want to replace it with a different AI voice.

### Voice Features

{% darrellImage800 n8n_elevenlabs-voice_features n8n_elevenlabs-voice_features.png max-800 %}

This action lists all available voices.
As of 15 June 2025, 21 voices are available.

You can also preview these voices on their website.

{% darrellImage800 n8n_elevenlabs-voice_preview_in_website n8n_elevenlabs-voice_preview_in_website.png max-800 %}

Whether they perform well with Chinese remains to be seen, as the voices are primarily trained for English.
The API currently supports only V2. If V3 with new voices is released, quality should improve.

{% darrellImage800 n8n_elevenlabs-v3_alpha_release n8n_elevenlabs-v3_alpha_release.png max-800 %}

## Pricing

{% darrellImage800 n8n_elevenlabs-pricing_table n8n_elevenlabs-pricing_table.png max-800 %}

The free tier is generous for light users.
Here are some API-related costs:

Text to Speech: Besides the included Characters or minutes in your plan, only **Creator Plan** and above can purchase additional Character limits.
Speech to Text: Also requires **Creator Plan** or higher to buy extra quota.
Voice Clone: You need at least **Starter Plan** to use this paid feature!

## n8n Use Cases

### Daily News Summary with Voice Narration

Many workflows already use AI APIs to generate daily news summaries.
With ElevenLabs TTS, those summaries can be turned directly into voice narration.

{% darrellImage800 n8n_elevenlabs-demo-news_summary_with_voice n8n_elevenlabs-demo-news_summary_with_voice.png max-400 %}

Besides Line, you can of course use Slack or Telegram as well.

{% darrellImage800 n8n_elevenlabs-demo-news_summary_with_voice_slack n8n_elevenlabs-demo-news_summary_with_voice_slack.png max-400 %}

{% darrellImage800 n8n_elevenlabs-demo-news_summary_with_voice_telegram n8n_elevenlabs-demo-news_summary_with_voice_telegram.png max-400 %}

To hear an example, listen to the clip below:
```
International: Anti-Trump "No Kings" protests in East Tennessee are growing, with demonstrations planned nationwide to oppose the former president's military parade proposals. Social Economy: An Indian mother and her boyfriend were sentenced for the death of a 1-year-old girl, whose body was hidden in a closet. The mother got 25 years, the boyfriend nearly 50, highlighting child protection law enforcement. Social Economy: A 4.1 magnitude earthquake hit Pijijiapan, Chiapas, Mexico, with the National Seismological Service immediately releasing preliminary data and reminding people to stay safe.
```
<audio controls>
    <source src="https://pub-c093258f61a1463ea03e1a40c141968a.r2.dev/2025-06-15_news.mp3" type="audio/mpeg">
    Your browser doesn't support audio playback.
</audio>

The current V2 voices still sound robotic when speaking Chinese; they read rather than speak naturally.

### Other Possible Use Cases

Once TTS becomes more natural, many workflows become easier.
Send text to the TTS node, receive audio, and forward it through messaging apps.
You could even host the mp3 files online or turn them into podcasts.
If V3 achieves natural speech, expanding into podcast distribution will be feasible.

I'm also planning to test OpenAI's Whisper for speech-to-text conversion.
Speech-to-text with speaker identification is a common request.
We're currently looking for a convenient and affordable solution. 