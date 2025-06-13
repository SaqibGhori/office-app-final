import {useState, type SetStateAction} from 'react'
import RealTimeCharts from '../Components/RealTImeCharts';

const FIleView = () => {
     const [selectedValue, setSelectedValue] = useState('table'); // Set default value

  const handleSelectChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setSelectedValue(e.target.value);
    console.log(selectedValue , "curent values")
  }

    const alldata = [
        {
            datetime: "2024-02-06 04:06:04",
            date: "2024-02-06",
            time: "04:06:04",
            vl1: "96.1",
            vl2: "46.5",
            vl3: "59.5",
        },
        {
            datetime: "2024-02-06 04:06:04",
            date: "2024-02-06",
            time: "04:06:04",
            vl1: "96.1",
            vl2: "46.5",
            vl3: "59.5",
        },
        {
            datetime: "2024-02-06 04:06:04",
            date: "2024-02-06",
            time: "04:06:04",
            vl1: "96.1",
            vl2: "46.5",
            vl3: "59.5",
        },
        {
            datetime: "2024-02-06 04:06:04",
            date: "2024-02-06",
            time: "04:06:04",
            vl1: "96.1",
            vl2: "46.5",
            vl3: "59.5",
        },
        {
            datetime: "2024-02-06 04:06:04",
            date: "2024-02-06",
            time: "04:06:04",
            vl1: "96.1",
            vl2: "46.5",
            vl3: "59.5",
        },
        {
            datetime: "2024-02-06 04:06:04",
            date: "2024-02-06",
            time: "04:06:04",
            vl1: "96.1",
            vl2: "46.5",
            vl3: "59.5",
        },
        {
            datetime: "2024-02-06 04:06:04",
            date: "2024-02-06",
            time: "04:06:04",
            vl1: "96.1",
            vl2: "46.5",
            vl3: "59.5",
        },
        {
            datetime: "2024-02-06 04:06:04",
            date: "2024-02-06",
            time: "04:06:04",
            vl1: "96.1",
            vl2: "46.5",
            vl3: "59.5",
        },
        {
            datetime: "2024-02-06 04:06:04",
            date: "2024-02-06",
            time: "04:06:04",
            vl1: "96.1",
            vl2: "46.5",
            vl3: "59.5",
        },
        {
            datetime: "2024-02-06 04:06:04",
            date: "2024-02-06",
            time: "04:06:04",
            vl1: "96.1",
            vl2: "46.5",
            vl3: "59.5",
        },
    ];

    return (
        <div className='mx-5'>
            <div className='flex justify-between mb-9'>
                <div>
                    <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l">
                        Back
                    </button>
                </div>
                <div><h2 className='text-3xl font-semibold'>File View</h2></div>
                <div className='flex gap-2'>
                    <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l">
                        Download CSV
                    </button>
                    <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r">
                        Download PDF
                    </button>
                </div>
            </div>
            <div className='flex justify-between items-center my-5' >
                <div>Select Your Range:</div>
                <div><label htmlFor="">From</label> <input className="shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="date" placeholder="" /></div>
                <div><label htmlFor="">To</label><input className="shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="date" placeholder="" /></div>
            </div>
            <hr />
            <div className="w-full  my-5">
                <div className="relative">
                    <select
                        value={selectedValue}
                        onChange={handleSelectChange}
                        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer">
                        <option value="table">Table</option>
                        <option value="chart">Chart</option>
                    </select>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                    </svg>
                </div>
            </div>
            <div>
                <div className='grid grid-cols-12 gap-4'>
                    <div className='col-span-3 bg-slate-300 p-5'>
                        <div className='mb-3 max-h-52 overflow-y-auto
                                       [&::-webkit-scrollbar]:w-2
                                       [&::-webkit-scrollbar-track]:rounded-full
                                       [&::-webkit-scrollbar-track]:bg-gray-100
                                       [&::-webkit-scrollbar-thumb]:rounded-full
                                       [&::-webkit-scrollbar-thumb]:bg-gray-500
                                       dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                                       dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500'>
                            <div className='bg-white hover:bg-slate-200 py-2 text-center my-1'>General Parameters</div>
                            <div className='bg-white hover:bg-slate-200 py-2 text-center my-1'>Active Power</div>
                            <div className='bg-white hover:bg-slate-200 py-2 text-center my-1'>Reactive Power</div>
                            <div className='bg-white hover:bg-slate-200 py-2 text-center my-1'>Apparent Power</div>
                            <div className='bg-white hover:bg-slate-200 py-2 text-center my-1'>COS</div>
                            <div className='bg-white hover:bg-slate-200 py-2 text-center my-1'>Power Factor</div>
                        </div>
                        <div className='max-h-52 overflow-y-auto
                                       [&::-webkit-scrollbar]:w-2
                                       [&::-webkit-scrollbar-track]:rounded-full
                                       [&::-webkit-scrollbar-track]:bg-gray-100
                                       [&::-webkit-scrollbar-thumb]:rounded-full
                                       [&::-webkit-scrollbar-thumb]:bg-gray-500
                                       dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                                       dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500'>
                            <div className='bg-white hover:bg-slate-200 py-2 text-center my-1'><input type="checkbox" /> <label htmlFor="">VL1</label></div>
                            <div className='bg-white hover:bg-slate-200 py-2 text-center my-1'><input type="checkbox" /> <label htmlFor="">VL2</label></div>
                            <div className='bg-white hover:bg-slate-200 py-2 text-center my-1'><input type="checkbox" /> <label htmlFor="">VL3</label></div>
                            <div className='bg-white hover:bg-slate-200 py-2 text-center my-1'><input type="checkbox" /> <label htmlFor="">VL4</label></div>
                            <div className='bg-white hover:bg-slate-200 py-2 text-center my-1'><input type="checkbox" /> <label htmlFor="">VL5</label></div>
                            <div className='bg-white hover:bg-slate-200 py-2 text-center my-1'><input type="checkbox" /> <label htmlFor="">VL6</label></div>
                        </div>
                    </div>
                    <div className='col-span-9 bg-slate-300 p-5 max-h-96 overflow-y-auto
                                       [&::-webkit-scrollbar]:w-2
                                       [&::-webkit-scrollbar-track]:rounded-full
                                       [&::-webkit-scrollbar-track]:bg-gray-100
                                       [&::-webkit-scrollbar-thumb]:rounded-full
                                       [&::-webkit-scrollbar-thumb]:bg-gray-500
                                       dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                                       dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500'>
                       {selectedValue == "table" ? <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                    >
                                        DateTime
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Date
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Time
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        VL1
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        VL2
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        VL3
                                    </th>

                                </tr>
                            </thead>
                            <tbody className="divide-y   ">
                                {alldata.map((data) => (
                                    <tr className='hover:bg-slate-200' >
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                            {data.datetime}
                                        </td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                            {data.date}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {data.time}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {data.vl1}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {data.vl2}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {data.vl3}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table> 
                        :
                        <RealTimeCharts/>
                        }
                    </div>
                </div>
                {/* <div></div> */}
            </div>
        </div>

    )
}

export default FIleView