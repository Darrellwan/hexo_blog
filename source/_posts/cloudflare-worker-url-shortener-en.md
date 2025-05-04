---
title: Building Your Free Personal URL Shortener with Cloudflare Worker and KV
tags:
  - Cloudflare
categories:
  - Code Development
page_type: post
id: cloudflare-worker-url-shortener
description: Build a simple yet practical URL shortening system using Cloudflare Worker and KV storage, requiring no servers and supporting basic API operations and UTM tracking capabilities.
date: 2025-05-02 13:01:00
bgImage: bg-blog-cloudflare-worker-shortenurl.jpg
preload:
  - bg-blog-cloudflare-worker-shortenurl.jpg
---
{% darrellImageCover bg-blog-cloudflare-worker-shortenurl bg-blog-cloudflare-worker-shortenurl.jpg max-800 %}

## Cloudflare Worker

It's a Serverless service
The biggest advantage is that the free plan is totally sufficient
Plus, Cloudflare is super fast

If you have **low volume** personal URL shortening needs
And want the possibility to **customize** it
To adjust according to your own usage habits
Then based on my experience using it for a few months, I highly recommend it

The whole architecture mainly uses Cloudflare Worker and KV

Worker handles the processing logic
KV plays a database-like role

KV = Key-Value storage similar to Redis
Perfect for small amounts of data that need quick access

### Pricing

I'm currently using the **free plan**

{% darrellImage800 cloudflare_worker-kv_worker_pricing cloudflare_worker-kv_worker_pricing.png max-800 %}

Although the KV + Worker free plan allows up to 100,000 reads per day,
If you plan to use other Workers in the future
I'd suggest not cutting it too close
**Not recommended for advertising purposes - if ad traffic suddenly spikes, you might exceed the free plan limits**

## URL Shortener System Architecture and Flow

The URL shortener system handles two main request flows:

### API Request Flow
1. Client sends an API request (like a POST request to create a new short URL)
2. Cloudflare Worker receives and processes the request
3. Validates the API Token for security
4. Performs CRUD operations based on the request
5. Accesses data in KV storage
6. Returns operation results in JSON format

{% darrellImage800 cloudflare_worker-api_flow cloudflare_worker-api_flow.png max-800 %}

### Short URL Flow
1. User visits a short URL (like `/abc`, `/abc/x`, or `/abc/x/spring_sale`)
2. Cloudflare Worker handles the redirect request
3. Extracts ShortCode, platform info, and campaign info from the URL path
4. Queries the target URL from KV storage
5. Determines next steps based on query results
6. If the short URL exists, adds UTM parameters (based on platform and campaign)
7. Performs a 301 redirect to the final target URL

{% darrellImage800 cloudflare_worker-redirect_flow cloudflare_worker-redirect_flow.png max-800 %}

## Code Explanation

Let's look at the complete Cloudflare Worker code implementation:

```javascript
const SOCIAL_PLATFORMS = {
  x: { source: 'x', medium: 'social' },
  facebook: { source: 'facebook', medium: 'social' },
  linkedin: { source: 'linkedin', medium: 'social' },
  instagram: { source: 'instagram', medium: 'social' },
  tiktok: { source: 'tiktok', medium: 'social' },
  threads: { source: 'threads_post', medium: 'social' },
  community: { source: 'community', medium: 'social' }
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    try {
      return url.pathname.startsWith('/api/') 
        ? handleApi(request, url, env)
        : handleRedirect(request, url, env);
    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  }
};

const CONFIG = {
  defaultUrl: 'https://www.darrelltw.com/', // Default redirect URL, used if environment variable is not set
  utmMedium: 'social'
};

async function handleApi(request, url, env) {
  // Validate API Token
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (token !== env.API_TOKEN) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const method = request.method;
  const path = url.pathname.replace(/^\/api/, '');
  
  // Handle POST/PUT requests
  if ((method === 'POST' || method === 'PUT') && path === '/urls') {
    const { key, url } = await request.json();
    if (!key || !url) return new Response('Missing required parameters', { status: 400 });
    
    await env.SHORT_URLS.put(
      `/${key.replace(/^\//, '')}`, 
      url
    );
    
    return jsonResponse({ success: true });
  }
  
  // Handle GET requests
  if (method === 'GET' && path.startsWith('/urls/')) {
    const key = `/${path.replace('/urls/', '').replace(/^\//, '')}`;
    const value = await env.SHORT_URLS.get(key);
    
    return value 
      ? new Response(value, { headers: { 'Content-Type': 'text/plain' } })
      : new Response('Short URL not found', { status: 404 });
  }
  
  return new Response('Invalid API endpoint', { status: 404 });
}

async function handleRedirect(request, url, env) {
  try {
    const path = url.pathname;
    // Prioritize default URL from environment variables, fallback to CONFIG value if not set
    let redirectUrl = env.DEFAULT_REDIRECT_URL || CONFIG.defaultUrl;
    
    // Check if path is valid and has a ShortCode
    if (path !== '/' && path !== '') {
      const pathParts = path.split('/').filter(Boolean);
      const shortCode = pathParts[0];
      const platform = pathParts[1];
      const campaign = pathParts[2];
            
      if (shortCode) {
        let data = await env.SHORT_URLS.get(`/${shortCode}`);    
        if (data) {
          try {
            const finalUrl = new URL(data);
            
            if (platform) {
              // Use predefined social platform parameters
              if (SOCIAL_PLATFORMS[platform]) {
                const { source, medium } = SOCIAL_PLATFORMS[platform];
                finalUrl.searchParams.set('utm_source', source);
                finalUrl.searchParams.set('utm_medium', medium);
              } else {
                // Use default values if platform not predefined
                finalUrl.searchParams.set('utm_source', platform);
                finalUrl.searchParams.set('utm_medium', CONFIG.utmMedium);
              }
            }
            
            // Set campaign parameter
            if (campaign) {
              finalUrl.searchParams.set('utm_campaign', campaign);
            }
                    
            redirectUrl = finalUrl.toString();
          } catch (error) {
            // Parse failed, log error and use default redirect
            console.error('Error parsing short URL data:', error);
            // Don't attempt to build URL, use default value directly
            redirectUrl = env.DEFAULT_REDIRECT_URL || CONFIG.defaultUrl;
          }
        }
      }
    }    
    return Response.redirect(redirectUrl, 301);
  } catch (error) {
    console.error('Redirect error:', error);
    return Response.redirect(env.DEFAULT_REDIRECT_URL || CONFIG.defaultUrl, 301);
  }
}

function jsonResponse(data, status = 200) {
  return new Response(
    JSON.stringify(data),
    { 
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
```

### Main Processing Logic

The entry point for the Worker is the `fetch` function, which handles all requests:

```javascript
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    try {
      return url.pathname.startsWith('/api/') 
        ? handleApi(request, url, env)
        : handleRedirect(request, url, env);
    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  }
};
```

This code checks if the URL path starts with `/api/`
If yes, it's considered an API request and handled by `handleApi`; otherwise, it's treated as a short URL visit and handled by `handleRedirect` for redirection.
It also defines some default configurations.

### API Management Features

The API handling function provides interfaces for managing short URLs:

```javascript
async function handleApi(request, url, env) {
  // Validate API Token
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (token !== env.API_TOKEN) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const method = request.method;
  const path = url.pathname.replace(/^\/api/, '');
  
  // Handle POST/PUT requests
  if ((method === 'POST' || method === 'PUT') && path === '/urls') {
    const { key, url } = await request.json();
    if (!key || !url) return new Response('Missing required parameters', { status: 400 });
    
    await env.SHORT_URLS.put(
      `/${key.replace(/^\//, '')}`, 
      url
    );
    
    return jsonResponse({ success: true });
  }
  
  // Handle GET requests
  if (method === 'GET' && path.startsWith('/urls/')) {
    const key = `/${path.replace('/urls/', '').replace(/^\//, '')}`;
    const value = await env.SHORT_URLS.get(key);
    
    return value 
      ? new Response(value, { headers: { 'Content-Type': 'text/plain' } })
      : new Response('Short URL not found', { status: 404 });
  }
  
  return new Response('Invalid API endpoint', { status: 404 });
}
```

API features include:
1. Validating the authorization token to ensure only authorized users can manage short URLs
2. Handling POST/PUT requests to create or update short URLs:
   - Receiving key (ShortCode) and url (destination URL)
   - Storing the URL string directly in KV, not as JSON format
3. Handling GET requests to retrieve information about existing short URLs
4. Returning appropriate JSON responses and status codes

### Short URL Redirection Feature

The redirection handling function is responsible for converting short URLs to long URLs:

```javascript
async function handleRedirect(request, url, env) {
  try {
    const path = url.pathname;
    // Prioritize default URL from environment variables, fallback to CONFIG value if not set
    let redirectUrl = env.DEFAULT_REDIRECT_URL || CONFIG.defaultUrl;
    
    // Check if path is valid and has a ShortCode
    if (path !== '/' && path !== '') {
      const pathParts = path.split('/').filter(Boolean);
      const shortCode = pathParts[0];
      const platform = pathParts[1];
      const campaign = pathParts[2];
            
      if (shortCode) {
        let data = await env.SHORT_URLS.get(`/${shortCode}`);    
        if (data) {
          try {
            const finalUrl = new URL(data);
            
            if (platform) {
              // Use predefined social platform parameters
              if (SOCIAL_PLATFORMS[platform]) {
                const { source, medium } = SOCIAL_PLATFORMS[platform];
                finalUrl.searchParams.set('utm_source', source);
                finalUrl.searchParams.set('utm_medium', medium);
              } else {
                // Use default values if platform not predefined
                finalUrl.searchParams.set('utm_source', platform);
                finalUrl.searchParams.set('utm_medium', CONFIG.utmMedium);
              }
            }
            
            // Set campaign parameter
            if (campaign) {
              finalUrl.searchParams.set('utm_campaign', campaign);
            }
                    
            redirectUrl = finalUrl.toString();
          } catch (error) {
            // Parse failed, log error and use default redirect
            console.error('Error parsing short URL data:', error);
            // Don't attempt to build URL, use default value directly
            redirectUrl = env.DEFAULT_REDIRECT_URL || CONFIG.defaultUrl;
          }
        }
      }
    }    
    return Response.redirect(redirectUrl, 301);
  } catch (error) {
    console.error('Redirect error:', error);
    return Response.redirect(env.DEFAULT_REDIRECT_URL || CONFIG.defaultUrl, 301);
  }
}
```

The redirection function workflow:
1. Parse three parts from the URL path: ShortCode, Platform, and Campaign
   - Using `path.split('/').filter(Boolean)` for more flexible multi-segment URL support
2. Look up the corresponding target URL in KV storage based on ShortCode
3. Use `new URL(data)` to directly parse the string from KV as a URL
4. Based on the Platform parameter, check if it's predefined in `SOCIAL_PLATFORMS`:
   - If yes, use the predefined source and medium to set UTM parameters
   - If not, use the Platform name as source and default CONFIG.utmMedium as medium
5. If there's a campaign parameter, set utm_campaign
6. Execute a 301 redirect to the final URL
7. For any error scenarios (including URL parsing failures), redirect directly to the default URL to ensure user experience isn't interrupted

### Use Cases

There are now three ways to use created short URLs:

- Basic access: `https://your-worker.domain/blog` 
- With platform parameter: `https://your-worker.domain/blog/x`
- With platform and campaign parameters: `https://your-worker.domain/blog/x/spring_sale`

The second method automatically adds UTM source and medium parameters, redirecting to:
`https://example.com/my-very-long-blog-post-url?utm_source=x&utm_medium=social`

The third method adds the campaign parameter, redirecting to:
`https://example.com/my-very-long-blog-post-url?utm_source=x&utm_medium=social&utm_campaign=spring_sale`

This allows for more precise tracking of traffic sources and conversion rates from different platforms and campaigns.

## Setup Steps

### 1. Create a Cloudflare Worker Project

{% darrellImage800 cloudflare_worker-create_a_worker cloudflare_worker-create_a_worker.png max-800 %}

### 2. Add Worker Code

{% darrellImage800 cloudflare_worker-edit_code cloudflare_worker-edit_code.png max-800 %}

Save the code from above to `worker.js`.

### 3. Configure Environment Variables

Set up the following environment variables in Cloudflare Dashboard to customize your URL shortener service:

| Environment Variable | Description | Default Value |
| --- | --- | --- |
| API_TOKEN | API authorization token | None, must be set |
| DEFAULT_REDIRECT_URL | Default redirect when short URL not found | If not set, defaults to 'https://www.darrelltw.com/' |

{% darrellImage800 cloudflare_worker-kv-show_variables cloudflare_worker-kv-show_variables.png max-800 %}

### 4. Set Up KV 

{% darrellImage800 cloudflare_worker-kv-select_from_sidebar cloudflare_worker-kv-select_from_sidebar.png max-400 %}

{% darrellImage800 cloudflare_worker-kv-create_and_binding cloudflare_worker-kv-create_and_binding.png max-800 %}

First, create a KV namespace
After creation, go back to the Worker settings
Bind the KV namespace you just created, using `SHORT_URLS` as the environment variable name

### 5. Deploy the Worker

Simply click the "Save and Deploy" button in the Cloudflare Dashboard to deploy your Worker.

## Testing

### Creating Short URLs

Use curl or tools like Postman to send API requests to create short URLs:

```bash
curl -X POST https://your-worker.domain/api/urls \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"key":"blog","url":"https://example.com/my-very-long-blog-post-url"}'
```

On success, it returns:

```json
{
  "success": true
}
```
---

Or you can directly add a record in the Cloudflare KV you just created

{% darrellImage800 cloudflare_worker-kv-testing_add_index cloudflare_worker-kv-testing_add_index.png max-800 %}


When storing short URLs, the URL is stored directly in KV, which simplifies the redirection process and improves efficiency.

### Visiting Short URLs

There are now three ways to use the created short URLs:

- Basic access: `https://your-worker.domain/blog` 
- With platform parameter: `https://your-worker.domain/blog/x`
- With platform and campaign parameters: `https://your-worker.domain/blog/x/spring_sale`

The second method automatically adds UTM source and medium parameters, redirecting to:
`https://example.com/my-very-long-blog-post-url?utm_source=x&utm_medium=social`

The third method adds the campaign parameter, redirecting to:
`https://example.com/my-very-long-blog-post-url?utm_source=x&utm_medium=social&utm_campaign=spring_sale`

This allows for more precise tracking of traffic sources and conversion rates from different platforms and campaigns.

## Automating with n8n

{% darrellImage800 cloudflare_worker-shortenurl_in_n8n cloudflare_worker-shortenurl_in_n8n.png max-800 %}

The scenario is that when a new article is pushed to Github, it triggers an action
The action calls an n8n workflow to handle a few things

1. Generate a short URL
2. Generate a tweet for user review, which will be posted to X once approved

The short URL generation part directly adds a record to KV
So you can immediately use the short URL afterward

## Conclusion

This simple URL shortening system can be easily deployed on Cloudflare Worker, implementing basic URL shortening and management functions.

Advanced features to consider:

- Visit statistics and analytics
- Short URL expiration time settings
- Batch management tools
- Support for more UTM parameters (utm_id, utm_term, etc.)

