---
title: Building an MCP Server in Cursor: Learning MCP Through Practice
date: 2025-03-09 22:44:20
tags:
  - Cursor
  - MCP
  - Claude
page_type: post
description: Learning notes on implementing an MCP Server in Cursor, featuring a simulated fruit and vegetable price query scenario, directly usable in Claude Desktop and Cursor.
categories:
  - AI
bgImage: cursor_mcp_server_bg.jpg
preload:
  - cursor_mcp_server_bg.jpg
---

{% darrellImageCover cursor_mcp_server_bg cursor_mcp_server_bg.jpg max-800 %}

## Why Implement an MCP Server

[Claude Desktop MCP Application Test Experience](https://www.darrelltw.com/claude-desktop-new-mcp-features-review/)
The previous article briefly mentioned the concept and usage of MCP.
However, while learning, I encountered many documents and videos,
and everyone seemed to have their own interpretation and concept of MCP.
So, I thought that actually developing my own MCP Server might lead to a better understanding!

This article will adopt a "learning by doing" approach, building a fruit and vegetable price query MCP Server from scratch in Cursor, and finally testing and verifying it on Claude Desktop.

## Definition of MCP

If you read ten articles, you might find ten different definitions or analogies for MCP.
My current understanding is: **Don't try to find a single truth, just grasp the concept.**

My personal definition currently aligns closely with what's mentioned in this article, which is the concept of a computer USB port.

{% darrellImage800 mcp_usb_concept mcp_usb_concept.png max-800 %}

{% darrellImage800 what-is-model-context-protocol what-is-model-context-protocol.png max-800 %}

**I recommend reading the original article if you're interested.**

From [MCP vs API: Model Context Protocol Explained](https://norahsakal.com/blog/mcp-vs-api-model-context-protocol-explained/)

Your computer initially only has its basic functions. Although it can already do many things,
if you want to play games, it doesn't have a built-in gamepad, right?
When you buy a gamepad with a USB connector and plug it in, your computer gains the ability to play games with that gamepad.

Similarly, devices like webcams, microphones, keyboards, mice, etc., all grant the computer new capabilities.

## Environment Setup

Before starting to develop the MCP Server, it's recommended to set up a Python virtual environment. This helps avoid package conflicts and facilitates dependency management:

### Create Virtual Environment

Use venv to create and activate a virtual environment:

```bash
python -m venv mcp-env
source mcp-env/bin/activate
```

Install and check MCP:

```bash
pip install "mcp[cli]"
mcp --version
```

## Developing the Fruit and Vegetable Price Query MCP Server

We will start directly with the fruit and vegetable price query service, implementing an MCP server that can query and compare the prices of different fruits and vegetables.

### 0. Cursor Learning Documents

My approach was to first look at the MCP SDK documentation on GitHub.
Actually, it wasn't me reading it - I downloaded it for Cursor to analyze.

[MCP Quick Start for Server Developers](https://github.com/modelcontextprotocol/python-sdk)

{% darrellImage800 cursor_mcp_server-server_developer_sdk cursor_mcp_server-server_developer_sdk.png max-800 %}

I'm not very familiar with TypeScript, so I used the Python SDK.

[Python MCP SDK](https://github.com/modelcontextprotocol/python-sdk)

{% darrellImage800 cursor_mcp_server-python_sdk_github cursor_mcp_server-python_sdk_github.png max-800 %}

After downloading the readme and putting it into the Cursor Project,
I directly asked the Agent to read this document first,
then help me create an MCP Server and demonstrate the fruit and vegetable price functionality.

You can also ask it to add comments after finishing, or explain what it did in text.

### 1. Code

Create a Python file: `fruit_price_server.py`:

```python
from mcp.server.fastmcp import FastMCP, Context, Image
import json
import os
from datetime import datetime, timedelta
import random
import io
from typing import Dict, List, Optional
import urllib.parse  # Add URL decoding library

# Try importing matplotlib, but provide a fallback
try:
    import matplotlib.pyplot as plt
    MATPLOTLIB_AVAILABLE = True
except ImportError:
    MATPLOTLIB_AVAILABLE = False
    print("Warning: matplotlib not installed, will use text charts as a fallback")

# Create an MCP server
mcp = FastMCP("Fruit and Vegetable Price Query")

# Simulate price data
FRUITS = {
    "apple": {
        "zh_name": "Apple",
        "current_price": 35.5,  # Price per kilogram (TWD)
        "unit": "kg",
        "prices": []  # Prices for the last 30 days will be generated during initialization
    },
    "banana": {
        "zh_name": "Banana",
        "current_price": 28.0,  # Price per kilogram (TWD)
        "unit": "kg",
        "prices": []  # Prices for the last 30 days will be generated during initialization
    }
}

# Create mapping from Chinese name to English name
ZH_TO_EN = {
    "蘋果": "apple",
    "苹果": "apple",  # Simplified Chinese also supported
    "香蕉": "banana"
}

# Generate price data for the past 30 days
for fruit in FRUITS.values():
    base_price = fruit["current_price"]
    today = datetime.now()
    
    # Generate price for each day
    for i in range(30):
        day = today - timedelta(days=29-i)
        # Random fluctuation, but kept within ±15% range
        price = base_price * (1 + random.uniform(-0.15, 0.15))
        fruit["prices"].append({
            "date": day.strftime("%Y-%m-%d"),
            "price": round(price, 1)
        })
    
    # Ensure the last day's price is the current price
    fruit["prices"][-1]["price"] = base_price

# Helper function to find fruit (supports Chinese/English names, including URL encoding)
def get_fruit_key(fruit_name: str) -> Optional[str]:
    """Get the English key based on Chinese or English name
    
    Args:
        fruit_name: Fruit/vegetable name (Chinese or English, possibly URL-encoded)
    
    Returns:
        The English key or None if not found
    """
    # Try URL decoding to support URL-encoded Chinese names
    try:
        decoded_name = urllib.parse.unquote(fruit_name)
        if decoded_name != fruit_name:
            print(f"Decoded URL-encoded name: {fruit_name} -> {decoded_name}")
            fruit_name = decoded_name
    except Exception as e:
        print(f"URL decoding failed: {e}")
    
    fruit_name = fruit_name.lower()
    
    # Direct match English name
    if fruit_name in FRUITS:
        return fruit_name
    
    # Look up Chinese name mapping
    if fruit_name in ZH_TO_EN:
        return ZH_TO_EN[fruit_name]
    
    return None

# Function to create standard table format
def create_table(dates, prices, title="Price Table", sample_size=10):
    """Creates a standard table format
    
    Args:
        dates: List of dates
        prices: List of prices
        title: Table title
        sample_size: Number of data points to display
        
    Returns:
        The table as a string
    """
    if not dates or not prices:
        return "No data to display"
    
    # Select evenly distributed sample points
    sample_indices = []
    if len(dates) <= sample_size:
        sample_indices = list(range(len(dates)))
    else:
        step = len(dates) / sample_size
        for i in range(sample_size):
            sample_indices.append(int(i * step))
        # Ensure the last point is included
        if sample_indices[-1] != len(dates) - 1:
            sample_indices[-1] = len(dates) - 1
    
    # Create table header
    table = f"【{title}】\n"
    table += "+--------------+-----------------+\n"
    table += "| Date         | Price (TWD/kg)  |\n"
    table += "+--------------+-----------------+\n"
    
    # Add data rows
    for i in sample_indices:
        date = dates[i]
        price = prices[i]
        table += f"| {date} | {price:15.1f} |\n"
    
    table += "+--------------+-----------------+\n"
    
    # Add price trend description
    price_trend = _get_price_trend_description(prices)
    table += f"Price Trend: {price_trend}\n"
    
    return table

# Create price comparison table
def create_comparison_table(dates, prices1, prices2, fruit1_name, fruit2_name, sample_size=8):
    """Creates a comparison table for two fruit/vegetable prices
    
    Args:
        dates: List of dates
        prices1: List of prices for the first fruit/vegetable
        prices2: List of prices for the second fruit/vegetable
        fruit1_name: Name of the first fruit/vegetable
        fruit2_name: Name of the second fruit/vegetable
        sample_size: Number of data points to display
        
    Returns:
        The comparison table as a string
    """
    if not dates or not prices1 or not prices2:
        return "No data to display"
    
    # Select evenly distributed sample points
    sample_indices = []
    if len(dates) <= sample_size:
        sample_indices = list(range(len(dates)))
    else:
        step = len(dates) / sample_size
        for i in range(sample_size):
            sample_indices.append(int(i * step))
        # Ensure the last point is included
        if sample_indices[-1] != len(dates) - 1:
            sample_indices[-1] = len(dates) - 1
    
    # Create table header
    table = f"【{fruit1_name} vs {fruit2_name} Price Comparison】\n"
    table += "+--------------+--------------+--------------+----------------------+\n"
    table += f"| Date         | {fruit1_name:12} | {fruit2_name:12} | Difference (TWD/kg) |\n"
    table += "+--------------+--------------+--------------+----------------------+\n"
    
    # Add data rows
    for i in sample_indices:
        date = dates[i]
        price1 = prices1[i]
        price2 = prices2[i]
        diff = price1 - price2
        table += f"| {date} | {price1:12.1f} | {price2:12.1f} | {diff:+20.1f} |\n"
    
    table += "+--------------+--------------+--------------+----------------------+\n"
    
    # Add summary
    avg_price1 = sum(prices1) / len(prices1)
    avg_price2 = sum(prices2) / len(prices2)
    avg_diff = avg_price1 - avg_price2
    
    table += f"Average Price: | {avg_price1:12.1f} | {avg_price2:12.1f} | {avg_diff:+20.1f} |\n"
    table += "+--------------+--------------+--------------+----------------------+\n"
    
    return table

# Text description function for price trend
def _get_price_trend_description(prices):
    """Provides a trend description based on price data
    
    Args:
        prices: List of prices
        
    Returns:
        Trend description string
    """
    if len(prices) < 2:
        return "Insufficient data to analyze trend"
    
    # Calculate price changes
    changes = []
    for i in range(1, len(prices)):
        changes.append(prices[i] - prices[i-1])
    
    # Calculate increases, decreases, and stable counts
    up_count = sum(1 for change in changes if change > 0)
    down_count = sum(1 for change in changes if change < 0)
    flat_count = sum(1 for change in changes if change == 0)
    
    # Calculate change between start and end prices
    start_price = prices[0]
    end_price = prices[-1]
    total_change = end_price - start_price
    percent_change = (total_change / start_price) * 100 if start_price != 0 else 0
    
    # Generate description
    description = ""
    
    # Overall trend
    if percent_change > 10:
        description += "Significant Increase"
    elif percent_change > 5:
        description += "Noticeable Increase"
    elif percent_change > 0:
        description += "Slight Increase"
    elif percent_change < -10:
        description += "Significant Decrease"
    elif percent_change < -5:
        description += "Noticeable Decrease"
    elif percent_change < 0:
        description += "Slight Decrease"
    else:
        description += "Basically Flat"
    
    description += f" ({percent_change:+.1f}%)"
    
    # Fluctuation pattern
    if up_count > 0.7 * len(changes):
        description += ", consistent upward trend"
    elif down_count > 0.7 * len(changes):
        description += ", consistent downward trend"
    elif up_count > down_count and up_count > flat_count:
        description += ", fluctuating but generally upward"
    elif down_count > up_count and down_count > flat_count:
        description += ", fluctuating but generally downward"
    else:
        description += ", high volatility"
    
    return description

# Resource to get the list of fruits and vegetables
@mcp.resource("fruits://list")
def list_fruits() -> str:
    """Gets a list of all queryable fruits and vegetables"""
    result = "Queryable Fruits and Vegetables:\n"
    result += "+----------------+--------------+----------------------+\n"
    result += "| Fruit/Veg Name | English Name | Current Price (TWD/kg) |\n"
    result += "+----------------+--------------+----------------------+\n"
    
    for key, fruit in FRUITS.items():
        result += f"| {fruit['zh_name']:14} | {key:12} | {fruit['current_price']:20.1f} |\n"
    
    result += "+----------------+--------------+----------------------+\n"
    result += "\nYou can query detailed information using:\n"
    result += "1. Read resource: fruits://Apple or fruits://apple\n"
    result += "2. Use tools: get_price_chart, compare_prices, or analyze_price_trend\n"
    
    return result

# Resource to get information for a specific fruit or vegetable
@mcp.resource("fruits://{fruit_name}")
def get_fruit_info(fruit_name: str) -> str:
    """Gets basic information for a specific fruit or vegetable
    
    Args:
        fruit_name: Fruit/vegetable name (Chinese or English, e.g., apple, 蘋果, banana, 香蕉)
    
    Returns:
        Fruit/vegetable information string
    """
    fruit_key = get_fruit_key(fruit_name)
    if not fruit_key:
        supported_list = ", ".join([f"{f['zh_name']}({k})" for k, f in FRUITS.items()])
        return f"Could not find information for {fruit_name}. Supported fruits/vegetables are: {supported_list}"
    
    fruit = FRUITS[fruit_key]
    prices_data = [item["price"] for item in fruit["prices"]]
    dates = [item["date"] for item in fruit["prices"]]
    
    result = f"【{fruit['zh_name']}】Basic Information\n\n"
    result += f"Current Price: {fruit['current_price']} TWD/{fruit['unit']}\n"
    result += f"30-Day High: {max(prices_data)} TWD/{fruit['unit']}\n"
    result += f"30-Day Low: {min(prices_data)} TWD/{fruit['unit']}\n"
    result += f"30-Day Average: {sum(prices_data)/len(prices_data):.1f} TWD/{fruit['unit']}\n"
    result += f"Recent Trend: {_price_trend_description(fruit['prices'])}\n\n"
    
    # Add standard table
    result += create_table(dates, prices_data, f"{fruit['zh_name']} Past 30 Days Price Table")
    
    return result

# Tool to get price trend chart for a specific fruit or vegetable
@mcp.tool()
def get_price_chart(fruit_name: str, days: int = 30) -> str:
    """Gets the price trend chart for a specific fruit or vegetable
    
    Args:
        fruit_name: Fruit/vegetable name (Chinese or English, e.g., apple, 蘋果, banana, 香蕉)
        days: Number of days to display, max 30
    
    Returns:
        Price trend chart (table version) with analysis
    """
    fruit_key = get_fruit_key(fruit_name)
    if not fruit_key:
        supported_list = ", ".join([f"{f['zh_name']}({k})" for k, f in FRUITS.items()])
        return f"Could not find information for {fruit_name}. Supported fruits/vegetables are: {supported_list}"
    
    fruit = FRUITS[fruit_key]
    zh_name = fruit['zh_name']
    
    # Limit days to a maximum of 30
    days = min(days, 30)
    
    # Get price data
    price_data = fruit["prices"][-days:]
    dates = [item["date"] for item in price_data]
    prices = [item["price"] for item in price_data]
    
    # Calculate important statistics
    current_price = prices[-1]
    avg_price = sum(prices) / len(prices)
    max_price = max(prices)
    min_price = min(prices)
    max_change = max([abs(prices[i] - prices[i-1]) for i in range(1, len(prices))])
    
    # Generate detailed report
    result = f"【{zh_name} Past {days} Days Price Analysis】\n\n"
    
    # Statistics Summary
    result += "Price Statistics Summary:\n"
    result += "+----------------------+-----------------+\n"
    result += "| Metric               | Value           |\n"
    result += "+----------------------+-----------------+\n"
    result += f"| Current Price        | {current_price:15.1f} |\n"
    result += f"| Average Price        | {avg_price:15.1f} |\n"
    result += f"| Highest Price        | {max_price:15.1f} |\n"
    result += f"| Lowest Price         | {min_price:15.1f} |\n"
    result += f"| Max Daily Fluctuation| {max_change:15.1f} |\n"
    result += "+----------------------+-----------------+\n\n"
    
    # Add detailed price table
    result += "Detailed Price Data (Sampled):\n"
    result += create_table(dates, prices, f"{zh_name} Price Table", sample_size=10)
    
    # Add price change description
    change_from_start = prices[-1] - prices[0]
    percent_change = (change_from_start / prices[0]) * 100 if prices[0] != 0 else 0
    
    result += f"\nPrice Trend Description:\n"
    result += f"- From {dates[0]} to {dates[-1]}, the price of {zh_name} "
    
    if change_from_start > 0:
        result += f"increased by {change_from_start:.1f} TWD (+{percent_change:.1f}%)"
    elif change_from_start < 0:
        result += f"decreased by {-change_from_start:.1f} TWD ({percent_change:.1f}%)"
    else:
        result += "remained unchanged"
    
    result += ".\n"
    
    # Add volatility analysis
    above_avg = sum(1 for p in prices if p > avg_price)
    below_avg = sum(1 for p in prices if p < avg_price)
    
    result += f"- During these {days} days, the price was above average on {above_avg} days and below average on {below_avg} days.\n"
    
    # Periodic change analysis
    if days >= 14:
        week1_avg = sum(prices[:7]) / 7
        week2_avg = sum(prices[7:14]) / 7
        week_change = ((week2_avg / week1_avg) - 1) * 100 if week1_avg != 0 else 0
        
        result += f"- Week 2 vs Week 1 average price change: {week_change:+.1f}%\n"
    
    if days >= 21:
        week3_avg = sum(prices[14:21]) / 7
        week3_change = ((week3_avg / week2_avg) - 1) * 100 if week2_avg != 0 else 0
        result += f"- Week 3 vs Week 2 average price change: {week3_change:+.1f}%\n"
    
    # Forecast trend
    result += "\nForecast:\n"
    if percent_change > 5:
        result += "- If the current trend continues, prices may continue to rise in the short term.\n"
    elif percent_change < -5:
        result += "- If the current trend continues, prices may continue to fall in the short term.\n"
    else:
        result += "- Prices may fluctuate around the current level.\n"
    
    return result

# Tool to compare prices of two fruits or vegetables
@mcp.tool()
def compare_prices(fruit1: str, fruit2: str, days: int = 30) -> str:
    """Compares the price trends of two fruits or vegetables
    
    Args:
        fruit1: Name of the first fruit/vegetable (Chinese or English, e.g., apple, 蘋果)
        fruit2: Name of the second fruit/vegetable (Chinese or English, e.g., banana, 香蕉)
        days: Number of days to compare, max 30
    
    Returns:
        Comparison result (table version) with analysis
    """
    fruit_key1 = get_fruit_key(fruit1)
    fruit_key2 = get_fruit_key(fruit2)
    
    if not fruit_key1 or not fruit_key2:
        error_msg = []
        if not fruit_key1:
            error_msg.append(f"Could not find information for {fruit1}")
        if not fruit_key2:
            error_msg.append(f"Could not find information for {fruit2}")
        error_msg.append("Supported fruits/vegetables are: " + ", ".join([f"{f['zh_name']}({k})" for k, f in FRUITS.items()]))
        return "\n".join(error_msg)
    
    # Limit days to a maximum of 30
    days = min(days, 30)
    
    # Get price data
    price_data1 = FRUITS[fruit_key1]["prices"][-days:]
    price_data2 = FRUITS[fruit_key2]["prices"][-days:]
    
    dates = [item["date"] for item in price_data1]
    prices1 = [item["price"] for item in price_data1]
    prices2 = [item["price"] for item in price_data2]
    
    fruit1_name = FRUITS[fruit_key1]["zh_name"]
    fruit2_name = FRUITS[fruit_key2]["zh_name"]
    
    # Calculate price differences
    current_diff = prices1[-1] - prices2[-1]
    avg_diff = sum(p1 - p2 for p1, p2 in zip(prices1, prices2)) / len(prices1)
    
    # Generate comparison report
    result = f"【{fruit1_name} vs {fruit2_name} Price Comparison Analysis】\n\n"
    
    # Summary data
    result += "Price Comparison Summary:\n"
    result += "+----------------+----------------+----------------+----------------+\n"
    result += f"| Metric          | {fruit1_name:14} | {fruit2_name:14} | Difference      |\n"
    result += "+----------------+----------------+----------------+----------------+\n"
    result += f"| Current Price   | {prices1[-1]:14.1f} | {prices2[-1]:14.1f} | {current_diff:+14.1f} |\n"
    result += f"| Average Price   | {sum(prices1)/len(prices1):14.1f} | {sum(prices2)/len(prices2):14.1f} | {avg_diff:+14.1f} |\n"
    result += f"| Highest Price   | {max(prices1):14.1f} | {max(prices2):14.1f} | {max(prices1)-max(prices2):+14.1f} |\n"
    result += f"| Lowest Price    | {min(prices1):14.1f} | {min(prices2):14.1f} | {min(prices1)-min(prices2):+14.1f} |\n"
    result += "+----------------+----------------+----------------+----------------+\n\n"
    
    # Add price comparison table
    result += "Detailed Price Comparison Data:\n"
    result += create_comparison_table(dates, prices1, prices2, fruit1_name, fruit2_name)
    
    # Add comparison analysis
    result += f"\nPrice Comparison Analysis:\n"
    
    # Price difference analysis
    if prices2[-1] != 0:
        price_diff_pct = (current_diff/prices2[-1])*100
        if current_diff > 0:
            result += f"- Currently, {fruit1_name} is {current_diff:.1f} TWD more expensive than {fruit2_name} ({price_diff_pct:.1f}%).\n"
        else:
            result += f"- Currently, {fruit1_name} is {-current_diff:.1f} TWD cheaper than {fruit2_name} ({price_diff_pct:.1f}%).\n"
    else:
        result += f"- Currently, {fruit1_name} is priced at {prices1[-1]:.1f} TWD while {fruit2_name} has no price data.\n"
    
    # Price trend comparison
    f1_change = ((prices1[-1] / prices1[0]) - 1) * 100 if prices1[0] != 0 else 0
    f2_change = ((prices2[-1] / prices2[0]) - 1) * 100 if prices2[0] != 0 else 0
    
    result += f"- {fruit1_name} price change over past {days} days: {f1_change:+.1f}%\n"
    result += f"- {fruit2_name} price change over past {days} days: {f2_change:+.1f}%\n"
    
    # Correlation analysis
    if (f1_change > 0 and f2_change > 0) or (f1_change < 0 and f2_change < 0):
        result += f"- Both items' price trends move in the same direction, but {fruit1_name if abs(f1_change) > abs(f2_change) else fruit2_name} changed more significantly.\n"
    else:
        result += f"- The price trends move in opposite directions: {fruit1_name} {('increased' if f1_change > 0 else 'decreased')} while {fruit2_name} {('decreased' if f2_change < 0 else 'increased')}.\n"
    
    # Purchase recommendation
    result += "\nPurchase Recommendation:\n"
    if current_diff < 0:
        result += f"- If taste preferences are similar, {fruit1_name} currently offers better value.\n"
    else:
        result += f"- If taste preferences are similar, {fruit2_name} currently offers better value.\n"
    
    if f1_change < 0 and f1_change < f2_change:
        result += f"- The price of {fruit1_name} is decreasing, which might be a good time to buy.\n"
    elif f2_change < 0 and f2_change < f1_change:
        result += f"- The price of {fruit2_name} is decreasing, which might be a good time to buy.\n"
    
    return result

# Tool to get price trend analysis for a specific fruit or vegetable
@mcp.tool()
def analyze_price_trend(fruit_name: str) -> str:
    """Gets a price trend analysis report for a specific fruit or vegetable
    
    Args:
        fruit_name: Fruit/vegetable name (Chinese or English, e.g., apple, 蘋果, banana, 香蕉)
    
    Returns:
        Price trend analysis report
    """
    fruit_key = get_fruit_key(fruit_name)
    if not fruit_key:
        supported_list = ", ".join([f"{f['zh_name']}({k})" for k, f in FRUITS.items()])
        return f"Could not find information for {fruit_name}. Supported fruits/vegetables are: {supported_list}"
    
    fruit = FRUITS[fruit_key]
    prices_data = fruit["prices"]
    prices = [item["price"] for item in prices_data]
    dates = [item["date"] for item in prices_data]
    
    # Calculate average price
    avg_price = sum(prices) / len(prices)
    
    # Calculate period-over-period change
    current_price = prices[-1]
    week_ago_price = prices[-8] if len(prices) >= 8 else prices[0]
    two_weeks_ago_price = prices[-15] if len(prices) >= 15 else prices[0]
    month_ago_price = prices[0]
    
    week_change = ((current_price / week_ago_price) - 1) * 100 if week_ago_price != 0 else 0
    two_weeks_change = ((current_price / two_weeks_ago_price) - 1) * 100 if two_weeks_ago_price != 0 else 0
    month_change = ((current_price / month_ago_price) - 1) * 100 if month_ago_price != 0 else 0
    
    # Calculate volatility (standard deviation)
    variance = sum((price - avg_price) ** 2 for price in prices) / len(prices)
    std_dev = variance ** 0.5
    volatility = (std_dev / avg_price) * 100 if avg_price != 0 else 0
    
    # Determine trend
    trend_description = _price_trend_description(prices_data)
    
    # Assemble report
    report = f"【{fruit['zh_name']} Price Analysis Report】\n\n"
    
    # Basic statistics table
    report += "Basic Price Statistics:\n"
    report += "+----------------+----------------+\n"
    report += "| Metric         | Value          |\n"
    report += "+----------------+----------------+\n"
    report += f"| Current Price  | {current_price:14.1f} |\n"
    report += f"| 30-Day Average | {avg_price:14.1f} |\n"
    report += f"| 30-Day High    | {max(prices):14.1f} |\n"
    report += f"| 30-Day Low     | {min(prices):14.1f} |\n"
    report += f"| Price Volatility| {volatility:14.1f}% |\n"
    report += "+----------------+----------------+\n\n"
    
    # Period-over-period change table
    report += "Price Changes Over Time:\n"
    report += "+----------------+----------------+\n"
    report += "| Time Period    | Change (%)     |\n"
    report += "+----------------+----------------+\n"
    report += f"| One Week       | {week_change:+14.1f}% |\n"
    report += f"| Two Weeks      | {two_weeks_change:+14.1f}% |\n"
    report += f"| One Month      | {month_change:+14.1f}% |\n"
    report += "+----------------+----------------+\n\n"
    
    # Add detailed price table
    report += "30-Day Price Data (Sampled):\n"
    report += create_table(dates, prices, f"{fruit['zh_name']} Price Table")
    
    # Price trend description
    report += f"\nPrice Trend Analysis:\n"
    report += f"- Overall Trend: {trend_description}\n"
    
    # Segmented trend analysis
    if len(prices) >= 21:
        early_prices = prices[:10]
        mid_prices = prices[10:20]
        late_prices = prices[20:]
        
        early_avg = sum(early_prices) / len(early_prices)
        mid_avg = sum(mid_prices) / len(mid_prices)
        late_avg = sum(late_prices) / len(late_prices)
        
        early_to_mid_change = ((mid_avg/early_avg)-1)*100 if early_avg != 0 else 0
        mid_to_late_change = ((late_avg/mid_avg)-1)*100 if mid_avg != 0 else 0
        
        report += "- Segmented Trend Analysis:\n"
        report += f"  * Early Period ({dates[0]} ~ {dates[9]}): Avg Price {early_avg:.1f} TWD\n"
        report += f"  * Mid Period ({dates[10]} ~ {dates[19]}): Avg Price {mid_avg:.1f} TWD, change from early: {early_to_mid_change:+.1f}%\n"
        report += f"  * Late Period ({dates[20]} ~ {dates[-1]}): Avg Price {late_avg:.1f} TWD, change from mid: {mid_to_late_change:+.1f}%\n"
    
    # Market prediction
    report += "\nMarket Forecast:\n"
    
    if week_change > 5:
        prediction = "- Short-term Trend: Price is in an upward channel and may continue to rise"
    elif week_change < -5:
        prediction = "- Short-term Trend: Price is in a downward channel and may continue to fall"
    else:
        prediction = "- Short-term Trend: Price is relatively stable and may fluctuate around the current level"
    
    report += prediction + "\n"
    
    # Volatility analysis
    if volatility > 10:
        report += "- Volatility Analysis: Price fluctuation is high, indicating market uncertainty\n"
    elif volatility > 5:
        report += "- Volatility Analysis: Price fluctuation is moderate, within normal market range\n"
    else:
        report += "- Volatility Analysis: Price fluctuation is low, indicating a stable market\n"
    
    # Purchase recommendation
    report += "- Purchase Recommendation: "
    if week_change < -3:
        report += "Price trend is downward, which may be a good time to buy\n"
    elif week_change > 3:
        report += "Price trend is upward, consider waiting for prices to drop before buying\n"
    else:
        report += "Price is relatively stable, purchase based on your needs\n"
    
    return report

# Helper function: Analyze price trend and return description
def _price_trend_description(prices):
    if len(prices) < 2:
        return "Insufficient data to analyze trend"
    
    # Calculate recent 7-day trend
    recent_prices = prices[-7:] if len(prices) >= 7 else prices
    price_changes = [recent_prices[i+1]["price"] - recent_prices[i]["price"] for i in range(len(recent_prices)-1)]
    
    # Determine trend
    up_changes = sum(1 for change in price_changes if change > 0)
    down_changes = sum(1 for change in price_changes if change < 0)
    flat_changes = len(price_changes) - up_changes - down_changes
    
    if up_changes > len(price_changes) * 0.65:
        return "Significant upward trend"
    elif down_changes > len(price_changes) * 0.65:
        return "Significant downward trend"
    elif up_changes > down_changes and up_changes > flat_changes:
        return "Slight upward trend"
    elif down_changes > up_changes and down_changes > flat_changes:
        return "Slight downward trend"
    else:
        return "Relatively stable"

if __name__ == "__main__":
    mcp.run()
```

### 2. Testing

Use `mcp dev` to test.
After execution, you will see an output line:
`🔍 MCP Inspector is up and running at http://localhost:5173 🚀`
This means success! You can now open this MCP Inspector.

```bash
mcp dev fruit_price_server.py
```

{% darrellImage800 cursor_mcp_server-dev-mcp_inspector_part_1 cursor_mcp_server-dev-mcp_inspector_part_1.png max-800 %}

Here's an example using Tools.
You can see the Tools listed here correspond to the `get_price_chart` function used in the code.
However, it seems the output doesn't actually provide a chart, but rather analysis.
This is an area for future optimization and adjustment.

Originally, it intended to use a library to draw charts.
But after testing, it was found that Claude Desktop doesn't directly display charts either.
It reads the chart data and then provides the analysis.
So, how to solve the chart drawing part is something to consider in the future.
For now, just ask Claude Desktop to draw the chart using its own methods.

{% darrellImage800 cursor_mcp_server-dev-mcp_inspector_part_2 cursor_mcp_server-dev-mcp_inspector_part_2.png max-800 %}

### 3. Installing on Claude Desktop

After confirming the functionality is normal, you can install it on Claude Desktop.

```bash
mcp install fruit_price_server.py
```

After the command runs, it might seem like nothing happened, but it should actually be successful.
At this point, restart Claude Desktop.
Click the tools icon and check if this MCP is present.

{% darrellImage800 cursor_mcp_server-check_mcp_running_on_claude_desktop cursor_mcp_server-check_mcp_running_on_claude_desktop.png max-800 %}

If it's there, let's start testing.

{% darrellImage800 cursor_mcp_server-claude_desktop_testing cursor_mcp_server-claude_desktop_testing.png max-800 %}

You can see the overall test is quite smooth; it actually activates the MCP before answering.
It's just a pity that the current data is simulated.
If it were connected to a real API or relevant data source in the future,

It could perhaps become a helpful assistant for grocery price inquiries.

### 4. Installing on Cursor

For Cursor, the steps are slightly different.

First, open Cursor Settings.

Click on MCP, then add a new MCP configuration.

{% darrellImage800 cursor_mcp_server-cursor_install cursor_mcp_server-cursor_install.png max-800 %}

The command is:
```
/full/path/to/mcp_env/bin/python /full/path/to/fruit_price_server.py
```

Since we are using a venv virtual environment, you need to specify the full paths to both the python executable within the virtual environment and the `fruit_price_server.py` file.
After successful configuration, you will see a green light.

To test, you can go back to the Cursor Agent and issue a command directly.
Cursor will similarly ask if you want to invoke the fruit price MCP.

{% darrellImage800 cursor_mcp_server-cursor_testing cursor_mcp_server-cursor_testing.png max-800 %}

Seeing the result means success!

## Future Directions

Based on this test scenario,
this fruit and vegetable price query service can be further expanded:

1. **Data Source** - Obtain price data from a real API
2. **Richer Analysis** - Add features like price prediction, trend analysis, etc.

## Conclusion

This was a fun Learning by Doing case.
I subsequently succeeded in creating an MCP that can connect to my own GA4 data and perform relevant analysis directly (popular pages, sources, etc.).
However, this is not a very correct approach, so I won't specifically introduce how to do it.

The reason is that if the GA4 data is personal, it's fine.
But if someone accidentally uses a company or commercial account for this type of analysis, there could be many sensitive data leak issues.
In the future, I will introduce better practices for this topic!

The MCP Server was just an experiment to see what it feels like to actually connect to an API.

## References

- [Claude Model Context Protocol (MCP) Official Documentation](https://docs.anthropic.com/en/docs/agents-and-tools/mcp)
- [Python FastMCP Documentation](https://modelcontextprotocol.io/)
- [MCP Example Servers](https://modelcontextprotocol.io/examples)
