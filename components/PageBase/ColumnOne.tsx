import CardBody from '../CardBody';

const ColumnOne = ({ children }) => (
  <div className='col-lg-8 mb-4'>
    <CardBody>{children}</CardBody>
  </div>
);

export default ColumnOne;
