import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { TodoStorage } from '../fileStorage/todoStorage';

const todosAccess = new TodoAccess()
const todosStorage = new TodoStorage()

export async function generateUploadUrl(userId: string, todoId: string): Promise<string> {

    const uploadUrl = await todosStorage.generateUploadUrl(todoId)
    await todosAccess.addTodoUrl(userId, todoId, todosStorage.generateTodoItemAttechmentUrl(todoId))

    return uploadUrl
}

export async function getUserTodos(userId: string): Promise<TodoItem[]> {
    return todosAccess.getUserTodos(userId)
}

export async function createTodo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {

    const itemId = uuid.v4()

    return await todosAccess.createTodo({
        todoId: itemId,
        userId: userId,
        createdAt: new Date().toISOString(),
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false
    })
}

export async function deleteTodo(userId: string, todoId: string, ) {
    await todosAccess.deleteTodo(userId, todoId)
}

export async function updateTodo(userId: string, todoId: string, todoUpdate: UpdateTodoRequest): Promise<TodoUpdate> {
    return await todosAccess.updateTodo(userId, todoId, {
        name: todoUpdate.name,
        dueDate: todoUpdate.dueDate,
        done: todoUpdate.done
    })
}