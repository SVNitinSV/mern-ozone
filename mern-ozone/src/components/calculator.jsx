import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import vehicleData from './vehicleData.json';

let frontal = null;
let final_speed = null;
let acceleration = null;
let roll_rest =  null;
let acc_force = null;
let areo_drag =  null;
let grade_resist = null;
let tot_trac_eff = null;
let crusing_trac_eff = null;
let wheel_torque = null;
let wheel_rpm = null;
let wheel_power = null;
let crus_wheel_pow = null;
let crus_torq = null;
let motor_torque = null;
let trac_force = null;
let motor_speed = null;
let motor_power = null;
let tot_range = null;
let theoretical_consump = null;



const Calculator = () => {
    const [a, setA] = useState('');
    const [b, setB] = useState('');
    const [c, setC] = useState('');
    const [result, setResult] = useState('');

    const [operand1, setOperand1] = useState('');
    const [operand2, setOperand2] = useState('');
    const [operand3, setOperand3] = useState('');
    const [operand4, setOperand4] = useState('');
    const [operand5, setOperand5] = useState('');
    const [operand6, setOperand6] = useState('0');
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

    frontal = (width*height)/1000000;
    final_speed = (max_speed*1000)/3600;
    acceleration = (final_speed)/acc_time;
    roll_rest =  gvw*9.81*roll_coeff*Math.cos((Math.PI * slope)/180);
    acc_force = gvw*acceleration;
    areo_drag =  0.5*air_den*drag_coeff*frontal*Math.pow(final_speed,2);
    grade_resist = gvw*9.81*Math.sin((Math.PI *slope)/180);
    tot_trac_eff = roll_rest+acc_force+areo_drag+grade_resist;
    crusing_trac_eff = roll_rest + areo_drag;
    wheel_torque = ((tot_trac_eff/2)*wheel_dia)/2000;
    wheel_rpm = final_speed*60/(Math.PI*wheel_dia/1000);
    wheel_power = (wheel_rpm*wheel_torque)/9550;
    crus_wheel_pow = (wheel_power*crusing_trac_eff)/tot_trac_eff;
    crus_torq = (crusing_trac_eff/2)*(wheel_dia/2000)/gear_ratio;
    motor_torque = wheel_torque/gear_ratio;
    trac_force = (motor_torque*gear_ratio*85*1000)/(wheel_dia/2*100);
    motor_speed = wheel_rpm*gear_ratio;
    motor_power = (motor_torque*motor_speed)/9550/0.98;
    tot_range = 0.6*(batt/(crus_wheel_pow*2))*max_speed;
    theoretical_consump = (batt*1000)/tot_range;

   

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
      frontal,
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
      operand2,
      operand3,
      operand4,
      operand5,
      operand6,
      operand7,
      operand8,
      operand9,
      operand10,
      operand11,
      operand12,
      operand13
      
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
      setOperand3(selectedPreset.operand3);
      setOperand4(selectedPreset.operand4);
      setOperand5(selectedPreset.operand5);
      setOperand6(selectedPreset.operand6);
      setOperand7(selectedPreset.operand7);
      setOperand8(selectedPreset.operand8);
      setOperand9(selectedPreset.operand9);
      setOperand10(selectedPreset.operand10);
      setOperand11(selectedPreset.operand11);
      setOperand12(selectedPreset.operand12);
      setOperand13(selectedPreset.operand13);
    }
  };

  const limits =
    vehicleCategory && vehicleSubCategory
      ? vehicleData[vehicleCategory][vehicleSubCategory]
      : null;

  const powerExceedsLimit = motor_power && limits && parseFloat(motor_power) > limits.maxPower;
  const gvwExceedsLimit = operand10 && limits && parseFloat(operand10) > limits.maxGVW;

  const powerSubceedsLimit = motor_power && limits && parseFloat(motor_power) < limits.minPower;
  const gvwSubceedsLimit = operand10 && limits && parseFloat(operand10) < limits.minGVW;

   

  const handleClear = () => {
    setOperand1('');
    setOperand2('');
    setOperand3('');
    setOperand4('');
    setOperand5('');
    setOperand6('');
    setOperand7('');
    setOperand8('');
    setOperand9('');
    setOperand10('');
    setOperand11('');
    setOperand12('');
    setOperand13('');
    setResults({});
  };
  
  const calculateResult = () => {
    const operandA = parseFloat(a);
    const operandB = parseFloat(b);
    const operandC = parseFloat(c);

    if (!isNaN(operandA) && !isNaN(operandB) && !isNaN(operandC)) {
      const calculatedResult = (2 * (operandB * operandA) / 100) + 25.4 * operandC;
      setOperand11(calculatedResult);
    } else {
      setOperand11('Invalid inputs');
    }
    
  };

  return (
    <div>
   <div className="p-4 border border-gray-300 rounded-lg shadow-md w-full max-w-3xl mx-auto mt-10">
   <div className='text-3xl p-3 mb-2 w-full text-center font-bold'>Powertrain Specification Calculator</div>
  <div className="mb-4">
    <label className="block mb-1 font-bold">Vehicle Category:</label>
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
    <label className="block mb-1 font-bold">Vehicle SubCategory:</label>
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
    {powerExceedsLimit && <p className="text-red-500 mt-1">Power exceeds limit!</p>}
  </div>
  <div className="mb-4">
    {gvwExceedsLimit && <p className="text-red-500 mt-1">GVW exceeds limit!</p>}
  </div>

  <div className="mb-4">
    {powerSubceedsLimit && <p className="text-red-500 mt-1">Power Subceeds limit!</p>}
  </div>
  <div className="mb-4">
    {gvwSubceedsLimit && <p className="text-red-500 mt-1">GVW Subceeds limit!</p>}
  </div>

  

</div>
    <div className="p-4 border border-gray-300 rounded-lg shadow-md w-full max-w-3xl mx-auto mt-10">

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
      <div className='pt-6 border-y-2'>
      <h2 className="text-3xl font-bold text-center mb-6">Wheel Diamteter Calculator</h2>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center">
          <input
            type="text"
            className="w-full p-2 mb-2 text-left bg-gray-100 rounded"
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder="TureWidth"
          />
          <span className="mx-2 font-bold">/</span>
          <input
            type="text"
            className="w-full p-2 mb-2 text-left bg-gray-100 rounded"
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder="AspectRatio"
          />
          <span className="mx-2 font-bold">R</span>
          <input
            type="text"
            className="w-full p-2 mb-2 text-left bg-gray-100 rounded"
            value={c}
            onChange={(e) => setC(e.target.value)}
            placeholder="RimDiameter"
          />
        </div>
        <div className="flex justify-center items-center w-full">
          <button
            className="btn bg-black text-white py-2 px-4 m-2 rounded"
            onClick={calculateResult}
          >
            Calculate wheel Diameter
          </button>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Wheel diameter(mm):</label>
          <input
            type="text"
            className="w-full p-2 mb-2 text-left bg-gray-100 rounded"
            value={operand11}
          />
        </div>
      </div>
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

  <div className="flex justify-center items-center w-full mb-5 mt-10">
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
      <div className='p-4 border border-gray-300 rounded-lg shadow-md w-full max-w-3xl mx-auto mt-10'>
    <div className='text-2xl p-3 mb-2 w-full text-left font-bold text-black'>Gradability</div>
    <div className="mb-4">
        <label className="block mb-1 font-semibold text-black">Speed (km/h): </label>
        <input
            type="number"
            value={operand9}
            onChange={(e) => setOperand9(e.target.value)}
            className="w-full p-2 mb-2 text-left bg-gray-100 rounded text-black"
        />
    </div>
    <div className="mb-4">
        <label className="block mb-1 font-semibold text-black">Time to Accelerate (seconds): </label>
        <input
            type="number"
            value={operand5}
            onChange={(e) => setOperand5(e.target.value)}
            className="w-full p-2 mb-2 text-left bg-gray-100 rounded text-black"
        />
    </div>
    <div className="mb-4">
        <label className="block mb-1 font-semibold text-black">Degree of Slope: {operand6}°</label>
        <input
            type="range"
            min="0"
            max="45"
            value={operand6}
            onChange={(e) => setOperand6(e.target.value)}
            className="w-full accent-black rounded h-4 outline-none"
        />
    </div>
    <button
        onClick={handleCalculate}
        className="bg-black text-white py-2 px-4 rounded"
    >
        Calculate
    </button>

    <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2 text-black">Results</h3>
        <table className="table-auto w-full text-left">
            <tbody>
                <tr>
                    <td className="font-semibold text-black">Speed:</td>
                    <td>{operand9} km/h</td>
                </tr>
                <tr>
                    <td className="font-semibold text-black">Time to Accelerate:</td>
                    <td>{operand5} seconds</td>
                </tr>
                <tr>
                    <td className="font-semibold text-black">Degree of Slope:</td>
                    <td>{operand6}°</td>
                </tr>
                <tr>
                    <td className="font-semibold text-black">Percentage of Slope:</td>
                    <td>{(operand6/45)*100}%</td>
                </tr>
                <tr>
                    <td className="font-semibold text-black">Required Power:</td>
                    <td>{motor_power} kW</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<div className='p-4 border border-gray-300 rounded-lg shadow-md w-full max-w-3xl mx-auto mt-10'>
    <div className='text-2xl p-3 mb-2 w-full text-left font-bold text-black'>Top Speed </div>
    <div className="mb-4">
        <label className="block mb-1 font-semibold text-black">Top Speed (km/h): </label>
        <input
            type="number"
            value={operand5}
            onChange={(e) => setOperand5(e.target.value)}
            className="w-full p-2 mb-2 text-left bg-gray-100 rounded text-black"
        />
    </div>
    <div className="mb-4">
        <label className="block mb-1 font-semibold text-black">Time to Accelerate (seconds): </label>
        <input
            type="number"
            value={operand5}
            onChange={(e) => setOperand5(e.target.value)}
            className="w-full p-2 mb-2 text-left bg-gray-100 rounded text-black"
        />
    </div>
    <div className="mb-4">
        <label className="block mb-1 font-semibold text-black">Degree of Slope: {operand6}°</label>
        <input
            type="range"
            min="0"
            max="45"
            value={operand6}
            onChange={(e) => setOperand6(e.target.value)}
            className="w-full accent-black rounded h-4 outline-none"
        />
    </div>
    <button
        onClick={handleCalculate}
        className="bg-black text-white py-2 px-4 rounded"
    >
        Calculate
    </button>

    <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2 text-black">Results</h3>
        <table className="table-auto w-full text-left">
            <tbody>
                <tr>
                    <td className="font-semibold text-black">Speed:</td>
                    <td>{operand9} km/h</td>
                </tr>
                <tr>
                    <td className="font-semibold text-black">Time to Accelerate:</td>
                    <td>{operand5} seconds</td>
                </tr>
                <tr>
                    <td className="font-semibold text-black">Degree of Slope:</td>
                    <td>{operand6}°</td>
                </tr>
                <tr>
                    <td className="font-semibold text-black">Required Power:</td>
                    <td>{motor_power} kW</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>


    </div>
  );
};

export default Calculator;
