import React, { useState, useEffect } from 'react';
import '../AdminDashboard.css'; // Reusing styles

function CourseManagement() {
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({ course_code: '', title: '', credit: '', department: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch('http://localhost:3000/api/admin/courses', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setCourses(data.data);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch('http://localhost:3000/api/admin/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                alert('Course added!');
                setFormData({ course_code: '', title: '', credit: '', department: '' });
                fetchCourses();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error adding course:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this course?')) return;
        try {
            const token = localStorage.getItem('auth_token');
            await fetch(`http://localhost:3000/api/admin/courses/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    return (
        <div className="admin-page-container">
            <h2>Course Management</h2>

            <div className="admin-form-card">
                <h3>Add New Course</h3>
                <form onSubmit={handleSubmit} className="admin-form-grid">
                    <input
                        type="text" placeholder="Course Code (e.g. CSE101)"
                        value={formData.course_code} onChange={e => setFormData({ ...formData, course_code: e.target.value })} required
                    />
                    <input
                        type="text" placeholder="Course Title"
                        value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required
                    />
                    <input
                        type="number" step="0.1" placeholder="Credits"
                        value={formData.credit} onChange={e => setFormData({ ...formData, credit: e.target.value })} required
                    />
                    <select
                        value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} required
                    >
                        <option value="">Select Department</option>
                        <option value="Computer Science & Engineering">CSE</option>
                        <option value="Electrical Engineering">EEE</option>
                        <option value="Business Administration">BBA</option>
                        <option value="English">English</option>
                    </select>
                    <button type="submit" className="admin-btn-primary">Add Course</button>
                </form>
            </div>

            <div className="admin-table-card">
                <h3>Existing Courses</h3>
                {loading ? <p>Loading...</p> : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Title</th>
                                <th>Credit</th>
                                <th>Department</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(course => (
                                <tr key={course.id}>
                                    <td>{course.course_code}</td>
                                    <td>{course.title}</td>
                                    <td>{course.credit}</td>
                                    <td>{course.department}</td>
                                    <td>
                                        <button onClick={() => handleDelete(course.id)} className="admin-btn-danger">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default CourseManagement;
