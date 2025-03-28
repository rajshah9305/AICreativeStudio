import { NextPage } from 'next';
import { useState } from 'react';
import { GenerationForm } from '../components/GenerationForm';
import { ResultDisplay } from '../components/ResultDisplay';
import { useAuth } from '../hooks/useAuth';

const Home: NextPage = () => {
  const [result, setResult] = useState(null);
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4">
      <h1>AI Creative Studio</h1>
      {user ? (
        <>
          <GenerationForm onGenerate={setResult} />
          <ResultDisplay result={result} />
        </>
      ) : (
        <div>Please login to continue</div>
      )}
    </div>
  );
};

export default Home;
