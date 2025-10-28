import { useState, useEffect } from 'react';
import UserController from './user.controller';
import UserModal from './UserModal';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await UserController.getAll();
      if (response.success) {
        setUsers(response.data);
      } else {
        showAlert('Error al cargar usuarios', 'danger');
      }
    } catch (error) {
      showAlert('Error de conexión con el servidor', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleSave = async (userData) => {
    try {
      let response;
      if (selectedUser) {
        response = await UserController.update(selectedUser.id, userData);
      } else {
        response = await UserController.create(userData);
      }

      if (response.success) {
        showAlert(response.message, 'success');
        setShowModal(false);
        loadUsers();
      } else {
        showAlert(response.message, 'danger');
      }
    } catch (error) {
      showAlert('Error al guardar el usuario', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      try {
        const response = await UserController.delete(id);
        if (response.success) {
          showAlert(response.message, 'success');
          loadUsers();
        } else {
          showAlert(response.message, 'danger');
        }
      } catch (error) {
        showAlert('Error al eliminar el usuario', 'danger');
      }
    }
  };

  return (
    <>
      {alert.show && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          {alert.message}
          <button type="button" className="btn-close" onClick={() => setAlert({ show: false, message: '', type: '' })}></button>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestión de Usuarios</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          <i className="bi bi-plus-circle"></i> Nuevo Usuario
        </button>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Correo Electrónico</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(user)}
                      >
                        <i className="bi bi-pencil"></i> Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(user.id)}
                      >
                        <i className="bi bi-trash"></i> Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <UserModal
        show={showModal}
        user={selectedUser}
        onSave={handleSave}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}

export default UserList;
