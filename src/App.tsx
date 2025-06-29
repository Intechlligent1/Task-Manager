import { useEffect, useState } from "react"
import { supabase } from "./supabase-client";

interface Task{
  id: number;
  title: string;
  description: string;
  created_at: string;
}

const App = () => {
  const [newTask, setNewTask] = useState({ title:"", description:"" });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newDescription, setNewDescription] = useState("")

  const handleDelete= async(id: number)=>{
    const {error}=await supabase.from("users").delete().eq("id",id)

    if (error){
      console.error("Error adding Tasks", error.message);
      return;
    }
  }

  const handleUpdate= async(id: number)=>{
    const {error}=await supabase.from("users").delete().eq("id",id)

    if (error){
      console.error("Error adding Tasks", error.message);
      return;
    }
  }

  const handleSubmit= async(e :any)=>{
    e.preventDefault()
    const {error}=await supabase.from("users").insert(newTask).single();

    if (error){
      console.error("Error adding Tasks", error.message)
    }
    setNewTask({ title:"", description:"" });
  }

  const fetchTasks = async()=>{
    const {error, data} = await supabase.from("users").select("*").order("created_at",{ascending:true})

    if(error){
      console.error("Error fetching tasks",error.message);
      return;
    }
    setTasks(data);
  };

  useEffect(()=>{
    fetchTasks();
  },[]);
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">📝 Task Manager</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task Title"
            onChange={(e)=>setNewTask((prev) => ({...prev, title: e.target.value}))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Task Description"
            onChange={(e)=>setNewTask((prev) => ({...prev, description: e.target.value}))}
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
          {
            tasks.map((task,key)=>(
              <li key={key} className="flex items-start justify-between bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-800">{task.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{task.description}</p>
            </div>
            <div>
              <textarea placeholder="Update description..." onChange={(e)=> setNewDescription(e.target.value) } onClick={handleUpdate()}/>
            </div>
            <div className="flex space-x-2">
              <button className="text-sm text-white bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600">
                ✏️ Edit
              </button>
              <button onClick={()=>{handleDelete(task.id)}} className="text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600">
                🗑️ Delete
              </button>
            </div>
          </li>
            ))
          }
          
        </ul>
      </div>
    </div>
  )
}

export default App
