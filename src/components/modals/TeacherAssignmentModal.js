import React, { useState, useEffect } from 'react';
import { XMarkIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Avatar from '../common/Avatar';
import LoadingSpinner from '../common/LoadingSpinner';
import { teachersAPI } from '../../services/api';

const TeacherAssignmentModal = ({ isOpen, onClose, onAssign, assignedTeacherIds = [], className }) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTeachers();
    }
  }, [isOpen]);

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const response = await teachersAPI.getAll();
      setTeachers(response.data || []);
    } catch (error) {
      console.error('Error loading teachers:', error);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (teacher) => {
    setAssigning(true);
    try {
      await onAssign(teacher);
      // No cerramos el modal automáticamente para permitir asignar múltiples profesoras
    } catch (error) {
      console.error('Error assigning teacher:', error);
    } finally {
      setAssigning(false);
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = !searchTerm || 
      teacher.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const notAssigned = !assignedTeacherIds.includes(teacher.id);
    
    return matchesSearch && notAssigned;
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={className}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Asignar Profesora a la Clase
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            icon={XMarkIcon}
          />
        </div>

        <div className="p-6">
          <div className="mb-4">
            <Input
              placeholder="Buscar profesora..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredTeachers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No se encontraron profesoras' : 'Todas las profesoras están asignadas'}
                </div>
              ) : (
                filteredTeachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar 
                        src={teacher.avatar} 
                        name={teacher.fullName || `${teacher.firstName} ${teacher.lastName}`} 
                        size="md" 
                      />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {teacher.fullName || `${teacher.firstName} ${teacher.lastName}`}
                        </h3>
                        <p className="text-xs text-gray-500">{teacher.email}</p>
                        {teacher.isStudioOwner && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                            Propietaria
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAssign(teacher)}
                      disabled={assigning}
                      icon={UserPlusIcon}
                    >
                      Asignar
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TeacherAssignmentModal;
