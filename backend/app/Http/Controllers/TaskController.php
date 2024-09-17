<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use Illuminate\Http\JsonResponse;

class TaskController extends Controller
{
    public function list(): JsonResponse {
        // on cherche la liste des tasks
        $tasks = Task::all()->load(['category', 'tags']);

        // on retourne la liste des tasks (on est pas obligé de mettre response)
        // par défaut, Laravel retourne les données en JSON
        return response()->json($tasks, 200);
    }

    public function show($id)
    {
        // Rechercher les données d'une tâche
        // SELECT * FROM tasks WHERE id = $id
        try {
            $task = Task::findOrFail($id);
            var_dump($task->category->name);
            $task->tag()->attach('tag_id'); //!PAS SURE DE MON COUP LA
        } catch (\Exception $e) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        return response()->json($task, 200);
    }

    public function store(Request $request)
    { //l'objet Request va être injecté automatiquement par Laravel dans le paramètre
        try {
            $request->validate([
                "title" => 'required|min:10|max:255',
                /*"status"      => ["integer", "between:0,1"],
                "category_id" => ["nullable", "integer", "exists:categories,id"],*/
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Validation error'], 404);
        }
        $task = new Task();
        $task->title       = $request->input("title");
        $task->status      = $request->input("status") ?? 0;
        $task->category_id = $request->input("category_id");

        /*$task->tag() = collect($request->input("tags"));
        var_dump($tags);
        /*$task->tag()->updateExistingPivot($request->get('tag_id'));*/ //!FONCTIONNE PAS*/
        $task->save();
        return response()->json($task, 201);
    }

    public function update(Request $request, $id)
    {
        try {
            $task = Task::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Task not found'], 404);
        }
        try {
            $request->validate([
                'title' => 'required|min:10|max:255',
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid data'], 404);
        }
        $task->title = $request->get('title');
        $task->category_id = $request->get('category_id');

        $task->save();

        return response()->json($task, 200);
    }

    public function delete($id)
    {
        try {
            $task = Task::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Task not found'], 404);
        }
        $task->delete();
        return response()->json(['message' => 'Task deleted'], 200);
    }
}
