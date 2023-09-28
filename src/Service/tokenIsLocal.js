// получение токена из Локала
export default function tokenIsLocal() {
  const token = localStorage.getItem('token');
  if (token) {
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  }
  return {};
}
