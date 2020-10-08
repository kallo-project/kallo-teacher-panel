import Head from 'next/head';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io(process.env.BACKEND_HOST);

import { Base, ColumnOne, ColumnTwo, ClassroomNav, ManageClassroom, Log } from '../../../components';

type Log = {
  id: string;
  message: string;
  created_at: string;
};

type ClassroomDetails = {
  id: string;
  name: string;
  class_code: string;
  logs: Log[];
};

const logs = (classroomDetails: ClassroomDetails) => {
  useEffect(() => {
    socket.emit('teacher-connection', classroomDetails.id);
  });

  return (
    <>
      <Head>
        <title>Kallo - {classroomDetails.name}</title>
      </Head>

      <Base>
        <ClassroomNav id={classroomDetails.id} activeTab={2} />

        <ColumnOne>
          <div>
            <h5 className='mb-3'>
              Logs
              <span className='badge bg-light text-muted ml-1'>{classroomDetails.logs.length}</span>
            </h5>

            <table className='table table-bordered'>
              <thead>
                <tr>
                  <th>Message</th>
                  <th>Created At</th>
                </tr>
              </thead>

              <tbody id='log-list'>
                {classroomDetails.logs.map((e) => (
                  <Log id={e.id} key={e.id} message={e.message} created_at={e.created_at} />
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

logs.getInitialProps = async ({ req, query: { id } }) => {
  const response = await fetch(`${process.env.BACKEND_HOST}/${process.env.API_VERSION}/classroom/${id}`);
  const responseJson: ClassroomDetails = await response.json();

  return {
    id: responseJson.id,
    name: responseJson.name,
    class_code: responseJson.class_code,
    logs: responseJson.logs
  } as ClassroomDetails;
};

export default logs;
