# VisaEvidence UK - Partner Visa Checklist

VisaEvidence UK is a mobile application prototype built with React Native and Expo. It helps applicants preparing for a UK Partner Visa to assess their mandatory prerequisites and gauge the "strength of evidence" for their relationship based on official Home Office guidance.

**[🚀 Live Demo](https://CedricTan.github.io/VisaChecklistWorkspace/)**

## Features

- **Step 1: Mandatory Prerequisites**
  - **Dynamic Cost Assessment**: Live calculation of Application Fees and Immigration Health Surcharge (IHS) for "Inside UK" vs "Outside UK" applications.
  - **Data-Driven Checks**: Input fields for age, income, and savings that auto-validate mandatory requirements.
  - **Auto-filling Checklist**: Key requirements like financial threshold and age are automatically checked if user inputs meet the legal criteria.

- **Step 2: Relationship Evidence Strength**
  - **Tiered Evidence System**: Evidence is categorized into Tier 1 (Strong), Tier 2 (Acceptable), and Tier 3 (Supporting).
  - **Real-time Scoring**: A visual gauge displays the "Application Strength" based on official weighting.
  - **Guidance-led**: Descriptions for each tier help users understand what the Home Office values most.

## Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Icons**: [@expo/vector-icons (MaterialCommunityIcons)](https://icons.expo.fyi/)
- **State Management**: React Hooks (useState, useMemo, useEffect)

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- [Expo Go](https://expo.dev/expo-go) app installed on your iOS or Android device (for mobile preview).

### Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd VisaChecklistWorkspace
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

1. Start the Expo development server:
   ```bash
   npx expo start
   ```

2. **To view on your phone**: Scan the QR code displayed in the terminal using the Expo Go app.

3. **To view in the browser**: Press `w` in the terminal to open the web version.

### Remote Access (Tunneling)

If you are on a different network than your development machine, or if the standard connection fails, you can use Expo's tunneling feature:

1. Install the global tunneling dependency (if not already installed):
   ```bash
   npm install -g @expo/ngrok
   ```

2. Start the project with the tunnel flag:
   ```bash
   npx expo start --tunnel
   ```

3. Scan the QR code with the Expo Go app. Access will be routed via ngrok, allowing it to work across different networks.

## Project Structure

- `App.js`: Main application logic and screen rendering.
- `src/components/`: Reusable UI components (ChecklistItem, MandatoryCard, ScoreIndicator).
- `src/constants/`: Data structures for evidence items and mandatory requirements.

---
*Disclaimer: This app is a prototype and for informational purposes only. Always consult the official GOV.UK website for the latest immigration rules and fees.*
