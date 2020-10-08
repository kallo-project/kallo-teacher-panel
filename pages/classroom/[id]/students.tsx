import Head from 'next/head';
import { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import io from 'socket.io-client';

const socket = io(process.env.BACKEND_HOST);

import {
  Base,
  ColumnOne,
  ColumnTwo,
  ClassroomNav,
  LoadBootstrap,
  ManageClassroom,
  Modal,
  Student
} from '../../../components';

type Student = {
  id: string;
  name: string;
  joined_at: string;
};

type ClassroomDetails = {
  id: string;
  name: string;
  class_code: string;
  limited_students: boolean;
  max_students: number;
  students: Student[];
};

const students = (classroomDetails: ClassroomDetails) => {
  const [studentComponents, setStudentComponents] = useState<any[]>([]);

  socket.emit('teacher-connection', classroomDetails.id);

  useEffect(() => {
    socket.on('student-join', (e: Student) =>
      setStudentComponents(
        studentComponents.concat(
          <Student class_id={classroomDetails.id} student_id={e.id} key={e.id} name={e.name} joined_at={e.joined_at} />
        )
      )
    );
  }, [studentComponents]);

  socket.on('student-tabs', (data: string) => {
    const { tabs }: { tabs: [{ title: string; url: string; active: boolean; incognito: boolean }] } = JSON.parse(data);

    document.getElementById('modal-body').innerHTML = ReactDOMServer.renderToStaticMarkup(
      <div className='list-group'>
        {tabs.map((e, index) => (
          <a
            className='list-group-item list-group-item-action flex-column align-items-start'
            href={e.url}
            target='_blank'
            key={index}
          >
            <div className='d-flex align-items-center'>
              <h5 className='mb-1'>{e.title.length > 40 ? `${e.title.substring(0, 40)}...` : e.title}</h5>

              {e.active ? <span className='badge bg-primary text-light ml-1'>Active</span> : ''}
              {e.incognito ? <span className='badge bg-danger text-light ml-1'>Incognito</span> : ''}
            </div>

            <small className='text-primary'>{e.url.length > 50 ? `${e.url.substring(0, 50)}...` : e.url}</small>
          </a>
        ))}
      </div>
    );
  });

  useEffect(() => {
    /*
      TODO: Replace this something with something better (I assume that there is a "better" way to do this,
      preferably using events or React's "setState").
    */
    setInterval(() => {
      if (window.location.pathname.split('/')[3] === 'students') {
        const currentStudents = document.getElementById('student-list').childElementCount;

        document.getElementById('student-count').innerText = (classroomDetails.limited_students
          ? `${currentStudents}/${classroomDetails.max_students}`
          : currentStudents) as string;
      }
    }, 100);
  });

  return (
    <>
      <Head>
        <title>Kallo - {classroomDetails.name}</title>
        <LoadBootstrap />
      </Head>

      <Modal />

      <Base>
        <ClassroomNav id={classroomDetails.id} activeTab={1} />

        <ColumnOne>
          <div>
            <h5 className='mb-3'>
              Students
              <span className='badge bg-light text-muted ml-1' id='student-count' />
            </h5>

            <table className='table table-bordered'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Joined At</th>
                  <th>Manage</th>
                </tr>
              </thead>

              <tbody id='student-list'>
                {classroomDetails.students
                  .map((e: Student) => (
                    <Student
                      class_id={classroomDetails.id}
                      student_id={e.id}
                      key={e.id}
                      name={e.name}
                      joined_at={e.joined_at}
                    />
                  ))
                  .concat(studentComponents)}
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

students.getInitialProps = async ({ req, query: { id } }) => {
  const response = await fetch(`${process.env.BACKEND_HOST}/${process.env.API_VERSION}/classroom/${id}`);
  const responseJson: ClassroomDetails = await response.json();

  return {
    id: responseJson.id,
    name: responseJson.name,
    class_code: responseJson.class_code,
    limited_students: responseJson.limited_students,
    max_students: responseJson.max_students,
    students: responseJson.students
  } as ClassroomDetails;
};

export default students;
