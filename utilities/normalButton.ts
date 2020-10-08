import enableButton from './enableButton';

const normalButton = (innerHTML: string, element: HTMLElement) => {
  element.innerHTML = innerHTML;
  enableButton(element);
};

export default normalButton;
