<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function list()
    {
        // Rechercher les données des categories
        // SELECT * FROM categories
        $categories = Category::all()->load('tasks'); //->load('tasks')

        return response()->json($categories, 200);
    }

    public function show($id)
    {
        // Rechercher les données d'une catégorie
        // SELECT * FROM categories WHERE id = $id
        try {
            $category = Category::with('tasks')->findOrFail($id); //with('tasks')->
            $tasksTitles = [];
            foreach($category->tasks as $task){
                $tasksTitles = $task->title;
            }
            var_dump($tasksTitles);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        return response()->json($category, 200);
    }

    public function store(Request $request)
    { //l'objet Request va être injecté automatiquement par Laravel dans le paramètre
        try {
            $request->validate([
                'name' => 'required|min:2|max:255',
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Validation error'], 404);
        }

        $category = new Category();
        $category->name = $request->get('name');
        $category->save();
        return response()->json($category, 201);
    }

    public function update(Request $request, $id)
    {
        try {
            $category = Category::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json(['message' => 'category not found'], 404);
        }
        try {
            $request->validate([
                'name' => 'required|min:2|max:255',
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid data'], 404);
        }
        $category->name = $request->get('name');
        $category->save();

        return response()->json($category, 200);
    }

    public function delete($id)
    {
        try {
            $category = Category::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json(['message' => 'category not found'], 404);
        }
        $category->delete();
        return response()->json(['message' => 'category deleted'], 200);
    }
}
