{% darrellImageCover n8n_pin_bg n8n_pin_bg.jpg max-800 %}

## What is Pin Data?

Every node (except Trigger nodes) has input and output data.

For example, when a Request node makes a call, it counts as one API call. If an API has limitations—such as rate limits (restricting the number of calls within a specific time frame) or usage limits (capping the maximum number of calls per day or month)—testing in n8n can become quite challenging.

In such cases, you can **pin** the current output data. During subsequent tests, n8n will directly use this pinned data without making new API calls or sending new requests!

{% darrellImage800 n8n_pin_demo n8n_pin_demo.png max-800 %}

## Using Pin

{% darrellImage800 n8n_how_to_pin n8n_how_to_pin.png max-800 %}

Pinning is very simple. Just right-click on the node you wish to pin, select "Pin", and when the node turns purple, it indicates that the node's data will be output directly.

## Suitable Scenarios

### TDX Transportation API

{% darrellImage800 n8n_tdx_api_pricing n8n_tdx_api_pricing.png max-800 %}

In the free version, the TDX API provides only 3 points per month, and each point deducts a different number of calls depending on the API.

For example, the basic service permits 1,500 calls per point, while the advanced service allows 200 calls per point.

By pinning the API's output data for subsequent integration testing, you can conserve your points during the testing phase.

### AI-Related Nodes

If you've fine-tuned your AI Prompt node and need to perform further integration tests, you'll notice that each pass through the AI node is time-consuming. Additionally, AI API calls can be costly, with prices varying depending on the model used.

In such scenarios, temporarily pinning the output is highly recommended. The video below demonstrates the difference between pinned and unpinned execution:

<div style="padding:0;position:relative;"><iframe src="https://player.vimeo.com/video/1052909965?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;byline=false&amp;title=false&amp;muted=true" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="n8n pin before after in openAi model"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

## Precautions

Since pinning is primarily used during testing or development, remember to unpin all nodes before deploying your workflow to production. Otherwise, instead of receiving up-to-date data in your production environment, you'll be stuck with the same pinned data—which could lead to serious issues in certain scenarios. 