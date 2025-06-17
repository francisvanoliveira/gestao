
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar para a aplicação principal
    navigate('/app');
  }, [navigate]);

  return null;
};

export default Index;
