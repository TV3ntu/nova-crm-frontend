import React, { useState, useEffect } from 'react';
import { XMarkIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Avatar from '../common/Avatar';
import LoadingSpinner from '../common/LoadingSpinner';
import { studentsAPI } from '../../services/api';

const StudentEnrollmentModal = ({ isOpen, onClose, onEnroll, enrolledStudentIds = [], className }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadStudents();
    }
  }, [isOpen]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const response = await studentsAPI.getAll();
      setStudents(response.data || []);
    } catch (error) {
      console.error('Error loading students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (student) => {
    setEnrolling(true);
    try {
      await onEnroll(student);
      // No cerramos el modal automáticamente para permitir inscribir múltiples estudiantes
    } catch (error) {
      console.error('Error enrolling student:', error);
    } finally {
      setEnrolling(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = !searchTerm || 
      student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone?.includes(searchTerm);
    
    const notEnrolled = !enrolledStudentIds.includes(student.id);
    
    return matchesSearch && notEnrolled;
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={className}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Inscribir Estudiante a la Clase
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
              placeholder="Buscar estudiante por nombre o teléfono..."
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
              {filteredStudents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No se encontraron estudiantes' : 'Todos los estudiantes están inscritos'}
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar 
                        src={student.avatar} 
                        name={student.fullName || `${student.firstName} ${student.lastName}`} 
                        size="md" 
                      />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {student.fullName || `${student.firstName} ${student.lastName}`}
                        </h3>
                        <p className="text-xs text-gray-500">{student.phone}</p>
                        {student.email && (
                          <p className="text-xs text-gray-500">{student.email}</p>
                        )}
                        {student.birthDate && (
                          <p className="text-xs text-gray-400">
                            Nacimiento: {new Date(student.birthDate).toLocaleDateString('es-CL')}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleEnroll(student)}
                      disabled={enrolling}
                      icon={UserPlusIcon}
                    >
                      Inscribir
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

export default StudentEnrollmentModal;
