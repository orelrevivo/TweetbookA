// UserNavLink.tsx
import React from 'react';
import { useRouter } from 'next/router';

type UserNavLinkProps = {
  name: string;
  path: string;
  onClick: () => void;
  isActive: boolean;
};

const UserNavLink: React.FC<UserNavLinkProps> = ({ name, path, onClick, isActive }) => {
  return (
    <button
      className={`nav-link ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      {name}
    </button>
  );
};

export default UserNavLink;
