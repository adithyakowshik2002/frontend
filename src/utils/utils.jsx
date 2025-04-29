export const getRoleFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode the payload
      return payload.role; // Return the role from the decoded token
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  };
  