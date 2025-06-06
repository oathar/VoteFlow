import React from 'react';
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md';
const OptionInputTile = ({
    isSelected,
    lable,
    onSelect
}) => {

    const getColors = () => {
        if(isSelected) return "text-white bg-primary border-sky-400";

        return "text-black bg-slate-200/80 border-slate-200";

    }
  return (
    <div>
        <button
            className={`w-full flex items-center gap-2 px-3 py-1 mb-4 border rounded-md ${getColors()}`}
            onClick={onSelect}
            >
             {isSelected ? (
                <MdRadioButtonChecked className='text-lg text-white'/>
             ) : (
                <MdRadioButtonUnchecked className='text-lg text-slate-400' />
             )}
            <span className='text-sm text-slate-700 font-medium ml-2'>
                {lable}
            </span>
            </button>
    </div>
  )
}

export default OptionInputTile