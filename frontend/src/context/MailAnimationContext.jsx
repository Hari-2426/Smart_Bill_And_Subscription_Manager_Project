import React, { createContext, useContext, useState, useCallback } from 'react';
import MailFlightAnimation from '../components/motion/MailFlightAnimation';

const MailAnimationContext = createContext(null);

export const MailAnimationProvider = ({ children }) => {
  const [mailEvent, setMailEvent] = useState(null);

  const triggerMailAnimation = useCallback(({ to, title, subtitle, duration = 4000 }) => {
    setMailEvent({
      to: to || 'your-email@domain.com',
      title: title || 'Email Notification Dispatched',
      subtitle: subtitle || 'Sent from SmartBill to your inbox',
      duration,
      id: Date.now(),
    });
  }, []);

  const closeMailAnimation = useCallback(() => {
    setMailEvent(null);
  }, []);

  return (
    <MailAnimationContext.Provider value={{ triggerMailAnimation }}>
      {children}
      {mailEvent && (
        <MailFlightAnimation
          key={mailEvent.id}
          isOpen={true}
          to={mailEvent.to}
          title={mailEvent.title}
          subtitle={mailEvent.subtitle}
          duration={mailEvent.duration}
          onClose={closeMailAnimation}
        />
      )}
    </MailAnimationContext.Provider>
  );
};

export const useMailAnimation = () => {
  const context = useContext(MailAnimationContext);
  if (!context) {
    throw new Error('useMailAnimation must be used within a MailAnimationProvider');
  }
  return context;
};

export default MailAnimationContext;
