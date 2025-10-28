import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const UserController = {
  async getAll() {
    try {
      const response = await axios.get(`${API_URL}/api/users`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener usuarios'
      };
    }
  },

  async getById(id) {
    try {
      const response = await axios.get(`${API_URL}/api/users/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener usuario'
      };
    }
  },

  async create(userData) {
    try {
      const response = await axios.post(`${API_URL}/api/users`, userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al crear usuario'
      };
    }
  },

  async update(id, userData) {
    try {
      const response = await axios.put(`${API_URL}/api/users/${id}`, userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al actualizar usuario'
      };
    }
  },

  async delete(id) {
    try {
      await axios.delete(`${API_URL}/api/users/${id}`);
      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al eliminar usuario'
      };
    }
  }
};

export default UserController;
