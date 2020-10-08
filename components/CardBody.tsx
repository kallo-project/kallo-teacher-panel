const CardBody = ({ children, additional = '' }) => (
  <div className={`card ${additional}`}>
    <div className='card-body'>{children}</div>
  </div>
);
export default CardBody;
