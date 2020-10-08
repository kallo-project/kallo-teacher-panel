import io from 'socket.io-client';
import ReactDOMServer from 'react-dom/server';

import ModalLoader from './ModalLoader';
import { loadingButton, normalButton } from '../utilities';
import { Envelope, Eye, Trash } from './Icons';

const socket = io(process.env.BACKEND_HOST);

type Error = { error: string };

const Student = ({ class_id, student_id, name, joined_at }) => {
  const studentURL = `${process.env.BACKEND_HOST}/${process.env.API_VERSION}/classroom/${class_id}/student/${student_id}`;

  const handleStudentTabs = () => {
    document.getElementById('modal-title').innerText = `${name}'s Tabs`;
    document.getElementById('modal-body').innerHTML = ReactDOMServer.renderToStaticMarkup(<ModalLoader />);
    socket.emit('request-tabs', JSON.stringify({ class_id, student_id }));
  };

  const handleStudentLogs = async () => {
    const modalBody = document.getElementById('modal-body');

    document.getElementById('modal-title').innerText = `${name}'s Logs`;
    modalBody.innerHTML = ReactDOMServer.renderToStaticMarkup(<ModalLoader />);

    try {
      const response = await fetch(studentURL, {
        method: 'GET',
        mode: 'cors'
      });

      if (response.ok) {
        const { logs }: { logs: [{ _id: string; message: string; created_at: string }] } = await response.json();

        modalBody.innerHTML = ReactDOMServer.renderToStaticMarkup(
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th scope='col'>Message</th>
                <th scope='col'>Created At</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((i) => (
                <tr key={i._id}>
                  <td>{i.message}</td>
                  <td>{i.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      } else {
        const json: Error = await response.json();
        modalBody.innerText = json.error;
      }
    } catch (e) {}
  };

  const handleSendPrivateMessage = () => {
    const message = prompt('Please type your message below. WARNING: Please do not send any sensitive information.');

    if (typeof message === 'string') {
      if (message.trim().length === 0) return alert('No message provided!');
      socket.emit('private-message', JSON.stringify({ class_id, student_id, message: message }));
    }
  };

  const handleStudentRemove = async (e) => {
    if (
      confirm(
        `Are you sure that you want to remove ${name} from this class session? NOTE: (S)he may still rejoin this class session. Click "OK" to confirm.`
      )
    ) {
      const currentTarget = e.currentTarget;
      loadingButton(currentTarget);

      let errorMessage;
      const element = currentTarget.parentElement.parentElement;

      try {
        const response = await fetch(studentURL, {
          method: 'DELETE',
          mode: 'cors'
        });

        if (response.ok) return element.remove();

        const error: Error = await response.json();
        errorMessage = error.error;
      } catch (e) {
        errorMessage = e.message;
      }

      if (errorMessage) {
        alert(errorMessage);
        normalButton(ReactDOMServer.renderToStaticMarkup(<Trash />), currentTarget);
      }
    }
  };

  return (
    <tr id={student_id}>
      <td>{name}</td>
      <td>{joined_at}</td>
      <td style={{ whiteSpace: 'nowrap', width: '1%' }}>
        <button
          className='btn btn-info dropdown-toggle'
          type='button'
          id='dropdownMenuButton'
          data-toggle='dropdown'
          aria-haspopup='true'
          aria-expanded='false'
        >
          <Eye />
        </button>

        <div className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
          <a
            className='dropdown-item'
            style={{ cursor: 'pointer' }}
            data-toggle='modal'
            data-target='#modal'
            onClick={handleStudentTabs}
          >
            Tabs
          </a>
          <a
            className='dropdown-item'
            style={{ cursor: 'pointer' }}
            data-toggle='modal'
            data-target='#modal'
            onClick={handleStudentLogs}
          >
            Logs
          </a>
        </div>

        <button
          className='btn btn-warning ml-2'
          title='Send the student a private message'
          onClick={handleSendPrivateMessage}
        >
          <Envelope />
        </button>

        <button className='btn btn-danger ml-2' title='Delete the student' onClick={handleStudentRemove}>
          <Trash />
        </button>
      </td>
    </tr>
  );
};

export default Student;
