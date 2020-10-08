import Router from 'next/router';

import { Alert, CardBody } from './';
import { loadingButton, normalButton, showAlert } from '../utilities';

const ManageClassroom = ({ class_code, id }) => {
  const handelClassroomDelete = async (element) => {
    if (
      confirm(
        'You are sure that you want to delete this class session? All the data will be permanently deleted. Click "OK" to confirm.'
      )
    ) {
      loadingButton(element.currentTarget);

      try {
        const response = await fetch(`${process.env.BACKEND_HOST}/${process.env.API_VERSION}/classroom/${id}`, {
          method: 'DELETE',
          mode: 'cors'
        });

        const responseJson = await response.json();

        if (response.ok) return Router.push('/');

        normalButton('Delete Classroom', element.currentTarget);
        showAlert(responseJson.error);
      } catch (e) {
        normalButton('Delete Classroom', element.currentTarget);
        showAlert(`An unknown error occurred: ${e.message}`);
      }
    }
  };

  return (
    <>
      <CardBody>
        <p className='text-secondary'>
          Your class code is displayed below; please provide your students with this code so they can join your class
          session.
        </p>

        <input className='form-control text-center mb-3' type='text' value={class_code} readOnly={true}></input>

        <hr className='mb-3' />

        <button className='btn btn-danger btn-block' onClick={handelClassroomDelete}>
          Delete Classroom
        </button>
      </CardBody>

      <Alert />
    </>
  );
};

export default ManageClassroom;
