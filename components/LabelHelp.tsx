import { Info } from './Icons';

const LabelHelp = ({ title, toolTip }) => (
  <>
    <label className='mr-1'>{title}</label>

    <span
      className='text-primary'
      data-toggle='tooltip'
      title={toolTip}
      onClick={() => alert(toolTip)}
    >
      <Info />
    </span>
  </>
);

export default LabelHelp;
