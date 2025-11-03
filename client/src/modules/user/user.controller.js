import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const UserController = {
  async getAll() {
    try {
      const response = await axios.get(`${API_URL}/api/users`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Error al obtener usuarios'
      };
    }
  },

  async getById(id) {
    try {
      const response = await axios.get(`${API_URL}/api/users/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error al obtener usuario'
      };
    }
  },

  async create(userData) {
    try {
      const response = await axios.post(`${API_URL}/api/users`, userData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error al crear usuario'
      };
    }
  },

  async update(id, userData) {
    try {
      const response = await axios.put(`${API_URL}/api/users/${id}`, userData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error al actualizar usuario'
      };
    }
  },

  async delete(id) {
    try {
      const response = await axios.delete(`${API_URL}/api/users/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar usuario'
      };
    }
  }
};

export default UserController;
