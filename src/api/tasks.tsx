import { API } from './API';

export const getTasks = () => API.get('api/tasks');
export const getTask = (id: number | string) => API.get(`api/tasks/${id}`);

export const createTask = (formData: FormData) => {
    return API.post('api/tasks', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const assignUserToTask = (taskId: number | string, userId: number | string) =>
    API.post(`api/tasks/${taskId}/assign/${userId}`);

export const unassignUserFromTask = (taskId: number | string, userId: number | string) =>
    API.delete(`api/tasks/${taskId}/unassign/${userId}`);

export const updateTask = (id: number | string, data: any) => API.put(`api/tasks/${id}`, data);
export const deleteTask = (id: number | string) => API.delete(`api/tasks/${id}`);

// Admin functions for task management
export const updateTaskStatus = (taskId: number | string, status: string, points?: number) =>
    API.patch(`api/tasks/${taskId}/status`, { status, points });

export const assignMultipleUsersToTask = (taskId: number | string, userIds: number[]) =>
    API.post(`api/tasks/${taskId}/assign-multiple`, { userIds });

