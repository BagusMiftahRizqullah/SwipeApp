# SwipeApp

SwipeApp is a React Native application built with Expo, demonstrating swipe gestures and smooth animations for an intuitive and interactive user experience.

---

## Table of Contents

- [Overview](#overview)
- [Thought Process and Design Choices](#thought-process-and-design-choices)
- [Implementation Steps](#implementation-steps)
- [Optimization Techniques](#optimization-techniques)
- [Issues Encountered and Resolutions](#issues-encountered-and-resolutions)
- [Getting Started](#getting-started)
- [Future Enhancements](#future-enhancements)
- [Contributions](#contributions)

---

## Overview

SwipeApp uses Expo for simplified development and deployment. The app features smooth swipe gestures and animations, emphasizing performance and cross-platform compatibility.

---

## Thought Process and Design Choices

1. **Ease of Development with Expo**:
   - Chose Expo for its fast setup, over-the-air updates, and robust library ecosystem.
   - Ensured compatibility across iOS and Android devices.

2. **User Experience as a Priority**:
   - Designed swipe interactions to feel natural and intuitive.
   - Focused on minimal UI clutter and smooth animations.

3. **Scalable and Maintainable Code**:
   - Used modular components for future enhancements and code reusability.
   - Leveraged Expo libraries such as `react-native-gesture-handler` and `react-native-reanimated` for efficient gesture handling and animations.

---

## Implementation Steps

### 1. Project Initialization
   - Created the project using Expo CLI:
     ```bash
     expo init SwipeApp
     ```
   - Selected the **"Managed Workflow"** for streamlined development.

### 2. Dependency Setup
   - Installed gesture and animation libraries:
     ```bash
     expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context react-native-vector-icons
     ```

### 3. Swipe Gesture Implementation
   - Used `PanGestureHandler` from `react-native-gesture-handler` for detecting swipe gestures.
   - Implemented handlers for left and right swipes with callbacks to trigger specific actions.

### 4. Animation Integration
   - Leveraged `react-native-reanimated` for creating physics-based animations.
   - Used shared values, interpolations, and custom easing functions for smooth transitions.

### 5. Responsive Design
   - Designed a responsive layout using `Flexbox` and `SafeAreaView` to ensure compatibility across screen sizes and devices.

### 6. Testing and Debugging
   - Tested on both iOS and Android devices using the Expo Go app.
   - Debugged layout issues and ensured animations performed consistently across platforms.

---

## Optimization Techniques

1. **Native-Driven Animations**:
   - Used `react-native-reanimated`’s native execution to offload animations to the UI thread, ensuring smooth performance.

2. **Efficient Gesture Handling**:
   - Debounced gesture recognition to avoid redundant computations.
   - Limited gesture callbacks to only execute when necessary.

3. **Expo’s Performance Tools**:
   - Utilized Expo’s debugging tools to monitor app performance and identify bottlenecks.

4. **Memory Management**:
   - Cleaned up gesture handlers and animations to prevent memory leaks.

---

## Issues Encountered and Resolutions

1. **Gesture Conflicts**:
   - **Issue**: Swipe gestures clashed with vertical scrolling components.
   - **Resolution**: Configured `PanGestureHandler` with appropriate gesture priorities and simultaneous handling options.

2. **Animation Jank on Android**:
   - **Issue**: Animations were less smooth on certain Android devices.
   - **Resolution**: Tweaked animation duration and used hardware-accelerated animations via `react-native-reanimated`.

3. **Expo Go Limitations**:
   - **Issue**: Some features (e.g., native modules) had limitations in the Expo Go app.
   - **Resolution**: Planned to use `EAS Build` for adding custom native functionality if needed.

---

## Getting Started

### Prerequisites
- Node.js installed (v14 or later recommended).
- Expo CLI installed:
  ```bash
  npm install -g expo-cli
