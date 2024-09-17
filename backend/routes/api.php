<?php

use Illuminate\Http\Request;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;


Route::get('/tasks', [TaskController::class, 'list']);

Route::get('/tasks/{id}', [TaskController::class, 'show'])->where('id', '[0-9]+');

Route::post('/tasks', [TaskController::class, 'store']);

Route::put('/tasks/{id}', [TaskController::class, 'update'])->where('id', '[0-9]+');

Route::delete('/tasks/{id}', [TaskController::class, 'delete'])->where('id', '[0-9]+');


Route::get('/categories', [CategoryController::class, 'list']);

Route::get('/categories/{id}', [CategoryController::class, 'show'])->where('id', '[0-9]+');

Route::post('/categories', [CategoryController::class, 'store']);

Route::put('/categories/{id}', [CategoryController::class, 'update'])->where('id', '[0-9]+');

Route::delete('/categories/{id}', [CategoryController::class, 'delete'])->where('id', '[0-9]+');



Route::get('/tags', [TagController::class, 'list']);

Route::get('/tags/{id}', [TagController::class, 'show'])->where('id', '[0-9]+');

Route::post('/tags', [TagController::class, 'store']);

Route::put('/tags/{id}', [TagController::class, 'update'])->where('id', '[0-9]+');

Route::delete('/tags/{id}', [TagController::class, 'delete'])->where('id', '[0-9]+');

