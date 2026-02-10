import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { tick, addResource } from "./gameSlice";
import { addTask, updateTaskProgress, completeTask } from "./taskSlice";
import { Button } from "@/components/ui/button";
import { Progress } from "./components/ui/progress";
import { Item, ItemTitle } from "./components/ui/item";

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

      <Button variant="outline" onClick={handleAddAirTask}>
        Add Air Task
      </Button>

      <div>
        <h3>Task Queue ({taskQueue.length})</h3>
        {taskQueue.length === 0 ? (
          <p style={{ color: "#666" }}>No tasks. Game loop paused.</p>
        ) : (
          <div>
            {taskQueue.map((task, index) => (
              <Item
                key={task.id}
                variant="outline"
              >
                <ItemTitle >
                  Task #{task.id} {index === 0 ? "(Processing)" : "(Queued)"}
                  {" - "} Reward: +{task.reward.amount} {task.reward.resource}
                </ItemTitle >
                {index === 0 && (<Progress id={`task-${task.id}-progress`} value={Math.min(task.progress * 100, 100)} />)}
              </Item>
            ))}
          </div>
        )}
      </div>

      <Item variant="outline">
        <ItemTitle>Game Status:</ItemTitle>
        {taskQueue.length > 0 ? "▶️ Running" : "⏸️ Paused"}
      </Item>
    </div>
  );
};

export default AirGameRedux;
