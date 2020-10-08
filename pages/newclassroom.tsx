// #region Load modules
import Router from 'next/router';
import Head from 'next/head';
import io from 'socket.io-client';
import ReactDOMServer from 'react-dom/server';
import ReCAPTCHA from 'react-google-recaptcha';

import { useRef, useState } from 'react';
import { enableButton, loadingButton, normalButton, setDisplayStyle, showAlert } from '../utilities';
import { Base, ColumnOne, ColumnTwo, Alert, CardBody, LabelHelp } from '../components';

const socket = io(process.env.BACKEND_HOST);
// #endregion

const newClassroom = () => {
  // #region Define references and states.
  const classroomNameElement = useRef<HTMLInputElement>(null);
  const maxStudentsElement = useRef<HTMLInputElement>(null);
  const allowedSitesElement = useRef<HTMLInputElement>(null);

  const [limitedStudents, setLimitedStudents] = useState<boolean>(false);
  const [restrictedAccess, setRestrictedAccess] = useState<boolean>(false);
  const [testMode, setTestMode] = useState<boolean>(false);

  const [allowedSites, setAllowedSites] = useState<string[]>([]);
  // #endregion

  // #region Set methods
  const handleAddSite = (e) => {
    e.preventDefault();

    if (testMode && allowedSites.length === 1)
      return showAlert('You can whitelist only one (1) site when the test mode option is enabled!');

    let url = allowedSitesElement.current.value;

    if (url !== '') {
      url = (url.indexOf('//') > -1 ? url.split('/')[2] : url.split('/')[0])
        .split(':')[0]
        .split('?')[0]
        .toLowerCase()
        .trim();

      if (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(url) && !allowedSites.includes(url)) {
        setAllowedSites((previousSites) => [...previousSites, url]);

        const parent = document.getElementById('allowedSites');

        parent.innerHTML += ReactDOMServer.renderToStaticMarkup(<li>{url}</li>);

        const div = 'allowedSiteGroup';

        if (document.getElementById(div).style.display !== 'block')
          document.getElementById(div).style.display = 'block';
        allowedSitesElement.current.value = '';
      }
    }
  };

  const postData = async (e) => {
    e.preventDefault();

    const maxStudents = parseInt(maxStudentsElement.current.value) || 0;

    // #region Validate inputs
    if (limitedStudents && maxStudents === 0)
      return showAlert(
        'The "Max students" field is required! Please turn off limited students mode or specify how many students may join your class session.'
      );
    else if (restrictedAccess && allowedSites.length === 0)
      return showAlert('No whitelisted sited added! Please turn off restricted access mode or add whitelisted sites.');
    else if (testMode && allowedSites.length === 0)
      return showAlert('Test mode is enabled! Please whitelist a site or disable the test mode option to continue.');
    else if (testMode && allowedSites.length > 1)
      return showAlert('You can whitelist only one (1) site when the test mode option is enabled!');
    // #endregion

    const submitButton = document.getElementById('submit-button');

    loadingButton(submitButton);

    try {
      const response = await fetch(`${process.env.BACKEND_HOST}/${process.env.API_VERSION}/newclassroom`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: classroomNameElement.current.value,
          limited_students: limitedStudents,
          max_students: maxStudents,
          restricted_access: restrictedAccess,
          allowed_sites: allowedSites,
          test_mode: testMode,
          captcha_response: window['grecaptcha'].getResponse()
        })
      });

      const responseJson = await response.json();

      if (!response.ok) {
        window['grecaptcha'].reset();
        normalButton('Create', submitButton);
        return showAlert(responseJson.error);
      }

      Router.push(`/classroom/${responseJson.class_id}/students`);
    } catch (e) {
      normalButton('Create', submitButton);
      showAlert(`An unknown error occurred: ${e.message}`);
    }
  };
  // #endregion

  return (
    <>
      <Head>
        <title>Kallo - New Classroom</title>
      </Head>

      <Base>
        <ColumnOne>
          <h5 className='mb-2'>Settings</h5>

          <form className='mt-3' id='settingsForm' onSubmit={postData}>
            <div className='mb-3'>
              <LabelHelp title='Name' toolTip="e.g. Mr. Joe's Final Exam" />
              <input
                className='form-control mt-2'
                name='name'
                type='text'
                placeholder="e.g. Mr. Joe's Final Exam"
                ref={classroomNameElement}
                required
              />
            </div>

            <hr className='my-4' />

            <div className='form-check form-switch mb-3'>
              <input
                className='form-check-input'
                id='isMaxStudents'
                name='limitedStudents'
                type='checkbox'
                onClick={() => {
                  setLimitedStudents(!limitedStudents);
                  setDisplayStyle('maxStudentsGroup');
                }}
              />
              <LabelHelp title='Limited Students' toolTip='Only a certain number of students may join this class' />
            </div>

            <div className='mb-3' id='maxStudentsGroup' style={{ display: 'none' }}>
              <label className='form-label text-muted'>Max students</label>
              <input
                className='form-control'
                id='maxStudents'
                name='maxStudents'
                type='number'
                placeholder='e.g. 27'
                ref={maxStudentsElement}
              />
            </div>

            <hr className='my-4' />

            <div className='form-check form-switch mb-3'>
              <input
                className='form-check-input'
                id='restrictedAccess'
                name='restrictedAccess'
                type='checkbox'
                onClick={() => {
                  setRestrictedAccess(!restrictedAccess);
                  setDisplayStyle('restrictedAccessGroup');
                }}
              />
              <LabelHelp
                title='Restricted Access'
                toolTip='Students have restricted access on what websites they can visit'
              />
            </div>

            <div className='mb-3' id='restrictedAccessGroup' style={{ display: 'none' }}>
              <label className='form-label text-muted'>Add sites</label>

              <div className='row g-2'>
                <div className='col-auto'>
                  <input
                    type='text'
                    className='form-control'
                    id='addSitesInput'
                    placeholder='e.g. example.com'
                    autoComplete='off'
                    ref={allowedSitesElement}
                  />
                </div>

                <div className='col-auto'>
                  <button className='btn btn-primary' id='addSiteButton' onClick={handleAddSite}>
                    Add
                  </button>
                </div>
              </div>

              <div className='mt-3' id='allowedSiteGroup' style={{ display: 'none' }}>
                <label className='form-label text-muted'>Allowed sites:</label>
                <ul id='allowedSites' />
              </div>
            </div>

            <hr className='my-4' />

            <div className='form-check form-switch'>
              <input
                className='form-check-input'
                id='testMode'
                name='testMode'
                type='checkbox'
                onClick={() => setTestMode(!testMode)}
              />
              <LabelHelp title='Test mode' toolTip='Lock student to only one window or tab' />
            </div>
          </form>
        </ColumnOne>

        <ColumnTwo>
          <CardBody>
            <ReCAPTCHA
              className='d-flex justify-content-center mb-2'
              id='recaptcha-response'
              form='settingsForm'
              sitekey={process.env.G_SITE_KEY}
              onChange={() => enableButton(document.getElementById('submit-button'))}
              onExpired={() => location.reload()}
              onErrored={() => location.reload()}
            />

            <button
              className='btn btn-primary btn-block disabled mb-2'
              id='submit-button'
              type='submit'
              form='settingsForm'
            >
              Create
            </button>
          </CardBody>

          <Alert />
        </ColumnTwo>
      </Base>
    </>
  );
};

export default newClassroom;
