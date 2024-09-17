<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function list()
    {
        // Rechercher les données des tâches
        // SELECT * FROM tags
        $tags = Tag::all()->load('tasks');

        return response()->json($tags, 200);
    }

    public function show($id)
    {
        // Rechercher les données d'une tâche
        // SELECT * FROM tags WHERE id = $id
        try {
            $tag = Tag::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Tag not found'], 404);
        }

        return response()->json($tag, 200);
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

        $tag = new Tag();
        $tag->name = $request->get('name');
        $tag->save();
        return response()->json($tag, 201);
    }

    public function update(Request $request, $id)
    {
        try {
            $tag = Tag::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Tag not found'], 404);
        }
        try {
            $request->validate([
                'name' => 'required|min:2|max:255',
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid data'], 404);
        }
        $tag->name = $request->get('name');
        $tag->save();

        return response()->json($tag, 200);
    }

    public function delete($id)
    {
        try {
            $tag = Tag::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Tag not found'], 404);
        }
        $tag->delete();
        return response()->json(['message' => 'Tag deleted'], 200);
    }
}
