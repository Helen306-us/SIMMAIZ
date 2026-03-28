/**
 * SliderInput — Slider con etiqueta, valor y tooltip informativo.
 */
export default function SliderInput({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '%',
  tooltip = '',
  color,
}) {
  return (
    <div className={`s-row ${tooltip ? 'tooltip' : ''}`} data-tip={tooltip}>
      <label>
        {label} <span style={color ? { color } : {}}>{value}{unit}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
