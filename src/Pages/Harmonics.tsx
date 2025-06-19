import { useState, type SetStateAction } from 'react'

const Harmonics = () => {
    const [selectedValue, setSelectedValue] = useState('table'); // Set default value

    const handleSelectChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setSelectedValue(e.target.value);
        console.log(selectedValue, "curent values")
    }

    const alldata = [
        {
            key:"voltage",
            h1: "96.1",
            h2: "46.5",
            h3: "59.4",
            h4: "31.8",
            h5: "22.3",
            h6: "96.1",
            h7: "46.5",
            h8: "59.4",
            h9: "31.8",
            h10: "22.3",
        },
        {
            key:"voltage",
            h1: "96.1",
            h2: "46.5",
            h3: "59.4",
            h4: "31.8",
            h5: "22.3",
            h6: "96.1",
            h7: "46.5",
            h8: "59.4",
            h9: "31.8",
            h10: "22.3",
        },
        {
            key:"voltage",
            h1: "96.1",
            h2: "46.5",
            h3: "59.4",
            h4: "31.8",
            h5: "22.3",
            h6: "96.1",
            h7: "46.5",
            h8: "59.4",
            h9: "31.8",
            h10: "22.3",
        },
        {
            key:"voltage",
            h1: "96.1",
            h2: "46.5",
            h3: "59.4",
            h4: "31.8",
            h5: "22.3",
            h6: "96.1",
            h7: "46.5",
            h8: "59.4",
            h9: "31.8",
            h10: "22.3",
        },
        {
            key:"voltage",
            h1: "96.1",
            h2: "46.5",
            h3: "59.4",
            h4: "31.8",
            h5: "22.3",
            h6: "96.1",
            h7: "46.5",
            h8: "59.4",
            h9: "31.8",
            h10: "22.3",
        },
        {
            key:"voltage",
            h1: "96.1",
            h2: "46.5",
            h3: "59.4",
            h4: "31.8",
            h5: "22.3",
            h6: "96.1",
            h7: "46.5",
            h8: "59.4",
            h9: "31.8",
            h10: "22.3",
        },
       
        {
            key:"voltage",
            h1: "96.1",
            h2: "46.5",
            h3: "59.4",
            h4: "31.8",
            h5: "22.3",
            h6: "96.1",
            h7: "46.5",
            h8: "59.4",
            h9: "31.8",
            h10: "22.3",
        },
       
        {
            key:"voltage",
            h1: "96.1",
            h2: "46.5",
            h3: "59.4",
            h4: "31.8",
            h5: "22.3",
            h6: "96.1",
            h7: "46.5",
            h8: "59.4",
            h9: "31.8",
            h10: "22.3",
        },
        {
            key:"voltage",
            h1: "96.1",
            h2: "46.5",
            h3: "59.4",
            h4: "31.8",
            h5: "22.3",
            h6: "96.1",
            h7: "46.5",
            h8: "59.4",
            h9: "31.8",
            h10: "22.3",
        },
        {
            key:"voltage",
            h1: "96.1",
            h2: "46.5",
            h3: "59.4",
            h4: "31.8",
            h5: "22.3",
            h6: "96.1",
            h7: "46.5",
            h8: "59.4",
            h9: "31.8",
            h10: "22.3",
        },
        {
            key:"voltage",
            h1: "96.1",
            h2: "46.5",
            h3: "59.4",
            h4: "31.8",
            h5: "22.3",
            h6: "96.1",
            h7: "46.5",
            h8: "59.4",
            h9: "31.8",
            h10: "22.3",
        },
        {
            key:"voltage",
            h1: "96.1",
            h2: "46.5",
            h3: "59.4",
            h4: "31.8",
            h5: "22.3",
            h6: "96.1",
            h7: "46.5",
            h8: "59.4",
            h9: "31.8",
            h10: "22.3",
        },
        {
            key:"voltage",
            h1: "96.1",
            h2: "46.5",
            h3: "59.4",
            h4: "31.8",
            h5: "22.3",
            h6: "96.1",
            h7: "46.5",
            h8: "59.4",
            h9: "31.8",
            h10: "22.3",
        },
       
    ];


    return (
        <>
            <div className='flex justify-between items-center mx-3'>
                <div>
                    <a href='/' className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r">
                        Back
                    </a>
                </div>
                <div>
                    <h1 className='text-2xl font-bold ml-5'>Harmonics</h1>
                </div>
                <div className='flex gap-2'>
                    <a href='/fileview' className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r">
                        File View
                    </a>
                    <a href='' className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r">
                        Alarm
                    </a>
                </div>
            </div>
            <div className="w-full  my-5  ">
                <div className="relative mx-3">
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
            <div className='col-span-9 mx-3 bg-slate-300 p-5 max-h-[500px] overflow-y-auto
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
                                Key
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                                H1
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                                H2
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                                H3
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                                H4
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                                H5
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                                H6
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                                H7
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                                H8
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                                H9
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                                H10
                            </th>

                        </tr>
                    </thead>
                    <tbody className="divide-y   ">
                        {alldata.map((data) => (
                            <tr className='hover:bg-slate-200' >
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                    {data.key}
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                    {data.h1}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {data.h2}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {data.h3}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {data.h4}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {data.h5}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {data.h6}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {data.h7}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {data.h8}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {data.h9}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {data.h10}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
                    :
                    // <RealTimeCharts/>
                    <div>testing</div>
                }
            </div>
        </>
    )
}

export default Harmonics