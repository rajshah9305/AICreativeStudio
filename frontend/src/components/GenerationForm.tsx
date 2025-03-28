import { useState } from 'react';
import { generateText, generateCode, generateImage } from '../services/api';
import { toast } from 'react-toastify';

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
          result = await generateText({ prompt, model: 'llama-3', parameters: {} });
          break;
        case 'code':
          result = await generateCode({ prompt, model: 'llama-3', parameters: {} });
          break;
        case 'image':
          result = await generateImage({ prompt, model: 'stable-diffusion', parameters: {} });
          break;
        default:
          throw new Error('Invalid generation type');
      }
      onGenerate(result);
    } catch (error) {
      toast.error(error.message || 'Generation failed');
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
