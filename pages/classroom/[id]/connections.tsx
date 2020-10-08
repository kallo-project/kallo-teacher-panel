import Head from 'next/head';
import { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(process.env.BACKEND_HOST);

import { Base, ColumnOne, ColumnTwo, ClassroomNav, ManageClassroom, Log } from '../../../components';

type ConnectionLogs = {
  _id: string;
  connect: boolean;
  student: string;
  created_at: string;
};

type ClassroomDetails = {
  id: string;
  name: string;
  class_code: string;
  connection_logs: ConnectionLogs[];
};

const connections = (classroomDetails: ClassroomDetails) => {
  useEffect(() => {
    socket.emit('teacher-connection', classroomDetails.id);
  });

  return (
    <>
      <Head>
        <title>Kallo - {classroomDetails.name}</title>
      </Head>

      <Base>
        <ClassroomNav id={classroomDetails.id} activeTab={3} />

        <ColumnOne>
          <div>
            <h5 className='mb-3'>
              Connections
              <span className='badge bg-light text-muted ml-1'>{classroomDetails.connection_logs.length}</span>
            </h5>

            <table className='table table-bordered'>
              <thead>
                <tr>
                  <th>Message</th>
                  <th>Created At</th>
                </tr>
              </thead>

              <tbody id='log-list'>
                {classroomDetails.connection_logs.map((e) => (
                  <Log
                    id={e._id}
                    key={e._id}
                    message={`${e.student} has ${e.connect ? 'joined' : 'left'} the class session.`}
                    created_at={e.created_at}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </ColumnOne>

        <ColumnTwo>
          <ManageClassroom class_code={classroomDetails.class_code} id={classroomDetails.id} />
        </ColumnTwo>
      </Base>
    </>
  );
};

connections.getInitialProps = async ({ req, query: { id } }) => {
  const response = await fetch(`${process.env.BACKEND_HOST}/${process.env.API_VERSION}/classroom/${id}`);
  const responseJson: ClassroomDetails = await response.json();

  return {
    id: responseJson.id,
    name: responseJson.name,
    class_code: responseJson.class_code,
    connection_logs: responseJson.connection_logs
  } as ClassroomDetails;
};

export default connections;
