const API_BASE = '/api/department';

export async function getAllDepartments() {
    console.log('departmentService.getAllDepartments called');
    const res = await fetch(`${API_BASE}/getdepartments`, {
        credentials: 'include'
    });
    if (!res.ok) {
        const text = await res.text();
        console.error('Fetch departments failed:', res.status, text);
        throw new Error('Failed to fetch departments');
    }
    return res.json();
}

export async function addDepartment(department) {
    console.log('Calling addDepartment', department);
    const res = await fetch(`${API_BASE}/createdepartment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(department),
    });
    if (!res.ok) {
        const text = await res.text();
        console.error('Add department failed:', res.status, text);
        throw new Error('Failed to add department');
    }
    return res.json();
}

export async function updateDepartment(id, department) {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(department),
    });
    if (!res.ok) {
        const text = await res.text();
        console.error('Update department failed:', res.status, text);
        throw new Error('Failed to update department');
    }
    return res.json();
}

export async function deleteDepartment(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (!res.ok) {
        const text = await res.text();
        console.error('Delete department failed:', res.status, text);
        throw new Error('Failed to delete department');
    }
    return res.json();
} 