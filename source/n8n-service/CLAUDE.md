# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a professional n8n automation solutions service website built as a static site with advanced CSS animations and interactive JavaScript components. The site serves as a landing page for Darrell's n8n consulting services, featuring enterprise training, one-on-one tutoring, and automation implementation services.

## Architecture & Key Design Decisions

### Color Scheme (darrelltw.com Style)
- **Primary Background**: `#1a1a1a` (deep black-gray)
- **Secondary Background**: `#222` 
- **Card Background**: `#2a2a2a`
- **Accent Color**: `#ff9500` (orange - this is the main brand color, NOT purple)
- **Text**: `#ccc` (primary), `#bbb` (secondary), `#999` (muted)

### CSS Architecture
- **CSS Variables**: All colors and theme values are centralized in `:root` for easy theming
- **Two-file CSS Structure**:
  - `main.css`: Core styles, layout, components
  - `animations.css`: Complex animations and keyframes
- **Mobile-first responsive design** with breakpoints at 768px and 480px

### JavaScript Architecture
- **Class-based modular design**: Each major feature is a separate class
- **Key Classes**:
  - `FormManager`: Handles 3-step contact form with validation
  - `SmoothScroll`: Page navigation
  - `ScrollReveal`: Intersection Observer-based animations
  - `AnimationController`: Advanced animation management

### Component Structure

#### Hero Section
- Left: Text content with orange title and CTA buttons
- Right: **Enhanced 3D workflow visualization** with:
  - SVG icons in circular containers
  - 3D card effects with hover animations
  - Animated data flow particles between steps
  - Subtle grid background pattern

#### Multi-step Contact Form
- **3 steps**: Basic Info → Service Type → Project Details
- **Real-time validation** with visual feedback
- **Progress indicators** with animated fill
- Form data collected in `FormManager.formData` object

## Development Commands

### Local Development
```bash
# Open directly in browser
open index.html

# Or use a local server (recommended)
python -m http.server 8000
# Then visit http://localhost:8000
```

### Testing
- Open in multiple browsers for compatibility testing
- Test responsive design at breakpoints: 768px, 480px
- Verify form validation and multi-step functionality

## Key Implementation Details

### Animation System
- **CSS Custom Properties** for consistent timing and easing
- **Intersection Observer** for scroll-triggered animations  
- **RequestAnimationFrame** for smooth performance
- **Reduced motion support** via `prefers-reduced-motion`
- **Fixed Workflow Layout**: Recent fixes ensure perfect alignment using `flex-shrink: 0` and precise spacing
- **Connection Line Precision**: Uses negative margins and exact widths to eliminate gaps between cards and lines

### Form Integration
- Form submission handled in `FormManager.sendFormData()`
- Currently logs to console - integrate with your backend API
- Success/error states with animated feedback
- Data validation includes email regex, required fields, service selection

### Workflow Animation (Recently Enhanced)
The hero section features a sophisticated 3D workflow visualization that was recently redesigned for better alignment and visual consistency:
- **Fixed Layout**: Cards are precisely aligned with `width: 160px`, `gap: 0`, and `max-width: 600px` container
- **Improved Connections**: Orange connection lines (`width: 80px`, `height: 3px`) with `margin: 0 -1px` for seamless alignment
- **3D Card Effects**: Each step has hover animations with `translateY(-8px) rotateX(-2deg)` transforms
- **Sequential Reveal**: Staggered animation delays (0.2s, 0.4s, 0.6s) using `stepReveal` keyframe
- **Data Flow Particles**: Animated orange particles with `particleFlow` animation on connection lines
- **Grid Background**: Subtle floating grid pattern with `gridFloat` animation
- **Mobile Responsive**: Automatic vertical layout with rotated connection lines on mobile

### Browser Compatibility
- Modern browsers (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- Uses modern CSS features: CSS Grid, Custom Properties, Intersection Observer
- Graceful degradation for older browsers

## Customization Points

### Color Theming
Modify CSS variables in `main.css` `:root` selector. The orange accent color (`#ff9500`) is core to the brand identity.

### Animation Timing
Adjust animation durations and delays in `main.css` (workflow animations are in main.css, not animations.css). Key animations:
- **Step reveal**: `stepReveal` keyframe with staggered delays (0.2s, 0.4s, 0.6s)
- **Data flow**: `particleFlow` (2s duration) and `connectionPulse` (3s duration) 
- **Grid movement**: `gridFloat` (20s infinite) for subtle background animation
- **Hover effects**: 3D transforms using `cubic-bezier(0.4, 0, 0.2, 1)` easing
- **Connection reveal**: `connectionReveal` at 0.8s delay for sequential appearance

### Form Backend Integration
Update `FormManager.sendFormData()` method to connect with your backend API or service (e.g., Netlify Forms, EmailJS, custom endpoint).

### Content Updates
Main content sections are clearly structured in `index.html`:
- **Services**: Update pricing (currently "NT$ 3,000 起/小時" for tutoring), services simplified to title + description + price format
- **Case studies**: Four example projects with horizontal flow visualizations (vertical on mobile)
- **Contact features**: Three key selling points as simple bullet list
- **Workflow**: Three-step process (觸發器→處理器→輸出) with SVG icons and descriptions

This is a showcase/portfolio piece emphasizing visual appeal and user experience over content management complexity.