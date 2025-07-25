# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a static n8n template sharing platform that showcases and distributes pre-built n8n workflow automation templates. The system operates as a single-page web application with the following core architecture:

### Data Layer
- `/data/workflows/` - Contains 17+ production-ready n8n workflow JSON files
- `/data/workflow-models.json` - Central metadata store containing Chinese descriptions, setup instructions, and categorized tags for each template
- `/data/bg/` - WebP preview images for each workflow template

### Presentation Layer
- `models.html` - Main template gallery with filterable grid view
- `model-detail.html` - Individual template detail pages with download capability
- `visualize.html` - Interactive n8n workflow visualization using n8n's demo component
- `/snapshots/` - Static HTML previews of each workflow for SEO and fast loading

### JavaScript Components
- `workflow-visualizer.js` - Core class for loading and rendering n8n workflows using @n8n_io/n8n-demo-component
- `schema-generator.js` - Generates JSON-LD structured data for SEO
- `header.js` - Navigation and responsive header functionality

## Key Technical Patterns

### Template Structure
Each template in `/data/workflow-models.json` follows this structure:
```json
{
  "id": "template-name",
  "title": "Chinese Display Name",
  "description": "Detailed Chinese description",
  "detailedDescription": ["Step-by-step functionality list"],
  "tags": ["categorization", "keywords"],
  "nodes": 4,
  "setup": {
    "prerequisites": "Required API access or credentials",
    "steps": ["Setup instructions"]
  }
}
```

### n8n Workflow Integration
- Uses n8n's official demo component for workflow visualization
- Workflows are standard n8n JSON exports with proper node connections
- All connection structures use node names (never node IDs) for proper linking

## n8n-Specific Agent Integration

### Claude Agent System
This project includes a specialized `n8n-workflow-builder` agent with three core modes:

1. **CREATE Mode** - Build new workflows from scratch
2. **OPTIMIZE Mode** - Analyze and improve existing workflows  
3. **INSPIRE Mode** - Generate creative automation ideas

### MCP Tools Integration
The agent has access to n8n MCP tools for direct workflow management:
- `mcp__n8n-mcp__create_n8n_workflow` - Upload workflows to n8n instance
- `mcp__n8n-mcp__get_n8n_workflow_by_id` - Retrieve existing workflows
- `mcp__n8n-mcp__search_n8n_workflows_by_keyword` - Search workflow library

### Critical n8n Connection Rules
When working with n8n workflows, strictly follow these connection patterns:

**CORRECT Format:**
```json
"connections": {
  "Node Display Name": {
    "main": [
      [
        {
          "node": "Target Node Display Name",
          "type": "main",
          "index": 0
        }
      ]
    ]
  }
}
```

**Key Rules:**
- Connection keys MUST use node names from the `name` field in nodes array
- Connection target values MUST reference node names (not IDs)  
- Maintain double array structure `[[{...}]]`
- Ensure exact name matching including Chinese characters and spaces

## Template Categories

The platform organizes templates into these categories:

### AI Enhancement
- Smart model selection and routing
- Image generation with cloud storage
- Receipt recognition and expense splitting

### Communication Integration  
- LINE Bot message processing
- Instagram auto-posting
- Social media data analysis

### Financial Management
- Credit card statement automation
- E-invoice parsing and analysis
- Delivery expense tracking

### Life Automation
- Health reminder systems
- Workflow execution controls
- Smart scheduling and notifications

## Working with Templates

### Adding New Templates
1. Study existing templates in `/data/workflows/` for structure patterns
2. Create workflow JSON with proper node connections using names
3. Add metadata entry to `/data/workflow-models.json`
4. Generate preview image and place in `/data/bg/`
5. Create static snapshot in `/snapshots/`

### Template Validation
- Ensure all nodes have proper `typeVersion` and required parameters
- Verify connection structure uses node names consistently
- Test workflow visualization in the web interface
- Validate metadata completeness in workflow-models.json

## Development Notes

### Static Site Architecture
This is a client-side only application with no backend dependencies. All data is loaded via JavaScript fetch from JSON files.

### n8n Demo Component Integration
The visualization system relies on n8n's official web component. The component is loaded via CDN and requires proper workflow JSON structure to render correctly.

### Chinese Language Support
All user-facing content is in Traditional Chinese. Template descriptions, setup instructions, and UI elements should maintain this language consistency.