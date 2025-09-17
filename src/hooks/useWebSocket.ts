import { useEffect, useRef, useState } from 'react';
import { wsUrl } from '@/lib/api';

export function useWebSocket(path = '/ws/updates') {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const url = wsUrl(path);
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);
        setMessages(prev => [...prev, data]);
      } catch (e) {
        setMessages(prev => [...prev, { type: 'raw', data: evt.data }]);
      }
    };
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [path]);

  const send = (data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(typeof data === 'string' ? data : JSON.stringify(data));
    }
  };

  return { connected, messages, send };
}
