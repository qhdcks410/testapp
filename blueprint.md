# **Project Blueprint: Modern Lotto Application**

## **1. Overview**
A modern, interactive, and responsive Lotto (lottery) number generator. This application allows users to generate 6 unique random numbers (1–45) with a polished visual presentation, including color-coded balls, smooth animations, and a history of previous draws.

## **2. Detailed Project Outline**

### **App Architecture & Structure**
-   **Framework-less:** Built using standard web technologies (HTML, CSS, JavaScript) without external frameworks.
-   **Web Components:** The core application logic and UI are encapsulated within a `lotto-app` custom element.
-   **ES Modules:** JavaScript is organized using modern ES module syntax for better maintainability.

### **Style & Design**
-   **Visual Aesthetic:** Modern, clean UI with a subtle noise texture on the background for a premium feel.
-   **Lotto Ball Colors:** Numbers are color-coded based on their value (classic lottery ranges: 1–10: Yellow, 11–20: Blue, 21–30: Red, 31–40: Grey, 41–45: Green).
-   **Glassmorphism:** The main generator interface uses a glass-morphic design with deep shadows for depth.
-   **Responsiveness:** Mobile-first approach using CSS Container Queries and Flexbox/Grid.
-   **Animations:** Smooth reveal animations when numbers are generated.

### **Features Implemented**
-   **Number Generation:** Logic to pick 6 unique numbers from a pool of 1–45.
-   **Sorting:** Numbers are automatically sorted in ascending order for readability.
-   **History Tracking:** Previous draws are saved to `localStorage` and displayed in a history section.
-   **Interactive Controls:** A "Generate" button with a modern hover/glow effect.

## **3. Implementation Plan (Current Step)**

### **Step 1: Core Structure & Web Component**
-   Update `index.html` to host the `<lotto-app>` component.
-   In `main.js`, define the `LottoApp` class extending `HTMLElement`.
-   Implement the `render()` method to build the component's internal Shadow DOM structure.

### **Step 2: Logic & Interactivity**
-   Implement the `generateNumbers()` function to pick 6 unique, sorted numbers.
-   Integrate `localStorage` to persist and load history.
-   Add event listeners to the "Generate" button and "Clear History" button.

### **Step 3: Modern CSS Styling**
-   Apply modern CSS features like Cascade Layers (`@layer`), Container Queries, and the `:has()` selector.
-   Use `oklch` color functions for vibrant and consistent colors.
-   Create the responsive layout for the Lotto balls and history list.

### **Step 4: Firebase Deployment**
-   Ensure `.idx/mcp.json` is correctly configured (already verified).
-   Initialize Firebase Hosting (if needed) and deploy the application.
-   Verify the live preview URL.
