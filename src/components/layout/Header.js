import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
import Avatar from '../common/Avatar';
import Button from '../common/Button';

const Header = ({ user, onMenuClick }) => {
  const { logout } = useAuth();

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={onMenuClick}
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      <div className="h-6 w-px bg-gray-200 lg:hidden" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
          >
            <BellIcon className="h-6 w-6" />
          </button>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

          <div className="flex items-center gap-x-3">
            <Avatar 
              src={user?.avatar} 
              name={user?.name || user?.email} 
              size="sm"
            />
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-gray-900">
                {user?.name || 'Usuario'}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-500 hover:text-gray-700"
            >
              Salir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
