import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSun, FaBell, FaGlobe, FaDollarSign } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const SettingsContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: rgba(26, 26, 29, 0.95);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(10px);
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const SettingsSection = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(26, 26, 29, 0.5);
  border-radius: 15px;
  border: 1px solid rgba(255,255,255,0.08);
`;

const SectionTitle = styled.h2`
  color: #ffffff;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.div`
  color: #b0b8c1;
`;

const SettingControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255,255,255,0.1);
    transition: .4s;
    border-radius: 34px;
    
    &:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
  }
  
  input:checked + span {
    background: linear-gradient(90deg, #0033cc 0%, #26d0ce 100%);
  }
  
  input:checked + span:before {
    transform: translateX(26px);
  }
`;

const Select = styled.select`
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: #ffffff;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #26d0ce;
  }
  
  option {
    background: #1a1a1d;
  }
`;

const SaveButton = styled.button`
  background: linear-gradient(90deg, #0033cc 0%, #26d0ce 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 2rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(38, 208, 206, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  text-align: center;
  margin-top: 1rem;
`;

const SuccessMessage = styled.div`
  color: #4ade80;
  text-align: center;
  margin-top: 1rem;
`;

const defaultSettings = {
  theme: 'dark',
  language: 'en',
  notifications: {
    email: true,
    push: true,
    priceAlerts: true
  },
  currency: 'USDT'
};

const Settings = () => {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!currentUser) return;
      
      try {
        const userSettingsRef = doc(db, 'users', currentUser.uid, 'settings', 'preferences');
        const settingsDoc = await getDoc(userSettingsRef);
        
        if (settingsDoc.exists()) {
          setSettings(settingsDoc.data());
        } else {
          // Create default settings if none exist
          await setDoc(userSettingsRef, defaultSettings);
          setSettings(defaultSettings);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError('Failed to load settings. Using defaults.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [currentUser]);

  const handleSettingChange = (key, value) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        newSettings[parent] = { ...newSettings[parent], [child]: value };
      } else {
        newSettings[key] = value;
      }
      return newSettings;
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!currentUser) return;
    
    try {
      const userSettingsRef = doc(db, 'users', currentUser.uid, 'settings', 'preferences');
      await updateDoc(userSettingsRef, settings);
      
      setSuccess('Settings saved successfully!');
      setHasChanges(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => setError(''), 3000);
    }
  };

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <SettingsContainer>
      <Title>Settings</Title>
      
      <SettingsSection>
        <SectionTitle>
          <FaSun /> Appearance
        </SectionTitle>
        <SettingItem>
          <SettingLabel>Dark Mode</SettingLabel>
          <SettingControl>
            <ToggleSwitch>
              <input
                type="checkbox"
                checked={settings.theme === 'dark'}
                onChange={(e) => handleSettingChange('theme', e.target.checked ? 'dark' : 'light')}
              />
              <span></span>
            </ToggleSwitch>
          </SettingControl>
        </SettingItem>
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>
          <FaGlobe /> Language
        </SectionTitle>
        <SettingItem>
          <SettingLabel>Interface Language</SettingLabel>
          <SettingControl>
            <Select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </Select>
          </SettingControl>
        </SettingItem>
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>
          <FaBell /> Notifications
        </SectionTitle>
        <SettingItem>
          <SettingLabel>Email Notifications</SettingLabel>
          <SettingControl>
            <ToggleSwitch>
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) => handleSettingChange('notifications.email', e.target.checked)}
              />
              <span></span>
            </ToggleSwitch>
          </SettingControl>
        </SettingItem>
        <SettingItem>
          <SettingLabel>Push Notifications</SettingLabel>
          <SettingControl>
            <ToggleSwitch>
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={(e) => handleSettingChange('notifications.push', e.target.checked)}
              />
              <span></span>
            </ToggleSwitch>
          </SettingControl>
        </SettingItem>
        <SettingItem>
          <SettingLabel>Price Alerts</SettingLabel>
          <SettingControl>
            <ToggleSwitch>
              <input
                type="checkbox"
                checked={settings.notifications.priceAlerts}
                onChange={(e) => handleSettingChange('notifications.priceAlerts', e.target.checked)}
              />
              <span></span>
            </ToggleSwitch>
          </SettingControl>
        </SettingItem>
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>
          <FaDollarSign /> Trading
        </SectionTitle>
        <SettingItem>
          <SettingLabel>Preferred Currency</SettingLabel>
          <SettingControl>
            <Select
              value={settings.currency}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
            >
              <option value="USDT">USDT</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
            </Select>
          </SettingControl>
        </SettingItem>
      </SettingsSection>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      <SaveButton
        onClick={handleSave}
        disabled={!hasChanges}
      >
        Save Changes
      </SaveButton>
    </SettingsContainer>
  );
};

export default Settings; 