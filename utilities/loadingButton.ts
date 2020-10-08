import disableButton from './disableButton';

const LoadingButton = (element: HTMLElement) => {
  element.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
  disableButton(element);
};

export default LoadingButton;
