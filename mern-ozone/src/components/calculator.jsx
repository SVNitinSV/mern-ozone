import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import vehicleData from './vehicleData.json';


const Calculator = () => {
    const [operand1, setOperand1] = useState('');
    const [operand2, setOperand2] = useState('');
    const [operand3, setOperand3] = useState('');
    const [operand4, setOperand4] = useState('');
    const [operand5, setOperand5] = useState('');
    const [operand6, setOperand6] = useState('');
    const [operand7, setOperand7] = useState('');
    const [operand8, setOperand8] = useState('');
    const [operand9, setOperand9] = useState('');
    const [operand10, setOperand10] = useState('');
    const [operand11, setOperand11] = useState('');
    const [operand12, setOperand12] = useState('');
    const [operand13, setOperand13] = useState('');
    const [operand14, setOperand14] = useState('');
    const [operand15, setOperand15] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    
    const [results, setResults] = useState({});
    
    const [vehicleCategory, setVehicleCategory] = useState('');
    const [vehicleSubCategory, setVehicleSubCategory] = useState('');
    const [presetName, setPresetName] = useState('');
    const [presets, setPresets] = useState([]);
  

    const handleCalculate = () => {
    const width = parseFloat(operand1);
    const height = parseFloat(operand2);

    const drag_coeff = parseFloat(operand4);
    const acc_time = parseFloat(operand5);
    const slope = parseFloat(operand6);
    const batt = parseFloat(operand7);
    const gear_ratio = parseFloat(operand8);
    const max_speed = parseFloat(operand9);
    const gvw = parseFloat(operand10);
    const wheel_dia = parseFloat(operand11);
    const roll_coeff = parseFloat(operand12);
    const air_den = parseFloat(operand13);
    const acc_dist = parseFloat(operand14);
    const trans_eff = parseFloat(operand15);

    if (isNaN(max_speed) || isNaN(acc_time)) {
      setResults({ error: 'Invalid input' });
      return;
    }

    const frontal = (width*height)/1000000;
    const final_speed = (max_speed*1000)/3600;
    const acceleration = (final_speed)/acc_time;
    const roll_rest =  gvw*9.81*roll_coeff*Math.cos((Math.PI * slope)/180);
    const acc_force = gvw*acceleration;
    const areo_drag =  0.5*air_den*drag_coeff*frontal*Math.pow(final_speed,2);
    const grade_resist = gvw*9.81*Math.sin((Math.PI *slope)/180);
    const tot_trac_eff = roll_rest+acc_force+areo_drag+grade_resist;
    const crusing_trac_eff = roll_rest + areo_drag;
    const wheel_torque = ((tot_trac_eff/2)*wheel_dia)/2000;
    const wheel_rpm = final_speed*60/(Math.PI*wheel_dia/1000);
    const wheel_power = (wheel_rpm*wheel_torque)/9550;
    const crus_wheel_pow = (wheel_power*crusing_trac_eff)/tot_trac_eff;
    const crus_torq = (crusing_trac_eff/2)*(wheel_dia/2000)/gear_ratio;
    const motor_torque = wheel_torque/gear_ratio;
    const trac_force = (motor_torque*gear_ratio*85*1000)/(wheel_dia/2*100);
    const motor_speed = wheel_rpm*gear_ratio;
    const motor_power = (motor_torque*motor_speed)/9550/0.98;
    const tot_range = 0.6*(batt/(crus_wheel_pow*2))*max_speed;
    const theoretical_consump = (batt*1000)/tot_range;

    setResults({
      acceleration,
      roll_rest,
      acc_force,
      areo_drag,
      grade_resist,
      tot_trac_eff,
      crusing_trac_eff,
      wheel_torque,
      wheel_rpm,
      wheel_power,
      crus_wheel_pow,
      crus_torq,
      motor_torque,
      trac_force,
      motor_speed,
      motor_power,
      tot_range,
      theoretical_consump,
      frontal
    });
  };

 useEffect(() => {
    const savedPresets = Cookies.get('presets');
    if (savedPresets) {
      setPresets(JSON.parse(savedPresets));
    }
  }, []);

  const handleVehicleCategoryChange = (e) => {
    setVehicleCategory(e.target.value);
    setVehicleSubCategory('');
  };

  const handleVehicleSubCategoryChange = (e) => {
    setVehicleSubCategory(e.target.value);
  };

  const handleSavePreset = () => {
    const newPreset = {
      name: presetName,
      vehicleCategory,
      vehicleSubCategory,
      operand1,
      operand2
    };
    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    Cookies.set('presets', JSON.stringify(updatedPresets));
  };

  const handleLoadPreset = (e) => {
    const selectedPreset = presets.find(preset => preset.name === e.target.value);
    if (selectedPreset) {
      setVehicleCategory(selectedPreset.vehicleCategory);
      setVehicleSubCategory(selectedPreset.vehicleSubCategory);
      setOperand1(selectedPreset.operand1);
      setOperand2(selectedPreset.operand2);
    }
  };

  const limits =
    vehicleCategory && vehicleSubCategory
      ? vehicleData[vehicleCategory][vehicleSubCategory]
      : null;

  const powerExceedsLimit = operand1 && limits && parseFloat(operand1) > limits.maxPower;
  const gvwExceedsLimit = operand2 && limits && parseFloat(operand2) > limits.maxGVW;


  const handleClear = () => {
    setOperand1('');
    setOperand2('');
    setResults({});
  };
  

  return (
    <div>
   <div className="p-4 border border-gray-300 rounded-lg shadow-md w-full max-w-3xl mx-auto mt-10">
  <div className="mb-4">
    <label className="block mb-1">Vehicle Category:</label>
    <select
      className="w-full p-2 border border-gray-300 rounded"
      value={vehicleCategory}
      onChange={handleVehicleCategoryChange}
    >
      <option value="">Select Category</option>
      {Object.keys(vehicleData).map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  </div>
  <div className="mb-4">
    <label className="block mb-1">Vehicle SubCategory:</label>
    <select
      className="w-full p-2 border border-gray-300 rounded"
      value={vehicleSubCategory}
      onChange={handleVehicleSubCategoryChange}
      disabled={!vehicleCategory}
    >
      <option value="">Select SubCategory</option>
      {vehicleCategory &&
        Object.keys(vehicleData[vehicleCategory]).map((subCategory) => (
          <option key={subCategory} value={subCategory}>
            {subCategory}
          </option>
        ))}
    </select>
  </div>
  <div className="mb-4">
    <label className="block mb-1">Power (kW):</label>
    <input
      type="number"
      className="w-full p-2 border border-gray-300 rounded"
      value={operand1}
      onChange={(e) => setOperand1(e.target.value)}
    />
    {powerExceedsLimit && <p className="text-red-500 mt-1">Power exceeds limit!</p>}
  </div>
  <div className="mb-4">
    <label className="block mb-1">GVW (kg):</label>
    <input
      type="number"
      className="w-full p-2 border border-gray-300 rounded"
      value={operand2}
      onChange={(e) => setOperand2(e.target.value)}
    />
    {gvwExceedsLimit && <p className="text-red-500 mt-1">GVW exceeds limit!</p>}
  </div>
  <div className="mb-4">
    <label className="block mb-1">Preset Name:</label>
    <input
      type="text"
      className="w-full p-2 border border-gray-300 rounded"
      value={presetName}
      onChange={(e) => setPresetName(e.target.value)}
    />
  </div>
  <button
    className="bg-black text-white py-2 px-4 rounded"
    onClick={handleSavePreset}
  >
    Save Preset
  </button>
  <div className="mt-4">
    <label className="block mb-1">Load Preset:</label>
    <select
      className="w-full p-2 border border-gray-300 rounded"
      onChange={handleLoadPreset}
      defaultValue=""
    >
      <option value="" disabled>Select Preset</option>
      {presets.map((preset, index) => (
        <option key={index} value={preset.name}>
          {preset.name}
        </option>
      ))}
    </select>
  </div>
</div>
    <div className="p-4 border border-gray-300 rounded-lg shadow-md w-full max-w-3xl mx-auto mt-10">
      <div className='text-3xl p-3 mb-2 w-full text-center font-bold'>Powertrain Specification Calculator</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 w-full">
        <div>
          <div className='text-lg p-2 font-semibold text-center'>Width(mm)</div>
          <input
            type="text"
            className="w-full p-2 mb-2 text-left bg-gray-100 rounded"
            value={operand1}
            onChange={(e) => setOperand1(e.target.value)}
            placeholder="Width"
          />
        </div>
        <div>
          <div className='text-lg p-2 font-semibold text-center'>Height(mm)</div>
          <input
            type="text"
            className="w-full p-2 mb-2 text-left bg-gray-100 rounded"
            value={operand2}
            onChange={(e) => setOperand2(e.target.value)}
            placeholder="Height"
          />
        </div>
        <div>
          <div className='text-lg p-2 font-semibold text-center'>Drag Co-efficient</div>
          <input
            type="text"
            className="w-full p-2 mb-2 text-left bg-gray-100 rounded"
            value={operand4}
            onChange={(e) => setOperand4(e.target.value)}
            placeholder="Drag Coefficient"
          />
        </div>
        <div>
          <div className='text-lg p-2 font-semibold text-center'>Acceleration Time(s)</div>
          <input
            type="text"
            className="w-full p-2 mb-2 text-left bg-gray-100 rounded"
            value={operand5}
            onChange={(e) => setOperand5(e.target.value)}
            placeholder="Acceleration Time"
          />
        </div>
        <div>
          <div className='text-lg p-2 font-semibold text-center'>Slope(Degrees)</div>
          <input
            type="text"
            className="w-full p-2 mb-2 text-left bg-gray-100 rounded"
            value={operand6}
            onChange={(e) => setOperand6(e.target.value)}
            placeholder="Slope"
          />
        </div>
        <div>
          <div className='text-lg p-2 font-semibold text-center'>Battery(Kwh)</div>
          <input
            type="text"
            className="w-full p-2 mb-2 text-left bg-gray-100 rounded"
            value={operand7}
            onChange={(e) => setOperand7(e.target.value)}
            placeholder="Battery(Kwh)"
          />
        </div>
        <div>
          <div className='text-lg p-2 font-semibold text-center'>Gear Ratio</div>
          <input
            type="text"
            className="w-full p-2 mb-2 text-left bg-gray-100 rounded"
            value={operand8}
            onChange={(e) => setOperand8(e.target.value)}
            placeholder="Gear Ratio"
          />
        </div>
        <div>
          <div className='text-lg p-2 font-semibold text-center'>Max Speed(km/h)</div>
          <input
            type="text"
            className="w-full p-2 mb-2 text-left bg-gray-100 rounded"
            value={operand9}
            onChange={(e) => setOperand9(e.target.value)}
            placeholder="Max Speed"
          />
        </div>
        <div>
          <div className='text-lg p-2 font-semibold text-center'>Gross Vehicle Weight(kg)</div>
          <input
            type="text"
            className="w-full p-2 mb-2 text-left bg-gray-100 rounded"
            value={operand10}
            onChange={(e) => setOperand10(e.target.value)}
            placeholder="Gross Vehicle Weight"
          />
        </div>
        <div>
          <div className='text-lg p-2 font-semibold text-center'>Tyre Diameter(mm)</div>
          <input
            type="text"
            className="w-full p-2 mb-2 text-left bg-gray-100 rounded"
            value={operand11}
            onChange={(e) => setOperand11(e.target.value)}
            placeholder="Tyre Diameter"
          />
        </div>
        <div>
          <div className='text-lg p-2 font-semibold text-center'>Rolling Co-efficient</div>
          <input
            type="text"
            className="w-full p-2 mb-2 text-left bg-gray-100 rounded"
            value={operand12}
            onChange={(e) => setOperand12(e.target.value)}
            placeholder="Rolling Coefficient"
          />
        </div>
        <div>
          <div className='text-lg p-2 font-semibold text-center'>Air Density</div>
          <input
            type="text"
            className="w-full p-2 mb-2 text-left bg-gray-100 rounded"
            value={operand13}
            onChange={(e) => setOperand13(e.target.value)}
            placeholder="Air Density"
          />
        </div>



      </div>
      <div className="flex justify-center items-center w-full mb-5">
        <button className="btn bg-black text-white py-2 px-4 m-2 rounded" onClick={handleCalculate}>
          Calculate
        </button>
        <button className="btn bg-black text-white py-2 px-4 m-2 rounded" onClick={handleClear}>
          Clear
        </button>
      </div>
      </div>
      <div className='p-4 border border-gray-300 rounded-lg shadow-md w-full max-w-3xl mx-auto mt-10'>
        <div className='text-2xl p-3 mb-2 w-full text-left font-bold'> Forces</div>
      {results.error ? (
        <div className="text-right text-red-500">{results.error}</div>
      ) : (
        <div className="font-semibold text-md grid grid-cols-1 sm:grid-cols-1 gap-2">
         {<div className='bg-gray-100 rounded w-full p-2 mb-2'>Rolling Resistance: {results.roll_rest} N</div>}
         {<div className='bg-gray-100 rounded w-full p-2 mb-2'> Acceleration Force: {results.acc_force} N</div>}
         {<div className='bg-gray-100 rounded w-full p-2 mb-2'> Aerodynamic Drag: {results.areo_drag} N</div>}
         {<div className='bg-gray-100 rounded w-full p-2 mb-2'> Grade Resistance: {results.grade_resist} N</div>}
         {<div className='bg-gray-100 rounded w-full p-2 mb-2'> Total Tractive Effort: {results.tot_trac_eff} N</div>}
         {<div className='bg-gray-100 rounded w-full p-2 mb-2'> Crusing Tract Effort: {results.crusing_trac_eff} N</div>}
         {<div className='bg-gray-100 rounded w-full p-2 mb-2'> Traction Force: {results.trac_force} N</div>}
        </div>
      )}
      </div>
      <div className='p-4 border border-gray-300 rounded-lg shadow-md w-full max-w-3xl mx-auto mt-10'>
        <div className='text-2xl p-3 mb-2 w-full text-left font-bold'> Wheel</div>
      {results.error ? (
        <div className="text-right text-red-500">{results.error}</div>
      ) : (
        <div className="font-semibold text-md grid grid-cols-1 sm:grid-cols-1 gap-2">
        {<div className='bg-gray-100 rounded w-full p-2 mb-2'> Wheel Torque: {results.wheel_torque} Nm</div>}
        {<div className='bg-gray-100 rounded w-full p-2 mb-2'> Wheel RPM: {results.wheel_rpm} rpm</div>}
        {<div className='bg-gray-100 rounded w-full p-2 mb-2'> Wheel Power: {results.wheel_power} kW</div>}
        {<div className='bg-gray-100 rounded w-full p-2 mb-2'> Crusing Wheel Power: {results.crus_wheel_pow} kW</div>}
        {<div className='bg-gray-100 rounded w-full p-2 mb-2'> Crusing Torque Needed: {results.crus_torq} Nm</div>}
        </div>
      )}
      </div>
      <div className='p-4 border border-gray-300 rounded-lg shadow-md w-full max-w-3xl mx-auto mt-10'>
        <div className='text-2xl p-3 mb-2 w-full text-left font-bold'> Transmission Efficiency</div>
      {results.error ? (
        <div className="text-right text-red-500">{results.error}</div>
      ) : (
        <div className="font-semibold text-md grid grid-cols-1 sm:grid-cols-1 gap-2">
          {<div className='bg-gray-100 rounded w-full p-2 mb-2'> Motor Torque: {results.motor_torque} Nm</div>}
          {<div className='bg-gray-100 rounded w-full p-2 mb-2'> Motor Speed: {results.motor_speed} rpm</div>}
          { <div className='bg-gray-100 rounded w-full p-2 mb-2'> Motor Power: {results.motor_power} kW</div>}
          {<div className='bg-gray-100 rounded w-full p-2 mb-2'> Total Range @60% efficiency: {results.tot_range} Km</div>}
          {<div className='bg-gray-100 rounded w-full p-2 mb-2'> Theoretical Consumption: {results.theoretical_consump} Wh/Km</div>}
        </div>
      )}
      </div>

    </div>
  );
};

export default Calculator;
