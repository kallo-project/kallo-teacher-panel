import Logo from '../Logo';

const Base = ({ children }) => (
  <div className='container mt-5'>
    <Logo height='72' />

    <section className='mt-5 mb-4'>
      <div className='row'>{children}</div>
    </section>
  </div>
);

export default Base;
