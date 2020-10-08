const setDisplayStyle = (id: string) => {
  const element = document.getElementById(id);
  element.style.display = element.style.display === 'none' ? 'block' : 'none';
};

export default setDisplayStyle;
