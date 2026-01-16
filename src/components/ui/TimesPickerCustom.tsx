import { cn } from "../../utils/cn";

interface TimePickerCustomProps {
  selectedTime: string;
  onChange: (time: string) => void;
  hourInterval?: number;
  minuteInterval?: number;
}

export const TimePickerCustom: React.FC<TimePickerCustomProps> = ({
  selectedTime,
  onChange,
  hourInterval = 1,
  minuteInterval = 10,
}) => {
  const [currentH, currentM] = (selectedTime || "00:00").split(":");
  //const timeToParse = selectedTime || "00:00";
  //const [selectedHour, selectedMinute] = timeToParse.split(":").map(Number);

  const generateTimes = (interval: number, max: number) => {
    const times = [];
    for (let i = 0; i < max; i += interval) {
      times.push(String(i).padStart(2, "0"));
    }
    return times;
  };

  const hours = generateTimes(hourInterval, 24);
  const minutes = generateTimes(minuteInterval, 60);

  // const handleHourChange = (hour: string) => {
  //   const minuteStr = String(selectedMinute).padStart(2, "0");
  //   onChange(`${hour}:${minuteStr}`);
  // };

  // const handleMinuteChange = (minute: string) => {
  //   const hourStr = String(selectedHour).padStart(2, "0");
  //   onChange(`${hourStr}:${minute}`);
  // };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white/5 rounded-xl border borde-white/10">
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 mb-2 block">
          Hora
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
          {hours.map((h) => {
            const isSelected = h === currentH;

            return (
              <button
                key={h}
                type="button"
                onClick={() => onChange(`${h}:${currentM}`)}
                className={cn(
                  "py-2 rounded-lg text-sm font-bold border transition-all",
                  isSelected
                    ? "bg-green-500 text-black border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                )}
              >
                {h}
              </button>
            );
          })}
          {/* {hours.map((hour) => (
            <button
              key={hour}
              type="button"
              onClick={() => handleHourChange(hour)}
              className={cn(
                "py-2 rounded-lg text-sm font-bold transition-all border",
                "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10",
                {
                  "bg-green-500 text-black border-green-500 shadow-md":
                    selectedHour === Number(hour),
                }
              )}
            >
              {hour}
            </button>
          ))} */}
        </div>
      </div>

      {/* Selector de Minutos */}
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 mb-2 block">
          Minutos
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
          {minutes.map((m) => {
            const isSelected = m === currentM;

            return (
              <button
                key={m}
                type="button"
                onClick={() => onChange(`${currentH}:${m}`)}
                className={cn(
                  "py-2 rounded-lg text-sm font-bold border transition-all",
                  isSelected
                    ? "bg-green-500 text-black border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                )}
              >
                {m}
              </button>
            );
          })}

          {/* {minutes.map((minute) => (
            <button
              key={minute}
              type="button"
              onClick={() => handleMinuteChange(minute)}
              className={cn(
                "py-2 rounded-lg text-sm font-bold transition-all border",
                "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10",
                {
                  "bg-green-500 text-black border-green-500 shadow-md":
                    selectedMinute === Number(minute),
                }
              )}
            >
              {minute}
            </button>
          ))} */}
        </div>
      </div>
    </div>
  );
};
