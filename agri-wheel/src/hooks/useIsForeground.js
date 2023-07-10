import { useState, useEffect } from 'react';
import { AppState } from 'react-native';

const useIsForeground = () => {
    const [isForeground, setIsForeground] = useState(true);

    useEffect(() => {
        const onChange = (state) => {
            setIsForeground(state === 'active');
        };
        const listener = AppState.addEventListener('change', onChange);
        return () => listener.remove();
    }, [setIsForeground]);

    return isForeground;
};
export default useIsForeground; 