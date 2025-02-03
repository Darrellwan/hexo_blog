{% darrellImageCover n8n_pin_bg n8n_pin_bg.jpg max-800 %}

## What is Pin Data?

Every node (except for Trigger) has input and output data.

For example, the Request node makes a call which is equivalent to one API call. If an API has limitations—such as a rate limit (only a certain number of calls allowed within a specific time frame) or usage limits (only a maximum number of calls allowed per day or month)—testing in n8n with such APIs can become very troublesome.

In these cases, you can **pin** the current output data. In subsequent tests, n8n will directly output this pinned data without re-calling the API or re-sending the request!

{% darrellImage800 n8n_pin_demo n8n_pin_demo.png max-800 %}

## Using Pin

{% darrellImage800 n8n_how_to_pin n8n_how_to_pin.png max-800 %}

Pinning is very simple. Just right-click on the node you wish to pin, select "Pin", and when the node turns purple, it indicates that the node's data will be output directly.

## Suitable Scenarios

### TDX Transportation API

{% darrellImage800 n8n_tdx_api_pricing n8n_tdx_api_pricing.png max-800 %}

In the free version, the TDX API provides only 3 points per month, and each point deducts a different number of calls depending on the API.

For example, the basic service allows 1500 calls per point, while the advanced service allows 200 calls per point.

By pinning the API's output data for subsequent integration testing, you can avoid wasting points on tests.

### AI-Related Nodes

If the AI Prompt node has been fine-tuned and you need to perform further integration tests, you might notice that each pass through the AI node takes a long time. In addition, the cost of AI API calls varies depending on the model used.

In such cases, it is also advisable to temporarily pin the output. The video below demonstrates the difference before and after pinning:

<div style="padding:0;position:relative;"><iframe src="https://player.vimeo.com/video/1052909965?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;byline=false&amp;title=false&amp;muted=true" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="n8n pin before after in openAi model"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

## Precautions

Since pinning is mainly used during testing or development, if your workflow is eventually deployed to production, remember to unpin any pinned nodes. Otherwise, in a production environment you might expect to receive the most up-to-date data, but you'd instead be getting the same old pinned data—which in some scenarios can lead to serious issues. 