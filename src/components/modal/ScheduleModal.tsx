import { FC, useState } from 'react';
import { motion } from 'framer-motion';

type ScheduleModalProps = {
  onClose: () => void;
};

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const years = [2024, 2025, 2026];
const hours = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes = Array.from({ length: 60 }, (_, i) => i);
const ampm = ['AM', 'PM'];

export const ScheduleModal: FC<ScheduleModalProps> = ({ onClose }) => {
  const [month, setMonth] = useState(months[0]);
  const [day, setDay] = useState(days[0]);
  const [year, setYear] = useState(years[0]);
  const [hour, setHour] = useState(hours[0]);
  const [minute, setMinute] = useState(minutes[0]);
  const [ampmValue, setAmpmValue] = useState(ampm[0]);

  return (
    <div className=''>
      <motion.div
        className='bg-none p-6 rounded-lg w-[400px]'
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className='flex justify-between mb-4'>
          <h2 className='dgwhwhdshsegds3 text-xl font-bold'>Schedule</h2>
          {/* <button onClick={onClose} className='Closebtnn123'>
            Close
          </button> */}
        </div>
        <div className='dgwhwhdshsegds3 space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Date</label>
            <div className='flex space-x-2 mt-1'>
              <select value={month} onChange={(e) => setMonth(e.target.value)} className='border p-2 rounded'>
                {months.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={day} onChange={(e) => setDay(parseInt(e.target.value))} className='border p-2 rounded'>
                {days.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <select value={year} onChange={(e) => setYear(parseInt(e.target.value))} className='border p-2 rounded'>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          
          <div>
            <label className='block text-sm font-medium text-gray-700'>Time</label>
            <div className='flex space-x-2 mt-1'>
              <select value={hour} onChange={(e) => setHour(parseInt(e.target.value))} className='border p-2 rounded'>
                {hours.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
              <select value={minute} onChange={(e) => setMinute(parseInt(e.target.value))} className='border p-2 rounded'>
                {minutes.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={ampmValue} onChange={(e) => setAmpmValue(e.target.value)} className='border p-2 rounded'>
                {ampm.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
          
          <div className='flex justify-end'>
            <button className='Confirm2q4215'>
              Confirm
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const DraftTabs: FC = () => {
  const [activeTab, setActiveTab] = useState<'unsent' | 'scheduled'>('unsent');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className='bg-white p-6 rounded-lg w-[400px]'>
      <div className='flex justify-between border-b'>
        <button
          className={`p-2 ${activeTab === 'unsent' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('unsent')}
        >
          Unsent posts
        </button>
        <button
          className={`p-2 ${activeTab === 'scheduled' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => {
            setActiveTab('scheduled');
            setIsModalOpen(true);
          }}
        >
          Scheduled posts
        </button>
      </div>
      <div className='mt-4'>
        {activeTab === 'unsent' ? (
          <div className='text-center'>
            <h3 className='text-lg font-bold'>Hold that thought</h3>
            <p>Not ready to post just yet? Save it to your drafts or schedule it for later.</p>
          </div>
        ) : null}
      </div>

      {isModalOpen && (
        <ScheduleModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};
