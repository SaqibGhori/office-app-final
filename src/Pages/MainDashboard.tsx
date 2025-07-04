import { useState , useEffect
  
 } from 'react'
import { useSocket } from '../hooks/useSocket'; // adjust path if needed
import RealTimeCharts from '../Components/RealTImeCharts';
import { useParams } from "react-router-dom";
import { Link ,  useLocation  } from 'react-router-dom';

// Reading type based on socket data
type Reading = {
  gatewayId: string;
  timestamp: string;
  data: {
    [category: string]: {
      [label: string]: number;
    };
  };
};

const MainDashboard = () => {
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [reading, setReading] = useState<Reading | null>(null);
  // const location = useLocation();
const inferUnitFromLabel = (label: string): string => {
  const lower = label.toLowerCase();
  if (lower.includes('v')) return 'volt';
  if (lower.includes('i') || lower.includes('amp')) return 'amp';
  if (lower.includes('pf') || lower.includes('cos')) return 'cos';
  if (lower.includes('hz') || lower.includes('f')) return 'Hz';
  if (lower.includes('w')) return 'Watt';
  if (lower.includes('va')) return 'VA';
  return '';
};
   // 🔥 Get gatewayId from URL
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const gatewayId = query.get("gateway") || undefined;  // <— here
  useSocket((data: Reading) => {
    setReading(data);
  }, gatewayId);
console.log(gatewayId , "moiz")

  const sections = reading?.data
  ? Object.entries(reading.data).map(([category, subObj]) => ({
      title: category,
      values: Object.entries(subObj).map(([label, value]) => ({
        label,
        value,
        unit: inferUnitFromLabel(label) // dynamic unit assignment
      }))
    }))
  : [];

  useEffect(() => {
  if (reading?.data && !selectedTitle) {
    const firstCategory = Object.keys(reading.data)[0];
    if (firstCategory) {
      setSelectedTitle(firstCategory);
    }
  }
}, [reading, selectedTitle]);

  return (
    <div>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className="text-2xl font-bold ml-5">{gatewayId}</h1>
        </div>

        <div className="flex gap-2 p-4">
          
          <Link to='/harmonics' className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
            Harmonics
          </Link>
          <Link to={`/fileview?gateway=${gatewayId}`} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
            File View
          </Link>
          <Link to={`/alaram?gateway=${gatewayId}`} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
            Alaram
          </Link>
          <Link to={`/settings?gateway=${gatewayId}`} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
            settings
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-4">
        {reading
          ? sections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              onClick={() => {
                setSelectedTitle(section.title);
                console.log("Clicked card title:", section.title);
              }}
              className="bg-white rounded-lg shadow p-4"
            >
              <h2 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
                {section.title}
              </h2>
              <div className="space-y-2">
                {section.values.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-600 w-16">{item.label}</span>
                    <div className="flex-1 flex items-center justify-end">
                      <span className="text-gray-800 font-mono mr-1">
                        {item.value}
                      </span>
                      <span className="text-gray-500 text-sm">{item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
          : // 👇 Skeleton Loader
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-4 animate-pulse space-y-4"
            >
              <div className="h-5 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
      </div>


      <div className="flex">
        <div className='w-[100%]'>
          <RealTimeCharts selectedTitle={selectedTitle} />
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
