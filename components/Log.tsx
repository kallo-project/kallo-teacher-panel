const Log = ({ id, message, created_at }) => (
  <tr id={id}>
    <td>{message}</td>
    <td>{created_at}</td>
  </tr>
);

export default Log;
