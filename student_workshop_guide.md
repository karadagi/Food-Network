# Workshop: Vibe Coding a 3D City with Antigravity
**Target Audience**: Architecture & Planning Students
**Goal**: Design a "Social Infrastructure" dashboard. Map the mismatch between **Abundance** (Restaurants with surplus) and **Need** (Student centers, shelters). visualizing the logistics of food rescue.

---

## 🌊 Phase 1: The Setup (Vibe Check)

We aren't writing code from scratch. We are directing an AI developer.

1.  **Antigravity Access**: Ensure you have your Antigravity AI assistant ready.
2.  **Mapbox Token**: Sign up at [mapbox.com](https://www.mapbox.com/) and grab your public **Access Token**.
3.  **Mission**: How do you visualize "Waste" turning into "Resource"?
4.  **Setup Check**: Read [Essential: Safe Mapbox Setup](./student_mapbox_setup.md) to initialize your project correctly. This prevents the "White Screen of Death".

---

## 🤖 Phase 2: The Prompt (Genesis)

Start a new session with Antigravity and copy-paste this prompt to kickstart the project:

> "I need a logistics dashboard for a 'Zero Waste' food network. It connects restaurants (Surplus) with students in need (Demand). The centerpiece is a 3D map of Atlanta. I want it to look [INSERT VIBE: e.g. 'Bioluminescent', 'Neon Logistics', or 'Clean Tech']. Visualize the flow of resources through the city."

**What happens next?**
*   Antigravity will create the files.
*   It might ask for your Mapbox Token. Paste it when asked.
*   It will install the libraries (`react-map-gl`, etc.).

---

## 🎨 Phase 3: The Aesthetic (Styling)

Now, we iterate. Don't touch the code—refine the prompt.

**To get 3D Buildings:**
> "The map looks flat. Add a 3D building layer. Make the buildings extrude based on their height. Color them [e.g., 'light grey'] and give them a slight transparency so we can see the street grid."

**To change the atmosphere:**
> "The lighting is too harsh. Can we change the map style to a dark mode? And add a floating panel on the left for project statistics with a glassmorphism effect."

**To add architectural context:**
> "I want to visualize a specific site at [Coordinates]. Can you fly the camera there and rotate it 45 degrees?"

---

## 🚀 Phase 4: Exhibition (Ship It)

When the vibes are immaculate, ask Antigravity to put it online.

> "I want to publish this to GitHub Pages. Please initialize the git repo, set up the deployment action, and tell me what command to run to push it."

Antigravity will handle the specialized configuration files (`vite.config.js`, `.github/workflows`) so you don't have to.

---

## � Cost & The "Free" Tier

Mapbox uses a **Pay-As-You-Go** model with a generous free tier.
*   **Web Map Loads**: You get **50,000 free loads per month**.
*   **Students**: This is more than enough for class projects, portfolios, and workshops.
*   **Credit Card**: Mapbox usually requires a credit card to verify identity. However, **creating an Organization account** during signup may sometimes bypass this requirement initially.
*   **Safety**: Mapbox does **not** have a hard spending cap button. However, 50,000 loads is a massive amount for a portfolio project.
*   **Advice**: Bookmark your **[Usage Page](https://account.mapbox.com/statistics)**. Check it once a week. If you finish the class, you can delete your Access Token to ensure no future usage is possible.

---

## �💡 Pro-Tips for Vibe Coding

*   **Be Specific about Feelings**: "Make it feel expensive" or "Make it look like a sci-fi HUD" are valid prompts. Antigravity translates "vibes" into CSS.
*   **Iterate Fast**: If something looks wrong, just say "That broke the map, undo it" or "The text is too small, make it readable."
*   **Ask for Explanations**: "How exactly is that 3D layer working?" helps you learn the logic without getting bogged down in syntax.
