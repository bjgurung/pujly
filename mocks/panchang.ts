export interface Panchang {
  date: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  sunrise: string;
  sunset: string;
  auspiciousTimes: string[];
  inauspiciousTimes: string[];
}

export const todayPanchang: Panchang = {
  date: 'February 22, 2026',
  tithi: 'Shukla Paksha Panchami',
  nakshatra: 'Rohini',
  yoga: 'Shubha',
  karana: 'Bava',
  sunrise: '6:32 AM',
  sunset: '6:15 PM',
  auspiciousTimes: [
    '8:00 AM - 10:30 AM',
    '12:00 PM - 1:30 PM',
    '4:00 PM - 5:30 PM',
  ],
  inauspiciousTimes: [
    '6:30 AM - 8:00 AM',
    '10:30 AM - 12:00 PM',
    '2:30 PM - 4:00 PM',
  ],
};
