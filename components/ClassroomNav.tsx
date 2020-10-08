import Link from 'next/link';
import { Door, Inbox, People } from '../components/Icons';

const ClassroomNav = ({ id, activeTab }) => {
  const isActive = (tab: number) => (activeTab === tab ? ' active' : '');

  return (
    <ul className='nav nav-tabs mb-3'>
      <li className='nav-item'>
        <Link href={{ pathname: `/classroom/${id}/students` }}>
          <a className={`nav-link${isActive(1)}`}>
            <People fill={activeTab === 1} />
            Students
          </a>
        </Link>
      </li>

      <li className='nav-item'>
        <Link href={{ pathname: `/classroom/${id}/logs` }}>
          <a className={`nav-link${isActive(2)}`}>
            <Inbox fill={activeTab === 2} />
            Logs
          </a>
        </Link>
      </li>

      <li className='nav-item'>
        <Link href={{ pathname: `/classroom/${id}/connections` }}>
          <a className={`nav-link${isActive(3)}`}>
            <Door fill={activeTab === 3} />
            Connections
          </a>
        </Link>
      </li>
    </ul>
  );
};

export default ClassroomNav;
