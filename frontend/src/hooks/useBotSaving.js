// src/hooks/useBotSaving.js
import { useEffect } from 'react';
import axios from 'axios';
import { useDebounce } from 'use-debounce';

export default function useBotSaving(botId, flowData) {
  const [debouncedFlow] = useDebounce(flowData, 2000);

  useEffect(() => {
    if (!debouncedFlow || !botId) return;
    
    const saveBot = async () => {
      try {
        await axios.put(`/api/bots/${botId}`, {
          flow: debouncedFlow
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
        });
      } catch (err) {
        console.error('Auto-save failed:', err);
      }
    };

    saveBot();
  }, [debouncedFlow, botId]);

  // Initial load
  const loadBot = async () => {
    const res = await axios.get(`/api/bots/${botId}`);
    return res.data.flow;
  };

  return { loadBot };
}
