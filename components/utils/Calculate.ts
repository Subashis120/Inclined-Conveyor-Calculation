export const calculateResult = (form: any) => {
  const diameter = parseFloat(form.diameter);
  const ratio = parseFloat(form.ratio);
  const length = parseFloat(form.length);
  const width = parseFloat(form.width);
  const thickness = parseFloat(form.thickness);
  const capacity = parseFloat(form.capacity);
  const density = parseFloat(form.density);
  const friction = parseFloat(form.friction);
  const height = parseFloat(form.height);

  // Example formula — replace with your actual math
  const revolution = 3.14 * diameter;
  const beltTravel = revolution * ratio;
  const materialIn1mOfBelt = (capacity*length*1.5) / beltTravel;
  const materialWeightInBelt = length * materialIn1mOfBelt;
  const beltWeight = length * width * thickness * density;
  const totalWeight = materialWeightInBelt + beltWeight;
  const beltpull = totalWeight * friction;
  const gravityPull = (totalWeight / length) * height;
  const totalPull = beltpull + gravityPull;
  const reqdPower = totalPull * beltTravel;
  const result = reqdPower / 4573.1;
  const pos = result * 1.3;

  const map = {
    "Linear Travel Of Drive Pulley (m) ": revolution.toFixed(3),
    "Linear Speed (m/min) ": beltTravel.toFixed(3),
    "Material In 1m Of Belt (kg/min) ": materialIn1mOfBelt.toFixed(3),
    "Material Weight In Belt (kg) ": materialWeightInBelt.toFixed(3),
    "Belt Weight (kg) ": beltWeight.toFixed(3),
    "Total Weight (kg) ": totalWeight.toFixed(3),
    "Belt Pull (kg) ": beltpull.toFixed(3),
    "Gravity Pull (kg) ": gravityPull.toFixed(3),
    "Total Pull (kg) ": totalPull.toFixed(3),
    "Calculated HP (kg m/min) ": reqdPower.toFixed(3),
    "Motor Power With FOS": pos.toFixed(3),
    "Final HP": getFinalHp(pos),
  };

  return map;
};

const getFinalHp = (value) => {
  if (value <= 0.5) return 0.5;

  return Math.ceil(value / 0.5) * 0.5;
};
