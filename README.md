# Redux Air Game with Time-Travel Debugging

## Installation

```bash
npm install @reduxjs/toolkit react-redux
```

## File Structure

```
src/
├── redux-store.ts       # Store configuration
├── gameSlice.ts         # Game state (resources)
├── taskSlice.ts         # Task queue state
├── hooks.ts             # Typed Redux hooks
├── App.tsx              # Root with Provider
└── AirGameRedux.tsx     # Main game component
```

## Using Redux DevTools

1. Install the Redux DevTools browser extension:
   - Chrome: https://chrome.google.com/webstore (search "Redux DevTools")
   - Firefox: https://addons.mozilla.org (search "Redux DevTools")

2. Open your game in the browser

3. Press F12 to open DevTools, then click the "Redux" tab

4. Features you get:
   - **Action Log**: See every action dispatched (tick, addTask, addResource, etc.)
   - **State Tree**: Inspect current state at any point
   - **Time Travel**:
     - Slider to scrub through action history
     - Jump to any previous state
     - See how state changed with each action
   - **Action Replay**: Skip or jump to specific actions
   - **Export/Import**: Save and load entire state histories

## Time-Travel Debugging Tips

**Debugging a bug:**

1. Reproduce the bug
2. Open Redux DevTools
3. Use the slider to go back in time
4. Find exactly when the bug appeared
5. Inspect the action that caused it
6. Check state before/after

**Balancing resources:**

1. Play for a bit
2. Export state to JSON
3. Adjust numbers in your code
4. Import the state back
5. Test from that exact point

**Testing edge cases:**

- Dispatch actions manually from DevTools console
- Set resources to specific values
- Skip forward/backward to test different scenarios

## Key Benefits for Games

- **Reproducible bugs**: Share exact action sequences
- **Balance testing**: Jump to late-game states instantly
- **No save/load code needed during development**: DevTools handles it
- **Trace issues**: See exactly which action caused a problem
