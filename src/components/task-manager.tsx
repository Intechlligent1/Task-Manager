import { useEffect, useState } from "react"
import { supabase } from "../supabase-client";

interface Task {
  id: number;
  title: string;
  description: string;
  created_at: string;
}


const TaskManager = () => {
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [descriptionEdits, setDescriptionEdits] = useState<{ [key: number]: string }>({});

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) {
      console.error("Error deleting task", error.message);
      return;
    }
    fetchTasks(); // Refresh tasks after delete
  };

  const handleUpdate = async (id: number) => {
    const newDesc = descriptionEdits[id];
    if (!newDesc) return;

    const { error } = await supabase.from("users").update({ description: newDesc }).eq("id", id);
    if (error) {
      console.error("Error updating task", error.message);
      return;
    }
    setEditingId(null);
    fetchTasks(); // Refresh tasks after update
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { error } = await supabase.from("users").insert(newTask).single();
    if (error) {
      console.error("Error adding task", error.message);
    }
    setNewTask({ title: "", description: "" });
    fetchTasks(); // Refresh tasks after adding
  };

  const fetchTasks = async () => {
    const { error, data } = await supabase.from("users").select("*").order("created_at", { ascending: true });
    if (error) {
      console.error("Error fetching tasks", error.message);
      return;
    }
    setTasks(data || []);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">📝 Task Manager</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            value={newTask.title}
            placeholder="Task Title"
            onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={newTask.description}
            placeholder="Task Description"
            onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            ➕ Add Task
          </button>
        </form>

        {/* Task List */}
        <ul className="mt-6 space-y-4">
          {tasks.map((task) => (
            <li key={task.id} className="flex flex-col gap-2 bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200">
              <div>
                <h3 className="font-semibold text-gray-800">{task.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{task.description}</p>
              </div>

              {editingId === task.id && (
                <div>
                  <textarea
                    className="w-full px-3 py-2 border border-blue-400 rounded-md"
                    placeholder="Update description..."
                    value={descriptionEdits[task.id] || ""}
                    onChange={(e) =>
                      setDescriptionEdits((prev) => ({
                        ...prev,
                        [task.id]: e.target.value,
                      }))
                    }
                  />
                  <button
                    onClick={() => handleUpdate(task.id)}
                    className="mt-2 text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    ✅ Save
                  </button>
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingId(task.id);
                    setDescriptionEdits((prev) => ({
                      ...prev,
                      [task.id]: task.description,
                    }));
                  }}
                  className="text-sm text-white bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                >
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TaskManager