const showAlert = (message: string) => {
  const element = document.getElementById('alert-div');
  if (element.style.display !== 'block') element.style.display = 'block';
  element.innerText = message;
};

export default showAlert;
