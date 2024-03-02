import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import React from 'react';

const Sidebar:React.FC <{currentPath: string}>=({currentPath}) =>
{
  
  
   return (
     <ul className='mt-3 p-0 '>
     <Link to={"/center"} className={`text-none ${currentPath === "/center" ? "text-danger hover-Sidebar ": "text-secondary bg-danger"}  `}> <li className='d-flex justify-content-between px-2 mb-4'><span className='fw-medium vertical-align-bottom'><Icon icon="ic:baseline-home" className='me-1 vertical-align-middle' width={30} height={19} />Home</span><span>&#10095;</span></li></Link>
     <Link to={"/reservation"} className={`text-none ${currentPath === "/reservation" ? "text-danger hover-Sidebar": "text-secondary bg-danger"}   `}> <li className='d-flex justify-content-between px-2 mb-2'><span className='fw-medium vertical-align-bottom'><Icon icon="ic:baseline-home" className='me-1 vertical-align-middle' width={30} height={19} />Reservation</span><span>&#10095;</span></li></Link>
     </ul>
   );
}
export default Sidebar