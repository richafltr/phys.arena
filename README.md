# Physics Arena: AI-Powered 3D Physics Simulation Battleground

## Overview

Physics Arena is an innovative, browser-native application designed to compare the capabilities of cutting-edge AI models in generating 3D physics simulations. Inspired by the concept of "LM Arena," this project provides a dynamic battleground where users can pit different AI models against each other by prompting them to create complex physics scenarios. The simulations are rendered in real-time using Three.js and powered by the lightweight Oimo.js physics engine, allowing for immediate visual comparison and user voting.

This application is perfect for researchers, developers, and enthusiasts interested in the intersection of AI, 3D graphics, and physics. It aims to showcase the intelligence and creativity of large language models in a tangible, interactive way.

## Features

*   **Side-by-Side AI Model Comparison**: Simultaneously generate and display physics simulations from two different AI models (e.g., OpenAI GPT-4o and Google Gemini 2.0 Flash).
*   **Real-time Physics Simulation**: Interactive 3D environments powered by Three.js for rendering and Oimo.js for physics calculations.
*   **AI-Powered Code Generation**: AI models generate the Three.js and Oimo.js code based on user prompts, which is then executed directly in the browser.
*   **User Voting System**: Users can vote on which simulation is "better" (more accurate, creative, or visually appealing), contributing to a community-driven evaluation of AI performance.
*   **Streaming Responses**: AI responses are streamed in real-time, providing a dynamic user experience during simulation generation.
*   **Intuitive User Interface**: Clean, modern design with glass-morphism elements for controls, ensuring a seamless and engaging experience.
*   **Browser-Native**: Runs entirely in the web browser, requiring no server-side setup beyond initial development server.

## Technology Stack

*   **Frontend**: React, TypeScript, Vite
*   **3D Graphics**: Three.js
*   **Physics Engine**: Oimo.js
*   **AI Integration**: AI SDK (`@ai-sdk/openai`, `@ai-sdk/google`)
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React

## Getting Started

Follow these instructions to set up and run the Physics Arena application on your local machine.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm (Node Package Manager)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd physics-arena
    ```
    (Replace `<repository-url>` with the actual URL of your repository.)

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Copy Oimo.js to public directory**:
    The Oimo.js library needs to be accessible in the `public` directory for the application to load it correctly.
    ```bash
    cp node_modules/oimo/build/oimo.min.js public/
    ```

### Environment Variables

The application requires API keys for the AI models. Create a `.env.local` file in the root of your project and add your API keys:

