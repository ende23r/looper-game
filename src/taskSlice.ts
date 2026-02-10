import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Task {
  id: number;
  progress: number;
  duration: number;
  reward: {
    resource: string;
    amount: number;
  };
  cost?: {
    resource: string;
    amount: number;
  };
}

interface TaskState {
  queue: Task[];
  nextId: number;
}

const initialState: TaskState = {
  queue: [],
  nextId: 0,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, "id" | "progress">>) => {
      const newTask: Task = {
        ...action.payload,
        id: state.nextId,
        progress: 0,
      };
      state.queue.push(newTask);
      state.nextId += 1;
    },

    updateTaskProgress: (
      state,
      action: PayloadAction<{ taskId: number; deltaTime: number }>,
    ) => {
      const { taskId, deltaTime } = action.payload;
      const task = state.queue.find((t) => t.id === taskId);
      if (task) {
        task.progress += deltaTime / task.duration;
      }
    },

    completeTask: (state, action: PayloadAction<number>) => {
      const taskId = action.payload;
      state.queue = state.queue.filter((t) => t.id !== taskId);
    },

    clearQueue: (state) => {
      state.queue = [];
    },
  },
});

export const { addTask, updateTaskProgress, completeTask, clearQueue } =
  taskSlice.actions;
export default taskSlice.reducer;
