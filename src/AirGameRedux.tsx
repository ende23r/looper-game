import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { tick, addResource } from "./gameSlice";
import { addTask, updateTaskProgress, completeTask } from "./taskSlice";

const AirGameRedux: React.FC = () => {
  const dispatch = useAppDispatch();

  // Select only what we need from the store
  const air = useAppSelector((state) => state.game.resources.air);
  const taskQueue = useAppSelector((state) => state.tasks.queue);

  const lastTickRef = useRef<number>(Date.now());
  const animationFrameRef = useRef<number | null>(null);

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = now - lastTickRef.current;
      lastTickRef.current = now;

      // Dispatch tick action for air decrease
      dispatch(tick(deltaTime));

      // Process tasks
      if (taskQueue.length > 0) {
        const currentTask = taskQueue[0];

        // Update progress
        dispatch(
          updateTaskProgress({
            taskId: currentTask.id,
            deltaTime,
          }),
        );

        // Check if complete
        if (currentTask.progress + deltaTime / currentTask.duration >= 1) {
          // Grant reward
          dispatch(
            addResource({
              resource: currentTask.reward.resource as
                | "air"
                | "metal"
                | "energy",
              amount: currentTask.reward.amount,
            }),
          );

          // Remove from queue
          dispatch(completeTask(currentTask.id));
        }
      }

      // Continue loop only if there are tasks
      if (taskQueue.length > 0) {
        animationFrameRef.current = requestAnimationFrame(gameLoop);
      }
    };

    // Start loop only if we have tasks
    if (taskQueue.length > 0) {
      lastTickRef.current = Date.now();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [taskQueue.length, dispatch, taskQueue]);

  const handleAddAirTask = () => {
    dispatch(
      addTask({
        duration: 3000,
        reward: {
          resource: "air",
          amount: 20,
        },
      }),
    );
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h2>Air Management Game (Redux)</h2>

      <div
        style={{
          fontSize: "24px",
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: air < 20 ? "#ffcccc" : "#ccffcc",
          borderRadius: "8px",
        }}
      >
        Air: {air.toFixed(1)}
      </div>

      <button
        onClick={handleAddAirTask}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          marginBottom: "20px",
        }}
      >
        Add Air Task
      </button>

      <div>
        <h3>Task Queue ({taskQueue.length})</h3>
        {taskQueue.length === 0 ? (
          <p style={{ color: "#666" }}>No tasks. Game loop paused.</p>
        ) : (
          <div>
            {taskQueue.map((task, index) => (
              <div
                key={task.id}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  backgroundColor: index === 0 ? "#e3f2fd" : "#f5f5f5",
                  borderRadius: "4px",
                  border: index === 0 ? "2px solid #2196F3" : "1px solid #ddd",
                }}
              >
                <div style={{ marginBottom: "5px" }}>
                  Task #{task.id} {index === 0 ? "(Processing)" : "(Queued)"}
                  {" - "} Reward: +{task.reward.amount} {task.reward.resource}
                </div>
                {index === 0 && (
                  <div
                    style={{
                      width: "100%",
                      backgroundColor: "#ddd",
                      borderRadius: "4px",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(task.progress * 100, 100)}%`,
                        height: "20px",
                        backgroundColor: "#4CAF50",
                        borderRadius: "4px",
                        transition: "width 0.1s",
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#f0f0f0",
          borderRadius: "4px",
          fontSize: "14px",
        }}
      >
        <strong>Game Status:</strong>{" "}
        {taskQueue.length > 0 ? "▶️ Running" : "⏸️ Paused"}
        <br />
        <em>
          Open Redux DevTools (F12 → Redux tab) for time-travel debugging!
        </em>
      </div>
    </div>
  );
};

export default AirGameRedux;
