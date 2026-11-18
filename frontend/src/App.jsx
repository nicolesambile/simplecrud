
import { useEffect, useState } from 'react';
import './App.css';

const API = 'http://localhost:5000/api/trucks';

const emptyForm = {
    plate_number: '',
    truck_model: '',
    truck_type: '',
    capacity: '',
    driver_name: '',
    contact_number: '',
    truck_status: 'Available'
};

function App() {
    const [trucks, setTrucks] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState('');
    const [message, setMessage] = useState('');

    // LOAD TRUCK RECORDS
    const loadTrucks = async () => {
        try {
            const response = await fetch(API);
            if (!response.ok) throw new Error('Failed to load trucks.');
            const data = await response.json();
            setTrucks(data);
        } catch (error) {
            setMessage(error.message);
        }
    };

    useEffect(() => {
        loadTrucks();
    }, []);

    // HANDLE INPUT
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // ADD AND UPDATE TRUCK
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = editingId
                ? `${API}/${editingId}`
                : API;

            const response = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            setMessage(result.message);
            setForm(emptyForm);
            setEditingId(null);
            await loadTrucks();

        } catch (error) {
            setMessage(error.message);
        }
    };

    // EDIT TRUCK
    const editTruck = (truck) => {
        setEditingId(truck.truck_id);

        setForm({
            plate_number: truck.plate_number,
            truck_model: truck.truck_model,
            truck_type: truck.truck_type,
            capacity: truck.capacity,
            driver_name: truck.driver_name,
            contact_number: truck.contact_number || '',
            truck_status: truck.truck_status
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // DELETE TRUCK
    const deleteTruck = async (id) => {
        if (!window.confirm('Are you sure you want to delete this truck?')) {
            return;
        }

        try {
            const response = await fetch(`${API}/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            setMessage(result.message);
            await loadTrucks();

        } catch (error) {
            setMessage(error.message);
        }
    };

    // SEARCH TRUCK
    const searchTruck = async (value) => {
        setSearch(value);

        try {
            const response = await fetch(
                `${API}/search?keyword=${encodeURIComponent(value)}`
            );

            if (!response.ok) throw new Error('Search failed.');

            const data = await response.json();
            setTrucks(data);

        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="container">

            <header>
                <h1>🚚 Truck Delivery Management System</h1>
                <p>Manage and monitor your truck records</p>
            </header>

            <div className="dashboard">
                <h2>Dashboard</h2>

                <div className="dashboard-card">
                    <h3>Total Trucks</h3>
                    <h1>{trucks.length}</h1>
                </div>
            </div>

            <section className="form-section">
                <h2>{editingId ? 'Update Truck' : 'Add New Truck'}</h2>

                <form onSubmit={handleSubmit}>

                    <input
                        name="plate_number"
                        placeholder="Plate Number *"
                        value={form.plate_number}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="truck_model"
                        placeholder="Truck Model *"
                        value={form.truck_model}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="truck_type"
                        placeholder="Truck Type *"
                        value={form.truck_type}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="number"
                        name="capacity"
                        placeholder="Capacity (kg) *"
                        value={form.capacity}
                        onChange={handleChange}
                        min="0.01"
                        step="0.01"
                        required
                    />

                    <input
                        name="driver_name"
                        placeholder="Driver Name *"
                        value={form.driver_name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="contact_number"
                        placeholder="Contact Number"
                        value={form.contact_number}
                        onChange={handleChange}
                    />

                    <select
                        name="truck_status"
                        value={form.truck_status}
                        onChange={handleChange}
                    >
                        <option value="Available">Available</option>
                        <option value="In Use">In Use</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>

                    <button type="submit">
                        {editingId ? 'Update Truck' : 'Add Truck'}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            className="cancel"
                            onClick={() => {
                                setEditingId(null);
                                setForm(emptyForm);
                            }}
                        >
                            Cancel
                        </button>
                    )}

                </form>

                {message && <p className="message">{message}</p>}
            </section>

            <section className="table-section">
                <h2>Truck Records</h2>

                <input
                    className="search"
                    placeholder="Search by Truck ID or Plate Number..."
                    value={search}
                    onChange={(e) => searchTruck(e.target.value)}
                />

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Truck ID</th>
                                <th>Plate Number</th>
                                <th>Model</th>
                                <th>Type</th>
                                <th>Capacity (kg)</th>
                                <th>Driver</th>
                                <th>Contact</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {trucks.map((truck) => (
                                <tr key={truck.truck_id}>
                                    <td>{truck.truck_id}</td>
                                    <td>{truck.plate_number}</td>
                                    <td>{truck.truck_model}</td>
                                    <td>{truck.truck_type}</td>
                                    <td>{truck.capacity}</td>
                                    <td>{truck.driver_name}</td>
                                    <td>{truck.contact_number || '-'}</td>
                                    <td>{truck.truck_status}</td>

                                    <td>
                                        <button
                                            className="edit"
                                            onClick={() => editTruck(truck)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete"
                                            onClick={() => deleteTruck(truck.truck_id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {trucks.length === 0 && (
                                <tr>
                                    <td colSpan="9">
                                        No truck records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

        </div>
    );
}

export default App;
