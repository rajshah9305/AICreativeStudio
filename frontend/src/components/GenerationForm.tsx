import { useState } from 'react';
import { generateText, generateCode, generateImage } from '../services/api';

export const GenerationForm = ({ onGenerate }) => {
  const [type, setType] = useState('text');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let result;
      switch(type) {
        case 'text':
          result = await generateText({ prompt });
          break;
        case 'code':
          result = await generateCode({ prompt });
          break;
        case 'image':
          result = await generateImage({ prompt });
          break;
      }
      onGenerate(result);
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form implementation */}
    </form>
  );
};
