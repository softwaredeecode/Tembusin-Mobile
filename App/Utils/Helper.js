import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getInitial = (name = '') => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }
  if (parts.length === 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const rupiahFormat = number => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};

export const formatDate = dateString => {
  const date = new Date(dateString);

  const day = date.getDate();
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day} ${month} ${year}, ${hours}:${minutes}`;
};

export const formatDateMaterial = dateString => {
  const [year, month, day] = dateString.split('T')[0].split('-');

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];

  return `${day} ${months[Number(month) - 1]} ${year}`;
};

export const useTryoutCountdown = () => {
  const [remainingMs, setRemainingMs] = useState(null);

  useEffect(() => {
    let raf;

    const tick = async () => {
      const endTimeStr = await AsyncStorage.getItem('tryout_end_time');
      if (!endTimeStr) return;

      const endTime = Number(endTimeStr);
      const diff = Math.max(0, endTime - Date.now());

      setRemainingMs(diff);
      raf = requestAnimationFrame(tick);
    };

    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  return remainingMs;
};

export const formatTime = ms => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
    2,
    '0',
  )}`;
};

export const formatDateToYYYYMMDD = dateString => {
  if (!dateString) return '';

  const parts = dateString.split(' ');
  if (parts.length !== 3) return '';

  const [day, monthStr, year] = parts;

  const monthMap = {
    Jan: '01',
    Feb: '02',
    Mar: '03',
    Apr: '04',
    May: '05',
    Jun: '06',
    Jul: '07',
    Aug: '08',
    Sep: '09',
    Oct: '10',
    Nov: '11',
    Dec: '12',
  };

  const month = monthMap[monthStr];
  if (!month) return '';

  return `${year}-${month}-${day.padStart(2, '0')}`;
};
