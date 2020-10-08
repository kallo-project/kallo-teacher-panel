import ModalLoader from './ModalLoader';

const Modal = () => {
  return (
    <>
      <div className='modal fade' id='modal' tabIndex={-1}>
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='modal-title'></h5>
              <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>

            <div className='modal-body' id='modal-body'>
              <ModalLoader />
            </div>

            <div className='modal-footer'>
              <button type='button' className='btn btn-secondary' data-dismiss='modal'>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
